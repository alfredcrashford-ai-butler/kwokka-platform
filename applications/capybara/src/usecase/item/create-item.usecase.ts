import { inject, injectable } from 'inversify';
import { ItemEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemUsecaseValidations } from './item-usecase-validations';
import { DecorationRepository, ItemRepository } from '../ports';

@injectable()
export class CreateItemUsecase implements Usecase {
  public constructor(
    @inject(ItemRepository) private itemRepository: ItemRepository,
    @inject(DecorationRepository) private decorationRepository: DecorationRepository,
  ) {}

  public async perform(item: ItemEntity): Promise<ItemEntity> {
    item.key = item.key.trim();
    await ItemUsecaseValidations.validateUniqueKey(this.itemRepository, item.key);
    if (item.actions) {
      item.actions.forEach((action) => (action.key = action.key.trim()));
      await ItemUsecaseValidations.validateActions(this.itemRepository, this.decorationRepository, item);
    }

    return await this.itemRepository.create(item);
  }
}
