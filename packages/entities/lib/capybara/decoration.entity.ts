import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export enum DecorationEntityType {
  Image = 'image',
  Badge = 'badge',
  Background = 'background',
}

export class DecorationEntity extends Entity {
  public applicationAccountId?: string;
  public key: string;
  public type: DecorationEntityType;

  public constructor(params: PublicProps<DecorationEntity>) {
    super(params);
    this.applicationAccountId = params.applicationAccountId;
    this.key = params.key;
    this.type = params.type;
  }
}
