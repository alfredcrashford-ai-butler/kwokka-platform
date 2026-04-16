import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { GameEntity } from '@kwokka/entities';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { GameRepository } from '../../../usecase/ports/game.repository';
import { GameMongoAdapter } from './game-mongo.adapter';

@injectable()
@injectFromBase()
export class GameMongoRepository extends MongoRepository<GameEntity> implements GameRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: GameMongoAdapter;
  private readonly modelName = 'game';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new GameMongoAdapter();
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
      url: {
        type: String,
      },
      tags: {
        type: [String],
        default: [],
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
    { timestamps: true },
  );
}
