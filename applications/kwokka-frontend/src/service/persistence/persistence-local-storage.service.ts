import { injectable } from 'inversify';
import { PersistenceService } from './persistence.service';

const STORAGE_NAMESPACE = '[kwokka]';

@injectable()
export class PersistenceServiceLocalStorageImpl extends PersistenceService {
  public storeValue(key: string, value: string): boolean {
    if (!window.localStorage) {
      return false;
    }

    window.localStorage.setItem(this.getValuePath(key), value);
    return true;
  }

  public loadValue(key: string): string {
    if (!window.localStorage) {
      return null;
    }

    return window.localStorage.getItem(this.getValuePath(key));
  }

  public clearValue(key: string): boolean {
    if (!window.localStorage) {
      return false;
    }

    window.localStorage.removeItem(this.getValuePath(key));
    return true;
  }

  private getValuePath(key: string): string {
    return `${STORAGE_NAMESPACE}[${key}]`;
  }
}
