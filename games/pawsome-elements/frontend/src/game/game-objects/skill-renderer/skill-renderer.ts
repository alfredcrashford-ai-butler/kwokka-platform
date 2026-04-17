import { GameObjects } from 'phaser';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
import type { PwsmPlayableScene } from '@/game/scenes';
import { ActiveSkillItemKey } from '@/game-data';
import { EventKey } from '@/game/event-key';
import type { Resizable } from '../resizable';
import type { Stateful } from '../stateful';
import { OwnCardSelectSkill } from './own-card-select-skill';
import { PlayerSelectSkill } from './player-select-skill';
import { InteractiveSkill } from './interactive-skill';
import { PwsmGameConstants } from '@/game/pwsm-game-constants';

const OWN_CARD_SELECT_SKILLS = [
  ActiveSkillItemKey.PlayAnyCard,
  ActiveSkillItemKey.TransformOwnCardIntoMultidog,
  ActiveSkillItemKey.TransformRandomOpponentsCardIntoSelected,
];
const PLAYER_SELECT_SKILLS = [ActiveSkillItemKey.SelectedPlayerBurnsCards, ActiveSkillItemKey.SelectedPlayerDrawsCards];

export class SkillRenderer extends GameObjects.Container implements Resizable, Stateful {
  private readonly ownCardSelectSkill: OwnCardSelectSkill;
  private readonly playerSelectSkill: PlayerSelectSkill;

  public constructor(public readonly scene: PwsmPlayableScene) {
    super(scene, 0, 0);

    this.ownCardSelectSkill = new OwnCardSelectSkill(scene);
    this.ownCardSelectSkill.on(InteractiveSkill.Events.SkillPlay, (data: any) => this.onSkillPlayed(data));
    this.add(this.ownCardSelectSkill);
    this.playerSelectSkill = new PlayerSelectSkill(scene);
    this.playerSelectSkill.on(InteractiveSkill.Events.SkillPlay, (data: any) => this.onSkillPlayed(data));
    this.add(this.playerSelectSkill);

    this.onResize();
  }

  public setGameState(gameInstance: PwsmGameInstanceEntity): void {
    this.ownCardSelectSkill.setGameState(gameInstance);
    this.playerSelectSkill.setGameState(gameInstance);

    if (!gameInstance.isPlayersTurn(this.scene.config.playerId)) {
      this.playerSelectSkill.hide();
      this.ownCardSelectSkill.hide();
    }
  }

  public onResize(): void {
    this.setPosition(this.scene.width / 2, this.scene.height / 2);
    this.ownCardSelectSkill.onResize();
    this.playerSelectSkill.onResize();
  }

  public playSkill(key: ActiveSkillItemKey): void {
    if (!this.canPlaySkill) {
      this.scene.eventBus.emit(EventKey.OuterSkillPlayCancel);
      return;
    }

    this.scene.eventBus.emit(EventKey.OuterSkillClick);

    if (this.isOwnCardSelectSkill(key)) {
      this.ownCardSelectSkill.show();
      return;
    }

    if (this.isPlayerSelectSkill(key)) {
      this.playerSelectSkill.show();
      return;
    }

    this.onSkillPlayed();
  }

  public onSkillPlayed(data: any = null): void {
    this.hide();
    this.shakeCamera();
    this.scene.eventBus.emit(EventKey.OuterSkillPlay, data);
  }

  public hide(): void {
    this.ownCardSelectSkill.hide();
    this.playerSelectSkill.hide();
  }

  public isOwnCardSelectSkill(key: ActiveSkillItemKey): boolean {
    return OWN_CARD_SELECT_SKILLS.includes(key);
  }

  private shakeCamera(): void {
    this.scene.shakeCamera(
      PwsmGameConstants.SkillRenderer.CameraShakeOnSkillDuration,
      PwsmGameConstants.SkillRenderer.CameraShakeOnSkillIntensity,
    );
  }

  private get canPlaySkill(): boolean {
    if (!this.scene.gameInstance.isPlayersTurn(this.scene.config.playerId)) {
      return false;
    }

    if (!this.scene.gameInstance.isPlayersSkillReady(this.scene.config.playerId)) {
      return false;
    }

    if (!this.scene.gameInstance.hasPlayableSkill(this.scene.config.playerId)) {
      return false;
    }

    return true;
  }

  private isPlayerSelectSkill(key: ActiveSkillItemKey): boolean {
    return PLAYER_SELECT_SKILLS.includes(key);
  }
}
