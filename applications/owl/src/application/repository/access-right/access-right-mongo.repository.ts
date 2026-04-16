import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { AccessRightEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { AccessRightMongoAdapter } from './access-right-mongo.adapter';
import { AccessRightRepository } from '../../../usecase';

@injectable()
@injectFromBase()
export class AccessRightMongoRepository extends MongoRepository<AccessRightEntity> implements AccessRightRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: AccessRightMongoAdapter = new AccessRightMongoAdapter();
  private readonly modelName = 'access-right';

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
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
