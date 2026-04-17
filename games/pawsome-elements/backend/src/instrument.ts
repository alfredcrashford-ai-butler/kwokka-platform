import * as Sentry from '@sentry/node';
import { ConfigUtil, EnvVarName, Logger } from './util';

if (ConfigUtil.get(EnvVarName.NodeEnv) === 'production') {
  Logger.info('Sentry setup started');
  Sentry.init({ dsn: 'https://dc08ee25e4d5d2f3fcee6be4542a2397@o975674.ingest.us.sentry.io/4508262011305984' });

  Sentry.profiler.startProfiler();
  Logger.info('Sentry setup completed');
} else {
  Logger.info(`Skip setting up sentry, as the environment is ${ConfigUtil.get(EnvVarName.NodeEnv)}`);
}
