import { PublicProps } from '@kwokka/utils';

export class Entity {
  public id?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public constructor(params: PublicProps<Entity>) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}
