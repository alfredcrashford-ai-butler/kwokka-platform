import { Events, GameObjects, Scene } from 'phaser';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import { RegistryKey } from '../registry-key';
import type { PwsmGameConfig } from '../pwsm-game-config';
import { Resource } from '../resource';

export class PwsmScene extends Scene {
  public get vw(): number {
    return this.registry.get(RegistryKey.VW);
  }

  public get vh(): number {
    return this.registry.get(RegistryKey.VH);
  }

  public get width(): number {
    return this.registry.get(RegistryKey.Width);
  }

  public get height(): number {
    return this.registry.get(RegistryKey.Height);
  }

  public get size(): number {
    return Math.max(this.width, this.height);
  }

  public get config(): PwsmGameConfig {
    return this.registry.get(RegistryKey.Config) || {};
  }

  public get eventBus(): Events.EventEmitter {
    return this.registry.get(RegistryKey.EventBus);
  }

  public get gameInstance(): PwsmGameInstanceEntity {
    return this.registry.get(RegistryKey.GameInstance);
  }

  public get translations(): any {
    return this.registry.get(RegistryKey.Translations);
  }

  public get isLandscape(): boolean {
    return this.width > this.height;
  }

  public get isPortrait(): boolean {
    return this.width <= this.height;
  }

  public static getProfileResource(accountId: string): string {
    return `${Resource.PlayerPanel.Profile}/${accountId}`;
  }

  public setDisplaySizeCover(
    obj: GameObjects.Components.Transform & (GameObjects.Components.Size | GameObjects.Container),
  ): void {
    PwsmScene.setDisplaySizeCover(obj, this.width, this.height);
    obj.x = this.width / 2;
    obj.y = this.height / 2;
  }

  public static setDisplaySizeCover(
    obj: GameObjects.Components.Size | GameObjects.Container,
    width: number,
    height: number,
  ): void {
    const objAspectRatio = obj.width / obj.height;
    const sceneAspectRatio = width / height;
    if (objAspectRatio > sceneAspectRatio) {
      obj.setDisplaySize(obj.width * (height / obj.height), height);
    } else if (objAspectRatio < sceneAspectRatio) {
      obj.setDisplaySize(width, obj.height * (width / obj.width));
    } else {
      obj.setDisplaySize(width, height);
    }
  }
}
