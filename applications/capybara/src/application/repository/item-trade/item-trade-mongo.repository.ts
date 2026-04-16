import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { ItemTradeEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { ItemTradeRepository } from '../../../usecase';
import { ItemTradeMongoAdapter } from './item-trade-mongo.adapter';

@injectable()
@injectFromBase()
export class ItemTradeMongoRepository extends MongoRepository<ItemTradeEntity> implements ItemTradeRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: ItemTradeMongoAdapter;
  private readonly modelName = 'item-trade';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new ItemTradeMongoAdapter();
  }

  private readonly schema: Schema = new Schema(
    {
      key: {
        type: String,
        required: true,
      },
      requiredItems: {
        type: [
          new Schema(
            {
              itemId: {
                type: String,
                required: true,
              },
              quantity: {
                type: Number,
                required: true,
              },
            },
            { _id: false },
          ),
        ],
        default: [],
      },
      maxQuantity: {
        type: Number,
        required: true,
      },
      itemId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      tradedItemId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      tradedItemQuantity: {
        type: Number,
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
