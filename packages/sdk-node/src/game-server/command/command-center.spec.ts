import { KwokkaSdkNodeConfig } from '../../config';
import { GameAPI } from '../../game/game-api';
import { Broadcaster } from '../broadcaster';
import { ClientRegistry } from '../client-registry';
import { GameInstanceRegistry } from '../game-instance-registry';
import { GameServerConfig } from '../game-server-config';
import { CommandCenter } from './command-center';

describe(CommandCenter, () => {
  let commandCenter: CommandCenter;
  let gameApi: GameAPI;
  let broadcaster: Broadcaster;
  let clientRegistry: ClientRegistry;
  let gameInstanceRegistry: GameInstanceRegistry;
  let sdkConfig: KwokkaSdkNodeConfig;
  let config: GameServerConfig;

  beforeEach(() => {
    gameApi = {} as any;
    broadcaster = {} as any;
    clientRegistry = {} as any;
    gameInstanceRegistry = {} as any;
    sdkConfig = {} as any;
    config = {} as any;
    commandCenter = new CommandCenter(gameApi, broadcaster, clientRegistry, gameInstanceRegistry, sdkConfig, config);
  });

  describe('execute', () => {
    it('should not enqueue or process commands if the command center is shut down', () => {
      commandCenter.shutdown();
      const queueName = 'testQueue';
      const command = { execute: jest.fn() } as any;

      commandCenter.execute(queueName, command);

      expect(command.execute).not.toHaveBeenCalled();
    });

    it('should enqueue and process commands if the command center is not shut down', async () => {
      const queueName = 'testQueue';
      const command = { execute: jest.fn().mockResolvedValue(undefined) } as any;

      commandCenter.execute(queueName, command);

      // Wait for the queue to process
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(command.execute).toHaveBeenCalled();
    });
  });

  describe('shutdown', () => {
    it('should clear all queues and active flags when shutdown is called', () => {
      const queueName = 'testQueue';
      const command = { execute: jest.fn() } as any;

      commandCenter.execute(queueName, command);
      commandCenter.shutdown();

      expect(commandCenter['queues'].size).toBe(0);
      expect(commandCenter['activeFlags'].size).toBe(0);
    });

    it('should prevent further commands from being enqueued after shutdown', () => {
      commandCenter.shutdown();
      const queueName = 'testQueue';
      const command = { execute: jest.fn() } as any;

      commandCenter.execute(queueName, command);

      expect(commandCenter['queues'].size).toBe(0);
    });
  });

  describe('processQueue', () => {
    it('should process all commands in the queue and then delete the queue', async () => {
      const queueName = 'testQueue';
      const command1 = { execute: jest.fn().mockResolvedValue(undefined) } as any;
      const command2 = { execute: jest.fn().mockResolvedValue(undefined) } as any;

      commandCenter.execute(queueName, command1);
      commandCenter.execute(queueName, command2);

      // Wait for the queue to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(command1.execute).toHaveBeenCalled();
      expect(command2.execute).toHaveBeenCalled();
      expect(commandCenter['queues'].has(queueName)).toBe(false);
    });

    it('should not process the queue if execution is already active', async () => {
      const queueName = 'testQueue';
      const command = { execute: jest.fn().mockResolvedValue(undefined) } as any;

      commandCenter['activeFlags'].set(queueName, true);
      commandCenter.execute(queueName, command);

      // Wait for the queue to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(command.execute).not.toHaveBeenCalled();
    });
  });

  describe('injectHelpers', () => {
    it('should inject all required helpers into the command', () => {
      const command = {} as any;

      const result = commandCenter['injectHelpers'](command);

      expect(result['broadcaster']).toBe(broadcaster);
      expect(result['clientRegistry']).toBe(clientRegistry);
      expect(result['gameInstanceRegistry']).toBe(gameInstanceRegistry);
      expect(result['sdkConfig']).toBe(sdkConfig);
      expect(result['config']).toBe(config);
      expect(result['gameApi']).toBe(gameApi);
      expect(result['commandCenter']).toBe(commandCenter);
    });
  });
});
