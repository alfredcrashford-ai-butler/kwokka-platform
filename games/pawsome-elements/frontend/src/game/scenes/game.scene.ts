import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { CardState } from '@/game-data/card';
import { FunctionUtil } from '@kwokka/utils';
import { SceneKey } from './scene-key';
import { PwsmPlayableScene } from './pwsm-playable-scene';
import { PwsmGameConstants } from '../pwsm-game-constants';
import type { PhaserHook } from '../phaser';
import {
  SkillRenderer,
  Card,
  OpponentsRenderer,
  Player,
  Table,
  CardDrawRenderer,
  GameTimer,
  InteractionRenderer,
} from '../game-objects';
import { EventKey } from '../event-key';

export class GameScene extends PwsmPlayableScene implements PhaserHook.Init, PhaserHook.Update {
  public gameTable: Table;
  public player: Player;
  public opponentsRenderer: OpponentsRenderer;
  public interactionRenderer: InteractionRenderer;
  public cardDrawRenderer: CardDrawRenderer;
  public skillRenderer: SkillRenderer;
  public timer: GameTimer;
  public fpsMeter: HTMLElement;

  public constructor() {
    super(SceneKey.GameScene);
  }

  public init(): void {
    this.input.setTopOnly(true);
    this.cameras.main.setBackgroundColor(PwsmGameConstants.BackgroundColor);

    this.setupGameObjects();
    this.setupEventListeners();
    this.setGameState(this.gameInstance);
    this.eventBus.emit(EventKey.OuterReady);

    this.fpsMeter = document.querySelector(PwsmGameConstants.Misc.FpsMeterSelector);
  }

  public update(): void {
    this.updateFpsMeter();
  }

  private updateFpsMeter = FunctionUtil.throttle(
    () => (this.fpsMeter.innerHTML = `${Math.floor(this.game.loop.actualFps)}`),
    1000,
  );

  private onSkillClick(): void {
    this.skillRenderer?.playSkill(this.gameInstance.getPlayersSkill(this.config.playerId));
  }

  private onResize(): void {
    this.gameTable?.onResize();
    this.player?.onResize();
    this.opponentsRenderer?.onResize();
    this.cardDrawRenderer?.onResize();
    this.skillRenderer?.onResize();
    this.timer?.onResize();
    this.interactionRenderer?.onResize();
  }

  private onSetTurnDuration(turnDuration: number): void {
    this.timer?.setTurnDuration(turnDuration);
  }

  private onSetInteractive(isInteractive: boolean): void {
    if (this.gameInstance.isFinished) {
      this.input.enabled = false;
      return;
    }

    this.input.enabled = isInteractive;
  }

  private setupGameObjects(): void {
    this.setupGameTable();
    this.setupCardDrawRenderer();
    this.setupOpponentsRenderer();
    // Interaction renderer goes under player but above opponents
    this.setupInteractionRenderer();
    this.setupPlayer();
    this.setupGameTimer();
    this.setupSkillRenderer();
  }

  private setupEventListeners(): void {
    this.eventBus.on(EventKey.Resize, () => this.onResize());
    this.eventBus.on(EventKey.SetState, (gameInstance: PwsmGameInstanceEntity) => this.setGameState(gameInstance));
    this.eventBus.on(EventKey.SkillClick, () => this.onSkillClick());
    this.eventBus.on(EventKey.SetTurnDuration, (d: number) => this.onSetTurnDuration(d));
    this.eventBus.on(EventKey.SetIntercative, (isInteractive: boolean) => this.onSetInteractive(isInteractive));
  }

  private setupGameTimer(): void {
    this.timer = new GameTimer(this);
    this.timer.setTurnDuration(this.turnDuration);
    this.add.existing(this.timer);
  }

  private setupGameTable(): void {
    this.gameTable = new Table(this, this.config.playerId, this.config.items.arena);
    this.add.existing(this.gameTable);
  }

  private setupSkillRenderer(): void {
    this.skillRenderer = new SkillRenderer(this);
    this.add.existing(this.skillRenderer);
  }

  private setupOpponentsRenderer(): void {
    this.opponentsRenderer = new OpponentsRenderer(this, this.config.playerId);
    this.opponentsRenderer.setSkillTooltipEnabled(true);
    this.add.existing(this.opponentsRenderer);
  }

  private setupInteractionRenderer(): void {
    this.interactionRenderer = new InteractionRenderer(this, this.config.playerId);
    this.add.existing(this.interactionRenderer);
  }

  private setupCardDrawRenderer(): void {
    this.cardDrawRenderer = new CardDrawRenderer(this);
    this.add.existing(this.cardDrawRenderer);
  }

  private setupPlayer(): void {
    this.player = new Player(this, this.config.playerId);
    this.player.setSkillTooltipEnabled(true);
    this.player.setSkillClickable(true);
    this.player.on(Player.Events.DropZoneCardDrop, (card: Card) => this.playCard(card.cardState));
    this.player.on(Player.Events.DropZoneCardEnter, () => this.highlightTableMax());
    this.player.on(Player.Events.DropZoneCardLeave, () => this.highlightTableMedium());
    this.player.on(Player.Events.CardDragStart, () => this.highlightTableMedium());
    this.player.on(Player.Events.CardDragEnd, () => this.unhighlightTable());
    this.player.on(Player.Events.CardSelected, (card: Card) => this.playCard(card.cardState));
    this.track(this.getPlayerObjectKey(this.config.playerId), this.player);
    this.add.existing(this.player);
  }

  private playCard(cardState: CardState): void {
    this.unhighlightTable();
    this.eventBus.emit(EventKey.OuterCardPlay, cardState);
  }

  private setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.gameTable?.setGameState(gameInstance);
    this.player?.setGameState(gameInstance);
    this.opponentsRenderer?.setGameState(gameInstance);
    this.interactionRenderer?.setGameState(gameInstance);
    this.cardDrawRenderer?.setGameState(gameInstance);
    this.skillRenderer?.setGameState(gameInstance);
    this.timer?.setGameState(gameInstance);
    if (gameInstance.isFinished) {
      this.input.enabled = false;
      this.timer?.setVisible(false);
    }
  }

  private highlightTableMedium(): void {
    this.gameTable?.setHighlightAreaAlpha(PwsmGameConstants.Table.HighlightAreaMediumAlpha);
  }

  private highlightTableMax(): void {
    this.gameTable?.setHighlightAreaAlpha(PwsmGameConstants.Table.HighlightAreaMaxAlpha);
  }

  private unhighlightTable(): void {
    this.gameTable?.setHighlightAreaAlpha(PwsmGameConstants.Table.HighlightAreaDisabledAlpha);
  }
}
