import { injectable, injectFromBase } from 'inversify';
import type { TraitEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { TraitApiAdapter } from './trait.api-adapter';

@injectable()
@injectFromBase()
export class TraitApi extends CrudApi<TraitEntity, Dto<TraitEntity>> {
  protected override readonly baseUrl = '/capybara/v1/traits';
  protected override readonly adapter = new TraitApiAdapter();
}
