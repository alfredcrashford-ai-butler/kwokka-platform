import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export enum AccountEntityType {
  User = 'user',
  Application = 'application',
  ApplicationAdmin = 'application_admin',
  PlatformAdmin = 'platform_admin',
}

export class AccountEntity extends Entity {
  public type: AccountEntityType;
  public isActive: boolean;
  public isVerified: boolean;

  public constructor(params: PublicProps<AccountEntity>) {
    super(params);
    this.type = params.type || AccountEntityType.User;
    this.isActive = params.isActive ?? true;
    this.isVerified = params.isVerified ?? false;
  }

  public static getNewUserAccount(): AccountEntity {
    return new AccountEntity({ type: AccountEntityType.User, isActive: true, isVerified: false });
  }
}
