import { inject, injectable } from 'inversify';
import type { ProfileEntity } from '@kwokka/entities';
import { LoggerService } from '@/service/logger';
import { ConfigService } from '@/service/config';
import { injectScript } from '@/util';
import { TrackerWorker } from './tracker-worker';
import type { TrackingCategory, TrackingEvent } from '../tracking-config';

const ANALYTICS_SCRIPT = 'https://app.rybbit.io/api/script.js';

@injectable()
export class RybbitTrackerWorker extends TrackerWorker {
  private logger: LoggerService;
  private siteId: string;
  private createTrackerPromise: Promise<void>;

  public constructor(
    @inject(LoggerService) logger: LoggerService,
    @inject(ConfigService) private configService: ConfigService,
  ) {
    super();
    this.logger = logger.withPrefix('#RybbitTrackerWorker:');
  }

  public async setup(): Promise<void> {
    this.logger.log('Rybbit initialization started.');

    const config = this.configService.frontendConfig;

    if (!config.rybbit || !config.rybbit.siteId) {
      throw new RangeError('Site id is not provided for RybbitTrackerWorker');
    }
    this.siteId = config.rybbit.siteId;

    this.createTrackerPromise = this.createTracker();
    await this.createTrackerPromise;

    this.logger.log('initialized!');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pageView(page: string, location: string): void {
    try {
      this.createTrackerPromise.then(() => {
        // @ts-ignore
        window.rybbit.pageview();
      });
    } catch (e: any) {
      this.logger.error(`Failed to set user, error: `, e);
    }
  }

  public event(category: TrackingCategory, name: TrackingEvent, params: object = {}): void {
    try {
      this.createTrackerPromise.then(() => {
        // @ts-ignore
        window.rybbit.event(name, { ...params, category });
      });
    } catch (e: any) {
      this.logger.error(`Failed to set user, error: `, e);
    }
  }

  public setUser(user: ProfileEntity): void {
    try {
      this.createTrackerPromise.then(() => {
        // @ts-ignore
        window.rybbit.identify(user.accountId);
      });
    } catch (e: any) {
      this.logger.error(`Failed to set user, error: `, e);
    }
  }

  private async createTracker(): Promise<void> {
    await injectScript(ANALYTICS_SCRIPT, {
      defer: true,
      dataset: {
        siteId: this.siteId,
        trackSpa: false,
        trackQuery: false,
      },
    });
  }
}
