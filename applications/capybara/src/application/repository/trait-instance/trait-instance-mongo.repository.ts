import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { TraitInstanceEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { TraitInstanceRepository } from '../../../usecase';
import { TraitInstanceMongoAdapter } from './trait-instance-mongo.adapter';
import { TraitMongoAdapter } from '../trait/trait-mongo.adapter';

@injectable()
@injectFromBase()
export class TraitInstanceMongoRepository
  extends MongoRepository<TraitInstanceEntity>
  implements TraitInstanceRepository
{
  public readonly model: MongooseModel<any>;
  public readonly adapter: TraitInstanceMongoAdapter;
  private readonly modelName = 'trait-instance';
  private readonly traitAdapter: TraitMongoAdapter;

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new TraitInstanceMongoAdapter();
    this.traitAdapter = new TraitMongoAdapter();
  }

  private readonly schema: Schema = new Schema(
    {
      accountId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      traitId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      value: {
        type: Schema.Types.Mixed,
        set: (value: any) => this.traitAdapter.castValue(value),
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true, minimize: false },
  );
}
