import { inject, injectable } from 'inversify';
import { SoundConfig, SoundGroup, SoundId } from './sound-config';
import { FunctionUtil, RandomUtil } from '@kwokka/utils';
import { KwokkaSound, type KwokkaSoundSettings, KwokkaSfx } from '@kwokka/sound';
import { PersistenceKey, PersistenceService } from '../persistence';

enum MusicName {
  Menu = 'menu',
  Game = 'game',
  GameEnd = 'game_end',
}

const FADE_DURATION_MS = 3000;

@injectable()
export class SoundService {
  private readonly kwokkaSound: KwokkaSound;
  private readonly activeMusicLoops: Record<MusicName, Promise<KwokkaSfx>> = {
    [MusicName.Menu]: null,
    [MusicName.Game]: null,
    [MusicName.GameEnd]: null,
  };
  private readonly activeMusicLoopFlags: Record<MusicName, boolean> = {
    [MusicName.Menu]: false,
    [MusicName.Game]: false,
    [MusicName.GameEnd]: false,
  };
  private readonly defaultSettings: KwokkaSoundSettings = {
    mute: false,
    masterGain: 0.75,
    groupGain: {
      [SoundGroup.Music]: 0.5,
      [SoundGroup.Sfx]: 1,
      [SoundGroup.Voice]: 0.75,
    },
  };

  public constructor(@inject(PersistenceService) private persistence: PersistenceService) {
    this.kwokkaSound = new KwokkaSound(SoundConfig);
    this.kwokkaSound.setSettings(this.settings);
  }

  public get settings(): KwokkaSoundSettings {
    const settingsStr = this.persistence.loadValue(PersistenceKey.AudioSettings);
    let settings: KwokkaSoundSettings;
    if (!settingsStr) {
      settings = this.defaultSettings;
      this.saveSettings(settings);
    } else {
      settings = JSON.parse(settingsStr);
    }
    return settings;
  }

  public setup(): void {
    return this.kwokkaSound.setup();
  }

  public mute(): void {
    return this.kwokkaSound.mute();
  }

  public unmute(): void {
    return this.kwokkaSound.unmute();
  }

  public setSettings(settings: KwokkaSoundSettings): void {
    return this.kwokkaSound.setSettings(settings);
  }

  public setGroupGain(group: string, gain: number): void {
    this.kwokkaSound.setGroupGain(group, gain);
  }

  public setMasterGain(gain: number): void {
    this.kwokkaSound.setMasterGain(gain);
  }

  public play(id: string): Promise<KwokkaSfx> | null {
    return this.kwokkaSound.play(id);
  }

  public teardown(): void {
    return this.kwokkaSound.teardown();
  }

  public playUiHover(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.UiHover1]));
  }

  public playUiSelect(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.UiSelect1, SoundId.UiSelect2]));
  }

  public playUiFail(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(SoundId.UiFail);
  }

  public playCardPlay(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.CardPlay1, SoundId.CardPlay2]));
  }

  public playCardDraw(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.CardDraw1]));
  }

  public playBubblePop(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(SoundId.BubblePop);
  }

  public playBubbles(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(SoundId.Bubbles);
  }

  public playPlayerRoomJoin(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.PlayerRoomJoin1, SoundId.PlayerRoomJoin2]));
  }

  public playPlayerRoomLeave(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.PlayerRoomLeave1]));
  }

  public playGameStart(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.GameStart1]));
  }

  public playCardPlayFail(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.CardPlayFail1]));
  }

  public playSkillEquip(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.SkillEquip]));
  }

  public playSkillPlay(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(
      RandomUtil.randomInArray([SoundId.SkillPlay1, SoundId.SkillPlay2, SoundId.SkillPlay3, SoundId.SkillPlay4]),
    );
  }

  public playNarratorVoiceQuestion(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(
      RandomUtil.randomInArray([
        SoundId.VoiceNarratorQuestion1,
        SoundId.VoiceNarratorQuestion2,
        SoundId.VoiceNarratorQuestion3,
      ]),
    );
  }

  public playNarratorVoiceExclamation(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(
      RandomUtil.randomInArray([
        SoundId.VoiceNarratorExclamation2,
        SoundId.VoiceNarratorExclamation3,
        SoundId.VoiceNarratorExclamation5,
      ]),
    );
  }

  public playNarratorVoiceMystery(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(
      RandomUtil.randomInArray([
        SoundId.VoiceNarratorMystery1,
        SoundId.VoiceNarratorMystery3,
        SoundId.VoiceNarratorMystery4,
      ]),
    );
  }

  public playNarratorVoiceNeutral(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(
      RandomUtil.randomInArray([
        SoundId.VoiceNarratorNeutral1,
        SoundId.VoiceNarratorNeutral2,
        SoundId.VoiceNarratorNeutral3,
        SoundId.VoiceNarratorNeutral4,
        SoundId.VoiceNarratorNeutral5,
        SoundId.VoiceNarratorNeutral8,
        SoundId.VoiceNarratorNeutral13,
      ]),
    );
  }

  public playSkillUnlock(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(SoundId.SkillUnlock);
  }

  public playMagicOverlay(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(SoundId.MagicOverlay);
  }

  public playMenuMusic(): Promise<void> {
    return this.playMusic(
      MusicName.Menu,
      [SoundId.MainMenuTheme1, SoundId.MainMenuTheme2, SoundId.MainMenuTheme3],
      FADE_DURATION_MS,
    );
  }

  public playGameMusic(): Promise<void> {
    return this.playMusic(
      MusicName.Game,
      [
        SoundId.GameTheme1,
        SoundId.GameTheme2,
        SoundId.GameTheme3,
        SoundId.GameTheme4,
        SoundId.GameTheme5,
        SoundId.GameTheme6,
        SoundId.GameTheme7,
      ],
      0,
    );
  }

  public playGameEndMusic(): Promise<void> {
    return this.playMusic(MusicName.GameEnd, [SoundId.GameEndLoop], 0);
  }

  public playGameEnd(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(SoundId.GameEnd);
  }

  public playBookOpen(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(SoundId.BookOpen);
  }

  public playBookClose(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(SoundId.BookClose);
  }

  public playBookPage(): Promise<KwokkaSfx> {
    return this.kwokkaSound.play(RandomUtil.randomInArray([SoundId.BookPage1, SoundId.BookPage2]));
  }

  public playCardEffect = FunctionUtil.throttle(() => this.kwokkaSound.play(SoundId.CardEffectApply), 100);

  public saveCurrentSettings(): void {
    this.saveSettings(this.kwokkaSound.settings);
  }

  public fadeOutAllMusic(durationMs: number = FADE_DURATION_MS): void {
    Object.values(MusicName).forEach((el) => this.fadeOutMusic(el, durationMs));
  }

  public fadeOutGameMusic(): void {
    this.fadeOutMusic(MusicName.Game, FADE_DURATION_MS);
    this.fadeOutMusic(MusicName.GameEnd, FADE_DURATION_MS);
  }

  private saveSettings(settings: KwokkaSoundSettings): void {
    this.persistence.storeValue(PersistenceKey.AudioSettings, JSON.stringify(settings));
  }

  private playMusic(musicName: MusicName, ids: SoundId[], fadeOutMs: number): Promise<void> {
    if (this.activeMusicLoopFlags[musicName]) {
      return;
    }

    this.activeMusicLoopFlags[musicName] = true;
    Object.values(MusicName)
      .filter((el) => el !== musicName)
      .forEach((el) => this.fadeOutMusic(el, fadeOutMs));
    return this.playRandomLoop(ids, musicName);
  }

  private async fadeOutMusic(musicName: MusicName, durationMs: number): Promise<void> {
    if (!this.activeMusicLoops[musicName]) {
      return;
    }

    const sfx = await this.activeMusicLoops[musicName];
    if (!sfx) {
      return;
    }

    sfx.off('ended');
    if (!durationMs) {
      sfx.stop();
      this.activeMusicLoops[musicName] = null;
      this.activeMusicLoopFlags[musicName] = false;
      return;
    }

    sfx.fade(0, durationMs);
    sfx.once('ended', () => {
      this.activeMusicLoops[musicName] = null;
      this.activeMusicLoopFlags[musicName] = false;
    });
    setTimeout(() => sfx.stop(), durationMs);
  }

  private async playRandomLoop(allIds: string[], musicName: MusicName): Promise<void> {
    // need to use inline function to make sure ids are always full array of initial ids
    const fn = async (ids: string[]) => {
      const sfxPromise = this.play(RandomUtil.randomInArray(ids));
      this.activeMusicLoops[musicName] = sfxPromise;
      const sfx = await sfxPromise;
      const endedListener = () => fn(allIds.filter((id) => id !== sfx.sfxConfig.id));
      sfx.once('ended', endedListener);
    };

    return fn(allIds);
  }
}
