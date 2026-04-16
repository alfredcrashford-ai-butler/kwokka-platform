import { DecorationEntity, ItemEntity, ItemInstanceEntity } from '@kwokka/entities';
import { KwokkaSdkNodeConfig } from '../config';
import { Dto, HttpUtil } from '../util';
import { AuthAPI } from '../auth';

export class InventoryAPI {
  private readonly capybaraUrl: string;

  public constructor(
    private readonly config: KwokkaSdkNodeConfig,
    private readonly auth: AuthAPI,
  ) {
    this.capybaraUrl = `${this.config.endpoint}/capybara`;
  }

  public async getItemByKey(key: string): Promise<ItemEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/key/${key}`;
      const response = await HttpUtil.get<{ data: Dto<ItemEntity> }>(url, this.auth.authHeaders);
      return this.deserializeItem(response.data);
    });
  }

  public async getItemById(id: string): Promise<ItemEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/${id}`;
      const response = await HttpUtil.get<{ data: Dto<ItemEntity> }>(url, this.auth.authHeaders);
      return this.deserializeItem(response.data);
    });
  }

  public async getDecorationById(id: string): Promise<DecorationEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/decorations/${id}`;
      const response = await HttpUtil.get<{ data: Dto<DecorationEntity> }>(url, this.auth.authHeaders);
      return this.deserializeDecoration(response.data);
    });
  }

  public async getDecorationByKey(key: string): Promise<DecorationEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/decorations/key/${key}`;
      const response = await HttpUtil.get<{ data: Dto<DecorationEntity> }>(url, this.auth.authHeaders);
      return this.deserializeDecoration(response.data);
    });
  }

  public async giveItemInstanceByItemId(
    itemId: string,
    accountId: string,
    quantity: number,
  ): Promise<ItemInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/my-application/${itemId}/give`;
      const response = await HttpUtil.post<{ data: Dto<ItemInstanceEntity> }>(
        url,
        { accountId, quantity },
        this.auth.authHeaders,
      );
      return this.deserializeItemInstance(response.data);
    });
  }

  public async takeItemInstanceByItemId(
    itemId: string,
    accountId: string,
    quantity: number,
  ): Promise<ItemInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/my-application/${itemId}/take`;
      const response = await HttpUtil.post<{ data: Dto<ItemInstanceEntity> }>(
        url,
        { accountId, quantity },
        this.auth.authHeaders,
      );
      return this.deserializeItemInstance(response.data);
    });
  }

  public async giveItemInstanceByItemKey(
    key: string,
    accountId: string,
    quantity: number,
  ): Promise<ItemInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/my-application/key/${key}/give`;
      const response = await HttpUtil.post<{ data: Dto<ItemInstanceEntity> }>(
        url,
        { accountId, quantity },
        this.auth.authHeaders,
      );
      return this.deserializeItemInstance(response.data);
    });
  }

  public async takeItemInstanceByItemKey(
    key: string,
    accountId: string,
    quantity: number,
  ): Promise<ItemInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/my-application/key/${key}/take`;
      const response = await HttpUtil.post<{ data: Dto<ItemInstanceEntity> }>(
        url,
        { accountId, quantity },
        this.auth.authHeaders,
      );
      return this.deserializeItemInstance(response.data);
    });
  }

  public async getItemInstanceByItemId(itemId: string, accountId: string): Promise<ItemInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/${itemId}/account/${accountId}`;
      const response = await HttpUtil.get<{ data: Dto<ItemInstanceEntity> }>(url, this.auth.authHeaders);
      return this.deserializeItemInstance(response.data);
    });
  }

  public async getItemInstanceByItemKey(itemKey: string, accountId: string): Promise<ItemInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/items/key/${itemKey}/account/${accountId}`;
      const response = await HttpUtil.get<{ data: Dto<ItemInstanceEntity> }>(url, this.auth.authHeaders);
      return this.deserializeItemInstance(response.data);
    });
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

  private deserializeDecoration(dto: Dto<DecorationEntity>): DecorationEntity {
    if (!dto) {
      return null;
    }

    return new DecorationEntity({
      id: dto.id,
      applicationAccountId: dto.applicationAccountId,
      key: dto.key,
      type: dto.type,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }
}
