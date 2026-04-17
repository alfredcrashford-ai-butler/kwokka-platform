import type { PwsmPlayableScene } from '@/game/scenes';
import { GameObjects } from 'phaser';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { CardFan } from '../card-fan';
import type { Resizable } from '../resizable';
import type { Stateful } from '../stateful';
import { PlayerPanel } from '../player-panel/player-panel';
import { Fan } from '../card-fan/fan';
import type { Card } from '../card';

export class Player extends GameObjects.Container implements Resizable, Stateful {
  public static readonly Events = {
    DropZoneCardDrop: 'drop_zone_card_drop',
    DropZoneCardEnter: 'drop_zone_card_enter',
    DropZoneCardLeave: 'drop_zone_card_leave',
    CardDragStart: 'card_drag_start',
    CardDragEnd: 'card_drag_end',
    CardSelected: 'card_selected',
  };

  private readonly fan: CardFan;
  private readonly panel: PlayerPanel;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    public readonly playerId: string,
  ) {
    super(scene, 0, 0);
    this.fan = new CardFan(scene, 0, 0);
    this.fan.setCardsDraggable(true);
    this.fan.setCardsSelectable(true);
    this.fan.setCardsHoverable(true);
    this.fan.on(Fan.Events.DropZoneCardDrop, (card: Card) => this.emit(Player.Events.DropZoneCardDrop, card));
    this.fan.on(Fan.Events.DropZoneCardEnter, (card: Card) => this.emit(Player.Events.DropZoneCardEnter, card));
    this.fan.on(Fan.Events.DropZoneCardLeave, (card: Card) => this.emit(Player.Events.DropZoneCardLeave, card));
    this.fan.on(Fan.Events.CardDragStart, (card: Card) => this.emit(Player.Events.CardDragStart, card));
    this.fan.on(Fan.Events.CardDragEnd, (card: Card) => this.emit(Player.Events.CardDragEnd, card));
    this.fan.on(Fan.Events.CardSelected, (card: Card) => this.emit(Player.Events.CardSelected, card));
    this.fan.setCardDrawIndicatorFontSize(PwsmGameConstants.Player.CardDrawIndicatorFontSize);
    this.add(this.fan);

    this.panel = new PlayerPanel(scene, playerId);
    this.panel.setSkillTooltipTransform(PwsmGameConstants.Player.TooltipTransform);
    this.panel.setSkillCursor('pointer');
    this.add(this.panel);

    this.onResize();
  }

  public setSkillTooltipEnabled(isEnabled: boolean): void {
    this.panel.setSkillTooltipEnabled(isEnabled);
  }

  public setSkillClickable(isClickable: boolean): void {
    this.panel.setSkillClickable(isClickable);
  }

  public onResize(): void {
    this.setPosition(this.scene.width * PwsmGameConstants.Player.X, this.scene.height * PwsmGameConstants.Player.Y);
    this.resizeFan();
    this.resizePanel();
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    const cards = gameInstance.getPlayersCards(this.playerId);
    this.fan.setCards(cards);
    this.panel.setGameState(gameInstance);
  }

  private resizePanel(): void {
    const width = PwsmGameConstants.Player.PanelWidth * this.scene.size;
    const height = width / PwsmGameConstants.PlayerPanel.AspectRatio;
    this.panel.setDisplaySize(width, height);
    this.panel.y = -this.panel.displayHeight / 2 + height / 2;
  }

  private resizeFan(): void {
    let fanWidth = this.scene.isLandscape
      ? PwsmGameConstants.Player.FanWidth
      : PwsmGameConstants.Player.FanPortraitWidth;
    fanWidth = fanWidth * this.scene.width;
    const aspectRatio = this.scene.isLandscape
      ? PwsmGameConstants.Fan.AspectRatio
      : PwsmGameConstants.Fan.CompactAspectRatio;
    const height = fanWidth / aspectRatio;
    this.fan.setAspectRatio(aspectRatio);
    this.fan.setDisplaySize(fanWidth, height);
    this.fan.y = -this.fan.displayHeight / 2 + PwsmGameConstants.Player.FanVerticalOffset;
  }
}
