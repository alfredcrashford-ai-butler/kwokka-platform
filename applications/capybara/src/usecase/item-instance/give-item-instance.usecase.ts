import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceUsecaseValidations } from './item-instance-usecase-validations';
import { ItemInstanceRepository, ItemRepository } from '../ports';

@injectable()
export class GiveItemInstanceUsecase implements Usecase {
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

    let itemInstance = await this.itemInstanceRepository.find({ filter: { accountId, itemId } });
    if (!itemInstance) {
      itemInstance = new ItemInstanceEntity({ itemId, accountId, quantity });
      return await this.itemInstanceRepository.create(itemInstance);
    }

    return await this.itemInstanceRepository.update(
      { filter: { accountId, itemId } },
      { quantity: itemInstance.quantity + quantity },
    );
  }
}
