import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export enum ItemTransactionType {
  Trade = 'trade',
}

export class ItemTransactionEntity extends Entity {
  public accountId: string;
  public type: ItemTransactionType;
  public itemId: string;
  public transactionDetails: any;

  public constructor(params: PublicProps<ItemTransactionEntity>) {
    super(params);
    this.accountId = params.accountId;
    this.type = params.type;
    this.itemId = params.itemId;
    this.transactionDetails = params.transactionDetails;
  }
}
