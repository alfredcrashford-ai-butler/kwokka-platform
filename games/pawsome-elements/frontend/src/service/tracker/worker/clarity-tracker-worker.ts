import type { ProfileEntity } from '@kwokka/entities';
import { inject, injectable } from 'inversify';
import Clarity from '@microsoft/clarity';
import { ConfigService, LoggerService } from '@/service';
import { TrackerWorker } from './tracker-worker';
import { TrackingCategory, TrackingEvent } from '../tracking-config';

@injectable()
export class ClarityTrackerWorker extends TrackerWorker {
  private readonly logger: LoggerService;
  private user: ProfileEntity;

  public constructor(
    @inject(LoggerService) logger: LoggerService,
    @inject(ConfigService) private configService: ConfigService,
  ) {
    super();
    this.logger = logger.withPrefix('#ClarityTrackerWorker:');
  }

  public setup(): void {
    this.logger.log('Clarity initialization started.');
    Clarity.init(this.configService.frontendConfig.clarity.projectId);
    this.logger.log('initialized!');
  }

  public event(category: TrackingCategory, name: TrackingEvent): void {
    Clarity.event(`${category}/${name}`);
  }

  public pageView(page: string): void {
    Clarity.event(`${TrackingCategory.PageView}/${page}`);
    if (this.user) {
      Clarity.identify(this.user.id, null, page);
    }
  }

  public setUser(user: ProfileEntity): void {
    this.user = user;
    Clarity.identify(user.id, null);
  }
}
