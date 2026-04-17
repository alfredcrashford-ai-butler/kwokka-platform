import { GameInstanceEntityStatus } from '@kwokka/entities';
import { BotLobbyController } from './bot-lobby-controller';
import { KickDisconnectReason } from '../disconnect-reason';
import { RoomPlayerAction } from '../player-action';
import { PwsmGameControllerHookParam } from '../hook-param';

export class RoomLobbyController extends BotLobbyController {
  public override onPlayerSentAction(data: PwsmGameControllerHookParam.PlayerAction): void {
    if (data.name === RoomPlayerAction.UpdateRoomVisibility) {
      return this.onUpdateRoomVisibility(data);
    }

    if (data.name === RoomPlayerAction.KickPlayer) {
      return this.onKickPlayer(data);
    }

    return super.onPlayerSentAction(data);
  }

  private onUpdateRoomVisibility(data: PwsmGameControllerHookParam.PlayerAction): void {
    if (data.accountId !== data.gameInstance.lobbySettings.hostAccountId) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (data.gameInstance.status !== GameInstanceEntityStatus.Initial) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    data.gameInstance.isPubliclyVisible = data.content.visibility === 'public';
    data.gameInstance.lobbySettings.visibility = data.content.visibility;
    this.gameController.persistGameInstance(data.gameInstance);
    this.updateGame(data.gameInstance);
  }

  private onKickPlayer(data: PwsmGameControllerHookParam.PlayerAction): void {
    if (data.accountId !== data.gameInstance.lobbySettings.hostAccountId) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (data.gameInstance.status !== GameInstanceEntityStatus.Initial) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!data.gameInstance.hasPlayer(data.content.playerId)) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (data.content.playerId === data.accountId) {
      this.sendForbiddenError(data.accountId);
      return;
    }

    if (!data.gameInstance.isBot(data.content.playerId)) {
      this.gameController.disconnectPlayer(data.content.playerId, KickDisconnectReason);
    }

    data.gameInstance.removePlayer(data.content.playerId);
    this.gameController.persistGameInstance(data.gameInstance);
    this.updateGame(data.gameInstance);
  }
}
