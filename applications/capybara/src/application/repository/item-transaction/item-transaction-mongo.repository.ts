import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { ItemTransactionEntity, ItemTransactionType } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { ItemTransactionMongoAdapter } from './item-transaction-mongo.adapter';
import { ItemTransactionRepository } from '../../../usecase';

@injectable()
@injectFromBase()
export class ItemTransactionMongoRepository
  extends MongoRepository<ItemTransactionEntity>
  implements ItemTransactionRepository
{
  public readonly model: MongooseModel<any>;
  public readonly adapter: ItemTransactionMongoAdapter;
  private readonly modelName = 'item-transaction';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new ItemTransactionMongoAdapter();
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
      type: {
        type: String,
        enum: Object.values(ItemTransactionType),
        required: true,
      },
      transactionDetails: {
        type: Object,
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
