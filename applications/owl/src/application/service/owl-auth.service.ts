import { inject, injectable } from 'inversify';
import { AccessTokenContent, AccountEntity, TokenContent, TokenEntity } from '@kwokka/entities';
import { CacheService, DefaultAuthService, LoggerService, TokenService } from '@kwokka/common-node';
import { AuthModuleCachePrefix } from '../cache';
import { GetAccountByIdUsecase, GetTokenByIdUsecase } from '../../usecase';

@injectable()
export class OwlAuthService extends DefaultAuthService {
  public constructor(
    @inject(LoggerService) logger: LoggerService,
    @inject(TokenService) private tokenService: TokenService,
    @inject(CacheService) private cacheService: CacheService,
    @inject(GetTokenByIdUsecase) private getTokenByIdUsecase: GetTokenByIdUsecase,
    @inject(GetAccountByIdUsecase) private getAccountByIdUsecase: GetAccountByIdUsecase,
  ) {
    super(logger);
  }

  protected override parseTokenString(tokenString: string): TokenContent {
    return this.tokenService.verify<TokenContent>(tokenString);
  }

  protected override async getToken(tokenContent: AccessTokenContent): Promise<TokenEntity> {
    const tokenId = tokenContent.jti;
    let token = this.cacheService.get<TokenEntity>(AuthModuleCachePrefix.Token, tokenId);
    if (!token) {
      token = await this.getTokenByIdUsecase.perform(tokenId);
      this.cacheService.set<TokenEntity>(AuthModuleCachePrefix.Token, tokenId, token);
    }
    return token;
  }

  protected override async getAccount(tokenContent: AccessTokenContent): Promise<AccountEntity> {
    const accountId = tokenContent.accountId;
    let account = this.cacheService.get<AccountEntity>(AuthModuleCachePrefix.Account, accountId);
    if (!account) {
      account = await this.getAccountByIdUsecase.perform(accountId);
      this.cacheService.set<AccountEntity>(AuthModuleCachePrefix.Account, accountId, account);
    }
    return account;
  }
}
