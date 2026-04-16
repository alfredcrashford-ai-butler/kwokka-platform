import { UuidUtil } from '@kwokka/utils';
import { KwokkaSoundConfig, KwokkaSoundSfxConfig } from './config';
import { KwokkaSoundSettings } from './settings';
import { KwokkaSfx } from './kwokka-sfx';

export class KwokkaSound {
  private interactionListener?: () => void;
  private windowBlurListener?: () => void;
  private windowFocusListener?: () => void;
  private isActive: boolean = false;
  private suspendedSfx: { config: KwokkaSoundSfxConfig; resolve: (sfx: KwokkaSfx) => any }[] = [];
  private context: AudioContext;
  private masterGainNode: GainNode;
  private windowActiveMuteNode: GainNode;
  private buffers: Record<string, Promise<AudioBuffer>> = {};
  private _settings: KwokkaSoundSettings;
  private config: KwokkaSoundConfig;
  private activeSfx: Record<string, KwokkaSfx> = {};
  private groupGainNodes: Record<string, GainNode> = {};
  private readonly defaultSettings: KwokkaSoundSettings = {
    mute: false,
    masterGain: 1,
    groupGain: {},
  };

  public get settings(): KwokkaSoundSettings {
    return this._settings;
  }

  public constructor(config: KwokkaSoundConfig) {
    this.verifyConfig(config);
    this.config = config;
    this.context = new AudioContext();
    this.windowActiveMuteNode = this.context.createGain();
    this.windowActiveMuteNode.connect(this.context.destination);
    this.windowActiveMuteNode.gain.value = 1;
    this.masterGainNode = this.context.createGain();
    this.masterGainNode.connect(this.windowActiveMuteNode);
    this._settings = this.defaultSettings;
    this.masterGainNode.gain.value = this.defaultSettings.masterGain;
    this.settings.groupGain = this.getDefaultGroupGain(this.config);
    this.setupGroupGains();
    this.applySettings();
    this.preload(this.config.sfx.filter((el) => el.preload).map((el) => el.id));
  }

  public setup(): void {
    this.interactionListener = () => {
      if (this.isActive) {
        document.body.removeEventListener('click', this.interactionListener!);
        document.body.removeEventListener('keydown', this.interactionListener!);
        return;
      }

      this.isActive = true;
      this.suspendedSfx.forEach(async ({ config, resolve }) => resolve(await this.playFromConfig(config)));
      this.suspendedSfx = [];
    };

    document.body.addEventListener('click', this.interactionListener);
    document.body.addEventListener('keydown', this.interactionListener);

    this.windowBlurListener = () => this.windowActiveMuteNode.gain.value = 0;
    window.addEventListener('blur', this.windowBlurListener);

    this.windowFocusListener = () => this.windowActiveMuteNode.gain.value = 1;
    window.addEventListener('focus', this.windowFocusListener);
  }

  public preload(ids: string[]): void {
    const urls = ids.map((id) => this.config.sfx.find((el) => el.id === id)?.src).filter(Boolean) as string[];
    if (urls.length < ids.length) {
      throw new Error('KwokkaSound: some ids are missing in the config and can not be preloaded');
    }
    urls.forEach((url) => this.getAudioBuffer(url));
  }

  public play(id: string): Promise<KwokkaSfx> | null {
    const config = this.config.sfx.find((el) => el.id === id);
    if (!config) {
      throw new Error(`KwokkaSound: sfx with id "${id}" is not provided in the config and can't be played`);
    }

    if (!this.isActive) {
      if (config.suspend) {
        return new Promise((resolve) => this.suspendedSfx.push({ config, resolve }));
      }
      return null;
    }

    return this.playFromConfig(config);
  }

  public setSettings(settings: KwokkaSoundSettings): void {
    this._settings = settings;
    this.applySettings();
  }

  public setMasterGain(gain: number): void {
    this.settings.masterGain = gain;
    this.applySettings();
  }

  public setGroupGain(group: string, gain: number): void {
    this.settings.groupGain[group] = gain;
    this.applySettings();
  }

  public mute(): void {
    this.settings.mute = true;
    this.applySettings();
  }

  public unmute(): void {
    this.settings.mute = false;
    this.applySettings();
  }

  public teardown(): void {
    document.body.removeEventListener('click', this.interactionListener!);
    document.body.removeEventListener('keydown', this.interactionListener!);
    window.removeEventListener('blur', this.windowBlurListener!);
    window.removeEventListener('focus', this.windowFocusListener!);
    this.suspendedSfx = [];
    this.buffers = {};
  }

  private applySettings(): void {
    if (this.settings.mute) {
      this.masterGainNode.gain.value = 0;
    } else {
      this.masterGainNode.gain.value = this.settings.masterGain;
    }

    Object.entries(this.groupGainNodes).forEach(([key, node]) => (node.gain.value = this.settings.groupGain[key] || 1));
  }

  private async playFromConfig(config: KwokkaSoundSfxConfig): Promise<KwokkaSfx> {
    const buffer = await this.getAudioBuffer(config.src);
    const sfx = new KwokkaSfx(buffer, this.context, this.groupGainNodes[config.group], config);
    const uuid = UuidUtil.generate(8);
    this.activeSfx[uuid] = sfx;
    sfx.once('ended', () => delete this.activeSfx[uuid]);
    sfx.play();
    return sfx;
  }

  private async getAudioBuffer(url: string): Promise<AudioBuffer> {
    let buffer = this.buffers[url];
    if (!buffer) {
      buffer = this.fetchAudioBuffer(url).then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer));
      this.buffers[url] = buffer;
    }
    return buffer;
  }

  private async fetchAudioBuffer(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return buffer;
  }

  private verifyConfig(config: KwokkaSoundConfig): void {
    const ids = config.sfx.map((el) => el.id);
    const uniqueIds = Array.from(new Set(ids));
    if (ids.length !== uniqueIds.length) {
      const repeatingIds = Array.from(new Set(ids.filter((id) => ids.filter((el) => el === id).length > 1)));
      throw new Error(`KwokkaSound: config is invalid, because ids are repeating (${repeatingIds})`);
    }

    if (config.sfx.find((el) => !el.group)) {
      throw new Error("KwokkaSound: config is invalid, because some sfx'es miss group");
    }

    if (config.sfx.find((el) => el.gain && (el.gain < 0 || typeof el.gain !== 'number'))) {
      throw new Error(
        "KwokkaSound: config is invalid, because some sfx'es have incorrect gain (less 0 or non-numeric)",
      );
    }
  }

  private getDefaultGroupGain(config: KwokkaSoundConfig): Record<string, number> {
    const gain: Record<string, number> = {};
    const groups = Array.from(new Set(config.sfx.map((el) => el.group)));
    groups.forEach((group) => (gain[group] = 1));
    return gain;
  }

  private setupGroupGains(): void {
    const groups = Object.keys(this.settings.groupGain);
    groups.forEach((group) => {
      this.groupGainNodes[group] = this.context.createGain();
      this.groupGainNodes[group].connect(this.masterGainNode);
    });
  }
}
