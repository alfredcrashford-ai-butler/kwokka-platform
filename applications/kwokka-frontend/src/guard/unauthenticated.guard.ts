import { inject, injectable } from 'inversify';
import { type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import { AccessService } from '@/service/access/access.service';
import type { Guard } from './guard';

@injectable()
export class UnauthenticatedGuard implements Guard {
  public constructor(@inject(AccessService) private accessService: AccessService) {}

  public perform = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const accessToken = this.accessService.getAccessToken();
    if (!accessToken) {
      next();
    } else {
      next('main');
    }
  };
}
