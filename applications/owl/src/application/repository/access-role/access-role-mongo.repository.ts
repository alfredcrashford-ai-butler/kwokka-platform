import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { AccessRoleEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { AccessRoleRepository } from '../../../usecase';
import { AccessRoleMongoAdapter } from './access-role-mongo.adapter';

@injectable()
@injectFromBase()
export class AccessRoleMongoRepository extends MongoRepository<AccessRoleEntity> implements AccessRoleRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: AccessRoleMongoAdapter = new AccessRoleMongoAdapter();
  private readonly modelName = 'access-role';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
  }

  private readonly schema: Schema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      accessRightsIds: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: [],
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
