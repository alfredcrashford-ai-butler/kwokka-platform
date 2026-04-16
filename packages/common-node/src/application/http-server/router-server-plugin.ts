import { Application } from 'express';
import { LoggerService } from '../service';
import { Router } from '../router';

export class RouterServerPlugin {
  private routers: { path: string; router: Router }[] = [];

  public constructor(
    private readonly app: Application,
    private readonly logger: LoggerService,
  ) {}

  public start(): void {
    this.routers.forEach((el: { path: string; router: Router }) => {
      this.app.use(el.path, el.router.getRouter());
      this.logger.info(`Setup routes successfully, path: ${el.path}`);
    });
  }

  public addRouter(path: string, router: Router): void {
    this.routers.push({ path, router });
  }
}
