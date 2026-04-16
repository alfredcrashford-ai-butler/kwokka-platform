import { Command } from './command';

export interface CommandExecuter {
  execute(queueName: string, command: Command);
}
