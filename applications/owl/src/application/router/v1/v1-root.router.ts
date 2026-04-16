import { inject, injectable, injectFromBase } from 'inversify';
import { Router } from '@kwokka/common-node';
import { AccessRightV1Router } from './access-right';
import { AccessRoleV1Router } from './access-role';
import { AccountRolesV1Router } from './account-roles';
import { AccountTypeRolesV1Router } from './account-type-roles';
import { AccountV1Router } from './account';
import { CredentialV1Router } from './credential';
import { OnboardingV1Router } from './onboarding';
import { TokenV1Router } from './token';

@injectable()
@injectFromBase()
export class V1RootRouter extends Router {
  public constructor(
    @inject(AccessRightV1Router) private accessRightV1Router: AccessRightV1Router,
    @inject(AccessRoleV1Router) private accessRoleV1Router: AccessRoleV1Router,
    @inject(AccountRolesV1Router) private accountRolesV1Router: AccountRolesV1Router,
    @inject(AccountTypeRolesV1Router) private accountTypeRolesV1Router: AccountTypeRolesV1Router,
    @inject(AccountV1Router) private accountV1Router: AccountV1Router,
    @inject(CredentialV1Router) private credentialV1Router: CredentialV1Router,
    @inject(TokenV1Router) private tokenV1Router: TokenV1Router,
    @inject(OnboardingV1Router) private onboardingV1Router: OnboardingV1Router,
  ) {
    super();
    this.addRouter('/access-rights', this.accessRightV1Router);
    this.addRouter('/access-roles', this.accessRoleV1Router);
    this.addRouter('/account-roles', this.accountRolesV1Router);
    this.addRouter('/account-type-roles', this.accountTypeRolesV1Router);
    this.addRouter('/accounts', this.accountV1Router);
    this.addRouter('/credentials', this.credentialV1Router);
    this.addRouter('/tokens', this.tokenV1Router);
    this.addRouter('/onboarding', this.onboardingV1Router);
  }
}
