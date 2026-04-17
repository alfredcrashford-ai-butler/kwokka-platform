import { GameObjects, type Types } from 'phaser';
import type { PwsmScene } from '../scenes';
import { PwsmGameConstants } from '../pwsm-game-constants';

export class PwsmText extends GameObjects.Text {
  public constructor(
    scene: PwsmScene,
    x: number = 0,
    y: number = 0,
    text: string = '',
    style: Types.GameObjects.Text.TextStyle = {},
  ) {
    style ??= {};
    style.fontFamily ||= PwsmGameConstants.FontFamily;
    style.align ||= 'center';
    style.shadow ||= PwsmGameConstants.TextShadow;
    style.wordWrap ||= { width: PwsmGameConstants.Card.TextWidth };
    super(scene, x, y, text, style);
  }
}
