import './instrument';

import { HttpServer } from './http-server';

(function main() {
  const server = new HttpServer();
  server.start();
})();
