import { BroadcastErrorCommand } from './broadcast-error.command';

describe(BroadcastErrorCommand, () => {
  let command: BroadcastErrorCommand;
  const client = { gameInstanceId: 'gameInstance', accountId: 'account' } as any;
  const code = 'code';
  const message = 'message';

  beforeEach(() => {
    command = new BroadcastErrorCommand(client, code, message);
    command['broadcaster'] = { broadcastError: jest.fn() } as any;
    command['sdkConfig'] = { logger: { info: jest.fn(), error: jest.fn() } } as any;
  });

  it('broadcasts error to given client', async () => {
    await command.execute();

    expect(command['broadcaster'].broadcastError).toHaveBeenCalledWith(client, code, message);
  });
});
