import { Logger } from './util';

export interface KwokkaSdkNodeConfig {
  clientId: string;
  secret: string;
  endpoint?: string;
  logger?: Logger;
}
