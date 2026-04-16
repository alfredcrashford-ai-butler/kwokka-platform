import { injectable, injectFromBase } from 'inversify';
import type { AccountTypeRolesEntity } from '@kwokka/entities';
import type { Dto } from '@/api/dto';
import { CrudApi } from '@/api/crud-api';
import { AccountTypeRolesApiAdapter } from './account-type-roles.api-adapter';

@injectable()
@injectFromBase()
export class AccountTypeRolesApi extends CrudApi<AccountTypeRolesEntity, Dto<AccountTypeRolesEntity>> {
  protected override readonly baseUrl = '/owl/v1/account-type-roles';
  protected override readonly adapter = new AccountTypeRolesApiAdapter();
}
