import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { ObjectId } from 'bson';
import { GameInstanceEntity, GameInstanceEntityStatus } from '@kwokka/entities';
import {
  MongoRepository,
  DatabaseService,
  RepositoryListResult,
  RepositoryListParams,
  RepositoryFilterListParams,
} from '@kwokka/common-node';
import { GameInstanceMongoAdapter } from './game-instance-mongo.adapter';
import { GameInstanceRepository } from '../../../usecase';
import { CurrentGameStats, GameStatsPeriod, PeriodicGameStats } from '../../../usecase/game/get-game-stats.usecase';

const ACTIVE_STATUSES = [GameInstanceEntityStatus.Initial, GameInstanceEntityStatus.InProgress];

@injectable()
@injectFromBase()
export class GameInstanceMongoRepository extends MongoRepository<GameInstanceEntity> implements GameInstanceRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: GameInstanceMongoAdapter;
  private readonly modelName = 'game-instance';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new GameInstanceMongoAdapter();
  }

  public iterateActive(
    params: RepositoryListParams,
    action: (payload: RepositoryListResult<GameInstanceEntity[]>) => any,
  ): Promise<void> {
    const filter = { status: { $in: [GameInstanceEntityStatus.InProgress, GameInstanceEntityStatus.Initial] } };
    return this.iterate({ ...params, filter }, action);
  }

  public override async list(params: RepositoryFilterListParams): Promise<RepositoryListResult<GameInstanceEntity[]>> {
    if (Array.isArray(params.filter?.playerIds)) {
      params.filter.playerIds = { $in: params.filter?.playerIds };
    }

    if (params.filter?.lobbySettings) {
      params.filter = this.convertUsecaseDeepSearchParameter(params.filter, 'lobbySettings');
    }

    if (params.filter?.results) {
      params.filter = this.convertUsecaseDeepSearchParameter(params.filter, 'results');
    }

    return super.list(params);
  }

  public async getCurrentStats(gameId?: string): Promise<CurrentGameStats> {
    const matchStage: any = { status: { $in: ACTIVE_STATUSES } };

    if (gameId) {
      matchStage.gameId = new ObjectId(gameId);
    }

    const aggregationResult = await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          currentActiveInstances: { $sum: 1 },
          currentPlayers: { $sum: { $size: '$playerIds' } },
        },
      },
    ]);

    return {
      currentActiveInstances: aggregationResult?.[0]?.currentActiveInstances || 0,
      currentPlayers: aggregationResult?.[0]?.currentPlayers || 0,
    };
  }

  public async getPeriodicStats(period: GameStatsPeriod, gameId?: string): Promise<PeriodicGameStats> {
    const matchStage: any = {};

    if (period.from) {
      matchStage.createdAt = { ...matchStage.createdAt, $gte: period.from };
    }

    if (period.to) {
      matchStage.createdAt = { ...matchStage.createdAt, $lte: period.to };
    }

    if (gameId) {
      matchStage.gameId = new ObjectId(gameId);
    }

    const aggregationResult = await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalInstances: { $sum: 1 },
          finishedInstances: { $sum: { $cond: [{ $eq: ['$status', GameInstanceEntityStatus.Finished] }, 1, 0] } },
          abandonedInstances: { $sum: { $cond: [{ $eq: ['$status', GameInstanceEntityStatus.Abandoned] }, 1, 0] } },
          totalPlayers: { $sum: { $size: '$playerIds' } },
          totalDuration: {
            $sum: { $cond: [{ $and: ['$createdAt', '$finishedAt'] }, { $subtract: ['$finishedAt', '$createdAt'] }, 0] },
          },
        },
      },
      {
        $project: {
          totalInstances: 1,
          finishedInstances: 1,
          abandonedInstances: 1,
          totalDuration: 1,
          totalPlayers: 1,
          averagePlayers: {
            $cond: [{ $gt: ['$totalInstances', 0] }, { $divide: ['$totalPlayers', '$totalInstances'] }, 0],
          },
          averageDuration: {
            $cond: [{ $gt: ['$finishedInstances', 0] }, { $divide: ['$totalDuration', '$finishedInstances'] }, 0],
          },
        },
      },
    ]);

    const result = aggregationResult?.[0] || {};

    return {
      period,
      totalPlayers: result.totalPlayers || 0,
      averagePlayers: result.averagePlayers || 0,
      averageDuration: result.averageDuration || 0,
      totalInstances: result.totalInstances || 0,
      finishedInstances: result.finishedInstances || 0,
      abandonedInstances: result.abandonedInstances || 0,
    };
  }

  private readonly schema: Schema = new Schema(
    {
      gameId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      lobbyId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      lobbySettings: {
        type: Object,
      },
      status: {
        type: String,
        enum: Object.values(GameInstanceEntityStatus),
        default: GameInstanceEntityStatus.Initial,
        required: true,
      },
      state: {
        type: new Schema(
          {
            publicState: {
              type: Object,
              required: true,
            },
            privateState: {
              type: Object,
              required: true,
            },
            playerState: {
              type: Object,
              required: true,
            },
          },
          { _id: false, minimize: false },
        ),
        required: true,
      },
      playerIds: {
        type: [String],
        default: [],
        required: true,
      },
      results: {
        type: Object,
      },
      startedAt: {
        type: Date,
      },
      finishedAt: {
        type: Date,
      },
      isPubliclyVisible: {
        type: Boolean,
        default: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true, minimize: false },
  );
}
