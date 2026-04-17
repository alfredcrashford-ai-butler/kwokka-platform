import { inject, injectable } from 'inversify';
import type { ProfileEntity } from '@kwokka/entities';
import { TrackerWorker } from './tracker-worker';
import { LoggerService } from '@/service/logger';
import type { TrackingCategory, TrackingEvent } from '../tracking-config';

@injectable()
export class DebugTrackerWorker extends TrackerWorker {
  private logger: LoggerService;

  public constructor(@inject(LoggerService) logger: LoggerService) {
    super();
    this.logger = logger.withPrefix('#DebugTrackerWorker:');
  }

  public setup(): void {
    this.logger.log('initialized!');
  }

  public event(category: TrackingCategory, name: TrackingEvent, params?: object): void {
    this.logger.log(`category: ${category}, event: ${name}, params: ${JSON.stringify(params || {})}`);
  }

  public pageView(page: string, location: string): void {
    this.logger.log(`pageView: ${page}, location: ${location}`);
  }

  public setUser(user: ProfileEntity): void {
    this.logger.log(`setUser: ${user.id}`);
  }
}
