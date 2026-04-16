import { GameServerConfig } from './game-server-config';

export const DefaultConfig: Pick<GameServerConfig, 'persistOnShutdown' | 'autoPersist' | 'autoCleanup'> = {
  persistOnShutdown: true,
  autoPersist: {
    enabled: true,
    threshold: 10,
  },
  autoCleanup: {
    enabled: true,
    crontab: '*/10 * * * *',
  },
};
