import { GameObjects } from 'phaser';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { PwsmPlayableScene } from '@/game/scenes';
import { OpponentSlot, PwsmGameConstants, type OpponentDimension } from '@/game/pwsm-game-constants';
import { PhaserInputEvent } from '@/game/phaser';
import { EventKey } from '@/game/event-key';
import type { Resizable } from '../resizable';
import type { Stateful } from '../stateful';
import { Opponent } from '../opponent';
import type { Connectable } from '../connectable';

type ExtendedOpponentDimension = OpponentDimension & { width: number; height: number; tooltipScale: number };

export class OpponentsRenderer extends GameObjects.Container implements Resizable, Stateful, Connectable {
  public static readonly Events = {
    OpponentClick: 'opponent_click',
  };

  private opponents: Opponent[] = [];
  private isClickable: boolean = false;
  private cursor: string;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    private readonly accountId: string,
  ) {
    super(scene, 0, 0);
    this.onResize();

    this.scene.eventBus.on(EventKey.SetConnectivity, (connectivity) => this.setConnectivity(connectivity));
  }

  public setConnectivity(connectivity: Record<string, boolean>): void {
    this.opponents.forEach((el) => el.setConnected(el.lobbyPlayer.isBot ? true : connectivity[el.lobbyPlayer.id]));
  }

  public setOpponentsClickable(isClickable: boolean): void {
    this.isClickable = isClickable;
  }

  public setSkillTooltipEnabled(isEnabled: boolean): void {
    this.opponents.forEach((el) => el.setSkillTooltipEnabled(isEnabled));
  }

  private setupOpponents(gameInstance: PwsmGameInstanceEntity): void {
    this.opponents.forEach((el) => this.scene.untrack(this.scene.getPlayerObjectKey(el.lobbyPlayer.id), el));
    this.remove(this.opponents, true);

    const opponents = gameInstance.getOpponents(this.accountId);
    this.opponents = opponents.map((el) => new Opponent(this.scene, el, gameInstance));
    this.opponents.forEach((el) => this.scene.track(this.scene.getPlayerObjectKey(el.lobbyPlayer.id), el));
    this.opponents.forEach((el) => this.setupInteractions(el));
    this.add(this.opponents);

    this.onResize();
  }

  public onResize(): void {
    this.setSize(this.scene.width, this.scene.height);

    const dimensions = this.calculateOpponentsDimensions(this.opponents);

    this.opponents.forEach((opponent) => {
      const dimension = dimensions[opponent.lobbyPlayer.id];
      opponent.setDisplaySize(dimension.width, dimension.height);
      opponent.setPosition(dimension.x, dimension.y);
      opponent.setAngle(dimension.angle);
      opponent.setTooltipTransform(dimension.tooltipTransform);
      opponent.setTooltipScale(dimension.tooltipScale);
    });
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    if (this.opponents.length !== gameInstance.opponentsCount) {
      this.setupOpponents(gameInstance);
    }

    this.opponents.forEach((el) => el.setGameState(gameInstance));
  }

  public setCursor(cursor: string): void {
    this.cursor = cursor;
  }

  private setupInteractions(opponent: Opponent): void {
    opponent.setInteractive({ cursor: this.cursor });
    opponent.on(PhaserInputEvent.PointerOver, () => this.onPointerOver(opponent));
    opponent.on(PhaserInputEvent.PointerOut, () => this.onPointerOut(opponent));
    opponent.on(PhaserInputEvent.PointerDown, () => this.onPointerDown(opponent));
  }

  private calculateOpponentsDimensions(opponents: Opponent[]): Record<string, ExtendedOpponentDimension> {
    const dimensions: Record<string, ExtendedOpponentDimension> = {};

    const activeSlots = this.getActiveSlots(opponents.length);
    const slotsDimensions = this.getSlotsDimensions(activeSlots);

    opponents.forEach((opponent, i) => (dimensions[opponent.lobbyPlayer.id] = slotsDimensions[activeSlots[i]]));

    return dimensions;
  }

  private getActiveSlots(opponentsCount: number): OpponentSlot[] {
    if (this.scene.isPortrait) {
      return PwsmGameConstants.Opponents.SlotsPortrait[opponentsCount] || [];
    }
    return PwsmGameConstants.Opponents.Slots[opponentsCount] || [];
  }

  private getSlotsDimensions(slots: OpponentSlot[]): { [slot in OpponentSlot]?: ExtendedOpponentDimension } {
    const dimensions: { [slot in OpponentSlot]?: ExtendedOpponentDimension } = {};

    slots.forEach((slot) => (dimensions[slot] = this.getSlotDimension(slot, slots.length)));

    return dimensions;
  }

  private getSlotDimension(slot: OpponentSlot, count: number): ExtendedOpponentDimension {
    const dimension = PwsmGameConstants.Opponents.Dimensions[slot];
    const size = PwsmGameConstants.Opponents.Sizes[count] || 0;
    const width = size * this.scene.size;
    const height = width / PwsmGameConstants.Opponents.AspectRatio;

    return {
      width,
      height,
      x: dimension.x * this.scene.width,
      y: dimension.y * this.scene.height,
      angle: dimension.angle,
      tooltipTransform: dimension.tooltipTransform,
      tooltipScale: PwsmGameConstants.Opponents.TooltipScales[count],
    };
  }

  private onPointerOver(opponent: Opponent): void {
    if (!this.isClickable) {
      return;
    }

    opponent?.setHighlighted(true);
  }

  private onPointerOut(opponent: Opponent): void {
    opponent?.setHighlighted(false);
  }

  private onPointerDown(opponent: Opponent): void {
    if (!this.isClickable) {
      return;
    }

    this.emit(OpponentsRenderer.Events.OpponentClick, opponent.lobbyPlayer.id);
  }
}
