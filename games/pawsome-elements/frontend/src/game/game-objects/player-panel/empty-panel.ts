import { GameObjects } from 'phaser';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { PwsmPlayableScene } from '@/game/scenes';
import { Resource } from '@/game/resource';

export class EmptyPanel extends GameObjects.Container {
  private background: GameObjects.Image;
  private placeholder: GameObjects.Image;

  public constructor(public readonly scene: PwsmPlayableScene) {
    super(scene, 0, 0);
    this.setSize(this.skillWidth, this.skillHeight);

    this.background = new GameObjects.Image(scene, 0, 0, Resource.PlayerPanel.SkillCooldownBackground);
    this.background.setDisplaySize(this.skillWidth, this.skillHeight);
    this.add(this.background);

    this.placeholder = new GameObjects.Image(scene, 0, 0, Resource.PlayerPanel.PanelPlaceholder);
    this.placeholder.setDisplaySize(
      this.skillWidth * PwsmGameConstants.PlayerPanel.PlaceholderWidth,
      this.skillHeight * PwsmGameConstants.PlayerPanel.PlaceholderWidth,
    );
    this.add(this.placeholder);
  }

  private get skillWidth(): number {
    return PwsmGameConstants.PlayerPanel.SkillWidth;
  }

  private get skillHeight(): number {
    return this.skillWidth / PwsmGameConstants.PlayerPanel.SkillAspectRatio;
  }
}
