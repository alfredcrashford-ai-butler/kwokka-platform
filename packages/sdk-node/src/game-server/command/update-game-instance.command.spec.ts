import { GameInstanceEntity } from '@kwokka/entities';
import { UpdateGameInstanceCommand } from './update-game-instance.command';

describe(UpdateGameInstanceCommand, () => {
  let gameInstance: GameInstanceEntity;
  let command: UpdateGameInstanceCommand;

  beforeEach(() => {
    gameInstance = {} as GameInstanceEntity;
    command = new UpdateGameInstanceCommand(gameInstance);
    command['broadcaster'] = { broadcastGameUpdated: jest.fn() } as any;
    command['gameInstanceRegistry'] = { updateGameInstance: jest.fn(), isReadyForPersist: jest.fn() } as any;
    command['sdkConfig'] = { logger: { info: jest.fn(), error: jest.fn() } } as any;
    command['commandCenter'] = { execute: jest.fn() } as any;
  });

  it('updates game instance and broadcasts game updated', () => {
    command.execute();

    expect(command['gameInstanceRegistry'].updateGameInstance).toHaveBeenCalledWith(gameInstance);
    expect(command['broadcaster'].broadcastGameUpdated).toHaveBeenCalledWith(gameInstance);
  });

  it('persists game instance if it is ready for persisting', () => {
    jest.spyOn(command['gameInstanceRegistry'], 'isReadyForPersist').mockReturnValue(true);

    command.execute();

    expect(command['commandCenter'].execute).toHaveBeenCalled();
  });

  it('does not persist game instance if it is not ready for persisting', () => {
    jest.spyOn(command['gameInstanceRegistry'], 'isReadyForPersist').mockReturnValue(false);

    command.execute();

    expect(command['commandCenter'].execute).not.toHaveBeenCalled();
  });
});
