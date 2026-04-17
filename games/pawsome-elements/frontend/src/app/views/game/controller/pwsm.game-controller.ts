import { GameInstanceEntity } from '@kwokka/entities';
import {
  GameController,
  type DisconnectReason,
  type GameInstanceUpdatedData,
  type PlayerActionData,
  type WebSocketErrorMessagePayload,
} from '@kwokka/sdk-js';
import { FunctionUtil, type PublicProps } from '@kwokka/utils';
import type { CardState } from '@/game-data/card/card-state';
import { PwsmGameInstanceEntity } from '@/game-data/game-instance/pwsm-game-instance.entity';
import { PlayerAction, RoomPlayerAction } from '@/game-data/player-action';
import type { LoggerService } from '@/service';
import { ErrorCode } from '@/util';

const ACTION_THROTTLE_MS = 300;

export class PwsmGameController extends GameController {
  private _connectivity: Record<string, boolean> = {};

  public constructor(
    public gameInstance: PwsmGameInstanceEntity,
    public logger: LoggerService,
    private errorHandler: (code: string, message: string) => any,
    private disconnectedHandler: (reason: DisconnectReason) => any,
  ) {
    super();
  }

  public get connectivity(): Record<string, boolean> {
    return this._connectivity;
  }

  public onConnected(): void {
    this.logger.log('#MainGameController: Connected');
  }

  public setDisconnectHandler(handler: (reason: DisconnectReason) => any): void {
    this.disconnectedHandler = handler;
  }

  public override onDisconnected(reason: DisconnectReason): void {
    this.logger.log('#MainGameController: Disconnected, reason:', reason);
    this.disconnectedHandler?.(reason);
  }

  public override onUnhandledError(error: any): void {
    const message = `Unexpected error, code: ${error.code}, message: ${error.message}`;
    this.logger.error(message, error);
    this.errorHandler(error.code || ErrorCode.UnexpectedError, error.message);
  }

  public override onErrorMessage(error: WebSocketErrorMessagePayload): void {
    const message = `Error, code: ${error.code}, message: ${error.message}`;
    this.logger.error(message, error);
    this.errorHandler(error.code || ErrorCode.UnexpectedError, error.message);
  }

  public override onGameInstanceUpdated(data: GameInstanceUpdatedData): void {
    const gameInstanceData = this.serializeGameInstance(this.gameInstance);
    this.updateGameInstanceProperty(gameInstanceData as any, data, 'status');
    this.updateGameInstanceProperty(gameInstanceData as any, data, 'state');
    this.updateGameInstanceProperty(gameInstanceData as any, data, 'playerIds');
    this.updateGameInstanceProperty(gameInstanceData as any, data, 'results');
    this.updateGameInstanceProperty(gameInstanceData as any, data, 'lobbySettings');
    this.updateGameInstanceProperty(gameInstanceData as any, data, 'connection');
    this.gameInstance = this.deserializeGameInstance(gameInstanceData);
  }

  public override onConnectivityUpdated(connectivity: Record<string, boolean>): void {
    this._connectivity = connectivity;
  }

  public override onBroadcast(data: any) {
    // TODO: implement broadcasts
    this.logger.log('Broadcast received', data);
  }

  public sendKickPlayerAction(playerId: string): void {
    this.sendAction({ name: RoomPlayerAction.KickPlayer, content: { playerId } });
  }

  public sendStartGameAction(): void {
    this.sendAction({ name: PlayerAction.StartGame, content: {} });
  }

  public sendPlayCardAction(item: CardState): void {
    this.sendAction({ name: PlayerAction.PlayCard, content: { cardInGameId: item.cardInGameId } });
  }

  public sendPlayCardInOthersTurnAction(item: CardState): void {
    this.sendAction({ name: PlayerAction.PlayCardInOthersTurn, content: { cardInGameId: item.cardInGameId } });
  }

  public sendSkipTurnAction(): void {
    this.sendAction({ name: PlayerAction.SkipTurn, content: {} });
  }

  public sendAddBotAction(): void {
    this.sendAction({ name: PlayerAction.AddBot, content: {} });
  }

  public sendInteractCardAction(content: any): void {
    this.sendAction({ name: PlayerAction.InteractCard, content });
  }

  public sendPlaySkillAction(content: any): void {
    this.sendAction({ name: PlayerAction.PlaySkill, content });
  }

  public sendUpdateRoomVisibilityAction(isPrivate: boolean): void {
    this.sendAction({
      name: RoomPlayerAction.UpdateRoomVisibility,
      content: { visibility: isPrivate ? 'private' : 'public' },
    });
  }

  // public sendLeaveAction(): void {
  //   this.sendAction({ name: PlayerAction.Leave, content: {} });
  // }

  public sendDoubleRewardAction(): void {
    this.sendAction({ name: PlayerAction.DoubleReward, content: {} });
  }

  public override sendAction = FunctionUtil.throttle(
    (data: PlayerActionData) => super.sendAction(data),
    ACTION_THROTTLE_MS,
  );

  private updateGameInstanceProperty(
    storingObject: PublicProps<PwsmGameInstanceEntity>,
    updates: GameInstanceUpdatedData,
    propertyName: string,
  ): void {
    if (updates[propertyName]) {
      storingObject[propertyName] = updates[propertyName];
    }
  }

  private deserializeGameInstance(dto: PublicProps<GameInstanceEntity>): PwsmGameInstanceEntity {
    return new PwsmGameInstanceEntity({
      id: dto.id,
      gameId: dto.gameId,
      lobbyId: dto.lobbyId,
      lobbySettings: dto.lobbySettings,
      status: dto.status,
      state: dto.state,
      playerIds: dto.playerIds,
      startedAt: dto.startedAt,
      finishedAt: dto.finishedAt,
      results: dto.results,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  private serializeGameInstance(entity: PwsmGameInstanceEntity): PublicProps<GameInstanceEntity> {
    return {
      id: entity.id,
      gameId: entity.gameId,
      lobbyId: entity.lobbyId,
      lobbySettings: entity.lobbySettings,
      status: entity.status,
      state: entity.state,
      playerIds: entity.playerIds,
      startedAt: entity.startedAt,
      finishedAt: entity.finishedAt,
      results: entity.results,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
