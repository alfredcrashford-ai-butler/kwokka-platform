import { GameObjects } from 'phaser';
import { ItemKey, type CardBackItemKey } from '@/game-data/item-key';
import type { PwsmPlayableScene } from '@/game/scenes';
import { Resource } from '@/game/resource';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';

const CardBackItemKeyToResource = {
  [ItemKey.DeckBackfaceArcane]: Resource.Card.Back.Arcane,
  [ItemKey.DeckBackfaceFilth]: Resource.Card.Back.Filth,
  [ItemKey.DeckBackfaceNature]: Resource.Card.Back.Nature,
  [ItemKey.DeckBackfaceFury]: Resource.Card.Back.Fury,
  [ItemKey.DeckBackfaceBloom]: Resource.Card.Back.Bloom,
};

export class CardBack extends GameObjects.Image {
  public constructor(scene: PwsmPlayableScene, x, y) {
    super(scene, x, y, CardBack.getCardBackResourceKey(scene.config.items.cardBack));
    this.setDisplaySize(PwsmGameConstants.Card.Width, PwsmGameConstants.Card.Height);
  }

  public setOutlined(isOutlined: boolean): void {
    // TODO: implement
  }

  private static getCardBackResourceKey(cardBackItemKey: CardBackItemKey): string {
    return CardBackItemKeyToResource[cardBackItemKey] || Resource.Card.Back.Standard;
  }
}
