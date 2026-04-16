
import { BootstrapModule, CommonModule, DatabaseService, HttpServer, LoggerService } from '@kwokka/common-node';
import { CapybaraCommonOverridesModule, CapybaraModule } from './framework';
import { RootRouter } from './application/router';

export class ApplicationBootstrapModule extends BootstrapModule {
  public override get modules() {
    return [new CommonModule(), new CapybaraCommonOverridesModule(), new CapybaraModule()];
  }

  public override async bootstrap(): Promise<void> {
    const startTime = Date.now();
    const server = this.container.get<HttpServer>(HttpServer);
    const logger = this.container.get<LoggerService>(LoggerService);
    const rootRouter = this.container.get<RootRouter>(RootRouter);
    server.addRouter('/', rootRouter);
    const database = this.container.get<DatabaseService>(DatabaseService);
    database.runMigrations();

    try {
      const result = await server.start();
      const endTime = Date.now();
      logger.info(`Start time is ${(endTime - startTime) / 1000}s`);
      logger.info(result);
    } catch (e: unknown) {
      logger.error('Error while starting server:', e);
    }
  }
}
