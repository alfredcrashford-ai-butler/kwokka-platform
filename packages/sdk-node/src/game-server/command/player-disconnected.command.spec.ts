import { GameInstanceEntity, LobbyEntity } from '@kwokka/entities';
import { NewConnectionDisconnectReason } from '../interface';
import { PlayerDisconnectedCommand } from './player-disconnected.command';

describe(PlayerDisconnectedCommand, () => {
  let command: PlayerDisconnectedCommand;
  const client = { gameInstanceId: 'gameInstance', accountId: 'account' } as any;

  beforeEach(() => {
    command = new PlayerDisconnectedCommand(client);
    command['broadcaster'] = { broadcastSetDisconnectReason: jest.fn(), disconnectClient: jest.fn() } as any;
    command['sdkConfig'] = { logger: { info: jest.fn(), error: jest.fn() } } as any;
    command['clientRegistry'] = { cleanupClient: jest.fn() } as any;
    command['gameInstanceRegistry'] = { getGameInstanceById: jest.fn() } as any;
    command['commandCenter'] = { execute: jest.fn() } as any;
    command['broadcaster'] = { broadcastConnectivity: jest.fn() } as any;
    command['gameApi'] = { getLobbyById: jest.fn() } as any;
    command['config'] = { controller: { onPlayerDisconnected: jest.fn() } } as any;
  });

  it('processes the disconnect fully if game instance exists', async () => {
    const gameInstance = new GameInstanceEntity({} as any);
    const lobby = new LobbyEntity({} as any);
    jest.spyOn(command['gameInstanceRegistry'], 'getGameInstanceById').mockResolvedValue(gameInstance);
    jest.spyOn(command['gameApi'], 'getLobbyById').mockResolvedValue(lobby);

    await command.execute();

    expect(command['clientRegistry'].cleanupClient).toHaveBeenCalledWith(client.accountId);
    expect(command['broadcaster'].broadcastConnectivity).toHaveBeenCalledWith(client.gameInstanceId);
    expect(command['config'].controller.onPlayerDisconnected).toHaveBeenCalledWith({
      accountId: client.accountId,
      gameInstance,
      lobby,
    });
  });

  it('processes the disconnect partially if game instance does not exist', async () => {
    jest.spyOn(command['gameInstanceRegistry'], 'getGameInstanceById').mockResolvedValue(null as any);

    await command.execute();

    expect(command['clientRegistry'].cleanupClient).toHaveBeenCalledWith(client.accountId);
    expect(command['broadcaster'].broadcastConnectivity).not.toHaveBeenCalled();
    expect(command['config'].controller.onPlayerDisconnected).not.toHaveBeenCalled();
  });
});
