import { inject, injectable } from 'inversify';
import { ItemEntity } from '@kwokka/entities';
import { ItemUsecaseValidations } from './item-usecase-validations';
import { DecorationRepository, ItemRepository } from '../ports';
import { Usecase } from '@kwokka/common-node';

@injectable()
export class UpdateItemUsecase implements Usecase {
  public constructor(
    @inject(ItemRepository) private itemRepository: ItemRepository,
    @inject(DecorationRepository) private decorationRepository: DecorationRepository,
  ) {}

  public async perform(id: string, item: Partial<ItemEntity>): Promise<ItemEntity> {
    ItemUsecaseValidations.validateNoApplicationAccountId(item);
    await ItemUsecaseValidations.validateExists(this.itemRepository, id);
    if (item.key) {
      item.key = item.key.trim();
      await ItemUsecaseValidations.validateUniqueKey(this.itemRepository, item.key, id);
    }
    if (item.actions) {
      item.actions.forEach((action) => (action.key = action.key.trim()));
      await ItemUsecaseValidations.validateActions(this.itemRepository, this.decorationRepository, item);
    }

    return await this.itemRepository.update({ filter: { id } }, item);
  }
}
