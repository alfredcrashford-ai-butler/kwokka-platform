import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceUsecaseValidations } from './item-instance-usecase-validations';
import { ItemInstanceRepository, ItemRepository } from '../ports';
import { RunItemInstanceActionUsecase } from './run-item-instance-action.usecase';

@injectable()
export class RunItemInstanceActionByItemKeyUsecase implements Usecase {
  public constructor(
    @inject(RunItemInstanceActionUsecase) private runItemInstanceActionUsecase: RunItemInstanceActionUsecase,
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
    @inject(ItemRepository) private itemRepository: ItemRepository,
  ) {}

  public async perform(itemKey: string, accountId: string, actionKey: string): Promise<ItemInstanceEntity> {
    const item = await ItemInstanceUsecaseValidations.validateItemExists(this.itemRepository, { key: itemKey });
    const itemInstance = await ItemInstanceUsecaseValidations.validateItemInstanceExists(this.itemInstanceRepository, {
      itemId: item.id,
      accountId,
    });
    return this.runItemInstanceActionUsecase.perform(itemInstance, actionKey);
  }
}
