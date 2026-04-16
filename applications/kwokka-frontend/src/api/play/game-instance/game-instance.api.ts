import { injectable, injectFromBase } from 'inversify';
import { CrudApi } from '@/api/crud-api';
import type { GameInstanceEntity } from '@kwokka/entities';
import type { Dto } from '@/api/dto';
import { GameInstanceApiAdapter } from './game-instance.api-adapter';

@injectable()
@injectFromBase()
export class GameInstanceApi extends CrudApi<GameInstanceEntity, Dto<GameInstanceEntity>> {
  protected override readonly baseUrl = '/zebra/v1/game-instances';
  protected override readonly adapter = new GameInstanceApiAdapter();
}
