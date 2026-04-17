import { GameObjects, Tweens } from 'phaser';
import type { Bounds, Position } from '@/util';
import { PwsmScene } from './pwsm-scene';
import { ObjectKey } from '../object-key';
import { RegistryKey } from '../registry-key';
import { PwsmGameConstants } from '../pwsm-game-constants';

type TrackedGameObject = GameObjects.Components.Transform & (GameObjects.Components.GetBounds | GameObjects.Container);

export class PwsmPlayableScene extends PwsmScene {
  public readonly objects: Map<string, TrackedGameObject> = new Map();

  public get turnDuration(): number {
    return this.registry.get(RegistryKey.TurnDuration);
  }

  public track(id: string, obj: TrackedGameObject): void {
    this.objects.set(id, obj);
  }

  public untrack(id: string, obj: TrackedGameObject): void {
    if (this.objects.get(id) === obj) {
      this.objects.delete(id);
    }
  }

  public getDiscardPilePosition(): Position {
    return this.objects.get(ObjectKey.DiscardPile).getWorldPoint();
  }

  public getDiscardPileBounds(): Bounds {
    return this.objects.get(ObjectKey.DiscardPile).getBounds();
  }

  public getDeckPosition(): Position {
    return this.objects.get(ObjectKey.Deck).getWorldPoint();
  }

  public getPlayersPositions(): Record<string, Position> {
    const res: Record<string, Position> = {};
    this.gameInstance.players
      .map((el) => el.id)
      .forEach((id) => (res[id] = this.objects.get(this.getPlayerObjectKey(id))?.getWorldPoint()));
    return res;
  }

  public getPlayerPosition(playerId: string): Position {
    const positions = this.getPlayersPositions();
    return positions[playerId] || { x: 0, y: 0 };
  }

  public getPlayerBounds(playerId: string): Bounds {
    return this.getObjectBounds(this.getPlayerObjectKey(playerId));
  }

  public getPlayerSkillBounds(playerId: string): Bounds {
    return this.getObjectBounds(this.getPlayerSkillObjectKey(playerId));
  }

  public getCardBounds(cardInGameId: string): Bounds {
    return this.getObjectBounds(this.getCardObjectKey(cardInGameId));
  }

  public getDeckBounds(): Bounds {
    return this.objects.get(ObjectKey.Deck).getBounds();
  }

  private getObjectBounds(id: string): Bounds {
    const bounds = this.objects.get(id)?.getBounds() || ({} as any);
    return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
  }

  public getPlayerObjectKey(id: string): string {
    return `${ObjectKey.Player}__${id}`;
  }

  public getPlayerSkillObjectKey(id: string): string {
    return `${ObjectKey.PlayerSkill}__${id}`;
  }

  public getCardObjectKey(id: string): string {
    return `${ObjectKey.Card}__${id}`;
  }

  public tweenScale(obj: GameObjects.Components.Transform, duration: number): Tweens.Tween {
    return this.add.tween({
      targets: obj,
      scale: `*=${PwsmGameConstants.Misc.ScaleTween}`,
      yoyo: true,
      ease: PwsmGameConstants.Misc.ScaleTweenEase,
      duration,
    });
  }

  public removeTweens(tweens: Tweens.Tween | Tweens.TweenChain | (Tweens.Tween | Tweens.TweenChain)[]): void {
    if (!tweens) {
      return;
    }

    if (!Array.isArray(tweens)) {
      tweens = [tweens];
    }

    tweens.forEach((tween) => tween?.destroy());
  }

  public shakeCamera(duration: number, intensity: number = 0.05): void {
    this.cameras.main.shake(duration, intensity, true);
  }
}
