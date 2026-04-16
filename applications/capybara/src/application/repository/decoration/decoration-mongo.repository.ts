import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { DecorationEntity, DecorationEntityType } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { DecorationRepository } from '../../../usecase';
import { DecorationMongoAdapter } from './decoration-mongo.adapter';

@injectable()
@injectFromBase()
export class DecorationMongoRepository extends MongoRepository<DecorationEntity> implements DecorationRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: DecorationMongoAdapter = new DecorationMongoAdapter();
  private readonly modelName = 'decoration';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
  }

  private readonly schema: Schema = new Schema(
    {
      key: {
        type: String,
        required: true,
      },
      applicationAccountId: {
        type: Schema.Types.ObjectId,
      },
      type: {
        type: String,
        enum: Object.values(DecorationEntityType),
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
