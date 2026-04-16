import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class ProfileEntity extends Entity {
  public accountId: string;
  public name: string;
  public locale: string;

  public constructor(params: PublicProps<ProfileEntity>) {
    super(params);
    this.accountId = params.accountId;
    this.name = params.name;
    this.locale = params.locale;
  }

  // TODO: add checks that name can not be longer than 8 characters and can not have spacebars
}
