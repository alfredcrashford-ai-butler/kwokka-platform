import { inject, injectable } from 'inversify';
import {
  DecorationEntity,
  ItemEntityActionEffectType,
  ItemEntityActionTrigger,
  ItemEntityUnlockDecorationsActionEffect,
} from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { ItemRepository, ItemInstanceRepository, DecorationRepository } from '../ports';

@injectable()
export class ListAvailableDecorationsUsecase implements Usecase {
  public constructor(
    @inject(DecorationRepository) private decorationRepository: DecorationRepository,
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
    @inject(ItemRepository) private itemRepository: ItemRepository,
  ) {}

  public async perform(accountId: string): Promise<UsecaseListResult<DecorationEntity>> {
    // Step 1: get all item ids that an account has
    const { payload: itemInstances } = await this.itemInstanceRepository.listAllExisting({ filter: { accountId } });
    let itemIds = itemInstances.map((el) => el.itemId);
    itemIds = Array.from(new Set(itemIds));

    // Step 2: get decoration ids
    const itemsResult = await this.itemRepository.listByIds(itemIds);
    let actions = itemsResult.payload.flatMap((el) => el.actions);
    actions = actions.filter((el) => el.trigger === ItemEntityActionTrigger.Have);
    let effects = actions.flatMap((el) => el.effects);
    effects = effects.filter((el) => el.type === ItemEntityActionEffectType.UnlockDecorations);
    const decorationIds = (effects as ItemEntityUnlockDecorationsActionEffect[]).flatMap(
      (el) => el.settings.decorationsIds,
    );

    // Step 3: get decorations
    return await this.decorationRepository.listByIds(decorationIds);
  }
}
