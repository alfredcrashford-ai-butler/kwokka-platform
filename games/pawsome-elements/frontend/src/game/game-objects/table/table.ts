import { GameObjects, Tweens } from 'phaser';
import { ItemKey, type ArenaItemKey } from '@/game-data/item-key';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import { Resource } from '@/game/resource';
import type { PwsmPlayableScene } from '@/game/scenes';
import { ObjectKey } from '@/game/object-key';
import { type Arena, FlowerFieldArena, LabArena, LibraryArena, LoneMountainArena, StandardArena } from './arena';
import type {} from './arena';
import type { Resizable } from '../resizable';
import type { Stateful } from '../stateful';
import { DiscardPile } from './discard-pile';
import { CardDeck } from './card-deck';

export class Table extends GameObjects.Container implements Resizable, Stateful {
  private arena: Arena;
  private discardPile: DiscardPile;
  private cardDeck: CardDeck;
  private dropZone: GameObjects.Zone;
  private highlightArea: GameObjects.Image;
  private highlightAreaTween: Tweens.Tween;

  public constructor(
    public readonly scene: PwsmPlayableScene,
    private readonly playerId: string,
    private readonly arenaKey: ArenaItemKey,
  ) {
    super(scene, scene.width / 2, scene.height / 2);
    this.setSize(PwsmGameConstants.Table.Width, PwsmGameConstants.Table.Height);
    this.cardDeck = new CardDeck(this.scene, this.playerId);
    this.scene.track(ObjectKey.Deck, this.cardDeck);
    this.discardPile = new DiscardPile(this.scene);
    this.scene.track(ObjectKey.DiscardPile, this.discardPile);

    // Drop zone must be under arena as arena includes discard pile and discard pile is
    // an interactive object. Otherwise we will not be able to click on the discard pile.
    this.dropZone = this.createDropZone();
    this.add(this.dropZone);

    this.arena = this.createArena();
    this.add(this.arena);

    this.highlightArea = this.createHighlightArea();
    this.add(this.highlightArea);

    this.onResize();
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.discardPile.setGameState(gameInstance);
    this.cardDeck.setGameState(gameInstance);
  }

  public onResize(): void {
    this.scene.setDisplaySizeCover(this);
    if (this.scene.isPortrait) {
      this.cardDeck.x = PwsmGameConstants.Table.DeckPortraitX;
      this.cardDeck.y = PwsmGameConstants.Table.DeckPortraitY;
      this.discardPile.x = PwsmGameConstants.Table.DiscardPilePortraitX;
      this.discardPile.y = PwsmGameConstants.Table.DiscardPilePortraitY;
    } else {
      this.cardDeck.x = PwsmGameConstants.Table.DeckX;
      this.cardDeck.y = PwsmGameConstants.Table.DeckY;
      this.discardPile.y = PwsmGameConstants.Table.DiscardPileY;
      this.discardPile.x = PwsmGameConstants.Table.DiscardPileX;
    }
  }

  public setHighlightAreaAlpha(alpha: number): void {
    this.scene.removeTweens(this.highlightAreaTween);

    this.highlightAreaTween = this.scene.tweens.add({
      targets: this.highlightArea,
      alpha,
      duration: PwsmGameConstants.Table.HighlightAreaAlphaTweenDuration,
    });
  }

  private createArena(): Arena {
    if (this.arenaKey === ItemKey.ArenaFlowerField) {
      return new FlowerFieldArena(this.scene, this.cardDeck, this.discardPile);
    }

    if (this.arenaKey === ItemKey.ArenaLoneMountain) {
      return new LoneMountainArena(this.scene, this.cardDeck, this.discardPile);
    }

    if (this.arenaKey === ItemKey.ArenaLab) {
      return new LabArena(this.scene, this.cardDeck, this.discardPile);
    }

    if (this.arenaKey === ItemKey.ArenaLibrary) {
      return new LibraryArena(this.scene, this.cardDeck, this.discardPile);
    }

    return new StandardArena(this.scene, this.cardDeck, this.discardPile);
  }

  private createDropZone(): GameObjects.Zone {
    const height = PwsmGameConstants.Table.Height * PwsmGameConstants.Table.DropZoneSize;
    const x = 0;
    const y = -PwsmGameConstants.Table.Height / 2 + height / 2;
    const width = PwsmGameConstants.Table.Width;
    const zone = new GameObjects.Zone(this.scene, x, y, width, height).setDropZone();
    zone.setName(PwsmGameConstants.GameObjectName.TableDropZone);
    zone.active = false;
    return zone;
  }

  private createHighlightArea(): GameObjects.Image {
    const area = new GameObjects.Image(this.scene, 0, 0, Resource.GameTable.HighlightArea);
    area.setDisplaySize(PwsmGameConstants.Table.Width, PwsmGameConstants.Table.Height);
    area.setAlpha(0);
    return area;
  }
}
