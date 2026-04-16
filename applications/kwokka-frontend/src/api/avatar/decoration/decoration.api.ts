import { injectable, injectFromBase } from 'inversify';
import type { DecorationEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { DecorationApiAdapter } from './decoration.api-adapter';

@injectable()
@injectFromBase()
export class DecorationApi extends CrudApi<DecorationEntity, Dto<DecorationEntity>> {
  protected override readonly baseUrl = '/capybara/v1/decorations';
  protected override readonly adapter = new DecorationApiAdapter();
}
