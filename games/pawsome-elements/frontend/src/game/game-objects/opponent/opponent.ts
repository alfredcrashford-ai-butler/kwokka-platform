import { GameObjects } from 'phaser';
import type { PwsmPlayableScene } from '@/game/scenes';
import type { LobbyPlayer, PwsmGameInstanceEntity } from '@/game-data/game-instance';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { Resource } from '@/game/resource';
import { CardBackFan } from '../card-fan';
import type { Stateful } from '../stateful';
import { PlayerPanel } from '../player-panel';

export class Opponent extends GameObjects.Container implements Stateful {
  private fan: CardBackFan;
  private panel: PlayerPanel;
  private isConnected: boolean = true;
  private highlight: GameObjects.Image;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    public readonly lobbyPlayer: LobbyPlayer,
    gameInstance: PwsmGameInstanceEntity,
  ) {
    super(scene, 0, 0);
    const width = PwsmGameConstants.Opponents.Width;
    const height = width / PwsmGameConstants.Opponents.AspectRatio;
    this.setSize(width, height);
    this.createHighlight(width, height);
    this.createFan(width, height);
    this.createPanel(width, height);
    this.setGameState(gameInstance);
  }

  public setSkillTooltipEnabled(isEnabled: boolean): void {
    this.panel.setSkillTooltipEnabled(isEnabled);
  }

  public setTooltipTransform(transform?: { x?: number; y?: number; rotate?: number }): void {
    this.panel.setSkillTooltipTransform(transform);
  }

  public setTooltipScale(scale: number): void {
    this.panel.setTooltipScale(scale);
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    const count = gameInstance.getPlayersCardsCount(this.lobbyPlayer.id);
    this.fan.setCards(count);
    this.panel.setGameState(gameInstance);
  }

  public setConnected(isConnected: boolean): void {
    this.isConnected = isConnected;
    this.alpha = this.isConnected ? 1 : PwsmGameConstants.Opponents.DisconnectedAlpha;
  }

  public setHighlighted(isHighlighted: boolean): void {
    this.highlight.alpha = isHighlighted ? PwsmGameConstants.Opponents.HighlightAlpha : 0;
  }

  private createPanel(width: number, height: number): void {
    this.panel = new PlayerPanel(this.scene, this.lobbyPlayer.id, this.lobbyPlayer.config);
    const panelWidth = width * PwsmGameConstants.Opponents.PanelWidth;
    const panelHeight = panelWidth / PwsmGameConstants.PlayerPanel.AspectRatio;
    this.panel.setDisplaySize(panelWidth, panelHeight);
    this.panel.y = -height / 2 + panelHeight / 2;
    this.panel.setSkillTooltipEnabled(true);
    this.add(this.panel);
  }

  private createFan(width: number, height: number): void {
    this.fan = new CardBackFan(this.scene, 0, 0);
    const fanHeight = width / PwsmGameConstants.Fan.AspectRatio;
    this.fan.setDisplaySize(width, fanHeight);
    this.fan.setAngle(180);
    this.fan.y = height / 2 - fanHeight / 2;
    this.fan.setCardDrawIndicatorFontSize(PwsmGameConstants.Opponents.CardDrawIndicatorFontSize);
    this.add(this.fan);
  }

  private createHighlight(width: number, height: number): void {
    this.highlight = new GameObjects.Image(this.scene, 0, 0, Resource.Misc.HighlightWhite);
    this.highlight.setDisplaySize(
      width * PwsmGameConstants.Opponents.HighlightExpand,
      height * PwsmGameConstants.Opponents.HighlightExpand,
    );
    this.highlight.alpha = 0;
    this.add(this.highlight);
  }
}
