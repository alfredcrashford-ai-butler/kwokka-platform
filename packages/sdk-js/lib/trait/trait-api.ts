import { TraitEntity, TraitInstanceEntity } from '@kwokka/entities';
import type { AuthAPI } from '../auth';
import type { KwokkaSdkJsConfig } from '../config';
import { HttpUtil, QueryListDto, QuerySortOption, QueryUtil, type Dto } from '../util';
import { AuthInternalAPI } from '../auth-internal';

type ListSort = { createdAt?: QuerySortOption; value?: QuerySortOption };

export class TraitAPI {
  private readonly capybaraUrl: string;

  public constructor(
    private readonly config: KwokkaSdkJsConfig,
    private readonly authInternal: AuthInternalAPI,
  ) {
    this.capybaraUrl = `${this.config.endpoint}/capybara`;
  }

  public async getTraitsByKeys(keys: string[]): Promise<TraitEntity[]> {
    return this.authInternal.withAuth(async () => {
      return Promise.all(
        keys.map(async (key) => {
          const url = `${this.capybaraUrl}/v1/traits/key/${key}`;
          const response = await HttpUtil.get<{ data: Dto<TraitEntity> }>(url, this.authInternal.authHeaders);
          return this.deserializeTrait(response.data);
        }),
      );
    });
  }

  public async getTraitByKey(key: string): Promise<TraitEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/key/${key}`;
      const response = await HttpUtil.get<{ data: Dto<TraitEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeTrait(response.data);
    });
  }

  public async getTraitById(id: string): Promise<TraitEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/${id}`;
      const response = await HttpUtil.get<{ data: Dto<TraitEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeTrait(response.data);
    });
  }

  public async getTraitInstancesByKeys(accountId: string, keys: string[]): Promise<TraitInstanceEntity[]> {
    return this.authInternal.withAuth(async () => {
      return Promise.all(
        keys.map(async (key) => {
          const url = `${this.capybaraUrl}/v1/traits/key/${key}/account/${accountId}`;
          const response = await HttpUtil.get<{ data: Dto<TraitInstanceEntity> }>(url, this.authInternal.authHeaders);
          return this.deserializeTraitInstance(response.data);
        }),
      );
    });
  }

  public async getTraitInstanceByTraitKey(accountId: string, key: string): Promise<TraitInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/key/${key}/account/${accountId}`;
      const response = await HttpUtil.get<{ data: Dto<TraitInstanceEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async getTraitInstanceByTraitId(accountId: string, id: string): Promise<TraitInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/${id}/account/${accountId}`;
      const response = await HttpUtil.get<{ data: Dto<TraitInstanceEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async getOwnTraitInstancesByKeys(keys: string[]): Promise<TraitInstanceEntity[]> {
    return this.authInternal.withAuth(async () => {
      return Promise.all(
        keys.map(async (key) => {
          const url = `${this.capybaraUrl}/v1/traits/key/${key}/account/${this.authInternal.accountId}`;
          const response = await HttpUtil.get<{ data: Dto<TraitInstanceEntity> }>(url, this.authInternal.authHeaders);
          return this.deserializeTraitInstance(response.data);
        }),
      );
    });
  }

  public async getOwnTraitInstanceByTraitKey(key: string): Promise<TraitInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/key/${key}/account/${this.authInternal.accountId}`;
      const response = await HttpUtil.get<{ data: Dto<TraitInstanceEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async getOwnTraitInstanceByTraitId(id: string): Promise<TraitInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/${id}/account/${this.authInternal.accountId}`;
      const response = await HttpUtil.get<{ data: Dto<TraitInstanceEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async updateOwnTraitInstanceByTraitKey(key: string, value: any): Promise<TraitInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/key/${key}/my`;
      const response = await HttpUtil.put<{ data: Dto<TraitInstanceEntity> }>(url, { value }, this.authInternal.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async updateOwnTraitInstanceByTraitId(id: string, value: any): Promise<TraitInstanceEntity> {
    return this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/${id}/my`;
      const response = await HttpUtil.put<{ data: Dto<TraitInstanceEntity> }>(url, { value }, this.authInternal.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async listTraitInstancesByTraitId(
    id: string,
    params: { offset?: number; limit?: number; sort?: ListSort } = {},
  ): Promise<QueryListDto<TraitInstanceEntity>> {
    return this.authInternal.withAuth(async () => {
      const query = QueryUtil.buildQuery(params);
      const url = `${this.capybaraUrl}/v1/traits/${id}/instances${query}`;
      const response = await HttpUtil.get<QueryListDto<Dto<TraitInstanceEntity>>>(url, this.authInternal.authHeaders);
      return { data: this.deserializeTraitInstanceList(response.data), meta: response.meta };
    });
  }

  private deserializeTrait(dto: Dto<TraitEntity>): TraitEntity {
    if (!dto) {
      return null;
    }

    return new TraitEntity({
      id: dto.id,
      key: dto.key,
      type: dto.type,
      applicationAccountId: dto.applicationAccountId,
      defaultValue: dto.defaultValue,
      isOwnerEditable: dto.isOwnerEditable,
      isPubliclyVisible: dto.isPubliclyVisible,
      config: dto.config,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  private deserializeTraitInstanceList(dtos: Dto<TraitInstanceEntity>[]): TraitInstanceEntity[] {
    return (dtos || []).map((el) => this.deserializeTraitInstance(el));
  }

  private deserializeTraitInstance(dto: Dto<TraitInstanceEntity>): TraitInstanceEntity {
    if (!dto) {
      return null;
    }

    return new TraitInstanceEntity({
      id: dto.id,
      accountId: dto.accountId,
      traitId: dto.traitId,
      value: dto.value ?? null,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }
}
