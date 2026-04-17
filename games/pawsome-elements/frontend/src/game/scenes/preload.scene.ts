import { CardElement, CardId } from '@/game-data/card';
import { ActiveSkillItemKey } from '@/game-data';
import { SceneKey } from './scene-key';
import { PwsmScene } from './pwsm-scene';
import type { PhaserHook } from '../phaser';
import { Resource } from '../resource';
import { PwsmGameConstants } from '../pwsm-game-constants';

export class PreloadScene extends PwsmScene implements PhaserHook.Create, PhaserHook.Preload, PhaserHook.Init {
  public camera: Phaser.Cameras.Scene2D.Camera;

  public constructor() {
    super(SceneKey.PreloadScene);
  }

  public init(): void {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(PwsmGameConstants.BackgroundColor);
  }

  public preload(): void {
    this.load.setBaseURL('/');
    this.load.setPath('static/game/');
    this.load.image(Resource.Placeholder, 'placeholder.webp');
    this.load.image(Resource.Misc.HighlightWhite, 'misc/highlight_white.webp');
    this.loadGameTable();
    this.loadParticles();
    this.loadCardImages();
    this.loadCards();
    this.loadCardBacks();
    this.loadPlayerPanel();
    this.loadSkills();
    this.loadTimer();
  }

  public create(): void {
    this.scene.start(SceneKey.GameScene);
  }

  private loadGameTable(): void {
    this.load.image(Resource.GameTable.DeckBottom, 'game_table/deck_bottom.webp');
    this.load.image(Resource.GameTable.HighlightArea, 'game_table/highlight_area.webp');
    this.load.image(Resource.GameTable.Arena.Standard.Background, 'game_table/arena/standard/background.webp');
    this.load.image(Resource.GameTable.Arena.Standard.Table, 'game_table/arena/standard/table.webp');
    this.load.image(Resource.GameTable.Arena.FlowerField.Background, 'game_table/arena/flower_field/background.webp');
    this.load.image(Resource.GameTable.Arena.FlowerField.Table, 'game_table/arena/flower_field/table.webp');
    this.load.image(Resource.GameTable.Arena.LoneMountain.Background, 'game_table/arena/lone_mountain/background.webp');
    this.load.image(Resource.GameTable.Arena.LoneMountain.Table, 'game_table/arena/lone_mountain/table.webp');
    this.load.image(Resource.GameTable.Arena.Lab.Background, 'game_table/arena/lab/background.webp');
    this.load.image(Resource.GameTable.Arena.Lab.Table, 'game_table/arena/lab/table.webp');
    this.load.image(Resource.GameTable.Arena.Library.Background, 'game_table/arena/library/background.webp');
    this.load.image(Resource.GameTable.Arena.Library.Table, 'game_table/arena/library/table.webp');
  }

  private loadParticles(): void {
    this.load.image(Resource.Particle.BaseCircle, 'particle/base_circle.webp');
    this.load.image(Resource.Particle.BaseSquare, 'particle/base_square.webp');
    this.load.atlas(Resource.Particle.Dust, 'particle/dust.webp', 'particle/dust.json');
    this.load.atlas(Resource.Particle.Flare, 'particle/flare.webp', 'particle/flare.json');
  }

  private loadCardImages(): void {
    this.load.image(Resource.Card.Image[CardId.Arcane1], 'card/image/arcane_1.webp');
    this.load.image(Resource.Card.Image[CardId.Arcane2], 'card/image/arcane_2.webp');
    this.load.image(Resource.Card.Image[CardId.Arcane3], 'card/image/arcane_3.webp');
    this.load.image(Resource.Card.Image[CardId.Arcane4], 'card/image/arcane_4.webp');
    this.load.image(Resource.Card.Image[CardId.Arcane5], 'card/image/arcane_5.webp');
    this.load.image(Resource.Card.Image[CardId.Arcane6], 'card/image/arcane_6.webp');
    this.load.image(Resource.Card.Image[CardId.Arcane7], 'card/image/arcane_7.webp');
    this.load.image(Resource.Card.Image[CardId.Arcane8], 'card/image/arcane_8.webp');
    this.load.image(Resource.Card.Image[CardId.Arcane9], 'card/image/arcane_9.webp');
    this.load.image(Resource.Card.Image[CardId.ArcaneHydrant], 'card/image/arcane_hydrant.webp');
    this.load.image(Resource.Card.Image[CardId.ArcaneShaking], 'card/image/arcane_shaking.webp');
    // this.load.image(Resource.Card.Image[CardId.ArcaneSoundboard], 'card/image/arcane_soundboard.webp');
    this.load.image(Resource.Card.Image[CardId.ArcaneTrashCanDiving], 'card/image/arcane_trash_can_diving.webp');
    this.load.image(Resource.Card.Image[CardId.ArcaneTreatHiding], 'card/image/arcane_treat_hiding.webp');

    this.load.image(Resource.Card.Image[CardId.Nature1], 'card/image/nature_1.webp');
    this.load.image(Resource.Card.Image[CardId.Nature2], 'card/image/nature_2.webp');
    this.load.image(Resource.Card.Image[CardId.Nature3], 'card/image/nature_3.webp');
    this.load.image(Resource.Card.Image[CardId.Nature4], 'card/image/nature_4.webp');
    this.load.image(Resource.Card.Image[CardId.Nature5], 'card/image/nature_5.webp');
    this.load.image(Resource.Card.Image[CardId.Nature6], 'card/image/nature_6.webp');
    this.load.image(Resource.Card.Image[CardId.Nature7], 'card/image/nature_7.webp');
    this.load.image(Resource.Card.Image[CardId.Nature8], 'card/image/nature_8.webp');
    this.load.image(Resource.Card.Image[CardId.Nature9], 'card/image/nature_9.webp');
    this.load.image(Resource.Card.Image[CardId.NatureHydrant], 'card/image/nature_hydrant.webp');
    this.load.image(Resource.Card.Image[CardId.NatureShaking], 'card/image/nature_shaking.webp');
    // this.load.image(Resource.Card.Image[CardId.NatureSoundboard], 'card/image/nature_soundboard.webp');
    this.load.image(Resource.Card.Image[CardId.NatureTrashCanDiving], 'card/image/nature_trash_can_diving.webp');
    this.load.image(Resource.Card.Image[CardId.NatureTreatHiding], 'card/image/nature_treat_hiding.webp');

    this.load.image(Resource.Card.Image[CardId.Filth1], 'card/image/filth_1.webp');
    this.load.image(Resource.Card.Image[CardId.Filth2], 'card/image/filth_2.webp');
    this.load.image(Resource.Card.Image[CardId.Filth3], 'card/image/filth_3.webp');
    this.load.image(Resource.Card.Image[CardId.Filth4], 'card/image/filth_4.webp');
    this.load.image(Resource.Card.Image[CardId.Filth5], 'card/image/filth_5.webp');
    this.load.image(Resource.Card.Image[CardId.Filth6], 'card/image/filth_6.webp');
    this.load.image(Resource.Card.Image[CardId.Filth7], 'card/image/filth_7.webp');
    this.load.image(Resource.Card.Image[CardId.Filth8], 'card/image/filth_8.webp');
    this.load.image(Resource.Card.Image[CardId.Filth9], 'card/image/filth_9.webp');
    this.load.image(Resource.Card.Image[CardId.FilthHydrant], 'card/image/filth_hydrant.webp');
    this.load.image(Resource.Card.Image[CardId.FilthShaking], 'card/image/filth_shaking.webp');
    // this.load.image(Resource.Card.Image[CardId.FilthSoundboard], 'card/image/filth_soundboard.webp');
    this.load.image(Resource.Card.Image[CardId.FilthTrashCanDiving], 'card/image/filth_trash_can_diving.webp');
    this.load.image(Resource.Card.Image[CardId.FilthTreatHiding], 'card/image/filth_treat_hiding.webp');

    this.load.image(Resource.Card.Image[CardId.Multimatter], 'card/image/multimatter.webp');
    this.load.image(Resource.Card.Image[CardId.BallOfFortune], 'card/image/ball_of_fortune.webp');
    this.load.image(Resource.Card.Image[CardId.BallOfCurse], 'card/image/ball_of_curse.webp');
    this.load.image(Resource.Card.Image[CardId.BallOfFate], 'card/image/ball_of_fate.webp');
    this.load.image(Resource.Card.Image[CardId.BallOfLuck], 'card/image/ball_of_luck.webp');
    this.load.image(Resource.Card.Image[CardId.BallOfWisdom], 'card/image/ball_of_wisdom.webp');
    this.load.image(Resource.Card.Image[CardId.BallOfWish], 'card/image/ball_of_wish.webp');
  }

  public loadCards(): void {
    this.load.image(Resource.Card.Silhouette, 'card/card_silhouette.webp');
    this.load.image(Resource.Card.BackSilhouette, 'card/card_back_silhouette.webp');
    this.load.image(Resource.Card.BackGlow, 'card/back_glow.webp');
    this.load.image(Resource.Card.Stone[CardElement.Arcane], 'card/stone/arcane.webp');
    this.load.image(Resource.Card.Stone[CardElement.Nature], 'card/stone/nature.webp');
    this.load.image(Resource.Card.Stone[CardElement.Filth], 'card/stone/filth.webp');
    this.load.image(Resource.Card.Stone[CardElement.Multimatter], 'card/stone/multimatter.webp');

    this.load.image(Resource.Card.ElementIcon[CardElement.Arcane], 'card/element_icon/arcane.webp');
    this.load.image(Resource.Card.ElementIcon[CardElement.Nature], 'card/element_icon/nature.webp');
    this.load.image(Resource.Card.ElementIcon[CardElement.Filth], 'card/element_icon/filth.webp');
    this.load.image(Resource.Card.ElementIcon[CardElement.Multimatter], 'card/element_icon/multimatter.webp');

    this.load.image(Resource.Card.Skin.Standard, 'card/skin/standard.webp');
    this.load.image(Resource.Card.Skin.Golden, 'card/skin/golden.webp');

    this.load.image(Resource.Card.Value.BallOfFortune, 'card/value_icon/ball_of_fortune.webp');
    this.load.image(Resource.Card.Value.Hydrant, 'card/value_icon/hydrant.webp');
    this.load.image(Resource.Card.Value.Soundboard, 'card/value_icon/soundboard.webp');
    this.load.image(Resource.Card.Value.Multimatter, 'card/value_icon/multidog.webp');
    this.load.image(Resource.Card.Value.Shaking, 'card/value_icon/shaking.webp');
    this.load.image(Resource.Card.Value.TrashCanDiving, 'card/value_icon/trash_can_diving.webp');
    this.load.image(Resource.Card.Value.TreatHiding, 'card/value_icon/treat_hiding.webp');

    this.load.image(Resource.Card.Effect.BackgroundContracted, 'card/effect/background_contracted.webp');
    this.load.image(Resource.Card.Effect.BackgroundExpanded, 'card/effect/background_expanded.webp');
    this.load.image(Resource.Card.Effect.Transform, 'card/effect/transform.webp');
    this.load.image(Resource.Card.Effect.Burn, 'card/effect/burn.webp');
    this.load.image(Resource.Card.Effect.Curse, 'card/effect/curse.webp');

    this.load.image(Resource.Card.Interaction.Overlay1, 'card/interaction/overlay_1.webp');
    this.load.image(Resource.Card.Interaction.Overlay2, 'card/interaction/overlay_2.webp');
    this.load.image(Resource.Card.Interaction.Overlay3, 'card/interaction/overlay_3.webp');
  }

  private loadCardBacks(): void {
    this.load.image(Resource.Card.Back.Arcane, 'card/back/arcane.webp');
    this.load.image(Resource.Card.Back.Filth, 'card/back/filth.webp');
    this.load.image(Resource.Card.Back.Nature, 'card/back/nature.webp');
    this.load.image(Resource.Card.Back.Standard, 'card/back/standard.webp');
    this.load.image(Resource.Card.Back.Fury, 'card/back/fury.webp');
    this.load.image(Resource.Card.Back.Bloom, 'card/back/bloom.webp');
  }

  private loadPlayerPanel(): void {
    this.load.image(Resource.PlayerPanel.BackgroundCenter, 'player_panel/background_center.webp');
    this.load.image(Resource.PlayerPanel.BackgroundSide, 'player_panel/background_side.webp');
    this.load.image(Resource.PlayerPanel.SkillCooldownBackground, 'player_panel/skill_cooldown_background.webp');
    this.load.image(Resource.PlayerPanel.SkillFrame, 'player_panel/skill_frame.webp');
    this.load.image(Resource.PlayerPanel.SkillSilhouetteWhite, 'player_panel/skill_silhouette_white.webp');
    this.load.image(Resource.PlayerPanel.SkillSilhouetteBlack, 'player_panel/skill_silhouette_black.webp');
    this.load.image(Resource.PlayerPanel.PanelPlaceholder, 'player_panel/panel_placeholder.webp');
    this.load.image(Resource.PlayerPanel.DefaultProfile, 'player_panel/default_profile.webp');
  }

  private loadSkills(): void {
    this.load.image(Resource.SkillRenderer.Background, 'skill_renderer/skill_bg.webp');
    this.load.image(Resource.Skill[ActiveSkillItemKey.ReduceStartCards], 'skill/reduce_start_cards.webp');
    this.load.image(
      Resource.Skill[ActiveSkillItemKey.SelectedPlayerDrawsCards],
      'skill/selected_player_draws_cards.webp',
    );
    this.load.image(
      Resource.Skill[ActiveSkillItemKey.TransformOwnCardIntoMultidog],
      'skill/transform_own_card_into_multidog.webp',
    );
    this.load.image(Resource.Skill[ActiveSkillItemKey.ReplaceOwnHand], 'skill/replace_own_hand.webp');
    this.load.image(Resource.Skill[ActiveSkillItemKey.PlayAnyCard], 'skill/play_any_card.webp');
    this.load.image(
      Resource.Skill[ActiveSkillItemKey.TransformRandomOpponentsCardIntoSelected],
      'skill/transform_random_opponents_card_into_selected.webp',
    );
    this.load.image(Resource.Skill[ActiveSkillItemKey.DiscardRandomCards], 'skill/discard_random_cards.webp');
  }

  private loadTimer(): void {
    this.load.image(Resource.Timer.Background, 'timer/timer_bg.webp');
  }
}
