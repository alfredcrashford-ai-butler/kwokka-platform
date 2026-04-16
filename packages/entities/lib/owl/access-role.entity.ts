import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class AccessRoleEntity extends Entity {
  public name: string;
  public description: string;
  public accessRightsIds: string[];

  public constructor(params: PublicProps<AccessRoleEntity>) {
    super(params);
    this.name = params.name;
    this.description = params.description;
    this.accessRightsIds = params.accessRightsIds;
  }
}
