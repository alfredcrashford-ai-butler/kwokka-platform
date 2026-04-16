export type FeatureToggleEntityId = string;

export interface FeatureToggleEntityConstructorParams {
  id: FeatureToggleEntityId;
  isGloballyEnabled: boolean;
  enabledUserGroups: string[];
}

export class FeatureToggleEntity {
  public id: FeatureToggleEntityId;

  public isGloballyEnabled: boolean;

  public enabledUserGroups: string[];

  public constructor(params: FeatureToggleEntityConstructorParams) {
    this.id = params.id;
    this.isGloballyEnabled = params.isGloballyEnabled;
    this.enabledUserGroups = params.enabledUserGroups;
  }
}

export enum FeatureToggleName {
  STORE = 'store',
  ADS = 'ads',
  PUBLIC_LOBBY = 'public_lobby',
}
