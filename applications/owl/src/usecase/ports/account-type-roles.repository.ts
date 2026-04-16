import { injectable } from 'inversify';
import { AccountTypeRolesEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class AccountTypeRolesRepository extends Repository<AccountTypeRolesEntity> {}
