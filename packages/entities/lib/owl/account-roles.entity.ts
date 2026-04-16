import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class AccountRolesEntity extends Entity {
  public accountId: string;
  public accessRoles: { id: string; enabled: boolean }[];

  public constructor(params: PublicProps<AccountRolesEntity>) {
    super(params);
    this.accountId = params.accountId;
    this.accessRoles = params.accessRoles;
  }
}
