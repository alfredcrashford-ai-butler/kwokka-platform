import { BootstrapModule, CommonModule, DatabaseService, HttpServer, LoggerService } from '@kwokka/common-node';
import { ZebraModule, ZebraCommonOverridesModule } from './framework';
import { RootRouter } from './application';
import { ScheduleGameInstanceCleanupInitializer } from './application/initializer';

export class ApplicationBootstrapModule extends BootstrapModule {
  public override get modules() {
    return [new CommonModule(), new ZebraCommonOverridesModule(), new ZebraModule()];
  }

  public override async bootstrap(): Promise<void> {
    const startTime = Date.now();
    const server = this.container.get<HttpServer>(HttpServer);
    const logger = this.container.get<LoggerService>(LoggerService);
    const rootRouter = this.container.get<RootRouter>(RootRouter);
    server.addRouter('/', rootRouter);

    const database = this.container.get<DatabaseService>(DatabaseService);
    database.runMigrations();

    this.runInitializers();

    try {
      const result = await server.start();
      const endTime = Date.now();
      logger.info(`Start time is ${(endTime - startTime) / 1000}s`);
      logger.info(result);
    } catch (e: unknown) {
      logger.error('Error while starting server:', e);
    }
  }

  private runInitializers(): void {
    const scheduleGameInstanceCleanupInitializer = this.container.get<ScheduleGameInstanceCleanupInitializer>(
      ScheduleGameInstanceCleanupInitializer,
    );

    scheduleGameInstanceCleanupInitializer.execute();
  }
}
