import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccountEntity, AccountEntityType, AccountRolesEntity } from '@kwokka/entities';
import { PublicProps } from '@kwokka/utils';
import { ApiResult, CrudController, HttpStatus } from '@kwokka/common-node';
import { CreateAccountUsecase } from '../../../../usecase/account/create-account.usecase';
import { DeleteAccountUsecase } from '../../../../usecase/account/delete-account.usecase';
import { GetAccountByIdUsecase } from '../../../../usecase/account/get-account-by-id.usecase';
import { ListAccountsUsecase } from '../../../../usecase/account/list-accounts.usecase';
import { SetAccountActiveUsecase } from '../../../../usecase/account/set-account-active.usecase';
import { SetAccountVerifiedUsecase } from '../../../../usecase/account/set-account-verified.usecase';
import { RevokeAccessByAccountIdUsecase } from '../../../../usecase/token/revoke-access-by-account-id.usecase';
import { AccountV1Adapter } from './account-v1.adapter';
import { CreateAccountRolesUsecase } from '../../../../usecase';

@injectable()
@injectFromBase()
export class AccountV1Controller extends CrudController<AccountEntity> {
  // There is no such thing as update account
  protected override updateUsecase = null;
  protected adapter: AccountV1Adapter = new AccountV1Adapter();

  public constructor(
    @inject(ListAccountsUsecase) protected readonly listUsecase: ListAccountsUsecase,
    @inject(CreateAccountUsecase) protected readonly createUsecase: CreateAccountUsecase,
    @inject(GetAccountByIdUsecase) protected readonly getByIdUsecase: GetAccountByIdUsecase,
    @inject(DeleteAccountUsecase) protected readonly deleteUsecase: DeleteAccountUsecase,
    @inject(SetAccountVerifiedUsecase) protected readonly setAccountVerifiedUsecase: SetAccountVerifiedUsecase,
    @inject(SetAccountActiveUsecase) protected readonly setAccountActiveUsecase: SetAccountActiveUsecase,
    @inject(CreateAccountRolesUsecase) protected readonly createAccountRolesUsecase: CreateAccountRolesUsecase,
    @inject(RevokeAccessByAccountIdUsecase)
    protected readonly revokeAccessByAccountIdUsecase: RevokeAccessByAccountIdUsecase,
  ) {
    super();
  }

  public override async list(req: Request): Promise<ApiResult<AccountEntity[]>> {
    const type = this.parseStringQueryParam(req, 'type') as AccountEntityType;
    return await this.listUsecase.perform(this.parseOffset(req), this.parseLimit(req), type);
  }

  public async setAccountActive(req: Request): Promise<ApiResult<PublicProps<AccountEntity>>> {
    const account = await this.setAccountActiveUsecase.perform(req.params.id, req.body.isActive);
    this.logger.info(`${this.logPrefix} account is now ${req.body.isActive ? 'active' : 'inactive'}: ${account.id}`);
    if (!req.body.isActive) {
      await this.revokeAccessByAccountIdUsecase.perform(req.params.id);
      this.logger.info(`${this.logPrefix} revoked all tokens from account: ${account.id}`);
    }

    const data = this.adapter.serialize(account);
    return { status: HttpStatus.Ok, data };
  }

  public createUserAccount(): Promise<ApiResult<PublicProps<AccountEntity>>> {
    return this.createAccount(AccountEntityType.User);
  }

  public async createApplicationAccount(): Promise<ApiResult<PublicProps<AccountEntity>>> {
    return this.createAccount(AccountEntityType.Application);
  }

  public async createApplicationAdminAccount(): Promise<ApiResult<PublicProps<AccountEntity>>> {
    return this.createAccount(AccountEntityType.ApplicationAdmin);
  }

  public async getOwnAccount(res: Response): Promise<ApiResult<PublicProps<AccountEntity>>> {
    const account = res.locals.account as AccountEntity;
    const data = this.adapter.serialize(account);
    return { status: HttpStatus.Ok, data };
  }

  public async deleteOwnAccount(res: Response) {
    const account = res.locals.account as AccountEntity;
    const entity = await this.deleteUsecase.perform(account.id);
    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }

  private async createAccount(type: AccountEntityType) {
    let account = new AccountEntity({ type, isActive: true, isVerified: false });

    account = await this.createUsecase.perform(account);
    await this.setupAccountRoles(account);
    const data = this.adapter.serialize(account);

    return { status: HttpStatus.Ok, data };
  }

  private async setupAccountRoles(account: AccountEntity): Promise<void> {
    let accountRoles = new AccountRolesEntity({ accountId: account.id, accessRoles: [] });
    accountRoles = await this.createAccountRolesUsecase.perform(accountRoles);
    this.logger.info(`${this.logPrefix} created account roles: ${accountRoles.id} for account: ${account.id}`);
  }
}
