import * as Sentry from '@sentry/node';
import { ConfigUtil } from './config.util';
import { EnvVarName } from './env-var-name';
import { Logger } from './logger';

export class ErrorTrackerUtil {
  public static captureException(e: any): void {
    if (ConfigUtil.get(EnvVarName.NodeEnv) === 'production') {
      Sentry.captureException(e);
    }
    Logger.error(`Captured exception: ${e}`);
  }
}
