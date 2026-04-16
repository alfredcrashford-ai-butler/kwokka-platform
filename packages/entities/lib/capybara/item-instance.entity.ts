import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class ItemInstanceEntity extends Entity {
  public accountId: string;
  public itemId: string;
  public quantity: number;

  public constructor(params: PublicProps<ItemInstanceEntity>) {
    super(params);
    this.accountId = params.accountId;
    this.itemId = params.itemId;
    this.quantity = params.quantity;
  }
}
