import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import type { Guard } from './guard';
import { KwokkaService, LoggerService } from '@/service';
import { RouteName } from '@/app/route-name';

@injectable()
export class ProfileGuard implements Guard {
  public constructor(
    @inject(KwokkaService) private kwokkaService: KwokkaService,
    @inject(LoggerService) private logger: LoggerService,
  ) {}

  public perform = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
      if (!this.kwokkaService.client.profile.myProfile) {
        const profile = await this.kwokkaService.client.profile.getOwnProfile();
        if (!profile) {
          next({ name: RouteName.SetupProfile });
          return;
        }
      }

      if (!this.kwokkaService.client.profile.myProfileDecorations) {
        const profileDecorations = await this.kwokkaService.client.profile.getOwnProfileDecorations();

        if (!profileDecorations) {
          next({ name: RouteName.SetupProfile });
          return;
        }
      }

      if (!this.kwokkaService.client.profile || !this.kwokkaService.client.profile.myProfileDecorations) {
        next({ name: RouteName.SetupProfile });
        return;
      }

      next();
    } catch (e: unknown) {
      this.logger.error('Error occurred when trying to load profile', e);
      this.kwokkaService.client.uninitialize();
      next({ name: RouteName.Auth });
    }
  };
}
