import { PawsomeElementsConfig } from '../config';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';

export abstract class Skill {
  public readonly cooldown = PawsomeElementsConfig.skillCooldownTurns;

  public startEffect(game: PwsmGameInstanceEntity, playerId: string): void {
    // implement in subclass
  }

  public playEffect(game: PwsmGameInstanceEntity, playerId: string, payload: any): void {
    game.setSkillCooldown(playerId, this.cooldown);
    this.transferTurnToNextPlayer(game);
  }

  public canPlay(game: PwsmGameInstanceEntity, playerId: string): boolean {
    return game.isPlayersTurn(playerId) && !game.isSkillOnCooldown(playerId) && !game.isInteraction();
  }

  public isPayloadValid(game: PwsmGameInstanceEntity, playerId: string, payload: any): boolean {
    return true;
  }

  protected transferTurnToNextPlayer(game: PwsmGameInstanceEntity): void {
    game.transferTurnToNextPlayer(game.lobbySettings.turnDuration);
  }
}
