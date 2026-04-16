import { injectable } from 'inversify';
import { PublicProps } from '@kwokka/utils';

export type RepositoryFilter = {
  [fieldName in string]: null | boolean | string | number | Date | string[] | number[] | object;
};
export type RepositorySort = { [fieldName in string]: 'asc' | 'desc' };

export interface RepositoryFilterListParams extends RepositoryListParams {
  filter?: RepositoryFilter;
}

export interface RepositoryListParams {
  offset?: number;
  limit?: number;
  sort?: RepositorySort;
}

export interface RepositoryFindParams {
  filter?: RepositoryFilter;
}

export interface RepositoryListResult<T> {
  payload: T;
  metadata: {
    offset?: number;
    limit?: number;
    count: number;
  };
}

@injectable()
export abstract class Repository<Entity> {
  public abstract find(params: RepositoryFindParams): Promise<Entity>;
  public abstract list(params: RepositoryFilterListParams): Promise<RepositoryListResult<Entity[]>>;
  public abstract listByIds(ids: string[]): Promise<RepositoryListResult<Entity[]>>;
  public abstract create(model: Entity): Promise<Entity>;
  public abstract update(params: RepositoryFindParams, model: Partial<PublicProps<Entity>>): Promise<Entity>;
  public abstract updateMany(
    params: RepositoryFindParams,
    model: Partial<PublicProps<Entity>>,
  ): Promise<RepositoryListResult<null>>;
  public abstract updateByIds(ids: string[], model: Partial<PublicProps<Entity>>): Promise<RepositoryListResult<null>>;
  public abstract iterate(
    params: RepositoryFindParams,
    action: (payload: RepositoryListResult<Entity[]>) => any,
  ): Promise<void>;
  public abstract delete(params: RepositoryFindParams): Promise<Entity>;
  public abstract deleteMany(params: RepositoryFindParams): Promise<RepositoryListResult<null>>;
}
