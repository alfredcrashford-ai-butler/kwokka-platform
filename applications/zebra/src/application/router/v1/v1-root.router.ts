import { inject, injectable, injectFromBase } from 'inversify';
import { Router } from '@kwokka/common-node';
import { GameInstanceV1Router } from './game-instance';
import { GameV1Router } from './game';
import { LobbyV1Router } from './lobby';

@injectable()
@injectFromBase()
export class V1RootRouter extends Router {
  public constructor(
    @inject(GameV1Router) private gameV1Router: GameV1Router,
    @inject(GameInstanceV1Router) private gameInstanceV1Router: GameInstanceV1Router,
    @inject(LobbyV1Router) private lobbyV1Router: LobbyV1Router,
  ) {
    super();
    this.addRouter('/games', this.gameV1Router);
    this.addRouter('/game-instances', this.gameInstanceV1Router);
    this.addRouter('/lobbies', this.lobbyV1Router);
  }
}
