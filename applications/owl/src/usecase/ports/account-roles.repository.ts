import { injectable } from 'inversify';
import { AccountRolesEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class AccountRolesRepository extends Repository<AccountRolesEntity> {}
