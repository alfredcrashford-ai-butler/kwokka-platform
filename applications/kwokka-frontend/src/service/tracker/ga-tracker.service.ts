import { inject, injectable } from 'inversify';

import { UserEntity } from '@/entity/user.entity';
import { injectScript } from '@/utils/inject';
import { ConfigService } from '@/service/config/config.service';
import { TrackerService } from '@/service/tracker/tracker.service';

const ANALYTICS_SCRIPT = 'https://www.googletagmanager.com/gtag/js?id=';

class GAInitializationError extends Error {
  public constructor(message: string) {
    super(`[GaTrackerService] Could not initialize: ${message}`);
  }
}

@injectable()
export class GaTrackerServiceImpl extends TrackerService {
  private resourceId: string;

  public constructor(@inject(ConfigService) private configService: ConfigService) {
    super();

    const config = this.configService.frontendConfig;

    if (!config.trackingConfig.ga || !config.trackingConfig.ga.resourseId) {
      throw new GAInitializationError('config error');
    }
    this.resourceId = config.trackingConfig.ga.resourseId;

    this.createGATracker();

    this.injectGAScript();
  }

  private createGATracker() {
    // gtag setup taken from https://analytics.google.com/analytics/web

    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function (...args) {
      // @ts-ignore
      window.dataLayer.push(...args);
    };
    this.handleGa('js', new Date());
    this.handleGa('config', this.resourceId);
  }

  private injectGAScript() {
    const url = `${ANALYTICS_SCRIPT}${this.resourceId}`;
    injectScript(url);
  }

  private handleGa(command: string, ...options: any[]) {
    // @ts-ignore
    window.gtag(command, ...options);
  }

  public pageView(page: string, location: string) {
    this.handleGa('set', { page, location });
    this.handleGa('event', 'page_view', { page, location });
  }

  public event(category: string, name: string, params: object = {}) {
    this.handleGa('event', name, { ...params, category });
  }

  public setUser(user: UserEntity) {
    this.handleGa('set', { user_id: user.id, user_email: user.email });
  }
}
