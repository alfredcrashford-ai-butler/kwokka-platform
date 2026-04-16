import { ConfigService, LoggerService, MongoDatabaseService } from '@kwokka/common-node';
import { inject, injectable, injectFromBase } from 'inversify';
import { CapybaraAccessRightSeedMigration } from './migrations/001-capybara-access-right-seed.migration';
import { BaseItemsSeedMigration } from './migrations/002-base-items-seed-migration';
import { TraitAccessRightMigration } from './migrations/003-trait-access-right.migration';
import { ItemTradeAccessRightMigration } from './migrations/004-item-trade-access-right.migration';

@injectable()
@injectFromBase()
export class CapybaraMongoDatabaseService extends MongoDatabaseService {
  protected readonly migrations = [
    new CapybaraAccessRightSeedMigration(this.configService),
    new BaseItemsSeedMigration(),
    new TraitAccessRightMigration(this.configService),
    new ItemTradeAccessRightMigration(this.configService),
  ];

  public constructor(
    @inject(LoggerService) protected logger: LoggerService,
    @inject(ConfigService) protected configService: ConfigService,
  ) {
    super(logger, configService);
    this.autoMigrationHelper.setMigrations(this.migrations);
  }
}
