import { injectable, injectFromBase } from 'inversify';
import { CrudApi } from '@/api/crud-api';
import type { LobbyEntity } from '@kwokka/entities';
import type { Dto } from '@/api/dto';
import { LobbyApiAdapter } from './lobby.api-adapter';

@injectable()
@injectFromBase()
export class LobbyApi extends CrudApi<LobbyEntity, Dto<LobbyEntity>> {
  protected override readonly baseUrl = '/zebra/v1/lobbies';
  protected override readonly adapter = new LobbyApiAdapter();
}
