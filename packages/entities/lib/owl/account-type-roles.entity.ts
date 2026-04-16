import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';
import { AccountEntityType } from './account.entity';

export class AccountTypeRolesEntity extends Entity {
  public type: AccountEntityType;
  public accessRolesIds: string[];

  public constructor(params: PublicProps<AccountTypeRolesEntity>) {
    super(params);
    this.type = params.type;
    this.accessRolesIds = params.accessRolesIds;
  }
}
