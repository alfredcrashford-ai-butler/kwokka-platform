import { injectable } from 'inversify';

@injectable()
export abstract class PersistenceService {
  public abstract storeValue(key: string, value: string): boolean;
  public abstract loadValue(key: string): string;
  public abstract clearValue(key: string): boolean;
}
