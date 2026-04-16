import { inject, injectable } from 'inversify';
import {
  ItemEntityActionEffectSettings,
  ItemEntityActionEffectType,
  ItemEntityGetItemsActionEffect,
  ItemEntityGetRandomItemsActionEffect,
  ItemInstanceEntity,
} from '@kwokka/entities';
import { RandomUtil } from '@kwokka/utils';
import { Usecase, UsecaseException } from '@kwokka/common-node';
import { ItemInstanceUsecaseValidations } from './item-instance-usecase-validations';
import { ItemInstanceRepository, ItemRepository } from '../ports';
import { ExceptionCode } from '../exception-code';
import { GiveItemInstanceUsecase } from './give-item-instance.usecase';
import { TakeItemInstanceUsecase } from './take-item-instance.usecase';

@injectable()
export class RunItemInstanceActionUsecase implements Usecase {
  public constructor(
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
    @inject(ItemRepository) private itemRepository: ItemRepository,
    @inject(GiveItemInstanceUsecase) private giveItemInstanceUsecase: GiveItemInstanceUsecase,
    @inject(TakeItemInstanceUsecase) private takeItemInstanceUsecase: TakeItemInstanceUsecase,
  ) {}

  public async perform(itemInstance: ItemInstanceEntity, actionKey: string): Promise<ItemInstanceEntity> {
    const item = await ItemInstanceUsecaseValidations.validateItemExists(this.itemRepository, { id: itemInstance.itemId });
    ItemInstanceUsecaseValidations.validateAction(item, actionKey);

    const action = item.actions.find((action) => action.key === actionKey);
    await Promise.all(action.effects.map((effect) => this.runEffect(effect, itemInstance)));

    return this.itemInstanceRepository.find({ filter: { id: itemInstance.id } });
  }

  private async runEffect(effect: ItemEntityActionEffectSettings, itemInstance: ItemInstanceEntity): Promise<void> {
    const handler = this.getEffectHandler(effect.type);
    await handler(effect, itemInstance);
  }

  private getEffectHandler(
    type: ItemEntityActionEffectType,
  ): (effect: ItemEntityActionEffectSettings, itemInstance: ItemInstanceEntity) => Promise<void> {
    if (type === ItemEntityActionEffectType.GetItems) {
      return this.runGetItemsEffect.bind(this);
    } else if (type === ItemEntityActionEffectType.GetRandomItems) {
      return this.runGetRandomItemsEffect.bind(this);
    } else if (type === ItemEntityActionEffectType.Destroy) {
      return this.runDestroyEffect.bind(this);
    } else {
      throw new UsecaseException(ExceptionCode.ItemActionConfigInvalid, 'Item action has invalid configuration');
    }
  }

  private async runGetItemsEffect(
    effect: ItemEntityActionEffectSettings,
    itemInstance: ItemInstanceEntity,
  ): Promise<void> {
    const theEffect = effect as ItemEntityGetItemsActionEffect;
    await Promise.all(
      theEffect.settings.items.map((item) =>
        this.giveItemInstanceUsecase.perform(itemInstance.accountId, item.itemId, item.quantity),
      ),
    );
  }

  private async runGetRandomItemsEffect(
    effect: ItemEntityActionEffectSettings,
    itemInstance: ItemInstanceEntity,
  ): Promise<void> {
    const theEffect = effect as ItemEntityGetRandomItemsActionEffect;
    await Promise.all(
      new Array(theEffect.settings.quantity).fill(null).map(() => {
        const selection = RandomUtil.weightedRandomInArray(theEffect.settings.items.map((el) => [el.weight, el]));
        return this.giveItemInstanceUsecase.perform(itemInstance.accountId, selection.itemId, selection.quantity);
      }),
    );
  }

  private async runDestroyEffect(
    effect: ItemEntityActionEffectSettings,
    itemInstance: ItemInstanceEntity,
  ): Promise<void> {
    await this.takeItemInstanceUsecase.perform(itemInstance.accountId, itemInstance.itemId, 1);
  }
}
