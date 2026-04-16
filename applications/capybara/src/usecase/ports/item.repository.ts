import { injectable } from 'inversify';
import { DecorationEntity, ItemEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class ItemRepository extends Repository<ItemEntity> {
  public abstract removeDecorationFromItems(decoration: DecorationEntity): Promise<void>;
  public abstract removeItemFromOtherItems(item: ItemEntity): Promise<void>;
}
