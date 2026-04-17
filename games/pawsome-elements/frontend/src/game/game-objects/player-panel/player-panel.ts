import { GameObjects } from 'phaser';
import type { ProfileConfig, PwsmGameInstanceEntity } from '@/game-data/game-instance';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';
import type { PwsmPlayableScene } from '@/game/scenes';
import { Resource } from '@/game/resource';
import type { ActiveSkillItemKey } from '@/game-data';
import { EventKey } from '@/game/event-key';
import type { Resizable } from '../resizable';
import type { Stateful } from '../stateful';
import { Profile } from '../profile';
import { EmptyPanel } from './empty-panel';
import { Skill } from './skill';
import { PhaserHook, PhaserInputEvent } from '@/game/phaser';
import { Tooltip } from '../tooltip';
import type { Translatable } from '../translatable';

export class PlayerPanel
  extends GameObjects.Container
  implements Resizable, Stateful, Translatable, PhaserHook.PreDestroy
{
  private profile: Profile;
  private backgroundCenter: GameObjects.Image;
  private backgroundSideTopLeft: GameObjects.Image;
  private backgroundSideTopRight: GameObjects.Image;
  private backgroundSideBottomLeft: GameObjects.Image;
  private backgroundSideBottomRight: GameObjects.Image;
  private skillTooltip: Tooltip;
  private skill: Skill;
  private emptyPanel: EmptyPanel;
  private isSkillTooltipEnabled: boolean;
  private isSkillVisible: boolean = false;
  private skillKey: ActiveSkillItemKey;
  private skillTooltipText: string;
  private tooltipTransform?: { x?: number; y?: number; rotate?: number } = { rotate: 0, y: 0, x: 0 };

  public constructor(
    public readonly scene: PwsmPlayableScene,
    public readonly accountId: string,
    public readonly config?: ProfileConfig,
  ) {
    super(scene, 0, 0);

    this.backgroundSideTopLeft = new GameObjects.Image(scene, 0, 0, Resource.PlayerPanel.BackgroundSide);
    this.add(this.backgroundSideTopLeft);

    this.backgroundSideTopRight = new GameObjects.Image(scene, 0, 0, Resource.PlayerPanel.BackgroundSide);
    this.add(this.backgroundSideTopRight);

    this.backgroundSideBottomLeft = new GameObjects.Image(scene, 0, 0, Resource.PlayerPanel.BackgroundSide);
    this.add(this.backgroundSideBottomLeft);

    this.backgroundSideBottomRight = new GameObjects.Image(scene, 0, 0, Resource.PlayerPanel.BackgroundSide);
    this.add(this.backgroundSideBottomRight);

    this.backgroundCenter = new GameObjects.Image(scene, 0, 0, Resource.PlayerPanel.BackgroundCenter);
    this.add(this.backgroundCenter);

    this.emptyPanel = new EmptyPanel(scene);
    this.add(this.emptyPanel);

    this.profile = new Profile(scene, accountId, config);
    this.add(this.profile);

    this.skill = new Skill(scene);
    this.scene.track(this.scene.getPlayerSkillObjectKey(this.accountId), this.skill);
    this.add(this.skill);

    this.setSkillVisible(false);

    this.skillTooltip = new Tooltip(scene, PwsmGameConstants.PlayerPanel.TooltipConfig);
    this.add(this.skillTooltip);

    this.onResize();

    this.skill.on(PhaserInputEvent.PointerOver, () => this.onSkillPointerOver());
    this.skill.on(PhaserInputEvent.PointerOut, () => this.onSkillPointerOut());
    this.scene.eventBus.addListener(EventKey.SetTranslations, this.setTranslations);
  }

  public override preDestroy(): void {
    this.scene.eventBus.removeListener(EventKey.SetTranslations, this.setTranslations);
    this.scene.untrack(this.scene.getPlayerSkillObjectKey(this.accountId), this.skill);
    super.preDestroy();
  }

  public setSkillCursor(cursor: string): void {
    if (this.skill?.input?.cursor) {
      this.skill.input.cursor = cursor;
    }
  }

  public setSkillTooltipTransform(transform?: { x?: number; y?: number; rotate?: number }): void {
    this.tooltipTransform = transform;

    this.repositionTooltip();
  }

  public setTooltipScale(scale: number): void {
    this.skillTooltip.scale = scale;
  }

  public setTranslations = () => {
    this.setSkillTooltipText(this.skillKey);
  };

  public setSkillClickable(isClickable: boolean) {
    this.skill.setClickable(isClickable);
  }

  public setSkillTooltipEnabled(isEnabled: boolean) {
    this.isSkillTooltipEnabled = isEnabled;
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    if (gameInstance.hasSkill(this.accountId)) {
      this.setSkill(gameInstance.getPlayersSkill(this.accountId));
      this.skill.setCooldown(gameInstance.getPlayersSkillCooldown(this.accountId));
      this.skill.setSkillReady(gameInstance.isPlayersSkillReady(this.accountId));
    }

    this.profile.setActiveAnimation(gameInstance.isPlayersTurn(this.accountId));
  }

  public override setDisplaySize(width: number, height: number): this {
    super.setDisplaySize(width, height);
    this.onResize();
    return this;
  }

  public onResize(): void {
    const width = PwsmGameConstants.PlayerPanel.Width;
    const height = width / PwsmGameConstants.PlayerPanel.AspectRatio;
    this.setSize(width, height);

    const backgroundCenterWidth = PwsmGameConstants.PlayerPanel.BackgroundCenterWidth;
    const backgroundCenterHeight = backgroundCenterWidth / PwsmGameConstants.PlayerPanel.BackgroundCenterAspectRatio;
    this.backgroundCenter.setDisplaySize(backgroundCenterWidth, backgroundCenterHeight);

    const backgroundSideWidth = PwsmGameConstants.PlayerPanel.BackgroundSideWidth;
    const backgroundSideHeight = backgroundSideWidth / PwsmGameConstants.PlayerPanel.BackgroundSideAspectRatio;
    this.backgroundSideTopLeft.setDisplaySize(backgroundSideWidth, backgroundSideHeight);
    this.backgroundSideTopLeft.x = -width / 2 + backgroundSideWidth / 2;
    this.backgroundSideTopLeft.y = backgroundSideHeight * PwsmGameConstants.PlayerPanel.BackgroundTopSideVerticalOffset;

    this.backgroundSideBottomLeft.setDisplaySize(backgroundSideWidth, backgroundSideHeight);
    this.backgroundSideBottomLeft.x = -width / 2 + backgroundSideWidth / 2;
    this.backgroundSideBottomLeft.y =
      backgroundSideHeight * PwsmGameConstants.PlayerPanel.BackgroundBottomSideVerticalOffset;
    this.backgroundSideBottomLeft.flipY = true;

    this.backgroundSideTopRight.setDisplaySize(backgroundSideWidth, backgroundSideHeight);
    this.backgroundSideTopRight.x = width / 2 - backgroundSideWidth / 2;
    this.backgroundSideTopRight.y =
      backgroundSideHeight * PwsmGameConstants.PlayerPanel.BackgroundTopSideVerticalOffset;
    this.backgroundSideTopRight.flipX = true;

    this.backgroundSideBottomRight.setDisplaySize(backgroundSideWidth, backgroundSideHeight);
    this.backgroundSideBottomRight.x = width / 2 - backgroundSideWidth / 2;
    this.backgroundSideBottomRight.y =
      backgroundSideHeight * PwsmGameConstants.PlayerPanel.BackgroundBottomSideVerticalOffset;
    this.backgroundSideBottomRight.flipX = true;
    this.backgroundSideBottomRight.flipY = true;

    const skillWidth = PwsmGameConstants.PlayerPanel.SkillWidth;
    const skillHeight = skillWidth / PwsmGameConstants.PlayerPanel.SkillAspectRatio;
    this.emptyPanel.setDisplaySize(skillWidth, skillHeight);
    this.emptyPanel.x = -width / 2 + skillWidth / 2;
    this.skill.setDisplaySize(skillWidth, skillHeight);
    this.skill.x = width / 2 - skillWidth / 2;

    this.repositionTooltip();
  }

  private repositionTooltip(): void {
    const width = PwsmGameConstants.PlayerPanel.Width;
    const skillWidth = PwsmGameConstants.PlayerPanel.SkillWidth;
    const skillHeight = skillWidth / PwsmGameConstants.PlayerPanel.SkillAspectRatio;

    this.skillTooltip.x = width / 2 - skillWidth / 2 + (this.tooltipTransform?.x || 0) * skillWidth;
    this.skillTooltip.y = (this.tooltipTransform?.y || 0) * skillHeight;
    this.skillTooltip.angle = this.tooltipTransform?.rotate || 0;
  }

  private setSkillVisible(isVisible: boolean): void {
    this.isSkillVisible = isVisible;
    this.emptyPanel.setVisible(isVisible);
    this.skill.setVisible(isVisible);
    this.backgroundCenter.setVisible(isVisible);
    this.backgroundSideTopLeft.setVisible(isVisible);
    this.backgroundSideTopRight.setVisible(isVisible);
    this.backgroundSideBottomLeft.setVisible(isVisible);
    this.backgroundSideBottomRight.setVisible(isVisible);
  }

  private setSkill(skillKey: ActiveSkillItemKey): void {
    this.skillKey = skillKey;
    if (!this.skill.visible) {
      this.skill.setSkill(skillKey);
    }

    this.setSkillVisible(true);
    this.setSkillTooltipText(skillKey);
  }

  private setSkillTooltipText(key: ActiveSkillItemKey): void {
    if (!key) {
      return;
    }
    const skillTranslations = this.scene.translations.skill[key];
    this.skillTooltipText = `[${skillTranslations.title}] ${skillTranslations.description}`;
  }

  private onSkillPointerOver(): void {
    if (!this.isSkillTooltipEnabled) {
      return;
    }

    if (!this.isSkillVisible) {
      return;
    }

    this.skillTooltip.setText(this.skillTooltipText);
    this.skillTooltip.show();
  }

  private onSkillPointerOut(): void {
    this.skillTooltip.hide();
  }
}
