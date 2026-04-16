import { Model, Mongoose, Schema } from 'mongoose';
import { LoggerService } from '../logger';
import { AutoMigration } from './auto-migration';

interface AutoMigrationRecord {
  _id: number;
  duration: number;
  name: string;
  logs?: any;
}

export class AutoMigrationHelper {
  private model: Model<AutoMigrationRecord>;
  private migrations: AutoMigration[];

  public constructor(
    private mongoose: Mongoose,
    private logger: LoggerService,
  ) {
    const schema = this.getMigrationSchema();
    this.model = this.mongoose.model<AutoMigrationRecord>('migration', schema);
  }

  public async runMigrations(): Promise<void> {
    const lastMigrationId = (await this.getLastMigrationId()) || 0;
    const migrationsToRun = this.getMigrationsToRun(lastMigrationId);
    if (!migrationsToRun.length) {
      this.logger.info('No migrations to run, skipping auto migration step');
      return;
    }

    this.logger.info(
      `Start migrations, last migration id: ${lastMigrationId || 'NONE'}, migrations to run: ${migrationsToRun.length}`,
    );
    try {
      for (let i = 0; i < migrationsToRun.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await this.runMigration(migrationsToRun[i]);
      }
    } catch (error) {
      this.logger.error(`Error occurred while running migrations, error: ${error.stack}`);
    }
    this.logger.info('Finished running migrations');
  }

  public setMigrations(migrations: AutoMigration[]): void {
    this.migrations = migrations;
  }

  private getMigrationSchema(): Schema {
    return new Schema(
      {
        _id: Number,
        logs: Object,
        name: String,
        duration: Number,
      },
      { timestamps: true },
    );
  }

  private async getLastMigrationId(): Promise<number> {
    const lastMigration = await this.model.find().sort({ _id: -1 }).limit(1).lean();
    return lastMigration[0] ? lastMigration[0]._id : 0;
  }

  private getMigrationsToRun(lastMigrationId: number): AutoMigration[] {
    return this.migrations.filter((el) => el.id > lastMigrationId).sort((a, b) => a.id - b.id);
  }

  private async runMigration(migration: AutoMigration) {
    this.logger.info(`Migration start, id: ${migration.id}`);
    const start = Date.now();
    const logs = await migration.run(this.mongoose);
    const duration = Date.now() - start;
    this.storeMigration({
      _id: migration.id,
      logs,
      duration,
      name: migration.constructor.name,
    });
    this.logger.info(`Migration finish, id: ${migration.id}, duration: ${duration}ms`);
  }

  private async storeMigration(autoMigration: AutoMigrationRecord): Promise<void> {
    await this.model.create(autoMigration);
  }
}
