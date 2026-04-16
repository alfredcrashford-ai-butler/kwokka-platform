import { injectable } from 'inversify';

@injectable()
export abstract class DatabaseService<Schema = any, Model = any> {
  public abstract registerModel(name: string, schema: Schema): Model;
  public abstract runMigrations(): Promise<void>;
}
