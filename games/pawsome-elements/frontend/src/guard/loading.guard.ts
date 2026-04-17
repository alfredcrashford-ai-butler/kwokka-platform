import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { RouteName } from '@/app/route-name';
import type { Guard } from './guard';
import { PersistenceKey, PersistenceService } from '@/service';

const PATH_WHITELIST = [
  RouteName.Game,
  RouteName.Practice,
  RouteName.QuickMatch,
  RouteName.RankedMatch,
  RouteName.Lobby,
  RouteName.Play,
  RouteName.Shop,
];

@injectable()
export class LoadingGuard implements Guard {
  private isCompleted = false;

  public constructor(@inject(PersistenceService) private persistence: PersistenceService) {}

  public perform = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (this.isCompleted || to.name === RouteName.Loading) {
      next();
    } else {
      if (this.isDiscordCallback(to)) {
        next({ name: RouteName.Loading, query: { targetUrl: to.fullPath } });
      } else {
        if (PATH_WHITELIST.includes(to.name as RouteName)) {
          this.persistence.storeValue(PersistenceKey.TargetUrl, to.fullPath);
        }
        next({ name: RouteName.Loading });
      }
    }
    this.isCompleted = true;
  };

  private isDiscordCallback(location: RouteLocationNormalized): boolean {
    return location?.name === RouteName.Auth && location?.query?.callback === 'discord';
  }
}
