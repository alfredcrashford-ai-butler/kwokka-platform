import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { TraitEntity, TraitType } from '@kwokka/entities';
import { TraitRepository } from '../../../usecase';
import { TraitMongoAdapter } from './trait-mongo.adapter';

@injectable()
@injectFromBase()
export class TraitMongoRepository extends MongoRepository<TraitEntity> implements TraitRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: TraitMongoAdapter;
  private readonly modelName = 'trait';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new TraitMongoAdapter();
  }

  private readonly schema: Schema = new Schema(
    {
      key: {
        type: String,
        required: true,
      },
      applicationAccountId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      type: {
        type: String,
        enum: Object.values(TraitType),
        required: true,
      },
      defaultValue: {
        type: Schema.Types.Mixed,
        set: (value: any) => this.adapter.castValue(value),
      },
      isOwnerEditable: {
        type: Boolean,
        default: false,
      },
      isPubliclyVisible: {
        type: Boolean,
        default: false,
      },
      config: {
        type: Object,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true, minimize: false },
  );
}
