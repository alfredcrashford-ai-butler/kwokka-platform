import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class TraitInstanceEntity<Value = any> extends Entity {
  public accountId: string;
  public traitId: string;
  public value: Value;

  public constructor(params: PublicProps<TraitInstanceEntity>) {
    super(params);
    this.accountId = params.accountId;
    this.traitId = params.traitId;
    this.value = params.value ?? null;
  }
}
