import { install as installSourceMapSupport } from 'source-map-support';

import { SubauthBootstrapModule } from './subauth-bootstrap.module';

installSourceMapSupport();

(function main() {
  const subauthBootstrapModule = new SubauthBootstrapModule();
  subauthBootstrapModule.bootstrap();
})();
