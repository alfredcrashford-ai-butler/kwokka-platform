import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { ProfileService } from '@/service/profile/profile.service';
import type { Guard } from './guard';

@injectable()
export class ProfileGuard implements Guard {
  public constructor(@inject(ProfileService) private profileService: ProfileService) {}

  public perform = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (!this.profileService.profile) {
      const profile = await this.profileService.fetchOwnProfile();
      if (!profile) {
        next('setup-profile');
        return;
      }
    }

    if (!this.profileService.profileDecorations) {
      const profileDecorations = await this.profileService.fetchOwnProfileDecorations();

      if (!profileDecorations) {
        next('setup-profile');
        return;
      }
    }

    if (!this.profileService.profile || !this.profileService.profileDecorations) {
      next('setup-profile');
      return;
    }

    next();
  };
}
