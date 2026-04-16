import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class ItemTradeEntity extends Entity {
  public itemId: string;
  public key: string;
  public quantity: number;
  public maxQuantity?: number;
  public tradedItemId: string;
  public tradedItemQuantity: number;
  public requiredItems?: { itemId: string; quantity: number }[];

  public constructor(params: PublicProps<ItemTradeEntity>) {
    super(params);
    this.key = params.key;
    this.itemId = params.itemId;
    this.quantity = params.quantity;
    this.maxQuantity = params.maxQuantity;
    this.tradedItemId = params.tradedItemId;
    this.tradedItemQuantity = params.tradedItemQuantity;
    this.requiredItems = params.requiredItems;
  }

  public static isQuantityValid(trade: ItemTradeEntity): boolean {
    return (
      (trade.quantity ?? 0) > 0 &&
      (trade.tradedItemQuantity ?? 0) >= 0 &&
      (trade.maxQuantity ?? Number.POSITIVE_INFINITY) > 0 &&
      (!trade.requiredItems || !trade.requiredItems.length || trade.requiredItems.every((el) => el.quantity > 0))
    );
  }
}
