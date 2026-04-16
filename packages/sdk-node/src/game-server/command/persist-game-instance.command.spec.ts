import { GameInstanceEntity } from '@kwokka/entities';
import { PersistGameInstanceCommand } from './persist-game-instance.command';

describe(PersistGameInstanceCommand, () => {
  let gameInstance: GameInstanceEntity;
  let command: PersistGameInstanceCommand;

  beforeEach(() => {
    gameInstance = {} as GameInstanceEntity;
    command = new PersistGameInstanceCommand(gameInstance)
    command['broadcaster'] = { broadcastGameUpdated: jest.fn() } as any;
    command['gameInstanceRegistry'] = { persistGameInstance: jest.fn() } as any;
    command['sdkConfig'] = { logger: { info: jest.fn(), error: jest.fn() } } as any;
  });

  it('persists game instance', async () => {
    await command.execute();

    expect(command['gameInstanceRegistry'].persistGameInstance).toHaveBeenCalledWith(gameInstance);
  });

  it('logs error when persist operation fails', async () => {
    jest.spyOn(command['gameInstanceRegistry'], 'persistGameInstance').mockRejectedValue(new Error());

    await command.execute();

    expect(command['sdkConfig'].logger?.error).toHaveBeenCalledTimes(1);
  });
});
