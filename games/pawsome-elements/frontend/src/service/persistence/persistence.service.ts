import { injectable } from 'inversify';

const STORAGE_NAMESPACE = '[pwsm]';

@injectable()
export class PersistenceService {
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

  public hardClear(): boolean {
    if (!window.localStorage) {
      return false;
    }

    Object.keys(window.localStorage).forEach((key) => window.localStorage.removeItem(key));

    return true;
  }

  public clear(): boolean {
    if (!window.localStorage) {
      return false;
    }

    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(STORAGE_NAMESPACE))
      .forEach((key) => window.localStorage.removeItem(key));

    return true;
  }

  private getValuePath(key: string): string {
    return `${STORAGE_NAMESPACE}[${key}]`;
  }
}
