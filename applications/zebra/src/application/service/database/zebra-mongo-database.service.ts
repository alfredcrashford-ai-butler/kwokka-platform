import { ConfigService, LoggerService, MongoDatabaseService } from '@kwokka/common-node';
import { inject, injectable, injectFromBase } from 'inversify';
import { ZebraAccessRightSeedMigration } from './migrations/001-zebra-access-right-seed.migration';
import { GameInstanceConnectionCleanupMigration } from './migrations/002-game-instance-connection-cleanup.migration';
import { LobbyConfigMigration } from './migrations/003-lobby-config.migration';

@injectable()
@injectFromBase()
export class ZebraMongoDatabaseService extends MongoDatabaseService {
  protected readonly migrations = [
    new ZebraAccessRightSeedMigration(this.configService),
    new GameInstanceConnectionCleanupMigration(),
    new LobbyConfigMigration(),
  ];

  public constructor(
    @inject(LoggerService) protected logger: LoggerService,
    @inject(ConfigService) protected configService: ConfigService,
  ) {
    super(logger, configService);
    this.autoMigrationHelper.setMigrations(this.migrations);
  }
}
