import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { ItemInstanceEntity } from '@kwokka/entities';
import {
  DatabaseService,
  MongoRepository,
  RepositoryFilterListParams,
  RepositoryListResult,
} from '@kwokka/common-node';
import { ItemInstanceRepository } from '../../../usecase';
import { ItemInstanceMongoAdapter } from './item-instance-mongo.adapter';

@injectable()
@injectFromBase()
export class ItemInstanceMongoRepository extends MongoRepository<ItemInstanceEntity> implements ItemInstanceRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: ItemInstanceMongoAdapter;
  private readonly modelName = 'item-instance';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new ItemInstanceMongoAdapter();
  }

  public async listAll(params: RepositoryFilterListParams): Promise<RepositoryListResult<ItemInstanceEntity[]>> {
    const filter = this.formatFilter(params?.filter);
    const sort = this.formatSort(params?.sort);

    return await this.withCastErrorProtection(
      async () => {
        const count = await this.model.find(filter).countDocuments();
        const docs = (await this.model.find(filter).sort(sort).lean()) as any[];

        const payload = this.adapter.deserializeList(docs);

        return { payload, metadata: { offset: 0, limit: count, count } };
      },
      { payload: [], metadata: { offset: 0, limit: 0, count: 0 } },
    );
  }

  public async listByItemsIds(
    itemsIds: string[],
    accountId: string,
  ): Promise<RepositoryListResult<ItemInstanceEntity[]>> {
    const filter = { itemId: { $in: itemsIds }, accountId };
    return await this.withCastErrorProtection(
      async () => {
        const count = await this.model.find(filter).countDocuments();
        const docs = (await this.model.find(filter).lean()) as any[];

        const payload = this.adapter.deserializeList(docs);

        return { payload, metadata: { offset: 0, limit: count, count } };
      },
      { payload: [], metadata: { offset: 0, limit: 0, count: 0 } },
    );
  }

  public listAllExisting(params: RepositoryFilterListParams): Promise<RepositoryListResult<ItemInstanceEntity[]>> {
    params.filter = { ...(params.filter || {}), quantity: { $gte: 1 } };
    return this.listAll(params);
  }

  private readonly schema: Schema = new Schema(
    {
      accountId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      itemId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        default: 0,
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
