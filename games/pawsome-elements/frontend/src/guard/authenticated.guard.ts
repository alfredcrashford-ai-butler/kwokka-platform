import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { KwokkaService } from '@/service';
import { RouteName } from '@/app/route-name';
import type { Guard } from './guard';

@injectable()
export class AuthenticatedGuard implements Guard {
  public constructor(@inject(KwokkaService) private kwokkaService: KwokkaService) {}

  public perform = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (this.kwokkaService.client.isAuthenticated) {
      next();
    } else {
      next({ name: RouteName.Auth });
    }
  };
}
