import { injectable, injectFromBase } from 'inversify';
import { ItemTradeApiAdapter } from './item-trade.api-adapter';
import type { ItemTradeEntity } from '@kwokka/entities';
import type { Dto } from '@/api/dto';
import { CrudApi } from '@/api/crud-api';

@injectable()
@injectFromBase()
export class ItemTradeApi extends CrudApi<ItemTradeEntity, Dto<ItemTradeEntity>> {
  protected readonly adapter = new ItemTradeApiAdapter();
  protected readonly baseUrl = '/capybara/v1/item-trades';
}
