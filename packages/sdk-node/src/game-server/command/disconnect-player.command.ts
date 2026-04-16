import { Command } from './command';
import { DisconnectReason, GameServerClient } from '../interface';

export class DisconnectPlayerCommand extends Command {
  protected override readonly commandName = 'DisconnectPlayer';

  public constructor(
    private readonly client: GameServerClient,
    private readonly reason?: DisconnectReason,
  ) {
    super();
  }

  protected override get context(): any {
    return { accountId: this.client.accountId, gameInstanceId: this.client.gameInstanceId, reason: this.reason?.code };
  }

  protected override run(): void | Promise<void> {
    if (this.reason) {
      this.broadcaster.broadcastSetDisconnectReason(this.client, this.reason);
    }
    this.broadcaster.disconnectClient(this.client);
  }
}
