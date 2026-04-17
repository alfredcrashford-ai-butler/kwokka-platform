import { inject, injectable } from 'inversify';
import type { ProfileEntity } from '@kwokka/entities';
import { LoggerService } from '@/service/logger';
import { ConfigService } from '@/service/config';
import { injectScript, injectScriptWithContent } from '@/util';
import { CookieService } from '@/service/cookie';
import { TrackerWorker } from './tracker-worker';
import type { TrackingCategory, TrackingEvent } from '../tracking-config';

const ANALYTICS_SCRIPT = 'https://www.googletagmanager.com/gtag/js?id=';

@injectable()
export class GaTrackerWorker extends TrackerWorker {
  private logger: LoggerService;
  private resourceId: string;

  public constructor(
    @inject(LoggerService) logger: LoggerService,
    @inject(ConfigService) private configService: ConfigService,
    @inject(CookieService) private cookieService: CookieService,
  ) {
    super();
    this.logger = logger.withPrefix('#GaTrackerWorker:');
  }

  public async setup(): Promise<void> {
    this.logger.log('GA initialization started.');

    const config = this.configService.frontendConfig;

    if (!config.ga || !config.ga.resourseId) {
      throw new RangeError('Resource id is not provided for GaTrackerWorker');
    }
    this.resourceId = config.ga.resourseId;

    await this.createGATracker();

    this.injectGAScript();

    this.logger.log('initialized!');
  }

  public pageView(page: string, location: string): void {
    this.handleGa('set', { page, location });
    this.handleGa('event', 'page_view', { page, location });
  }

  public event(category: TrackingCategory, name: TrackingEvent, params: object = {}): void {
    this.handleGa('event', name, { ...params, category });
  }

  public setUser(user: ProfileEntity): void {
    this.handleGa('set', { user_id: user.accountId });
  }

  private async createGATracker(): Promise<void> {
    // const consent = await this.cookieService.getDefaultGtagConsent();
    // gtag('consent', 'default', ${JSON.stringify(consent)});
    // gtag setup taken from https://analytics.google.com/analytics/web
    injectScriptWithContent(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.resourceId}');
    `);

    // this.cookieService.setConsentHandler(async () =>
    //   this.handleGa('consent', 'update', await this.cookieService.getGtagConsent()),
    // );
  }

  private injectGAScript(): void {
    const url = `${ANALYTICS_SCRIPT}${this.resourceId}`;
    injectScript(url, { async: true });
  }

  private handleGa(command: string, ...options: any[]): void {
    this.logger.log('handleGA', command);
    // @ts-ignore
    window.gtag(command, ...options);
  }
}
