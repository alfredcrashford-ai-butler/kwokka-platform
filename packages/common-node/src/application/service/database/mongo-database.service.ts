import { inject, injectable } from 'inversify';
import { Document, Model, Mongoose, Schema } from 'mongoose';
import { ConfigService } from '../config';
import { LoggerService } from '../logger';
import { DatabaseService } from './database.service';
import { AutoMigrationHelper } from './auto-migration-helper';
import { EnvVarName } from '../../../util';

@injectable()
export abstract class MongoDatabaseService extends DatabaseService<Schema, Model<Document>> {
  protected readonly mongoose: Mongoose;
  protected readonly autoMigrationHelper: AutoMigrationHelper;

  public constructor(
    @inject(LoggerService) protected logger: LoggerService,
    @inject(ConfigService) protected configService: ConfigService,
  ) {
    super();
    this.mongoose = new Mongoose();
    this.autoMigrationHelper = new AutoMigrationHelper(this.mongoose, this.logger);

    const connectionString = this.configService.get(EnvVarName.MongodbUri);

    this.mongoose.connect(connectionString);
    this.mongoose.connection.on('connected', () => this.logger.info('Connected to mongo db'));
    this.mongoose.connection.on('error', (error: Error) => this.logger.error(error.stack));
  }

  public override registerModel<T extends Document>(name: string, schema: Schema): Model<T> {
    return this.mongoose.model<T>(name, schema);
  }

  public override async runMigrations(): Promise<void> {
    await this.autoMigrationHelper.runMigrations();
  }
}
