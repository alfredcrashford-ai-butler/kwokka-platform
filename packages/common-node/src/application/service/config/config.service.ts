import { injectable } from 'inversify';
import dotenv from 'dotenv';

@injectable()
export class ConfigService {
  private readonly defaultEnv: Record<string, string>;

  public constructor() {
    const defaultEnv = {};
    dotenv.config({ processEnv: defaultEnv });
    this.defaultEnv = defaultEnv;
  }

  public get(key: string): string {
    const value = process.env[key] || this.defaultEnv[key];
    if (!value) {
      throw new Error(`Environment variable value is missing: ${key}`);
    }

    return value;
  }
}
