import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { CredentialEntity, CredentialEntityType } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { CredentialRepository } from '../../../usecase';
import { CredentialMongoAdapter } from './credential-mongo.adapter';

@injectable()
@injectFromBase()
export class CredentialMongoRepository extends MongoRepository<CredentialEntity> implements CredentialRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: CredentialMongoAdapter = new CredentialMongoAdapter();
  private readonly modelName = 'credential';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
  }

  private readonly schema: Schema = new Schema(
    {
      type: {
        type: String,
        required: true,
        enum: Object.values(CredentialEntityType),
      },
      accountId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      isVerified: {
        type: Boolean,
        required: true,
        default: false,
      },
      identifier: {
        type: String,
        required: true,
      },
      data: {
        type: Object,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
