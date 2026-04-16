import { inject, injectable } from 'inversify';
import { HttpService, type NetworkResponse } from '@/service/network/http.service';
import type { Entity } from '@kwokka/entities';
import type { Adapter, PublicProps } from '@kwokka/utils';

@injectable()
export abstract class CrudApi<E extends Entity, Dto = any> {
  @inject(HttpService)
  protected http: HttpService;

  protected abstract get adapter(): Adapter<E, Dto>;
  protected abstract get baseUrl(): string;

  public async list(offset: number, limit: number): Promise<NetworkResponse<E[]>> {
    const result = await this.http.get<Dto[]>(`${this.baseUrl}?offset=${offset}&limit=${limit}`);
    const entities = this.adapter.deserializeList(result.data);
    return {
      data: entities,
      meta: result.meta,
    };
  }

  public async getById(id: string): Promise<E> {
    const result = await this.http.get<Dto>(`${this.baseUrl}/${id}`);
    if (!result.data) {
      return null;
    }
    return this.adapter.deserialize(result.data);
  }

  public async create(entity: E): Promise<E> {
    const dto = this.adapter.serialize(entity);
    const result = await this.http.post<Dto>(this.baseUrl, dto);
    if (!result.data) {
      return null;
    }

    return this.adapter.deserialize(result.data);
  }

  public async update(id: string, data: Partial<PublicProps<E>>): Promise<E> {
    const result = await this.http.patch<Dto>(`${this.baseUrl}/${id}`, data);
    if (!result.data) {
      return null;
    }

    return this.adapter.deserialize(result.data);
  }

  public async delete(id: string): Promise<E> {
    const result = await this.http.delete<Dto>(`${this.baseUrl}/${id}`);
    if (!result.data) {
      return null;
    }

    return this.adapter.deserialize(result.data);
  }
}
