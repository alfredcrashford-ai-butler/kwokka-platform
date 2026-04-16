import { NewConnectionDisconnectReason } from '../interface';
import { DisconnectPlayerCommand } from './disconnect-player.command';

describe(DisconnectPlayerCommand, () => {
  let command: DisconnectPlayerCommand;
  const client = { gameInstanceId: 'gameInstance', accountId: 'account' } as any;
  const reason = NewConnectionDisconnectReason;

  beforeEach(() => {
    command = new DisconnectPlayerCommand(client);
    command['broadcaster'] = { broadcastSetDisconnectReason: jest.fn(), disconnectClient: jest.fn() } as any;
    command['sdkConfig'] = { logger: { info: jest.fn(), error: jest.fn() } } as any;
  });

  it('broadcasts disconnect without setting disconnect reason when it is not provided', async () => {
    await command.execute();

    expect(command['broadcaster'].disconnectClient).toHaveBeenCalledWith(client);
  });

  it('broadcasts disconnect with setting disconnect reason if it is provided', async () => {
    (command as any)['reason'] = reason;

    await command.execute();

    expect(command['broadcaster'].broadcastSetDisconnectReason).toHaveBeenCalledWith(client, reason);
    expect(command['broadcaster'].disconnectClient).toHaveBeenCalledWith(client);
  });
});
