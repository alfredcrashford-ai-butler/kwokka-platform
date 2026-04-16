import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export enum TraitType {
  Text = 'text',
  Numeric = 'numeric',
  Boolean = 'boolean',
  Item = 'item',
  Custom = 'custom',
}

export class TraitEntity<Config = any, Value = any> extends Entity {
  public key: string;
  public type: TraitType;
  public applicationAccountId: string;
  public defaultValue?: Value;
  public isOwnerEditable?: boolean;
  public isPubliclyVisible?: boolean;
  public config?: Config;

  public constructor(params: PublicProps<TraitEntity>) {
    super(params);
    this.key = params.key;
    this.type = params.type;
    this.applicationAccountId = params.applicationAccountId;
    this.isOwnerEditable = params.isOwnerEditable;
    this.isPubliclyVisible = params.isPubliclyVisible;
    this.config = params.config;
    this.defaultValue = params.defaultValue;
  }
}

export class NumericTraitEntity extends TraitEntity<null, number> {
  public declare type: TraitType.Numeric;

  public constructor(params: Omit<PublicProps<TraitEntity<null, number>>, 'type' | 'config'>) {
    super({ ...params, type: TraitType.Numeric });
  }
}

export class TextTraitEntity extends TraitEntity<null, string> {
  public declare type: TraitType.Text;

  public constructor(params: Omit<PublicProps<TraitEntity<null, string>>, 'type' | 'config'>) {
    super({ ...params, type: TraitType.Text });
  }
}

export class BooleanTraitEntity extends TraitEntity<null, boolean> {
  public declare type: TraitType.Boolean;

  public constructor(params: Omit<PublicProps<TraitEntity<null, boolean>>, 'type' | 'config'>) {
    super({ ...params, type: TraitType.Boolean });
  }
}

export interface ItemTraitConfig {
  allowedItemsIds?: string[];
}

export class ItemTraitEntity extends TraitEntity<ItemTraitConfig, string> {
  public declare type: TraitType.Item;

  public constructor(params: Omit<PublicProps<TraitEntity<ItemTraitConfig, string>>, 'type'>) {
    super({ ...params, type: TraitType.Item });
  }
}

export class CustomTraitEntity extends TraitEntity<any, any> {
  public declare type: TraitType.Custom;

  public constructor(params: Omit<PublicProps<TraitEntity<any, any>>, 'type' | 'isOwnerEditable'>) {
    super({ ...params, isOwnerEditable: false, type: TraitType.Custom });
  }
}
