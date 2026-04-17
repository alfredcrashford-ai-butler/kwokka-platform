import { Game as PhaserGame, Events } from 'phaser';
import { FunctionUtil } from '@kwokka/utils';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { CardState } from '@/game-data/card';
import type { Bounds, Position } from '@/util';
import { GameScene, PreloadScene, PwsmScene } from './scenes';
import { RegistryKey } from './registry-key';
import type { PwsmGameConfig } from './pwsm-game-config';
import { EventKey } from './event-key';
import { SceneKey } from './scenes/scene-key';
import { PwsmGameConstants } from './pwsm-game-constants';

const SCENES = [PreloadScene, GameScene];
const THROTTLE_MS = 50;

export class PwsmGame extends PhaserGame {
  private readonly resizeListener: () => any;
  private readonly eventBus: Events.EventEmitter;
  private readonly interactiveLocks: Record<string, boolean> = {};

  public constructor(parent: HTMLElement, config: PwsmGameConfig) {
    super({
      parent,
      scene: SCENES,
      ...PwsmGameConstants.PhaserConfig,
    });

    this.eventBus = new Events.EventEmitter();
    this.registry.set(RegistryKey.EventBus, this.eventBus);

    this.setConfig(config);
    this.setGameState(config.gameInstance);
    this.setTranslations(config.translations);
    this.setTurnDuration(config.turnDuration);

    this.eventBus.on(
      EventKey.OuterCardPlay,
      this.throttle((cardState: CardState) => config.onCardPlay(cardState)),
    );
    this.eventBus.on(
      EventKey.OuterInteract,
      this.throttle((data: any) => config.onInteract(data)),
    );
    this.eventBus.on(
      EventKey.OuterSkillPlay,
      this.throttle((data: any) => config.onSkillPlay(data)),
    );
    this.eventBus.on(EventKey.OuterSkillClick, () => config.onSkillClick());
    this.eventBus.on(EventKey.OuterCardDraw, () => config.onCardDraw());
    this.eventBus.on(EventKey.OuterSkillPlayed, () => config.onSkillPlayed());
    this.eventBus.on(EventKey.OuterCardStateChange, (changes) => config.onCardStateChange(changes.old, changes.new));
    this.eventBus.on(EventKey.OuterReady, () => config.onReady());
    this.eventBus.on(EventKey.OuterCardPlayed, () => config.onCardPlayed());
    this.eventBus.on(EventKey.OuterSkillPlayCancel, () => config.onSkillPlayCancel());
    this.eventBus.on(EventKey.OuterSkipTurn, () => config.onSkipTurn());

    this.resizeListener = FunctionUtil.debounce(() => this.resize(), PwsmGameConstants.Misc.ResizeDebounceMs);
    window.addEventListener('resize', this.resizeListener);
    this.resize();
  }

  public setProfileTexture(accountId: string, profile: string): void {
    this.textures.addBase64(PwsmScene.getProfileResource(accountId), profile);
    this.textures.once(`addtexture-${PwsmScene.getProfileResource(accountId)}`, () =>
      this.eventBus.emit(EventKey.SetProfileTexture, { accountId }),
    );
  }

  public override destroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.eventBus.removeAllListeners();
    super.destroy(true);
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.registry.set(RegistryKey.GameInstance, gameInstance);
    this.eventBus.emit(EventKey.SetState, gameInstance);
  }

  public setTranslations(translations: any): void {
    this.registry.set(RegistryKey.Translations, translations);
    this.eventBus.emit(EventKey.SetTranslations, translations);
  }

  public setConnectivity(connectivity: Record<string, boolean>): void {
    this.registry.set(RegistryKey.Connectivity, connectivity);
    this.eventBus.emit(EventKey.SetConnectivity, connectivity);
  }

  public setConfig(config: PwsmGameConfig): void {
    this.registry.set(RegistryKey.Config, config);
    this.eventBus.emit(EventKey.SetConfig, config);
  }

  public setTurnDuration(turnDuration: number): void {
    this.registry.set(RegistryKey.TurnDuration, turnDuration);
    this.eventBus.emit(EventKey.SetTurnDuration, turnDuration);
  }

  public getPlayerBounds(playerId: string): Bounds {
    const gameScene = this.scene.getScene<GameScene>(SceneKey.GameScene);
    if (!gameScene) {
      return null;
    }

    const bounds = gameScene.getPlayerBounds(playerId);
    return this.toWindowBounds(bounds);
  }

  public getCardBounds(cardInGameId: string): Bounds {
    const gameScene = this.scene.getScene<GameScene>(SceneKey.GameScene);
    if (!gameScene) {
      return null;
    }

    const bounds = gameScene.getCardBounds(cardInGameId);
    return this.toWindowBounds(bounds);
  }

  public getPlayerSkillBounds(playerId: string): Bounds {
    const gameScene = this.scene.getScene<GameScene>(SceneKey.GameScene);
    if (!gameScene) {
      return null;
    }

    const bounds = gameScene.getPlayerSkillBounds(playerId);
    return this.toWindowBounds(bounds);
  }

  public getDiscardPileBounds(): Bounds {
    const gameScene = this.scene.getScene<GameScene>(SceneKey.GameScene);
    if (!gameScene) {
      return null;
    }

    const bounds = gameScene.getDiscardPileBounds();
    return this.toWindowBounds(bounds);
  }

  public getDeckBounds(): Bounds {
    const gameScene = this.scene.getScene<GameScene>(SceneKey.GameScene);
    if (!gameScene) {
      return null;
    }

    const bounds = gameScene.getDeckBounds();
    return this.toWindowBounds(bounds);
  }

  public getDeckPosition(): Position {
    const gameScene = this.scene.getScene<GameScene>(SceneKey.GameScene);
    if (!gameScene) {
      return null;
    }

    const bounds = gameScene.getDeckPosition();
    return this.toWindowPosition(bounds);
  }

  public setInteractiveLock(id: string, isInteractive: boolean): void {
    const wasLocked = Object.values(this.interactiveLocks).includes(true);
    this.interactiveLocks[id] = isInteractive;
    const isLocked = Object.values(this.interactiveLocks).includes(true);
    if (wasLocked === isLocked) {
      return;
    }

    this.eventBus.emit(EventKey.SetIntercative, !isLocked);
  }

  private get dpr(): number {
    return Math.min(window.devicePixelRatio, PwsmGameConstants.Rendering.MaxDpr);
  }

  private get zoom(): number {
    return 1 / this.dpr;
  }

  private throttle<T extends (...args: any[]) => any>(fn: T): T {
    return FunctionUtil.throttle(fn, THROTTLE_MS);
  }

  private toWindowBounds(bounds: Bounds): Bounds {
    if (!bounds) {
      return null;
    }

    return {
      ...this.toWindowPosition(bounds),
      width: bounds.width * this.zoom,
      height: bounds.height * this.zoom,
    };
  }

  private toWindowPosition(position: Position): Position {
    if (!position) {
      return null;
    }

    return {
      x: position.x * this.zoom,
      y: position.y * this.zoom,
    };
  }

  private resize(): void {
    const width = Math.round(window.innerWidth * this.dpr);
    const height = Math.round(window.innerHeight * this.dpr);

    this.scale.resize(width, height);
    this.scale.setZoom(this.zoom);

    this.registry.set(RegistryKey.Width, width);
    this.registry.set(RegistryKey.Height, height);
    this.registry.set(RegistryKey.VW, width / 100);
    this.registry.set(RegistryKey.VH, height / 100);
    this.eventBus.emit(EventKey.Resize, { width, height });
  }
}
