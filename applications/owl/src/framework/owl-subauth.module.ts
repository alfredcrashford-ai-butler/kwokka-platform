import { Module } from '@kwokka/common-node';
import { AccountMongoRepository, SubauthRouter, TokenMongoRepository } from '../application';
import { AccountRepository, GetAccountByIdUsecase, GetTokenByIdUsecase, TokenRepository } from '../usecase';

export class OwlSubauthModule extends Module {
  public get components() {
    return [
      { identifier: AccountRepository, implementer: AccountMongoRepository },
      { identifier: TokenRepository, implementer: TokenMongoRepository },
      SubauthRouter,
      GetTokenByIdUsecase,
      GetAccountByIdUsecase,
    ];
  }
}
