import { ItemEntity, ItemInstanceEntity, ItemTradeEntity } from '@kwokka/entities';
import type { AuthAPI } from '../auth';
import type { KwokkaSdkJsConfig } from '../config';
import { HttpUtil, type Dto } from '../util';
import { AuthInternalAPI } from '../auth-internal';

export class InventoryAPI {
  private readonly capybaraUrl: string;

  public constructor(
    private readonly config: KwokkaSdkJsConfig,
    private readonly authInternal: AuthInternalAPI,
  ) {
    this.capybaraUrl = `${this.config.endpoint}/capybara`;
  }

  public async getItemsByIds(ids: string[]): Promise<ItemEntity[]> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items?ids=${(ids || []).filter(Boolean).join(',')}`;
      const response = await HttpUtil.get<{ data: Dto<ItemEntity>[] }>(url, this.authInternal.authHeaders);
      return this.deserializeItemsList(response.data);
    });
  }

  public async getItemsByKeys(keys: string[]): Promise<ItemEntity[]> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items?keys=${(keys || []).filter(Boolean).join(',')}`;
      const response = await HttpUtil.get<{ data: Dto<ItemEntity>[] }>(url, this.authInternal.authHeaders);
      return this.deserializeItemsList(response.data);
    });
  }

  public async getItemByKey(key: string): Promise<ItemEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/key/${key}`;
      const response = await HttpUtil.get<{ data: Dto<ItemEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeItem(response.data);
    });
  }

  public async getItemById(id: string): Promise<ItemEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/${id}`;
      const response = await HttpUtil.get<{ data: Dto<ItemEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeItem(response.data);
    });
  }

  public async getOwnItemInstanceByItemId(itemId: string): Promise<ItemInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/${itemId}/my`;
      const response = await HttpUtil.get<{ data: Dto<ItemInstanceEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeItemInstance(response.data);
    });
  }

  public async getOwnItemInstanceByItemKey(itemKey: string): Promise<ItemInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/key/${itemKey}/my`;
      const response = await HttpUtil.get<{ data: Dto<ItemInstanceEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeItemInstance(response.data);
    });
  }

  public async getItemTradeByKey(key: string): Promise<ItemTradeEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/item-trades/key/${key}`;
      const response = await HttpUtil.get<{ data: Dto<ItemTradeEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeItemTrade(response.data);
    });
  }

  public async getItemTradeByid(id: string): Promise<ItemTradeEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/item-trades/${id}`;
      const response = await HttpUtil.get<{ data: Dto<ItemTradeEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeItemTrade(response.data);
    });
  }

  public async runOwnItemTradeByKey(key: string): Promise<ItemInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/item-trades/key/${key}/my/run`;
      const response = await HttpUtil.post<{ data: Dto<ItemInstanceEntity> }>(url, {}, this.authInternal.authHeaders);
      return this.deserializeItemInstance(response.data);
    });
  }

  public async runOwnItemTradeByid(id: string): Promise<ItemInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/item-trades/${id}/my/run`;
      const response = await HttpUtil.post<{ data: Dto<ItemInstanceEntity> }>(url, {}, this.authInternal.authHeaders);
      return this.deserializeItemInstance(response.data);
    });
  }

  private deserializeItemsList(dtos: Dto<ItemEntity>[]): ItemEntity[] {
    if (!dtos?.length) {
      return null;
    }

    return dtos.map(dto => this.deserializeItem(dto));
  }

  private deserializeItem(dto: Dto<ItemEntity>): ItemEntity {
    if (!dto) {
      return null;
    }

    return new ItemEntity({
      id: dto.id,
      key: dto.key,
      applicationAccountId: dto.applicationAccountId,
      isTransferrable: dto.isTransferrable,
      actions: dto.actions,
      tags: dto.tags,
      rarity: dto.rarity,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  private deserializeItemTrade(dto: Dto<ItemTradeEntity>): ItemTradeEntity {
    if (!dto) {
      return null;
    }

    return new ItemTradeEntity({
      id: dto.id,
      itemId: dto.itemId,
      key: dto.key,
      quantity: dto.quantity,
      maxQuantity: dto.maxQuantity,
      tradedItemId: dto.tradedItemId,
      tradedItemQuantity: dto.tradedItemQuantity,
      requiredItems: dto.requiredItems,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  private deserializeItemInstance(dto: Dto<ItemInstanceEntity>): ItemInstanceEntity {
    if (!dto) {
      return null;
    }

    return new ItemInstanceEntity({
      id: dto.id,
      accountId: dto.accountId,
      itemId: dto.itemId,
      quantity: dto.quantity,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }
}
