import { GameServerClient } from '../interface';
import { Command } from './command';

export class BroadcastErrorCommand extends Command {
  protected override readonly commandName = 'BroadcastError';

  public constructor(
    private readonly client: GameServerClient,
    private readonly code: string,
    private readonly message: string,
  ) {
    super();
  }

  protected override get context(): any {
    return { accountId: this.client.accountId, code: this.code };
  }

  protected override run(): void {
    this.broadcaster.broadcastError(this.client, this.code, this.message);
  }
}
