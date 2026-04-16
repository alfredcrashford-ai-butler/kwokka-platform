const STORAGE_NAMESPACE = '[kwokka_sdk_js]';

export const ACCESS_TOKEN_PERSISTENCE_KEY = 'access_token';
export const REFRESH_TOKEN_PERSISTENCE_KEY = 'refresh_token';

export class PersistenceUtil {
  public static storeValue(key: string, value: string): boolean {
    if (!window.localStorage) {
      return false;
    }

    window.localStorage.setItem(this.getValuePath(key), value);
    return true;
  }

  public static loadValue(key: string): string {
    if (!window.localStorage) {
      return null;
    }

    return window.localStorage.getItem(this.getValuePath(key));
  }

  public static clearValue(key: string): boolean {
    if (!window.localStorage) {
      return false;
    }

    window.localStorage.removeItem(this.getValuePath(key));
    return true;
  }

  private static getValuePath(key: string): string {
    return `${STORAGE_NAMESPACE}[${key}]`;
  }
}
