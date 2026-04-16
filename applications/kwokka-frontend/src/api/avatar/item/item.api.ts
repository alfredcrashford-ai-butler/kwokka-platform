import { injectable, injectFromBase } from 'inversify';
import type { ItemEntity, ItemInstanceEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import type { NetworkResponse } from '@/service/network/http.service';
import { ItemApiAdapter } from './item.api-adapter';
import { ItemInstanceApiAdapter } from './item-instance.api-adapter';

@injectable()
@injectFromBase()
export class ItemApi extends CrudApi<ItemEntity, Dto<ItemEntity>> {
  protected override readonly baseUrl = '/capybara/v1/items';
  protected override readonly adapter = new ItemApiAdapter();
  protected readonly itemInstanceAdapter = new ItemInstanceApiAdapter();

  public async listOwnItemInstances(offset: number, limit: number): Promise<NetworkResponse<ItemInstanceEntity[]>> {
    const result = await this.http.get<Dto<ItemInstanceEntity>[]>(`${this.baseUrl}/my?offset=${offset}&limit=${limit}`);
    const entities = this.itemInstanceAdapter.deserializeList(result.data);
    return { data: entities, meta: result.meta };
  }

  public async runItemInstanceAction(itemId: string, accountId: string, key: string): Promise<ItemInstanceEntity> {
    const url = `${this.baseUrl}/${itemId}/account/${accountId}/run-action`;
    const result = await this.http.post<Dto<ItemInstanceEntity>>(url, { key });
    return this.itemInstanceAdapter.deserialize(result.data);
  }

  public async runOwnItemInstanceAction(itemId: string, key: string): Promise<ItemInstanceEntity> {
    const url = `${this.baseUrl}/${itemId}/my/run-action`;
    const result = await this.http.post<Dto<ItemInstanceEntity>>(url, { key });
    return this.itemInstanceAdapter.deserialize(result.data);
  }

  public async giveItemInstanceByItemId(
    accountId: string,
    itemId: string,
    quantity: number,
  ): Promise<ItemInstanceEntity> {
    const url = `${this.baseUrl}/${itemId}/give`;
    const result = await this.http.post<Dto<ItemInstanceEntity>>(url, { accountId, quantity });
    return this.itemInstanceAdapter.deserialize(result.data);
  }

  public async takeItemInstanceByItemId(
    accountId: string,
    itemId: string,
    quantity: number,
  ): Promise<ItemInstanceEntity> {
    const url = `${this.baseUrl}/${itemId}/take`;
    const result = await this.http.post<Dto<ItemInstanceEntity>>(url, { accountId, quantity });
    return this.itemInstanceAdapter.deserialize(result.data);
  }

  public async listItemInstancesByAccountId(
    offset: number,
    limit: number,
    accountId: string,
  ): Promise<NetworkResponse<ItemInstanceEntity[]>> {
    const url = `${this.baseUrl}/account/${accountId}?offset=${offset}&limit=${limit}`;
    const result = await this.http.get<Dto<ItemInstanceEntity>[]>(url);
    const entities = this.itemInstanceAdapter.deserializeList(result.data);
    return { data: entities, meta: result.meta };
  }
}
