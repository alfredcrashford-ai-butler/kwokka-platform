import process from 'node:process';
import { KwokkaSdkNodeConfig } from '../../config';
import { Scheduler } from '../../util';
import { CommandCenter } from '../command';
import { GameInstanceRegistry } from '../game-instance-registry';
import { GameServerConfig } from '../game-server-config';
import { ShutdownProcessor } from './shutdown-processor';
import { ClientRegistry } from '../client-registry';
import { Broadcaster } from '../broadcaster';

describe(ShutdownProcessor, () => {
  let shutdownProcessor: ShutdownProcessor;
  let sdkConfig: KwokkaSdkNodeConfig;
  let config: GameServerConfig;
  let commandCenter: CommandCenter;
  let gameInstanceRegistry: GameInstanceRegistry;
  let scheduler: Scheduler;
  let broadcaster: Broadcaster;
  let clientRegistry: ClientRegistry;

  beforeEach(() => {
    gameInstanceRegistry = {} as any;
    sdkConfig = {} as any;
    config = {} as any;
    scheduler = {} as any;
    commandCenter = {} as any;
    broadcaster = {} as any;
    clientRegistry = {} as any;
    shutdownProcessor = new ShutdownProcessor(
      sdkConfig,
      config,
      commandCenter,
      gameInstanceRegistry,
      scheduler,
      broadcaster,
      clientRegistry,
    );
  });

  it('should initialize with isShuttingDown as false', () => {
    expect(shutdownProcessor.isShuttingDown).toBe(false);
  });

  it('should call process.on for each signal event during setup', () => {
    const processOnSpy = jest.spyOn(process, 'on');

    shutdownProcessor.setup();

    expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(processOnSpy).toHaveBeenCalledWith('SIGQUIT', expect.any(Function));
    expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
  });
});
