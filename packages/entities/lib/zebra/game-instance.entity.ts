import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export enum GameInstanceEntityStatus {
  Initial = 'initial',
  InProgress = 'in_progress',
  Finished = 'finished',
  Abandoned = 'abandoned',
}

export interface GameInstanceEntityState<PublicState, PrivateState, PlayerState> {
  publicState: PublicState;
  privateState: PrivateState;
  playerState: { [id: string]: PlayerState };
}

export class GameInstanceEntity<
  PublicState = any,
  PrivateState = any,
  PlayerState = any,
  LobbySettings = any,
  Results = any,
> extends Entity {
  public gameId: string;
  public lobbyId: string;
  public lobbySettings: LobbySettings;
  public status: GameInstanceEntityStatus;
  public state: GameInstanceEntityState<PublicState, PrivateState, PlayerState>;
  public playerIds: string[];
  public startedAt?: Date;
  public finishedAt?: Date;
  public results?: Results;
  public isPubliclyVisible?: boolean;

  public constructor(params: PublicProps<GameInstanceEntity>) {
    super(params);
    this.gameId = params.gameId;
    this.lobbyId = params.lobbyId;
    this.lobbySettings = params.lobbySettings || {};
    this.status = params.status || GameInstanceEntityStatus.Initial;
    this.state = params.state || { publicState: {}, privateState: {}, playerState: {} };
    this.playerIds = params.playerIds || [];
    this.startedAt = params.startedAt;
    this.finishedAt = params.finishedAt;
    this.results = params.results;
    this.isPubliclyVisible = params.isPubliclyVisible;
  }

  public addPlayer(id: string, state: PlayerState): void {
    this.playerIds.push(id);
    this.state.playerState[id] = state;
  }

  public removePlayer(id: string): void {
    this.playerIds = this.playerIds.filter((el) => el !== id);
    delete this.state.playerState[id];
  }
}
