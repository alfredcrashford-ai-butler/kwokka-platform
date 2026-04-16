import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';
import { DecorationEntityType } from './decoration.entity';

export class ProfileDecorationsEntity extends Entity {
  public profileId: string;
  public decorations: { [type in DecorationEntityType]: string };

  public constructor(params: PublicProps<ProfileDecorationsEntity>) {
    super(params);
    this.profileId = params.profileId;
    this.decorations = params.decorations;
  }
}
