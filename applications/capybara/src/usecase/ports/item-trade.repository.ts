import { injectable } from 'inversify';
import { ItemTradeEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class ItemTradeRepository extends Repository<ItemTradeEntity> {}
