import { GameController, KwokkaSdkNodeClient } from '@kwokka/sdk-node';
import { GameInstanceEntityStatus, LobbyEntity } from '@kwokka/entities';
import { RandomUtil } from '@kwokka/utils';
import { PwsmGameInstanceEntity } from '../../entity/game-instance/pwsm-game-instance.entity';
import { BotLobbyController } from './bot-lobby-controller';
import { LobbyKey } from '../../entity';
import { Logger } from '../../util';
import { ErrorTrackerUtil } from '../../util/error-tracker.util';

const MAX_SEARCH_DURATION_MS = 10000;
const MIN_TOTAL_PLAYERS = 3;
const MAX_TOTAL_PLAYERS = 4;

export class QuickMatchLobbyController extends BotLobbyController {
  public override readonly botDifficulty: number = 0.75;

  private logPrefix = `#${this.constructor.name}:`;
  private scanInterval: NodeJS.Timeout;

  public constructor(
    protected gameController: GameController,
    protected client: KwokkaSdkNodeClient,
  ) {
    super(gameController, client);
    this.scanInterval = setInterval(this.scanAndProcessMatches.bind(this), 1000);
  }

  protected override fillGameInstanceWithBots(lobby: LobbyEntity, gameInstance: PwsmGameInstanceEntity): void {
    const targetTotal = RandomUtil.randomIntegerInRange(MIN_TOTAL_PLAYERS, MAX_TOTAL_PLAYERS + 1);
    const cappedTotal = Math.min(targetTotal, lobby.maxPlayers);
    const botsToAdd = Math.max(0, cappedTotal - gameInstance.players.length);
    Array(botsToAdd)
      .fill(null)
      .forEach(() => gameInstance.addBot());
  }

  private async scanAndProcessMatches(): Promise<void> {
    try {
      const lobby = await this.getLobby(LobbyKey.QuickMatch);
      const now = Date.now();
      const gameInstances = this.gameController.activeGameInstances
        .filter((el) => el.lobbyId === lobby.id)
        .filter((el) => el.status === GameInstanceEntityStatus.Initial)
        .filter((el) => now - el.createdAt.getTime() > MAX_SEARCH_DURATION_MS);
        gameInstances.forEach((el) => this.processAwaitingMatch(lobby, PwsmGameInstanceEntity.toPwsm(el)));
    } catch (e: any) {
      Logger.error(`${this.logPrefix} Failed to scan and process matches.`);
      ErrorTrackerUtil.captureException(e);
    }
  }

  private async processAwaitingMatch(lobby: LobbyEntity, gameInstance: PwsmGameInstanceEntity): Promise<void> {
    this.fillGameInstanceWithBots(lobby, gameInstance);
    await this.startGame(gameInstance, lobby);
    this.updateGame(gameInstance);
  }
}
