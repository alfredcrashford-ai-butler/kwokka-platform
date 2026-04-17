import { GameObjects, Math as PhaserMath, Tweens } from 'phaser';
import type { PwsmPlayableScene } from '@/game/scenes';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import { Resource } from '@/game/resource';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { type PhaserHook } from '@/game/phaser';
import type { Stateful } from '../stateful';
import type { Resizable } from '../resizable';
import { PwsmText } from '../pwsm-text';

export class GameTimer extends GameObjects.Container implements Resizable, Stateful, PhaserHook.PreUpdate {
  private readonly background: GameObjects.Image;
  private readonly graphics: GameObjects.Graphics;
  private readonly text: PwsmText;
  private readonly particleEmitter: GameObjects.Particles.ParticleEmitter;
  private timeTotalMs: number;
  private timeLeftMs: number;
  private tween: Tweens.Tween;
  private activeTween: Tweens.Tween;

  public constructor(public readonly scene: PwsmPlayableScene) {
    super(scene);
    const width = PwsmGameConstants.Timer.Width;
    const height = PwsmGameConstants.Timer.Width / PwsmGameConstants.Timer.AspectRatio;
    this.setSize(width, height);

    this.particleEmitter = new GameObjects.Particles.ParticleEmitter(
      scene,
      0,
      0,
      Resource.Particle.BaseSquare,
      PwsmGameConstants.Timer.ParticlesEmitterConfig,
    );
    this.add(this.particleEmitter);

    this.background = new GameObjects.Image(scene, 0, 0, Resource.Timer.Background);
    this.background.setDisplaySize(width, height);
    this.add(this.background);

    const lineStyle = {
      width: PwsmGameConstants.Timer.ArcWidth,
      color: PwsmGameConstants.Colors.White,
      alpha: PwsmGameConstants.Timer.ArcAlpha,
    };
    this.graphics = new GameObjects.Graphics(scene, { lineStyle });
    this.add(this.graphics);

    this.text = new PwsmText(scene, 0, 0, '', {
      fontSize: PwsmGameConstants.Timer.FontSize,
      wordWrap: null,
    });
    this.text.setFixedSize(width, 0);
    this.text.x = 0;
    this.text.y = 0;
    this.text.setOrigin(0.5);
    this.add(this.text);

    this.startActiveTween();

    this.onResize();
  }

  public preUpdate(_: any, delta: any): void {
    if (!this.timeTotalMs || !this.timeLeftMs) {
      return;
    }

    this.timeLeftMs = Math.max(this.timeLeftMs - delta, 0);
    this.renderGraphics();
    this.renderText();
  }

  public setTurnDuration(duration: number): void {
    this.timeTotalMs = duration;
    this.timeLeftMs = duration;
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.reposition(gameInstance);
  }

  public onResize(): void {
    this.reposition(this.scene.gameInstance);
    const sceneWidth = this.scene.size * PwsmGameConstants.Timer.SceneSize;
    this.setDisplaySize(sceneWidth, sceneWidth / PwsmGameConstants.Timer.AspectRatio);
    this.startActiveTween();
  }

  private startActiveTween(): void {
    this.scene.removeTweens(this.activeTween);
    this.activeTween = this.scene.add.tween({
      targets: this,
      scale: `+=${PwsmGameConstants.Timer.HighlightScale}`,
      yoyo: true,
      loop: -1,
      duration: PwsmGameConstants.Timer.HighlightTweenDuration,
      ease: PwsmGameConstants.Timer.HighlightTweenEase,
    });
  }

  private reposition(gameInstance: PwsmGameInstanceEntity): void {
    this.scene.removeTweens(this.tween);
    const playerId = gameInstance.state.publicState.currentTurnPlayerId;
    const position = this.scene.getPlayerPosition(playerId);
    this.tween = this.scene.add.tween({
      targets: this,
      x: position.x,
      y: position.y,
      duration: PwsmGameConstants.Timer.TweenDuration,
      ease: PwsmGameConstants.Timer.TweenEase,
      easeParams: PwsmGameConstants.Timer.TweenParams,
    });
  }

  private renderGraphics(): void {
    this.graphics.clear();
    this.graphics.beginPath();
    const startAngle = PhaserMath.DegToRad(PwsmGameConstants.Timer.ArcStartAngle);
    const endAngle = startAngle + PhaserMath.DegToRad((this.timeLeftMs / this.timeTotalMs) * 360);
    this.graphics.arc(0, 0, PwsmGameConstants.Timer.ArcRadius, startAngle, endAngle);
    this.graphics.strokePath();
  }

  private renderText(): void {
    this.text.text = `${Math.ceil(this.timeLeftMs / 1000)}`;
  }
}
