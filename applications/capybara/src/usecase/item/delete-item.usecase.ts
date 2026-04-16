import { inject, injectable } from 'inversify';
import { ItemEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemUsecaseValidations } from './item-usecase-validations';
import { ItemInstanceRepository, ItemRepository } from '../ports';

@injectable()
export class DeleteItemUsecase implements Usecase {
  public constructor(
    @inject(ItemRepository) private itemRepository: ItemRepository,
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
  ) {}

  public async perform(id: string): Promise<ItemEntity> {
    const item = await ItemUsecaseValidations.validateExists(this.itemRepository, id);
    await this.cleanupRelatedEntities(item);
    return await this.itemRepository.delete({ filter: { id } });
  }

  private async cleanupRelatedEntities(item: ItemEntity) {
    await this.itemRepository.removeItemFromOtherItems(item);
    this.itemInstanceRepository.deleteMany({ filter: { itemId: item.id } });
  }
}
