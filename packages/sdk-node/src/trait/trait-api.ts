import { TraitEntity, TraitInstanceEntity } from '@kwokka/entities';
import { AuthAPI } from '../auth';
import { KwokkaSdkNodeConfig } from '../config';
import { Dto, HttpUtil } from '../util';

export class TraitAPI {
  private readonly capybaraUrl: string;

  public constructor(
    private readonly config: KwokkaSdkNodeConfig,
    private readonly auth: AuthAPI,
  ) {
    this.capybaraUrl = `${this.config.endpoint}/capybara`;
  }

  public async getTraitByKey(key: string): Promise<TraitEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/key/${key}`;
      const response = await HttpUtil.get<{ data: Dto<TraitEntity> }>(url, this.auth.authHeaders);
      return this.deserializeTrait(response.data);
    });
  }

  public async getTraitById(id: string): Promise<TraitEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/${id}`;
      const response = await HttpUtil.get<{ data: Dto<TraitEntity> }>(url, this.auth.authHeaders);
      return this.deserializeTrait(response.data);
    });
  }

  public async getTraitInstanceByTraitKey(accountId: string, key: string): Promise<TraitInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/key/${key}/account/${accountId}`;
      const response = await HttpUtil.get<{ data: Dto<TraitInstanceEntity> }>(url, this.auth.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async getTraitInstanceByTraitId(accountId: string, traitId: string): Promise<TraitInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/${traitId}/account/${accountId}`;
      const response = await HttpUtil.get<{ data: Dto<TraitInstanceEntity> }>(url, this.auth.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async updateTraitInstanceByTraitKey(accountId: string, key: string, value: any): Promise<TraitInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/key/${key}/account/${accountId}`;
      const response = await HttpUtil.put<{ data: Dto<TraitInstanceEntity> }>(url, { value }, this.auth.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }

  public async updateTraitInstanceByTraitId(
    accountId: string,
    traitId: string,
    value: any,
  ): Promise<TraitInstanceEntity> {
    return this.auth.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/traits/${traitId}/account/${accountId}`;
      const response = await HttpUtil.put<{ data: Dto<TraitInstanceEntity> }>(url, { value }, this.auth.authHeaders);
      return this.deserializeTraitInstance(response.data);
    });
  }


  public async getOwnTraitInstanceByTraitKey(key: string): Promise<TraitInstanceEntity> {
    return this.getTraitInstanceByTraitKey(this.auth.accountId, key);
  }

  public async getOwnTraitInstanceByTraitId(id: string): Promise<TraitInstanceEntity> {
    return this.getTraitInstanceByTraitId(this.auth.accountId, id);
  }

  public async updateOwnTraitInstanceByTraitKey(key: string, value: any): Promise<TraitInstanceEntity> {
    return this.updateTraitInstanceByTraitKey(this.auth.accountId, key, value);
  }

  public async updateOwnTraitInstanceByTraitId(id: string, value: any): Promise<TraitInstanceEntity> {
    return this.updateTraitInstanceByTraitId(this.auth.accountId, id, value);
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

  private deserializeTraitInstance(dto: Dto<TraitInstanceEntity>): TraitInstanceEntity {
    if (!dto) {
      return null;
    }

    return new TraitInstanceEntity({
      id: dto.id,
      accountId: dto.accountId,
      traitId: dto.traitId,
      value: dto.value,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }
}
