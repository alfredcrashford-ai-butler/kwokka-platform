import dotenv from 'dotenv';

const defaultEnv = {};
dotenv.config({ processEnv: defaultEnv });

export class ConfigUtil {
  private static readonly defaultEnv: Record<string, string> = defaultEnv;

  public static get(key: string): string {
    const value = process.env[key] || this.defaultEnv[key];
    if (!value) {
      throw new Error(`Environment variable value is missing: ${key}`);
    }

    return value;
  }
}
