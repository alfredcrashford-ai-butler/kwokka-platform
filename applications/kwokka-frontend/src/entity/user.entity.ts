import { ArrayUtil } from '@kwokka/utils';
import { FeatureToggleEntity } from './feature-toggle.entity';

export type UserEntityId = string;

export interface UserEntityConstructorParams {
  id: UserEntityId;
  email: string;
  locale: string;
  name: string;
  imageUrl: string;
  featureToggles: string[];
  groups: string[];
  isAnon: boolean;
  isVerified: boolean;
  onboarding: { [id in string]: boolean };
  isOnboardingDisabled: boolean;
}

export const UserAvatarEmoji = [
  '🐵',
  '🐶',
  '🐱',
  '🐯',
  '🐮',
  '🐷',
  '🐭',
  '🐹',
  '🐰',
  '🦁',
  '🦊',
  '🐻',
  '🐨',
  '🐼',
  '🐲',
  '🐸',
  '🌚',
  '🌝',
];

export enum UserOnboardingId {
  DASHBOARD = 'dashboard',
  ABSURD = 'absurd',
  ADMIRADO = 'admirado',
  SPACE_CUSTOMS = 'spaceCustoms',
  CODEMEMES = 'codememes',
  BIG_BOSSES_ATTACK = 'bigBossesAttack',
  BIG_BOSSES_DEFENCE = 'bigBossesDefence',
  LOBBIES = 'lobbies',
  LOBBIES_UNRANKED = 'lobbiesUnranked',
  LOBBIES_COMPETITIVE = 'lobbiesCompetitive',
  LOBBIES_PARTY_PASS = 'lobbiesPartyPass',
  PAWSOME_ELEMENTS = 'pawsomeElements',
}

export enum UserGroupName {
  ADMIN = 'admin',
  USER = 'user',
  EARLY_ADOPTER = 'early_adopter',
  PAWSOME_ELEMENTS_TESTER = 'pawsome_elements_tester',
}

export class UserEntity {
  public id: UserEntityId;

  public email: string;

  public isAnon: boolean;

  public isVerified: boolean;

  public locale: string;

  public name: string;

  public imageUrl: string;

  public featureToggles: string[];

  public groups: string[];

  public onboarding: { [id in string]: boolean };

  public isOnboardingDisabled: boolean;

  public constructor(params: UserEntityConstructorParams) {
    this.id = params.id;
    this.email = params.email;
    this.isAnon = params.isAnon;
    this.isVerified = params.isVerified;
    this.locale = params.locale;
    this.name = params.name;
    this.imageUrl = params.imageUrl;
    this.featureToggles = params.featureToggles;
    this.groups = params.groups;
    this.onboarding = params.onboarding;
    this.isOnboardingDisabled = params.isOnboardingDisabled;
  }

  public hasAnyGroup(userGroups: UserGroupName[]): boolean {
    return ArrayUtil.includesAny(userGroups, this.groups);
  }

  public get isEarlyAdopter(): boolean {
    return this.hasAnyGroup([UserGroupName.EARLY_ADOPTER]);
  }

  public get isAdmin(): boolean {
    return this.hasAnyGroup([UserGroupName.ADMIN]);
  }

  public canHaveOnboarding(id: string): boolean {
    if (this.isOnboardingDisabled) {
      return false;
    }

    return !this.onboarding || !this.onboarding[id];
  }

  public getEnabledFeatureToggles(toggles: FeatureToggleEntity[]) {
    const enabledToggles = toggles.filter(
      (el) =>
        el.isGloballyEnabled ||
        ArrayUtil.includesAny(el.enabledUserGroups, this.groups) ||
        this.featureToggles?.some((toggle) => toggle === el.id),
    );
    return enabledToggles.map((el) => el.id);
  }
}
