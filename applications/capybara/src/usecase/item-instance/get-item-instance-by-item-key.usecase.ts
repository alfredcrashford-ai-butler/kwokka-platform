import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceRepository, ItemRepository } from '../ports';
import { ItemInstanceUsecaseValidations } from './item-instance-usecase-validations';

@injectable()
export class GetItemInstanceByItemKeyUsecase implements Usecase {
  public constructor(
    @inject(ItemRepository) private itemRepository: ItemRepository,
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
  ) {}

  public async perform(key: string, accountId: string): Promise<ItemInstanceEntity> {
    const item = await ItemInstanceUsecaseValidations.validateItemExists(this.itemRepository, { key });
    const itemInstance = await this.itemInstanceRepository.find({ filter: { itemId: item.id, accountId } });
    return itemInstance || null;
  }
}
