import { injectable } from 'inversify';
import { ItemTransactionEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class ItemTransactionRepository extends Repository<ItemTransactionEntity> {}
