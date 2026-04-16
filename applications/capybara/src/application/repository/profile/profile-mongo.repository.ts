import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { ProfileEntity } from '@kwokka/entities';
import { MongoRepository, DatabaseService } from '@kwokka/common-node';
import { ProfileRepository } from '../../../usecase';
import { ProfileMongoAdapter } from './profile-mongo.adapter';

@injectable()
@injectFromBase()
export class ProfileMongoRepository extends MongoRepository<ProfileEntity> implements ProfileRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: ProfileMongoAdapter;
  private readonly modelName = 'profile';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new ProfileMongoAdapter();
  }

  private readonly schema: Schema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      locale: {
        type: String,
        required: true,
      },
      accountId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
