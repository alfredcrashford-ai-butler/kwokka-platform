import { injectable, injectFromBase } from 'inversify';
import type { AccessRightEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { AccessRightApiAdapter } from './access-right.api-adapter';

@injectable()
@injectFromBase()
export class AccessRightApi extends CrudApi<AccessRightEntity, Dto<AccessRightEntity>> {
  protected override readonly baseUrl = '/owl/v1/access-rights';
  protected override readonly adapter = new AccessRightApiAdapter();
}
