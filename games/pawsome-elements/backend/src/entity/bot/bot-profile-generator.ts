import { DecorationEntityType } from '@kwokka/entities';
import { RandomUtil } from '@kwokka/utils';
import { BackgroundDecorationKey, ImageDecorationKey } from '../decoration-key';
import { ProfileConfig } from '../game-instance';

const NAMES = [
  'alex',
  'amy',
  'andy',
  'angela',
  'anna',
  'anton',
  'bruce',
  'bucky',
  'carol',
  'clark',
  'creed',
  'dave',
  'diana',
  'finn',
  'frodo',
  'gabe',
  'han',
  'harry',
  'jack',
  'jan',
  'jane',
  'jason',
  'jill',
  'jim',
  'joel',
  'joker',
  'jules',
  'kate',
  'kelly',
  'ken',
  'kevin',
  'kirk',
  'korra',
  'lara',
  'leia',
  'leon',
  'loki',
  'lucas',
  'luke',
  'mario',
  'marty',
  'max',
  'mike',
  'miles',
  'mimir',
  'neo',
  'ned',
  'nick',
  'odin',
  'oscar',
  'pam',
  'peach',
  'penny',
  'peter',
  'quinn',
  'ralph',
  'remy',
  'rocky',
  'ron',
  'ryan',
  'sam',
  'silke',
  'sia',
  'steve',
  'thor',
  'tony',
  'vader',
  'wanda',
  'yoda',
  'zoro',
];

const PREFIXES = [
  'Dark',
  'Ultra',
  'The',
  'Mr',
  'Dr',
  'Lord',
  'Ghost',
  'Fire',
  'Ice',
  'Iron',
  'Golden',
  'Night',
  'Nova',
  'Alpha',
  'Beta',
  'Omega',
  'King',
  'Queen',
  'Dead',
  'Red',
  'Blue',
  'Green',
  'Turbo',
  'Mega',
  'Super',
  'Ninja',
  'Venom',
  'Magic',
  'Crimson',
  'Lucky',
  'Savage',
  'X1',
  'Z3',
  'R2',
  'Q7',
  'S9',
  'M4',
  'T5',
  'L6',
  'P8',
  'V0',
];

const SUFFIXES = [
  'Slayer',
  'Hunter',
  'Master',
  'King',
  'Queen',
  'Rider',
  'Ninja',
  'Lord',
  'Beast',
  'Ghost',
  'Wizard',
  'Mage',
  'Druid',
  'Knight',
  'Seeker',
  'Titan',
  'Phantom',
  'Hero',
  'Demon',
  'Angel',
  'Storm',
  'Bandit',
  'Outlaw',
  'Monk',
  'Dragon',
  'Giant',
  '007',
  '99',
  '42',
  '360',
  '24',
  '77',
  '13',
  '88',
  '23',
  '66',
];

const SURROUNDERS = [
  ['xX', 'Xx'],
  ['The', 'X'],
  ['Mr', 'K'],
  ['Dr', 'Z'],
  ['x', 'Xx'],
  ['X', 'x'],
  ['A', 'Zz'],
  ['Z', 'Xx'],
  ['Go', 'Dx'],
  ['Fx', 'Rx'],
  ['C', 'Kx'],
  ['K', 'Zz'],
  ['Q', 'Xx'],
  ['Zz', 'X'],
  ['Dx', 'Go'],
  ['Rx', 'Fx'],
  ['V', 'Dx'],
  ['Mx', 'Vx'],
  ['Ax', 'K'],
  ['Bx', 'Mx'],
  ['Ox', 'Q'],
  ['P', 'Zx'],
  ['Tx', 'Px'],
  ['Ux', 'Ox'],
  ['Wx', 'Tx'],
  ['Y', 'Wx'],
  ['Z', 'Px'],
  ['Lx', 'Mx'],
  ['Nx', 'Nx'],
  ['Kx', 'Lx'],
  ['X1', '77'],
  ['Z3', '99'],
  ['R2', '42'],
  ['Q7', '23'],
  ['S9', '88'],
  ['M4', '13'],
  ['T5', '66'],
  ['L6', '24'],
  ['P8', '360'],
  ['V0', '007'],
];

export class BotProfileGenerator {
  private static generateName(): string {
    let name = RandomUtil.randomInArray(NAMES);
    if (RandomUtil.randomInArray([true, false])) {
      name = name.toUpperCase();
    }

    const modifyName = RandomUtil.randomInArray([this.addPrefix, this.addSuffix, this.addSurrounders]);
    name = modifyName(name);
    return name;
  }

  private static addPrefix(name: string): string {
    return `${RandomUtil.randomInArray(PREFIXES)}${name}`;
  }

  private static addSuffix(name: string): string {
    return `${name}${RandomUtil.randomInArray(SUFFIXES)}`;
  }

  private static addSurrounders(name: string): string {
    const [prefix, suffix] = RandomUtil.randomInArray(SURROUNDERS);
    return `${prefix}${name}${suffix}`;
  }

  public static generate(): ProfileConfig {
    return {
      name: this.generateName(),
      decorations: {
        [DecorationEntityType.Background]: RandomUtil.randomInArray(Object.values(BackgroundDecorationKey)),
        [DecorationEntityType.Image]: RandomUtil.randomInArray(Object.values(ImageDecorationKey)),
        [DecorationEntityType.Badge]: null,
      },
    };
  }
}
