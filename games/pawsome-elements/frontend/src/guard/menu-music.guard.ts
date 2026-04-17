import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { SoundService } from '@/service';
import type { Guard } from './guard';

@injectable()
export class MenuMusicGuard implements Guard {
  public constructor(@inject(SoundService) private soundService: SoundService) {}

  public perform = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    this.soundService.playMenuMusic();
    next();
  };
}
