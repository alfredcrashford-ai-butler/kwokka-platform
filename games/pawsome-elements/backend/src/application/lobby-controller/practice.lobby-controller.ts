import { LobbyEntity } from '@kwokka/entities';
import { PwsmGameInstanceEntity } from '../../entity/game-instance/pwsm-game-instance.entity';
import { BotLobbyController } from './bot-lobby-controller';

export class PracticeLobbyController extends BotLobbyController {
  public override readonly botDifficulty = 0.4;

  protected override async startGame(gameInstance: PwsmGameInstanceEntity, lobby: LobbyEntity): Promise<void> {
    this.fillGameInstanceWithBots(lobby, gameInstance);
    await super.startGame(gameInstance, lobby);
  }
}
