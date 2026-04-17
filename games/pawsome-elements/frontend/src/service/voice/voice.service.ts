import { inject, injectable } from 'inversify';
import { SoundService } from '../sound';
import type { KwokkaSfx } from '@kwokka/sound';

export enum ToneToken {
  Exclamation = 'exclamation',
  Question = 'question',
  Ellipsis = 'ellipsis',
  Normal = 'normal',
}

export enum Voice {
  Narrator = 'narrator',
}

@injectable()
export class VoiceService {
  private currentSfx: KwokkaSfx;

  private voiceToneMap: {
    [key in Voice]: {
      [key in ToneToken]: () => Promise<KwokkaSfx>;
    };
  };

  public constructor(@inject(SoundService) private soundService: SoundService) {
    this.voiceToneMap = {
      [Voice.Narrator]: {
        [ToneToken.Exclamation]: () => this.soundService.playNarratorVoiceExclamation(),
        [ToneToken.Question]: () => this.soundService.playNarratorVoiceQuestion(),
        [ToneToken.Ellipsis]: () => this.soundService.playNarratorVoiceMystery(),
        [ToneToken.Normal]: () => this.soundService.playNarratorVoiceNeutral(),
      },
    };
  }

  public async playNarratorVoice(sentence: string): Promise<void> {
    this.stopCurrentVoice();
    this.currentSfx = await this.playVoice(Voice.Narrator, sentence);
  }

  public stopCurrentVoice(): void {
    this.currentSfx?.stop();
  }

  private transformSentenceToToken(sentence: string): ToneToken {
    if (sentence.includes('!')) {
      return ToneToken.Exclamation;
    } else if (sentence.includes('?')) {
      return ToneToken.Question;
    } else if (sentence.includes('...')) {
      return ToneToken.Ellipsis;
    } else {
      return ToneToken.Normal;
    }
  }

  private async playVoice(voice: Voice, sentence: string): Promise<KwokkaSfx> {
    const token = this.transformSentenceToToken(sentence);
    const voiceMap = this.voiceToneMap[voice];

    if (!voiceMap) {
      throw new Error(`No tone map found for voice: ${voice}`);
    }

    const playSound = voiceMap[token];
    if (playSound) {
      return await playSound();
    } else {
      throw new Error(`No sound method found for tone: ${token}`);
    }
  }
}
