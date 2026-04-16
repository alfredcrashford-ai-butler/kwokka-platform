import { KwokkaSoundSfxConfig } from './config';

export class KwokkaSfx {
  private gainNode: GainNode;
  private source: AudioBufferSourceNode;
  private eventListeners: Record<string, (() => any)[]> = {};

  public constructor(
    private buffer: AudioBuffer,
    private context: AudioContext,
    private targetNode: AudioNode,
    public readonly sfxConfig: KwokkaSoundSfxConfig,
  ) {
    this.source = this.context.createBufferSource();
    this.gainNode = this.context.createGain();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode).connect(this.targetNode);
    this.source.loop = sfxConfig.loop || false;
    this.setGain(sfxConfig.gain || 1);
  }

  public play(): void {
    this.source.start();
  }

  public stop(): void {
    this.source.stop();
  }

  public setGain(gain: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = gain;
    }
  }

  public fade(gain: number, durationMs: number): void {
    // duration must be in seconds o_0
    const duration = durationMs / 1000;
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(gain, this.context.currentTime + duration);
  }

  public on(event: 'ended', fn: () => any): void {
    this.addEventListener(event, fn);
  }

  public once(event: 'ended', fn: () => any): void {
    const eventListener = () => {
      this.removeEventListener(event, eventListener);
      fn();
    };
    this.addEventListener(event, eventListener);
  }

  public off(event: 'ended', fn?: () => any): void {
    if (fn) {
      this.removeEventListener(event, fn);
    } else {
      this.removeAllEventListeners(event);
    }
  }

  private addEventListener(event: string, fn: () => any): void {
    this.eventListeners[event] ||= [];
    this.eventListeners[event].push(fn);
    this.source.addEventListener(event, fn);
  }

  private removeEventListener(event: string, fn: () => any): void {
    this.eventListeners[event] ||= [];
    this.eventListeners[event] = this.eventListeners[event].filter(el => el !== fn);
    this.source.removeEventListener(event, fn);
  }

  private removeAllEventListeners(event: string): void {
    this.eventListeners[event] ||= [];
    this.eventListeners[event].forEach(fn => this.removeEventListener(event, fn));
  }
}
