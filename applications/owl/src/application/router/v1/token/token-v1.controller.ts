import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { TokenEntity, TokenContent, TokenEntityType, RefreshTokenEntity, AccountEntity } from '@kwokka/entities';
import { PublicProps } from '@kwokka/utils';
import { Controller, ApiResult, HttpStatus, ControllerException, TokenService } from '@kwokka/common-node';
import { ExceptionCode } from '../../../../usecase/exception-code';
import { GetTokenByIdUsecase } from '../../../../usecase/token/get-token-by-id.usecase';
import { ListTokensUsecase } from '../../../../usecase/token/list-tokens.usecase';
import { RefreshAccessUsecase } from '../../../../usecase/token/refresh-access.usecase';
import { RevokeAccessByAccountIdUsecase } from '../../../../usecase/token/revoke-access-by-account-id.usecase';
import { RevokeAccessByCorrelationIdUsecase } from '../../../../usecase/token/revoke-access-by-correlation-id.usecase';
import { TokenV1Adapter } from './token-v1.adapter';
import { ListTokensByAccountIdUsecase } from '../../../../usecase/token/list-tokens-by-account-id.usecase';

@injectable()
@injectFromBase()
export class TokenV1Controller extends Controller {
  private readonly adapter: TokenV1Adapter = new TokenV1Adapter();

  public constructor(
    @inject(GetTokenByIdUsecase) private readonly getTokenByIdUsecase: GetTokenByIdUsecase,
    @inject(ListTokensUsecase) private readonly listTokensUsecase: ListTokensUsecase,
    @inject(ListTokensByAccountIdUsecase) private readonly listTokensByAccountIdUsecase: ListTokensByAccountIdUsecase,
    @inject(RevokeAccessByAccountIdUsecase)
    private readonly revokeAccessByAccountIdUsecase: RevokeAccessByAccountIdUsecase,
    @inject(RevokeAccessByCorrelationIdUsecase)
    private readonly revokeAccessByCorrelationIdUsecase: RevokeAccessByCorrelationIdUsecase,
    @inject(RefreshAccessUsecase) private readonly refreshAccessUsecase: RefreshAccessUsecase,
    @inject(TokenService) private readonly tokenService: TokenService,
  ) {
    super();
  }

  public async getById(req: Request): Promise<ApiResult<PublicProps<TokenEntity>>> {
    const entity = await this.getTokenByIdUsecase.perform(req.params.id);
    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }

  public async list(req: Request): Promise<ApiResult<PublicProps<TokenEntity>[]>> {
    const accountId = this.parseStringQueryParam(req, 'accountId');
    const offset = this.parseOffset(req);
    const limit = this.parseLimit(req);
    const usecaseResult = accountId
      ? await this.listTokensByAccountIdUsecase.perform(accountId, offset, limit)
      : await this.listTokensUsecase.perform(offset, limit);
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  public async revokeAccessByCorrelationId(req: Request): Promise<ApiResult<void>> {
    const correlationId = req.params.correlationId as string;
    await this.revokeAccessByCorrelationIdUsecase.perform(correlationId);
    this.logger.info(`${this.logPrefix} revoked all tokens by correlationId: ${correlationId}`);
    return { status: HttpStatus.Ok, data: null };
  }

  public async revokeAccessByAccountId(req: Request): Promise<ApiResult<void>> {
    const accountId = req.params.accountId as string;
    await this.revokeAccessByAccountIdUsecase.perform(accountId);
    this.logger.info(`${this.logPrefix} revoked all tokens by accountId: ${accountId}`);
    return { status: HttpStatus.Ok, data: null };
  }

  public async refreshAccess(req: Request, res: Response): Promise<ApiResult<{ access: string; refresh: string }>> {
    const tokenString = req.query.refreshToken as string;
    const tokenContent = this.tokenService.verify<TokenContent>(tokenString);
    if (!tokenContent || tokenContent.type !== TokenEntityType.Refresh) {
      this.logger.warn(`${this.logPrefix} token is invalid: ${tokenContent || '[TOKEN CONTENT NOT PARSED]'}`);
      throw new ControllerException(ExceptionCode.RefreshTokenInvalid, 'The refresh token is invalid.');
    }

    const account = res.locals.account as AccountEntity;
    if (tokenContent.accountId !== account.id) {
      this.logger.warn(`${this.logPrefix} token does not belong to account: ${account.id}`);
      throw new ControllerException(
        ExceptionCode.RefreshTokenDoesNotBelongToAccount,
        'The refresh token does not belong to current account.',
      );
    }

    const token = (await this.getTokenByIdUsecase.perform(tokenContent.jti)) as RefreshTokenEntity;
    const tokenPair = await this.refreshAccessUsecase.perform(token);

    const access = this.tokenService.sign<TokenContent>(tokenPair.access.content);
    const refresh = this.tokenService.sign<TokenContent>(tokenPair.refresh.content);
    this.logger.info(`${this.logPrefix} refreshed access for account: ${tokenContent.accountId}`);

    return { status: HttpStatus.Ok, data: { access, refresh } };
  }
}
