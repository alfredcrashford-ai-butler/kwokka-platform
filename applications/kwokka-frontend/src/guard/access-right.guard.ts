import { inject, injectable, unmanaged } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { PersistenceService } from '@/service/persistence/persistence.service';
import { TrackerService } from '@/service/tracker/tracker.service';
import { AccessService } from '@/service/access/access.service';
import type { Guard } from './guard';

@injectable()
export class AccessRightGuard implements Guard {
  public constructor(
    @inject(PersistenceService) private persistenceService: PersistenceService,
    @inject(TrackerService) private trackerService: TrackerService,
    @inject(AccessService) private accessService: AccessService,
    @unmanaged() private rights: string[] = [],
  ) {}

  public withAccessRight(right: string): AccessRightGuard {
    return new AccessRightGuard(this.persistenceService, this.trackerService, this.accessService, [
      ...this.rights,
      right,
    ]);
  }

  public perform = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const hasAllRights = this.rights.every((right) => this.accessService.hasRight(right));
    if (hasAllRights) {
      next();
    } else {
      next('main');
    }
  };
}
