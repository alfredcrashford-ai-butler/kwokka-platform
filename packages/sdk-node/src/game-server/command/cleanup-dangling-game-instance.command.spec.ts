import { CleanupDanglingGameInstanceCommand } from './cleanup-dangling-game-instance.command';
import { PersistGameInstanceCommand } from './persist-game-instance.command';

describe(CleanupDanglingGameInstanceCommand, () => {
  let command: CleanupDanglingGameInstanceCommand;
  const gameInstanceId = 'gameInstanceId';

  beforeEach(() => {
    command = new CleanupDanglingGameInstanceCommand(gameInstanceId);
    command['broadcaster'] = { broadcastError: jest.fn() } as any;
    command['clientRegistry'] = { getClientsByGameInstanceId: jest.fn() } as any;
    command['gameInstanceRegistry'] = {
      isActiveGameInstance: jest.fn(),
      getGameInstanceById: jest.fn(),
      cleanupGameInstance: jest.fn(),
    } as any;
    command['commandCenter'] = { execute: jest.fn() } as any;
    command['sdkConfig'] = { logger: { info: jest.fn(), error: jest.fn() } } as any;
  });

  it('does not clean up if has active clients', async () => {
    jest.spyOn(command['clientRegistry'], 'getClientsByGameInstanceId').mockReturnValue([{} as any]);
    jest.spyOn(command['gameInstanceRegistry'], 'isActiveGameInstance').mockReturnValue(true);

    await command.execute();

    expect(command['commandCenter'].execute).not.toHaveBeenCalled();
  });

  it('does not clean up if game is not active', async () => {
    jest.spyOn(command['clientRegistry'], 'getClientsByGameInstanceId').mockReturnValue([]);
    jest.spyOn(command['gameInstanceRegistry'], 'isActiveGameInstance').mockReturnValue(false);

    await command.execute();

    expect(command['commandCenter'].execute).not.toHaveBeenCalled();
  });

  it('cleans up if game is active and no clients are connected', async () => {
    const gameInstance = {} as any;
    jest.spyOn(command['clientRegistry'], 'getClientsByGameInstanceId').mockReturnValue([]);
    jest.spyOn(command['gameInstanceRegistry'], 'isActiveGameInstance').mockReturnValue(true);
    jest.spyOn(command['gameInstanceRegistry'], 'getGameInstanceById').mockResolvedValue(gameInstance);

    await command.execute();

    expect(command['commandCenter'].execute).toHaveBeenCalled();
    const executeCall = (command['commandCenter'].execute as jest.Mock).mock.calls[0];
    expect(executeCall[0]).toEqual(gameInstanceId);
    expect(executeCall[1]).toBeInstanceOf(PersistGameInstanceCommand);
    expect(command['gameInstanceRegistry'].cleanupGameInstance).toHaveBeenCalledWith(gameInstanceId);
  });
});
