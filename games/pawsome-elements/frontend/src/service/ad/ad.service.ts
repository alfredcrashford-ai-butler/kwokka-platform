import { inject, injectable } from 'inversify';
import { injectScript, injectScriptWithContent } from '@/util';
import { LoggerService } from '../logger';
import { ConfigService } from '../config';

const AD_SCRIPT = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

export enum AdType {
  Reward = 'reward',
  Next = 'next',
}

export enum AdResult {
  Viewed = 'viewed',
  Other = 'other',
}

@injectable()
export class AdService {
  private logger: LoggerService;

  public constructor(
    @inject(LoggerService) logger: LoggerService,
    @inject(ConfigService) private configService: ConfigService,
  ) {
    this.logger = logger.withPrefix('#AdService:');
  }

  public async setup(): Promise<void> {
    this.logger.log('initialization started.');

    if (!this.configService.frontendConfig.ad) {
      throw new RangeError('config is not provided.');
    }

    await this.injectAdScripts();

    this.logger.log('initialized!');
  }

  public configure(config: { isSoundEnabled: boolean }): void {
    (window as any).adConfig({
      sound: config.isSoundEnabled ? 'on' : 'off',
      preloadAdBreaks: 'on',
    });
  }

  public show(params: { type: AdType; name?: string }): Promise<AdResult> {
    return new Promise((resolve, reject) => {
      try {
        (window as any).adBreak({
          type: params.type,
          name: params.name,
          adBreakDone: (placementInfo: { breakStatus: string }) => {
            if (placementInfo.breakStatus === 'viewed') {
              return resolve(AdResult.Viewed);
            }

            return resolve(AdResult.Other);
          },
        });
      } catch (e: unknown) {
        reject(e);
      }
    });
  }

  private async injectAdScripts(): Promise<void> {
    await injectScriptWithContent(`
      window.adsbygoogle = window.adsbygoogle || [];
      var adBreak = adConfig = function(o) {adsbygoogle.push(o);}
    `);

    await injectScript(AD_SCRIPT, {
      async: true,
      id: 'google-ad-script',
      crossorigin: 'anonymous',
      'data-adbreak-test': this.configService.isProduction ? 'on' : 'off',
      'data-ad-client': this.configService.frontendConfig.ad.client,
      'data-ad-frequency-hint': this.configService.frontendConfig.ad.frequency,
    });
  }
}
