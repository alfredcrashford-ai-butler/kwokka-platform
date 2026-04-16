import { inject, injectable } from 'inversify';
import { Model as MongooseModel, Types, isValidObjectId, Error as MongooseError } from 'mongoose';
import { Entity as CommonEntity } from '@kwokka/entities';
import { Adapter, ObjectUtil, PublicProps } from '@kwokka/utils';
import {
  Repository,
  RepositoryFilter,
  RepositoryFilterListParams,
  RepositoryFindParams,
  RepositoryListResult,
  RepositorySort,
  UsecaseDeepSearchOperator,
  UsecaseDeepSearchParameter,
} from '../../usecase';
import { MongoDTO } from './mongo-dto';
import { LoggerService } from '../service';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 50;

type MongooseSort = [string, 1 | -1][];

@injectable()
export abstract class MongoRepository<Entity extends CommonEntity> extends Repository<Entity> {
  public abstract get adapter(): Adapter<Entity, MongoDTO<Entity>>;
  public abstract get model(): MongooseModel<any>;

  @inject(LoggerService)
  public logger: LoggerService;

  public override async find(params: RepositoryFindParams): Promise<Entity> {
    const filter = this.formatFilter(params?.filter);
    return await this.withCastErrorProtection(async () => {
      const doc = await this.model.findOne(filter).lean();

      if (!doc) {
        return null;
      }

      return this.adapter.deserialize(doc as MongoDTO<Entity>);
    }, null);
  }

  public override async list(params: RepositoryFilterListParams): Promise<RepositoryListResult<Entity[]>> {
    const offset = this.getOffset(params?.offset);
    const limit = this.getLimit(params?.limit);
    const filter = this.formatFilter(params?.filter);
    const sort = this.formatSort(params?.sort);

    return await this.withCastErrorProtection(
      async () => {
        const count = await this.model.find(filter).countDocuments();
        const docs = (await this.model.find(filter).sort(sort).skip(offset).limit(limit).lean()) as any[];

        const payload = this.adapter.deserializeList(docs);

        return { payload, metadata: { offset, limit, count } };
      },
      { payload: [], metadata: { offset, limit, count: 0 } },
    );
  }

  public override async listByIds(ids: string[]): Promise<RepositoryListResult<Entity[]>> {
    const uniqueIds = Array.from(new Set(ids));
    const filter = { _id: { $in: uniqueIds } };
    return await this.withCastErrorProtection(
      async () => {
        const count = await this.model.find(filter).countDocuments();
        const docs = (await this.model.find(filter).lean()) as any[];

        const payload = this.adapter.deserializeList(docs);

        return { payload, metadata: { offset: 0, limit: uniqueIds.length, count } };
      },
      { payload: [], metadata: { offset: 0, limit: uniqueIds.length, count: 0 } },
    );
  }

  public override async create(entity: Entity): Promise<Entity> {
    const model = this.adapter.serialize(entity);
    const doc = new this.model({ ...model });

    await doc.save();

    return this.adapter.deserialize(doc.toObject());
  }

  public override async update(params: RepositoryFindParams, model: Partial<PublicProps<Entity>>): Promise<Entity> {
    const filter = this.formatFilter(params?.filter);
    const doc = await this.model.findOne(filter);

    if (!doc) {
      return null;
    }

    Object.keys(model).forEach((key) => {
      if (model[key] === undefined) {
        return;
      }
      doc[key] = model[key];
    });
    await doc.save();

    return this.adapter.deserialize(doc.toObject());
  }

  public override async updateMany(
    params: RepositoryFindParams,
    model: Partial<PublicProps<Entity>>,
  ): Promise<RepositoryListResult<null>> {
    const filter = this.formatFilter(params?.filter);
    const count = await this.model.find(filter).countDocuments();
    await this.model.updateMany(filter, { $set: model });

    return { payload: null, metadata: { count } };
  }

  public updateByIds(ids: string[], model: Partial<PublicProps<Entity>>): Promise<RepositoryListResult<null>> {
    const filter = { id: { $in: ids } };
    return this.updateMany({ filter }, model);
  }

  public override async iterate(
    params: RepositoryFilterListParams,
    action: (payload: RepositoryListResult<Entity[]>) => any,
  ): Promise<void> {
    let offset = this.getOffset(params?.offset);
    const limit = this.getLimit(params?.limit);
    while (true) {
      const result = await this.list({ ...params, limit, offset });

      await action(result);

      if (result.payload.length < limit) {
        break;
      }

      offset += limit;
    }
  }

  public override async delete(params: RepositoryFindParams): Promise<Entity> {
    const filter = this.formatFilter(params?.filter);
    const doc = await this.model.findOne(filter);

    if (!doc) {
      return null;
    }

    doc.deletedAt = new Date();
    await doc.save();

    return this.adapter.deserialize(doc.toObject());
  }

  public override async deleteMany(params: RepositoryFindParams): Promise<RepositoryListResult<null>> {
    return this.updateMany(params, { deletedAt: new Date() } as any);
  }

  protected async iterateByPage(
    filter: RepositoryFilter,
    fn: (res: RepositoryListResult<Entity[]>) => any,
  ): Promise<void> {
    let page = 0;
    const limit = MAX_LIMIT;
    this.logger.debug('#MongoRepository: starting iterateByPage');
    while (true) {
      this.logger.debug(`#MongoRepository: iterateByPage, page: ${page}`);
      const result = await this.list({ filter, offset: page * limit, limit });
      await fn(result);
      if (result.payload.length < limit) {
        break;
      }
      page++;
    }
  }

  // TODO: add test that format filter does not turns numbers into ObjectId
  protected formatFilter(filter: RepositoryFilter): RepositoryFilter {
    let result = { ...(filter || {}) };
    if (result.id) {
      result._id = result.id;
      delete result.id;
    }

    if (!result.deletedAt) {
      result.deletedAt = null;
    }

    result = ObjectUtil.mapDeep(result, (v: any) =>
      typeof v === 'string' && isValidObjectId(v) ? new Types.ObjectId(v) : v,
    );
    Object.entries(result).forEach(([k, v]) => v === undefined && delete result[k]);

    return result;
  }

  protected formatSort(sort?: RepositorySort): MongooseSort | RepositorySort {
    if (!sort) {
      // If 'createdAt' is same for multiple documents - will provide weird results with
      // repeating records. Therefore adding additional _id sorting for default cases.
      return [
        ['createdAt', -1],
        ['_id', -1],
      ];
    }

    return { ...sort };
  }

  // When we send incorrectly formed filter, i.e. instead of ObjectId some field is simply a
  // string that can not be converted to ObjectId - mongoose throws CastError. Instead of
  // throwing the error for incorrectly formed payload - we should simply return a default
  // value. That is a repository style.
  protected async withCastErrorProtection(fn, defaultResult) {
    try {
      return await fn();
    } catch (e: any) {
      if (e instanceof MongooseError.CastError) {
        return defaultResult;
      }
      throw e;
    }
  }

  protected getOffset(offset: number | undefined | null): number {
    if (isNaN(offset) || !offset || typeof offset !== 'number' || offset < 0) {
      offset = DEFAULT_OFFSET;
    }
    return offset ?? DEFAULT_OFFSET;
  }

  protected getLimit(limit: number | undefined | null): number {
    // Passing limit as 0 to mongo is treated as "no limit", resulting in returning all records.
    if (isNaN(limit) || !limit || typeof limit !== 'number' || limit < 0) {
      limit = DEFAULT_LIMIT;
    }
    return Math.min(limit, MAX_LIMIT);
  }

  protected convertUsecaseDeepSearchParameter(filter: RepositoryFilter, paramName: string): RepositoryFilter {
    const param: UsecaseDeepSearchParameter = filter?.[paramName] as UsecaseDeepSearchParameter;

    if (!param) {
      return filter;
    }

    filter = { ...filter };
    delete filter[paramName];

    this.applyDeepSearchOperators(filter, paramName, param);
    return filter;
  }

  private applyDeepSearchOperators(
    filter: RepositoryFilter,
    paramName: string,
    param: UsecaseDeepSearchParameter,
  ): void {
    const processField = (fieldPath: string, value: UsecaseDeepSearchParameter | UsecaseDeepSearchOperator) => {
      if (this.isOperatorObject(value)) {
        const mongoOps = this.buildMongoOps(value as UsecaseDeepSearchOperator);
        if (Object.keys(mongoOps).length > 0) {
          filter[`${paramName}.${fieldPath}`] = mongoOps;
        }
      } else if (value && typeof value === 'object') {
        Object.entries(value).forEach(([subField, subValue]) => {
          processField(`${fieldPath}.${subField}`, subValue);
        });
      }
    };

    Object.entries(param).forEach(([field, operators]) => {
      processField(field, operators);
    });
  }

  private buildMongoOps(operators: UsecaseDeepSearchOperator): Record<string, any> {
    const mongoOps: Record<string, any> = {};

    if (operators.min !== undefined) {
      mongoOps['$gte'] = operators.min;
    }

    if (operators.max !== undefined) {
      mongoOps['$lte'] = operators.max;
    }

    if (operators.eq !== undefined) {
      mongoOps['$eq'] = operators.eq;
    }

    if (operators.neq !== undefined) {
      mongoOps['$ne'] = operators.neq;
    }

    return mongoOps;
  }

  private isOperatorObject(value: any): value is UsecaseDeepSearchOperator {
    if (!value || typeof value !== 'object') return false;
    return ['min', 'max', 'eq', 'neq'].some((key) => value[key] !== undefined);
  }
}
