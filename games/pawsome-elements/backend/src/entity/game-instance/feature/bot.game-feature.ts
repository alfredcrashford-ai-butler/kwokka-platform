import { UuidUtil } from '@kwokka/utils';
import { BotProfileGenerator } from '../../bot';
import { GameFeature } from './game-feature';

export class BotGameFeature extends GameFeature {
  public addBot(): void {
    const id = `bot_${UuidUtil.generateNoSpecialSymbols()}`;
    this.game.state.playerState[id] = { cards: [] };
    this.game.lobbySettings.players ||= [];
    this.game.lobbySettings.players.push({ id, isBot: true, config: BotProfileGenerator.generate() });
  }

  public get botIds(): string[] {
    return this.game.lobbySettings.players.filter((el) => el.isBot).map((el) => el.id);
  }

  public get realPlayersIds(): string[] {
    return this.game.lobbySettings.players.filter((el) => !el.isBot).map((el) => el.id);
  }

  public get hasRealPlayers(): boolean {
    return Boolean(this.realPlayersIds.length);
  }

  public isBot(playerId: string): boolean {
    return this.botIds.includes(playerId);
  }
}
