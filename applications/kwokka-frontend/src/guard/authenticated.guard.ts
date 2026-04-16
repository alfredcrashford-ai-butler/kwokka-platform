import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { PersistenceService } from '@/service/persistence/persistence.service';
import { PersistenceKey } from '@/service/persistence/persistence-key';
import { AccessService } from '@/service/access/access.service';
import type { Guard } from './guard';

@injectable()
export class AuthenticatedGuard implements Guard {
  public constructor(
    @inject(PersistenceService) private persistenceService: PersistenceService,
    @inject(AccessService) private accessService: AccessService,
  ) {}

  public perform = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const accessToken = this.accessService.getAccessToken();
    if (accessToken) {
      this.redirect(next);
    } else {
      this.saveAfterSigninUrl(to);
      next('auth');
    }
  };

  private redirect(next: (path?: string) => void) {
    const afterLoginUrl = this.getAfterLoginUrl();
    if (afterLoginUrl) {
      next(afterLoginUrl);
    } else {
      next();
    }
  }

  private saveAfterSigninUrl(route: RouteLocationNormalized) {
    const path = route.fullPath;
    if (path !== '/') {
      this.persistenceService.storeValue(PersistenceKey.AfterSigninUrl, path);
    }
  }

  private getAfterLoginUrl(): string {
    const url = this.persistenceService.loadValue(PersistenceKey.AfterSigninUrl);
    this.persistenceService.clearValue(PersistenceKey.AfterSigninUrl);
    return url;
  }
}
