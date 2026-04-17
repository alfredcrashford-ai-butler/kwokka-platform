import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { ErrorTrackerService, KwokkaService, LoggerService, TrackerService } from '@/service';
import type { Guard } from './guard';

@injectable()
export class TrackingGuard implements Guard {
  private readonly logger: LoggerService;

  public constructor(
    @inject(LoggerService) logger: LoggerService,
    @inject(ErrorTrackerService) private errorTrackerService: ErrorTrackerService,
    @inject(KwokkaService) private kwokkaService: KwokkaService,
    @inject(TrackerService) private trackerService: TrackerService,
  ) {
    this.logger = logger.withPrefix('#TrackingGuard:');
  }

  public perform = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
      this.trackerService.setUser(this.kwokkaService?.client?.profile?.myProfile);
    } catch (e: any) {
      this.logger.error('error occured in setUser', e);
      this.errorTrackerService.captureError(e);
    } finally {
      next();
    }
  };
}
