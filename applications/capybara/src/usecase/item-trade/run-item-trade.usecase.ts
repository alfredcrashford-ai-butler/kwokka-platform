import { inject, injectable } from 'inversify';
import {
  AccountEntity,
  ItemInstanceEntity,
  ItemTradeEntity,
  ItemTransactionEntity,
  ItemTransactionType,
} from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceRepository, ItemTradeRepository, ItemTransactionRepository } from '../ports';
import { GiveItemInstanceUsecase, TakeItemInstanceUsecase } from '../item-instance';
import { ItemTradeUsecaseValidations } from './item-trade-usecase-validations';
import { CreateItemTransactionUsecase } from '../item-transaction';

@injectable()
export class RunItemTradeUsecase implements Usecase {
  public constructor(
    @inject(ItemTradeRepository) private itemTradeRepository: ItemTradeRepository,
    @inject(CreateItemTransactionUsecase) private createItemTransactionUsecase: CreateItemTransactionUsecase,
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
    @inject(GiveItemInstanceUsecase) private giveItemInstanceUsecase: GiveItemInstanceUsecase,
    @inject(TakeItemInstanceUsecase) private takeItemInstanceUsecase: TakeItemInstanceUsecase,
  ) {}

  public async perform(itemTrade: ItemTradeEntity, account: AccountEntity): Promise<ItemInstanceEntity> {
    itemTrade = await ItemTradeUsecaseValidations.validateExists(this.itemTradeRepository, itemTrade.id);
    await this.validateAccountHasRequiredItems(account, itemTrade);
    await this.validateAccountHasLessItems(account, itemTrade);

    await this.takeItemInstanceUsecase.perform(account.id, itemTrade.tradedItemId, itemTrade.tradedItemQuantity);
    const result = await this.giveItemInstanceUsecase.perform(account.id, itemTrade.itemId, itemTrade.quantity);

    await this.createItemTransation(account, itemTrade);

    return result;
  }

  private async validateAccountHasLessItems(account: AccountEntity, itemTrade: ItemTradeEntity): Promise<void> {
    await ItemTradeUsecaseValidations.validateAccountHasLessItems(
      this.itemInstanceRepository,
      account.id,
      itemTrade.itemId,
      itemTrade.maxQuantity,
    );
  }

  private async validateAccountHasRequiredItems(account: AccountEntity, itemTrade: ItemTradeEntity): Promise<void> {
    await ItemTradeUsecaseValidations.validateAccountHasRequiredItems(
      this.itemInstanceRepository,
      itemTrade,
      account.id,
    );
  }

  private async createItemTransation(account: AccountEntity, itemTrade: ItemTradeEntity): Promise<void> {
    const transaction = new ItemTransactionEntity({
      accountId: account.id,
      type: ItemTransactionType.Trade,
      itemId: itemTrade.itemId,
      transactionDetails: {
        quantity: itemTrade.quantity,
        tradedItemId: itemTrade.tradedItemId,
        tradedItemQuantity: itemTrade.tradedItemQuantity,
      },
    });
    await this.createItemTransactionUsecase.perform(transaction);
  }
}
