import { GameObjects } from 'phaser';
import { FunctionUtil, RandomUtil } from '@kwokka/utils';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { PwsmPlayableScene } from '@/game/scenes';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { Resource } from '@/game/resource';
import { CardType, type CardState } from '@/game-data/card';
import { EventKey } from '@/game/event-key';
import type { Stateful } from '../stateful';
import { Card } from '../card';

export class DiscardPile extends GameObjects.Container implements Stateful {
  private cards: Card[] = [];
  private placeholder: GameObjects.Image;
  private dustEmitter: GameObjects.Particles.ParticleEmitter;

  public constructor(public readonly scene: PwsmPlayableScene) {
    super(scene, 0, 0);
    const width = PwsmGameConstants.Table.DiscardPileWidth;
    const height = PwsmGameConstants.Table.DiscardPileHeight;
    this.setSize(width, height);

    this.placeholder = new GameObjects.Image(scene, 0, 0, Resource.Placeholder);
    this.placeholder.setDisplaySize(width, height);
    this.add(this.placeholder);

    this.dustEmitter = new GameObjects.Particles.ParticleEmitter(
      scene,
      0,
      0,
      Resource.Particle.Dust,
      PwsmGameConstants.Table.DiscardPileDustParticlesConfig,
    );
    this.add(this.dustEmitter);
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.discardOldCards(gameInstance);
    this.addNewCards(gameInstance);
    this.updateCardStates(gameInstance);
    this.updateInteractionState(gameInstance);
  }

  private discardOldCards(gameInstance: PwsmGameInstanceEntity): void {
    const lastCards = this.getLastCards(gameInstance);
    const lastCardsIds = lastCards.map((el) => el.cardInGameId);
    const tableCardsIds = this.cards.map((el) => el.cardState.cardInGameId);

    const missingIds = tableCardsIds.filter((id) => !lastCardsIds.includes(id));
    if (missingIds.length > 0) {
      missingIds.forEach((id) => this.discardCard(id));
    }
  }

  private addNewCards(gameInstance: PwsmGameInstanceEntity): void {
    const lastCards = this.getLastCards(gameInstance);
    const tableCardsIds = this.cards.map((el) => el.cardState.cardInGameId);
    const newIds = lastCards.map((el) => el.cardInGameId).filter((id) => !tableCardsIds.includes(id));
    if (newIds.length > 0) {
      const newCardsStates = lastCards.filter((el) => newIds.includes(el.cardInGameId));
      newCardsStates.forEach((state, i) => this.playCard(state, i));
      this.scene.eventBus.emit(EventKey.OuterCardPlayed);
      this.cards.forEach((card, i) => this.moveTo(card, i));
      // move dust emitter under the top card
      this.moveTo(this.dustEmitter, this.cards.length - 1);
    }
  }

  private updateCardStates(gameInstance: PwsmGameInstanceEntity): void {
    this.cards.forEach((el) => el.setCardState(gameInstance.getCardState(el.cardState.cardInGameId)));
  }

  private updateInteractionState(gameInstance: PwsmGameInstanceEntity): void {
    if (!this.cards.length) {
      return;
    }

    this.cards.slice(0, this.cards.length - 1).forEach((el) => el.setInteractionOverlayActive(false));
    const lastCard = this.cards[this.cards.length - 1];
    lastCard.setInteractionOverlayActive(gameInstance.isInteraction);
  }

  private getLastCards(gameInstance: PwsmGameInstanceEntity): CardState[] {
    return gameInstance.getLastCardsInDiscardPile(PwsmGameConstants.Table.DiscardCardCount);
  }

  private discardCard(cardInGameId: string): void {
    const card = this.cards.find((el) => el.cardState.cardInGameId === cardInGameId);
    if (!card) {
      return;
    }

    this.cards = this.cards.filter((el) => el.cardState.cardInGameId !== cardInGameId);
    this.remove(card, true);
  }

  private playCard(state: CardState, i: number): void {
    const card = new Card(this.scene, 0, 0, state);
    this.cards.push(card);
    card.setDisplaySize(PwsmGameConstants.Table.DiscardPileWidth, PwsmGameConstants.Table.DiscardPileHeight);

    this.addCardRandomTransforms(card);
    const oldScale = card.scale;
    card.scale = oldScale * 2;
    this.scene.add.tween({
      targets: card,
      scale: oldScale,
      duration: PwsmGameConstants.Table.DiscardPileCardPlayDuration,
      delay: PwsmGameConstants.Table.DiscardPileCardPlayDelay * i,
      ease: PwsmGameConstants.Table.DiscardPileCardPlayEase,
    });
    this.scene.time.delayedCall(PwsmGameConstants.Table.DiscardPileDustEmitDelay, () => this.emitDust());
    this.add(card);

    if ([CardType.Special, CardType.Interaction].includes(state.config.type)) {
      this.shakeCamera();
    }
  }

  private addCardRandomTransforms(card: Card): void {
    const deltaX = PwsmGameConstants.Table.DiscardPileDeltaX;
    card.x += RandomUtil.randomInRange(-deltaX, deltaX);
    const deltaY = PwsmGameConstants.Table.DiscardPileDeltaY;
    card.y += RandomUtil.randomInRange(-deltaY, deltaY);
    const deltaRotation = PwsmGameConstants.Table.DiscardPileDeltaRotation;
    card.angle += RandomUtil.randomInRange(-deltaRotation, deltaRotation);
  }

  private emitDust = FunctionUtil.throttle(
    () => this.dustEmitter.emitParticle(),
    PwsmGameConstants.Table.DiscardPileDustEmitThrottle,
  );

  private shakeCamera = FunctionUtil.throttle(() => {
    this.scene.time.delayedCall(PwsmGameConstants.Table.CameraShakeOnPlayDelay, () =>
      this.scene.shakeCamera(
        PwsmGameConstants.Table.CameraShakeOnPlayDuration,
        PwsmGameConstants.Table.CameraShakeOnPlayIntensity,
      ),
    );
  }, PwsmGameConstants.Table.DiscardPileShakeCameraThrottle);
}
