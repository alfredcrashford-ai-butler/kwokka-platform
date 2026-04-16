import { injectable } from 'inversify';
import { AccountEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class AccountRepository extends Repository<AccountEntity> {}