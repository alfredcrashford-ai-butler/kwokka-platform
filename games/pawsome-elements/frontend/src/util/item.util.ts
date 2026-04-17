import { ItemKey, type CardBackItemKey } from '@/game-data/item-key';

export class ItemUtil {
  public static getCardBackSrc(itemKey: CardBackItemKey): string {
    const map = {
      [ItemKey.DeckBackfaceArcane]: '/static/game/card/back/arcane.webp',
      [ItemKey.DeckBackfaceFilth]: '/static/game/card/back/filth.webp',
      [ItemKey.DeckBackfaceNature]: '/static/game/card/back/nature.webp',
      [ItemKey.DeckBackfaceBloom]: '/static/game/card/back/bloom.webp',
      [ItemKey.DeckBackfaceFury]: '/static/game/card/back/fury.webp',
    };
    return map[itemKey] || '/static/game/card/back/standard.webp';
  }
}
