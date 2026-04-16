import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { AccountRepository } from '../../../usecase';
import { AccountMongoAdapter } from './account-mongo.adapter';
import { AccountEntity, AccountEntityType } from '@kwokka/entities';

@injectable()
@injectFromBase()
export class AccountMongoRepository extends MongoRepository<AccountEntity> implements AccountRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: AccountMongoAdapter = new AccountMongoAdapter();
  private readonly modelName = 'account';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
  }

  private readonly schema: Schema = new Schema(
    {
      type: {
        type: String,
        enum: Object.values(AccountEntityType),
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
