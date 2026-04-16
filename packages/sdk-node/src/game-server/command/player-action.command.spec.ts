import { IncomingMessageType, PlayerActionIncomingMessage } from '../message';
import { PlayerActionCommand } from './player-action.command';

describe(PlayerActionCommand, () => {
  let command: PlayerActionCommand;
  const message = {
    type: 'cmd',
    payload: { type: IncomingMessageType.PlayerAction, data: { name: 'action', content: {} } },
  } as PlayerActionIncomingMessage;
  const client = { gameInstanceId: 'gameInstance', accountId: 'account' } as any;
  const lobby = { id: 'lobby' };
  const gameInstance = { id: 'gameInstance' };

  beforeEach(() => {
    command = new PlayerActionCommand(message, client);
    command['gameInstanceRegistry'] = { getGameInstanceById: jest.fn().mockResolvedValue(gameInstance) } as any;
    command['gameApi'] = { getLobbyById: jest.fn().mockResolvedValue(lobby) } as any;
    command['config'] = { controller: { onPlayerAction: jest.fn(), onUnhandledError: jest.fn() } } as any;
    command['sdkConfig'] = { logger: { error: jest.fn(), info: jest.fn() } } as any;
  });

  it('processes player message with controller', async () => {
    await command.execute();

    expect(command['config'].controller.onPlayerAction).toHaveBeenCalledWith({
      name: message.payload.data.name,
      content: message.payload.data.content,
      accountId: client.accountId,
      gameInstance,
      lobby,
    });
  });

  it('logs error and calls controller.onUnhandledError when an error occurs during processing', async () => {
    const error = new Error();
    jest.spyOn(command['config'].controller, 'onPlayerAction').mockRejectedValue(error);

    await command.execute();

    expect(command['sdkConfig'].logger?.error).toHaveBeenCalledTimes(1);
    expect(command['config'].controller.onUnhandledError).toHaveBeenCalledWith(error);
  });
});
