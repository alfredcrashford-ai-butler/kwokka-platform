import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class AccessRightEntity extends Entity {
  public name: string;

  public constructor(params: PublicProps<AccessRightEntity>) {
    super(params);
    this.name = params.name;
  }
}
