import { inject, injectable } from 'inversify';
import { ItemTransactionEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemRepository, ItemTransactionRepository } from '../ports';
import { ItemTransactionUsecaseValidations } from './item-transaction-usecase-validations';

@injectable()
export class CreateItemTransactionUsecase implements Usecase {
  public constructor(
    @inject(ItemTransactionRepository) private itemTransactionRepository: ItemTransactionRepository,
    @inject(ItemRepository) private itemRepository: ItemRepository,
  ) {}

  public async perform(itemTransaction: ItemTransactionEntity): Promise<ItemTransactionEntity> {
    await ItemTransactionUsecaseValidations.validateItemExists(this.itemRepository, itemTransaction.itemId);

    return await this.itemTransactionRepository.create(itemTransaction);
  }
}
