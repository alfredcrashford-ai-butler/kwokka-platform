import { inject, injectable, injectFromBase } from 'inversify';
import { Request, Response } from 'express';
import { AccountEntity, GameInstanceEntity, GameInstanceEntityStatus } from '@kwokka/entities';
import {
  ApiResult,
  CrudController,
  EntityNotFoundControllerException,
  HttpStatus,
  TokenService,
} from '@kwokka/common-node';
import { GameInstanceV1Adapter } from './game-instance-v1.adapter';
import {
  ListGameInstancesUsecase,
  CreateGameInstanceUsecase,
  UpdateGameInstanceUsecase,
  GetGameInstanceByIdUsecase,
  DeleteGameInstanceUsecase,
} from '../../../../usecase';
import { TokenType } from '../../../service';

const GAME_INSTANCE_CONNECT_TOKEN_DURATION_MS = 60 * 1000;

interface GameInstanceConnectToken {
  type: TokenType.GameInstanceConnect;
  accountId: string;
  exp: number;
  iat: number;
  gameInstanceId: string;
  jti: null;
}

export interface GameInstanceConnectTokenValidationResponse {
  isValid: boolean;
  content?: {
    accountId: string;
    gameInstanceId: string;
  };
}

@injectable()
@injectFromBase()
export class GameInstanceV1Controller extends CrudController<GameInstanceEntity> {
  protected readonly adapter: GameInstanceV1Adapter = new GameInstanceV1Adapter();

  public constructor(
    @inject(ListGameInstancesUsecase) protected readonly listUsecase: ListGameInstancesUsecase,
    @inject(CreateGameInstanceUsecase) protected readonly createUsecase: CreateGameInstanceUsecase,
    @inject(UpdateGameInstanceUsecase) protected readonly updateUsecase: UpdateGameInstanceUsecase,
    @inject(GetGameInstanceByIdUsecase) protected readonly getByIdUsecase: GetGameInstanceByIdUsecase,
    @inject(DeleteGameInstanceUsecase) protected readonly deleteUsecase: DeleteGameInstanceUsecase,
    @inject(TokenService) protected readonly tokenService: TokenService,
  ) {
    super();
  }

  public override list(req: Request): Promise<ApiResult<GameInstanceEntity[]>> {
    const filter = {
      playerIds: this.parseStringArrayQueryParam(req, 'playerIds'),
      isPubliclyVisible: true,
    };

    return this.listGameInstances(req, filter);
  }

  public async generateConnectToken(req: Request, res: Response): Promise<ApiResult<{ token: string }>> {
    const gameInstanceId = req.params.id;
    const account = res.locals.account as AccountEntity;
    const gameInstance = await this.getByIdUsecase.perform(gameInstanceId);
    if (!gameInstance) {
      const log = `${this.logPrefix} generate connect token cancelled, game instance does not exist, id: ${gameInstanceId}`;
      this.logger.warn(log);
      throw new EntityNotFoundControllerException(`gameInstanceId: ${gameInstanceId}`);
    }

    const token = this.getConnectToken(account.id, gameInstanceId);

    return { status: HttpStatus.Ok, data: { token } };
  }

  public async validateConnectToken(req: Request): Promise<ApiResult<GameInstanceConnectTokenValidationResponse>> {
    const content = this.tokenService.verify<GameInstanceConnectToken>(req.body.token);
    if (!content || content.type !== TokenType.GameInstanceConnect || Date.now() > content.exp) {
      return { status: HttpStatus.Ok, data: { isValid: false } };
    }

    const responseContent = { accountId: content.accountId, gameInstanceId: content.gameInstanceId };
    return { status: HttpStatus.Ok, data: { isValid: true, content: responseContent } };
  }

  public listOwnGameInstances(req: Request, res: Response): Promise<ApiResult<GameInstanceEntity[]>> {
    const account = res.locals.account as AccountEntity;
    const filter = { playerIds: [account.id] };
    return this.listGameInstances(req, filter);
  }

  private async listGameInstances(req: Request, filter: any): Promise<ApiResult<GameInstanceEntity[]>> {
    const offset = this.parseOffset(req);
    const limit = this.parseLimit(req);
    const sort = this.parseSort(req);
    filter.lobbyId = this.parseStringQueryParam(req, 'lobbyId');
    filter.gameId = this.parseStringQueryParam(req, 'gameId');
    filter.lobbySettings = this.parseObjectQueryParam(req, 'lobbySettings');
    filter.results = this.parseObjectQueryParam(req, 'results');
    filter.status = this.parseStringQueryParam(req, 'status') as GameInstanceEntityStatus;
    const usecaseResult = await this.listUsecase.perform(filter, sort, offset, limit);
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  private getConnectToken(accountId: string, gameInstanceId: string): string {
    const issueDateMs = Date.now();
    const expiryDateMs = issueDateMs + GAME_INSTANCE_CONNECT_TOKEN_DURATION_MS;
    const content: GameInstanceConnectToken = {
      type: TokenType.GameInstanceConnect,
      accountId,
      gameInstanceId,
      exp: expiryDateMs,
      iat: issueDateMs,
      jti: null,
    };
    return this.tokenService.sign(content);
  }
}
