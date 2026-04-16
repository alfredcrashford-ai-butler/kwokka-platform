import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceUsecaseValidations } from './item-instance-usecase-validations';
import { ItemInstanceRepository, ItemRepository } from '../ports';

@injectable()
export class TakeItemInstanceUsecase implements Usecase {
  public constructor(
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
    @inject(ItemRepository) private itemRepository: ItemRepository,
  ) {}

  public async perform(
    accountId: string,
    itemId: string,
    quantity: number,
    applicationAccountId?: string,
  ): Promise<ItemInstanceEntity> {
    ItemInstanceUsecaseValidations.validatePositiveQuantity(quantity);
    const filter: any = { id: itemId };
    if (applicationAccountId) {
      filter.applicationAccountId = applicationAccountId;
    }
    await ItemInstanceUsecaseValidations.validateItemExists(this.itemRepository, filter);

    const itemInstance = await this.itemInstanceRepository.find({ filter: { itemId, accountId } });
    ItemInstanceUsecaseValidations.validateAccountHasEnoughItemInstanceQuantity(itemInstance, quantity);

    return await this.itemInstanceRepository.update(
      { filter: { itemId, accountId } },
      { quantity: (itemInstance?.quantity || 0) - quantity },
    );
  }
}
