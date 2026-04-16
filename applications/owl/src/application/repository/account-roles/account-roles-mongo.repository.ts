import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { AccountRolesEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { AccountRolesRepository } from '../../../usecase';
import { AccountRolesMongoAdapter } from './account-roles-mongo.adapter';

@injectable()
@injectFromBase()
export class AccountRolesMongoRepository extends MongoRepository<AccountRolesEntity> implements AccountRolesRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: AccountRolesMongoAdapter = new AccountRolesMongoAdapter();
  private readonly modelName = 'account-roles';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
  }

  private readonly schema: Schema = new Schema(
    {
      accountId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      accessRoles: {
        type: [
          new Schema(
            {
              id: {
                type: Schema.Types.ObjectId,
                required: true,
              },
              enabled: {
                type: Boolean,
                required: true,
              },
            },
            { _id: false },
          ),
        ],
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
