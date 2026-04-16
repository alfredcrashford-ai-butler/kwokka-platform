import { PlayerConnectedCommand } from './player-connected.command';
import { IncorrectConnectionParamsDisconnectReason } from '../interface';

describe(PlayerConnectedCommand, () => {
  let command: PlayerConnectedCommand;
  const client = { gameInstanceId: 'gameInstance', accountId: 'account' } as any;
  const lobby = { id: 'lobby' };

  beforeEach(() => {
    command = new PlayerConnectedCommand(client);
    command['config'] = { controller: { onPlayerConnected: jest.fn() } } as any;
    command['broadcaster'] = {
      broadcastSetDisconnectReason: jest.fn(),
      broadcastConnectivity: jest.fn(),
      disconnectClient: jest.fn(),
    } as any;
    command['gameApi'] = { getLobbyById: jest.fn().mockResolvedValue(lobby) } as any;
    command['sdkConfig'] = { logger: { warn: jest.fn(), info: jest.fn() } } as any;
  });

  it('connects player when game instance exists', async () => {
    const gameInstance = { id: 'gameInstance', lobbyId: 'lobby' };
    command['gameInstanceRegistry'] = { getGameInstanceById: jest.fn().mockResolvedValue(gameInstance) } as any;

    await command.execute();

    expect(command['config'].controller.onPlayerConnected).toHaveBeenCalledWith({
      accountId: 'account',
      lobby,
      gameInstance,
    });
    expect(command['broadcaster'].broadcastConnectivity).toHaveBeenCalledWith(gameInstance.id);
  });

  it('disconnects player if game instance does not exist', async () => {
    command['gameInstanceRegistry'] = { getGameInstanceById: jest.fn().mockResolvedValue(null) } as any;

    await command.execute();

    expect(command['config'].controller.onPlayerConnected).not.toHaveBeenCalled();
    expect(command['broadcaster'].broadcastSetDisconnectReason).toHaveBeenCalledWith(
      client,
      IncorrectConnectionParamsDisconnectReason,
    );
    expect(command['broadcaster'].disconnectClient).toHaveBeenCalledWith(client);
  });
});
