import { install as installSourceMapSupport } from 'source-map-support';

import { ApplicationBootstrapModule } from './application-bootstrap.module';

installSourceMapSupport();

(function main() {
  const applicationBootstrapModule = new ApplicationBootstrapModule();
  applicationBootstrapModule.bootstrap();
})();
