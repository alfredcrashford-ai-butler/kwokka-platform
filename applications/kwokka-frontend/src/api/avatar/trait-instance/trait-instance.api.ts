import { inject, injectable } from 'inversify';
import type { Dto } from '@/api/dto';
import { HttpService, type NetworkResponse } from '@/service/network/http.service';
import { TraitInstanceApiAdapter } from './trait-instance.api-adapter';
import type { TraitInstanceEntity } from '@kwokka/entities';

@injectable()
export class TraitInstanceApi {
  private readonly adapter = new TraitInstanceApiAdapter();
  private readonly baseUrl = '/capybara/v1/traits';

  @inject(HttpService)
  private readonly http: HttpService;

  public async getTraitInstanceByTraitKey(
    accountId: string,
    key: string,
  ): Promise<NetworkResponse<TraitInstanceEntity>> {
    const result = await this.http.get<Dto<TraitInstanceEntity>>(`${this.baseUrl}/key/${key}/account/${accountId}`);

    if (!result.data) {
      return null;
    }

    return { data: this.adapter.deserialize(result.data), meta: result.meta };
  }

  public async getTraitInstanceByTraitId(
    accountId: string,
    traitId: string,
  ): Promise<NetworkResponse<TraitInstanceEntity>> {
    const result = await this.http.get<Dto<TraitInstanceEntity>>(`${this.baseUrl}/${traitId}/account/${accountId}`);

    if (!result.data) {
      return null;
    }

    return { data: this.adapter.deserialize(result.data), meta: result.meta };
  }

  public async updateTraitInstanceByTraitKey(
    accountId: string,
    key: string,
    value: any,
  ): Promise<NetworkResponse<TraitInstanceEntity>> {
    const url = `${this.baseUrl}/key/${key}/account/${accountId}`;
    const result = await this.http.put<Dto<TraitInstanceEntity>>(url, { value });

    if (!result.data) {
      return null;
    }

    return { data: this.adapter.deserialize(result.data), meta: result.meta };
  }

  public async updateTraitInstanceByTraitId(
    accountId: string,
    traitId: string,
    value: any,
  ): Promise<NetworkResponse<TraitInstanceEntity>> {
    const url = `${this.baseUrl}/${traitId}/account/${accountId}`;
    const result = await this.http.put<Dto<TraitInstanceEntity>>(url, { value });

    if (!result.data) {
      return null;
    }

    return { data: this.adapter.deserialize(result.data), meta: result.meta };
  }

  public async updateOwnTraitInstanceByTraitId(
    traitId: string,
    value: any,
  ): Promise<NetworkResponse<TraitInstanceEntity>> {
    const url = `${this.baseUrl}/${traitId}/my`;
    const result = await this.http.put<Dto<TraitInstanceEntity>>(url, { value });

    if (!result.data) {
      return null;
    }

    return { data: this.adapter.deserialize(result.data), meta: result.meta };
  }

  public async updateOwnTraitInstanceByTraitKey(
    key: string,
    value: any,
  ): Promise<NetworkResponse<TraitInstanceEntity>> {
    const url = `${this.baseUrl}/key/${key}/my`;
    const result = await this.http.put<Dto<TraitInstanceEntity>>(url, { value });

    if (!result.data) {
      return null;
    }

    return { data: this.adapter.deserialize(result.data), meta: result.meta };
  }

  public async deleteTraitInstanceByTraitKey(
    key: string,
    accountId: string,
  ): Promise<NetworkResponse<TraitInstanceEntity>> {
    const url = `${this.baseUrl}/key/${key}/account/${accountId}`;
    const result = await this.http.delete<Dto<TraitInstanceEntity>>(url);

    if (!result.data) {
      return null;
    }

    return { data: this.adapter.deserialize(result.data), meta: result.meta };
  }

  public async deleteTraitInstanceByTraitId(
    traitId: string,
    accountId: string,
  ): Promise<NetworkResponse<TraitInstanceEntity>> {
    const url = `${this.baseUrl}/${traitId}/account/${accountId}`;
    const result = await this.http.delete<Dto<TraitInstanceEntity>>(url);

    if (!result.data) {
      return null;
    }

    return { data: this.adapter.deserialize(result.data), meta: result.meta };
  }
}
