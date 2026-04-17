import { inject, injectable } from 'inversify';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { KwokkaService, LoggerService, PersistenceKey, PersistenceService } from '@/service';
import { RouteName } from '@/app/route-name';
import type { Guard } from './guard';

@injectable()
export class ActiveGameGuard implements Guard {
  // this guard needs to run only once
  private isCompleted = false;

  public constructor(
    @inject(KwokkaService) private kwokkaService: KwokkaService,
    @inject(PersistenceService) private persistence: PersistenceService,
    @inject(LoggerService) private logger: LoggerService,
  ) {}

  public perform = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (this.isCompleted) {
      next();
      return;
    }

    try {
      const gameInstance = await this.kwokkaService.getMyActiveGame();
      if (gameInstance) {
        return this.redirectToGame(next, gameInstance.id);
      }

      next();
    } catch (e: unknown) {
      this.logger.error('Error occurred when trying to load active games', e);
      next();
    } finally {
      this.isCompleted = true;
    }
  };

  private redirectToGame(next: NavigationGuardNext, id: string): void {
    this.persistence.clearValue(PersistenceKey.TargetUrl);
    next({ name: RouteName.Game, params: { id } });
  }
}
