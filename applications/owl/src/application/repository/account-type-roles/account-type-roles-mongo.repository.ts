import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { AccountEntityType, AccountTypeRolesEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { AccountTypeRolesRepository } from '../../../usecase';
import { AccountTypeRolesMongoAdapter } from './account-type-roles-mongo.adapter';

@injectable()
@injectFromBase()
export class AccountTypeRolesMongoRepository
  extends MongoRepository<AccountTypeRolesEntity>
  implements AccountTypeRolesRepository
{
  public readonly model: MongooseModel<any>;
  public readonly adapter: AccountTypeRolesMongoAdapter = new AccountTypeRolesMongoAdapter();
  private readonly modelName = 'account-type-roles';

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
      accessRolesIds: {
        type: [Schema.Types.ObjectId],
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
