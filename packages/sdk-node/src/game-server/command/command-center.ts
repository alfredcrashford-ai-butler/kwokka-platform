import { Command } from './command';
import { Broadcaster } from '../broadcaster';
import { ClientRegistry } from '../client-registry';
import { GameInstanceRegistry } from '../game-instance-registry';
import { KwokkaSdkNodeConfig } from '../../config';
import { GameServerConfig } from '../game-server-config';
import { GameAPI } from '../../game';
import { Queue } from '../../util';
import { CommandExecuter } from './command-executer';

export class CommandCenter implements CommandExecuter {
  private queues: Map<string, Queue<Command>> = new Map();
  private activeFlags: Map<string, boolean> = new Map();
  private isShutdown = false;

  public constructor(
    private readonly gameApi: GameAPI,
    private readonly broadcaster: Broadcaster,
    private readonly clientRegistry: ClientRegistry,
    private readonly gameInstanceRegistry: GameInstanceRegistry,
    private readonly sdkConfig: KwokkaSdkNodeConfig,
    private readonly config: GameServerConfig,
  ) {}

  public execute(queueName: string, command: Command): void {
    if (this.isShutdown) {
      return;
    }

    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, new Queue());
    }

    const queue = this.queues.get(queueName);
    command = this.injectHelpers(command);
    queue.enqueue(command);
    this.processQueue(queueName);
  }

  public shutdown(): void {
    this.isShutdown = true;
    this.queues.clear();
    this.activeFlags.clear();
  }

  private async processQueue(queueName: string): Promise<void> {
    if (this.isExecutionActive(queueName)) {
      return;
    }

    this.activeFlags.set(queueName, true);
    const queue = this.queues.get(queueName)!;

    while (queue.size > 0) {
      const command = queue.dequeue();
      await command.execute();
    }

    this.queues.delete(queueName);
    this.activeFlags.delete(queueName);
  }

  private isExecutionActive(name: string): boolean {
    return this.activeFlags.get(name);
  }

  private injectHelpers(command: Command): Command {
    command['broadcaster'] = this.broadcaster;
    command['clientRegistry'] = this.clientRegistry;
    command['gameInstanceRegistry'] = this.gameInstanceRegistry;
    command['sdkConfig'] = this.sdkConfig;
    command['config'] = this.config;
    command['gameApi'] = this.gameApi;
    command['commandCenter'] = this;
    return command;
  }
}
