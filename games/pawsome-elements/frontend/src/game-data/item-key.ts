export enum ItemKey {
  Essence = 'pwsm_essence',

  ArenaLoneMountain = 'pwsm_arena_lone_mountain',
  ArenaFlowerField = 'pwsm_arena_flower_field',
  ArenaLab = 'pwsm_arena_lab',
  ArenaLibrary = 'pwsm_arena_library',

  CardSkinGoldenSpecial = 'pwsm_golden_special',
  CardSkinGoldenLabradoodle = 'pwsm_golden_labradoodle',
  CardSkinGoldenDobermann = 'pwsm_golden_dobermann',
  CardSkinGoldenHusky = 'pwsm_golden_husky',
  CardSkinGoldenRetriever = 'pwsm_golden_retriever',
  CardSkinGoldenCorgi = 'pwsm_golden_corgi',
  CardSkinGoldenPug = 'pwsm_golden_pug',
  CardSkinGoldenDoxie = 'pwsm_golden_doxie',
  CardSkinGoldenYork = 'pwsm_golden_york',
  CardSkinGoldenSpitz = 'pwsm_golden_spitz',

  DeckBackfaceFilth = 'pwsm_deck_backface_filth',
  DeckBackfaceNature = 'pwsm_deck_backface_nature',
  DeckBackfaceArcane = 'pwsm_deck_backface_arcane',
  DeckBackfaceFury = 'pwsm_deck_backface_fury',
  DeckBackfaceBloom = 'pwsm_deck_backface_bloom',

  NoteOrigins1 = 'pwsm_comic_origins_1',
  NoteOrigins2 = 'pwsm_comic_origins_2',
  NoteOrigins3 = 'pwsm_comic_origins_3',
  NoteOrigins4 = 'pwsm_comic_origins_4',
  NoteOrigins5 = 'pwsm_comic_origins_5',
  NoteOrigins6 = 'pwsm_comic_origins_6',
}

export const NoteItemKeys = [
  ItemKey.NoteOrigins1,
  ItemKey.NoteOrigins2,
  ItemKey.NoteOrigins3,
  ItemKey.NoteOrigins4,
  ItemKey.NoteOrigins5,
  ItemKey.NoteOrigins6,
];

export type CardBackItemKey =
  | ItemKey.DeckBackfaceArcane
  | ItemKey.DeckBackfaceFilth
  | ItemKey.DeckBackfaceNature
  | ItemKey.DeckBackfaceFury
  | ItemKey.DeckBackfaceBloom;

export type ArenaItemKey =
  | ItemKey.ArenaLoneMountain
  | ItemKey.ArenaFlowerField
  | ItemKey.ArenaLab
  | ItemKey.ArenaLibrary;

export type CardSkinItemKey =
  | ItemKey.CardSkinGoldenSpecial
  | ItemKey.CardSkinGoldenLabradoodle
  | ItemKey.CardSkinGoldenDobermann
  | ItemKey.CardSkinGoldenHusky
  | ItemKey.CardSkinGoldenRetriever
  | ItemKey.CardSkinGoldenCorgi
  | ItemKey.CardSkinGoldenPug
  | ItemKey.CardSkinGoldenDoxie
  | ItemKey.CardSkinGoldenYork
  | ItemKey.CardSkinGoldenSpitz;

export type NoteOriginsItemKey =
  | ItemKey.NoteOrigins1
  | ItemKey.NoteOrigins2
  | ItemKey.NoteOrigins3
  | ItemKey.NoteOrigins4
  | ItemKey.NoteOrigins5
  | ItemKey.NoteOrigins6;
