import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { LobbyEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { LobbyRepository } from '../../../usecase';
import { LobbyMongoAdapter } from './lobby-mongo.adapter';

@injectable()
@injectFromBase()
export class LobbyMongoRepository extends MongoRepository<LobbyEntity> implements LobbyRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: LobbyMongoAdapter;
  private readonly modelName = 'lobby';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new LobbyMongoAdapter();
  }

  private readonly schema: Schema = new Schema(
    {
      key: {
        type: String,
        required: true,
      },
      gameId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      minPlayers: {
        type: Number,
        required: true,
      },
      maxPlayers: {
        type: Number,
        required: true,
      },
      config: {
        type: Object,
        required: true,
        default: {},
      },
      availableSince: {
        type: Date,
      },
      availableTill: {
        type: Date,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true, minimize: false },
  );
}
