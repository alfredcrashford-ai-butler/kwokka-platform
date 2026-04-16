import { injectable, injectFromBase } from 'inversify';
import type { AccessRoleEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { AccessRoleApiAdapter } from './access-role.api-adapter';

@injectable()
@injectFromBase()
export class AccessRoleApi extends CrudApi<AccessRoleEntity, Dto<AccessRoleEntity>> {
  protected override readonly baseUrl = '/owl/v1/access-roles';
  protected override readonly adapter = new AccessRoleApiAdapter();
}
