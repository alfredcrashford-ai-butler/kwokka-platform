import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { DecorationEntity, ProfileDecorationsEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { ProfileDecorationsMongoAdapter } from './profile-decorations-mongo.adapter';
import { ProfileDecorationsRepository } from '../../../usecase';

@injectable()
@injectFromBase()
export class ProfileDecorationsMongoRepository
  extends MongoRepository<ProfileDecorationsEntity>
  implements ProfileDecorationsRepository
{
  public readonly model: MongooseModel<any>;
  public readonly adapter: ProfileDecorationsMongoAdapter;
  private readonly modelName = 'profile-decorations';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new ProfileDecorationsMongoAdapter();
  }

  public async removeDecorationFromProfileDecorations(decoration: DecorationEntity): Promise<void> {
    await this.model.updateMany(
      { [`decorations.${decoration.type}`]: decoration.id },
      { $unset: { [`decorations.${decoration.type}`]: '' } },
    );
  }

  private readonly schema: Schema = new Schema(
    {
      profileId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      decorations: {
        type: Object,
        default: {},
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
