/**
 * @enum Theme
 * @public
 */
export enum Theme {
  MAIN = 'main',
}

/**
 * @class ThemeEntity
 * @public
 */
export class ThemeEntity {
  public static get MAIN(): Theme {
    return Theme.MAIN;
  }
}
