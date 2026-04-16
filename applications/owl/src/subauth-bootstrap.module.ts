import { BootstrapModule, CommonModule, HttpServer, LoggerService } from '@kwokka/common-node';
import { OwlCommonOverridesModule } from './framework';
import { OwlSubauthModule } from './framework/owl-subauth.module';
import { SubauthRouter } from './application';

export class SubauthBootstrapModule extends BootstrapModule {
  public override get modules() {
    return [new CommonModule(), new OwlCommonOverridesModule(), new OwlSubauthModule()];
  }

  public override async bootstrap(): Promise<void> {
    const startTime = Date.now();
    const server = this.container.get<HttpServer>(HttpServer);
    const logger = this.container.get<LoggerService>(LoggerService);
    const router = this.container.get<SubauthRouter>(SubauthRouter);
    server.addRouter('/', router);

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
