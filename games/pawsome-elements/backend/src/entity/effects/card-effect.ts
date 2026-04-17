import { EffectState, CardState } from '../card';
import { PwsmGameInstanceEntity } from '../game-instance/pwsm-game-instance.entity';

export abstract class CardEffect {
  /**
   * Called before play to verify the card can be played.
   */
  public canPlay(game: PwsmGameInstanceEntity, effect: EffectState, card: CardState): boolean {
    return true;
  }

  /**
   * Fired when played from hand.
   */
  public onPlay(game: PwsmGameInstanceEntity, effect: EffectState, playerId: string, card: CardState): void {
    // implement in subclass
  }

  /**
   * Fired when shuffled to deck.
   */
  public onShuffle(game: PwsmGameInstanceEntity, effect: EffectState, card: CardState): void {
    card.effects = card.effects.filter((el) => el !== effect);
  }

  /**
   * Fired when other card is played on top of this one.
   */
  public onTopPlay(game: PwsmGameInstanceEntity, effect: EffectState, card: CardState): void {
    // implement in subclass
  }

  /**
   * Fired when other card is played when card with this effect is in hand of player.
   */
  public onOtherCardPlay(game: PwsmGameInstanceEntity, effect: EffectState, card: CardState): void {
    // implement in subclass
  }
}
