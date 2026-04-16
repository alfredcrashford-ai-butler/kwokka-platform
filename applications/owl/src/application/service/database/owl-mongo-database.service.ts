import { ConfigService, LoggerService, MongoDatabaseService } from '@kwokka/common-node';
import { inject, injectable, injectFromBase } from 'inversify';
import { AuthSeedMigration } from './migrations/001-auth-seed.migration';

@injectable()
@injectFromBase()
export class OwlMongoDatabaseService extends MongoDatabaseService {
  protected readonly migrations = [new AuthSeedMigration()];

  public constructor(
    @inject(LoggerService) protected logger: LoggerService,
    @inject(ConfigService) protected configService: ConfigService,
  ) {
    super(logger, configService);
    this.autoMigrationHelper.setMigrations(this.migrations);
  }
}
