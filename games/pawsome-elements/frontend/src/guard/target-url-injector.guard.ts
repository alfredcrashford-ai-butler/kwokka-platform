import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { PersistenceKey, PersistenceService } from '@/service';
import type { Guard } from './guard';

@injectable()
export class TargetUrlInjectorGuard implements Guard {
  public constructor(@inject(PersistenceService) private persistence: PersistenceService) {}

  public perform = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const targetUrl = this.persistence.loadValue(PersistenceKey.TargetUrl);
    this.persistence.clearValue(PersistenceKey.TargetUrl);

    if (targetUrl && targetUrl !== to.fullPath) {
      next(targetUrl);
    } else {
      next();
    }
  };
}
