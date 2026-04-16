import { type GameController } from './game-controller';

type CronField =
  | '*'
  | `*/${number}`
  | `${number}`
  | `${number}-${number}`
  | `${number}/${number}`
  | `${number}-${number}/${number}`
  | `${number},${number}`
  | `${number},${number}`
  | `${number},${number},${number}`
  | `${number},${number},${number},${number}`;

type CronExpression = `${CronField} ${CronField} ${CronField} ${CronField} ${CronField}`;

export interface AutoPersistConfig {
  enabled?: boolean;
  threshold?: number;
}

export interface AutoCleanupConfig {
  enabled?: boolean;
  crontab?: CronExpression;
}

export interface GameServerConfig {
  path: string;
  host: string;
  controller: GameController;
  persistOnShutdown?: boolean;
  autoPersist?: AutoPersistConfig;
  autoCleanup?: AutoCleanupConfig;
}
