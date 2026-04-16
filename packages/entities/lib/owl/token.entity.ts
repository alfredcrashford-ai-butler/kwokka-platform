import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';
import { AccountEntityType } from './account.entity';

const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;
const MONTH_MILLISECONDS = 1000 * 60 * 60 * 24 * 30;
const HOUR_MILLISECONDS = 1000 * 60 * 60;

export enum TokenEntityType {
  Refresh = 'refresh',
  Access = 'access',
  Restore = 'restore',
  Verify = 'verify',
}

export interface TokenContent {
  type: TokenEntityType;
  accountId: string;
  correlationId: string;
  // Expiration time
  exp: number;
  // Issued at time
  iat: number;
  // JWT id, id of the token entity
  jti: string;
}

export interface AccessTokenContent extends TokenContent {
  type: TokenEntityType.Access;
  accountType: AccountEntityType;
  rights: string[];
}

export interface RefreshTokenContent extends TokenContent {
  type: TokenEntityType.Refresh;
}

export interface RestoreTokenContent<T = any> extends TokenContent {
  type: TokenEntityType.Restore;
  data: T;
}

export interface VerifyTokenContent extends TokenContent {
  type: TokenEntityType.Verify;
  credentialId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TokenEntity<T = any> extends Entity {
  public type: TokenEntityType;
  public revokedAt?: Date;
  public content: T;
  public accountId: string;
  public credentialId: string;
  public expiresAt?: Date;
  public correlationId: string;
  public static AccessTokenExpiryInterval = DAY_MILLISECONDS;
  public static RefreshTokenExpiryInterval = MONTH_MILLISECONDS;
  public static RestoreTokenExpiryInterval = HOUR_MILLISECONDS;
  public static VerifyTokenExpiryInterval = HOUR_MILLISECONDS;

  public constructor(params: PublicProps<TokenEntity>) {
    super(params);
    this.type = params.type;
    this.revokedAt = params.revokedAt;
    this.content = params.content;
    this.expiresAt = params.expiresAt;
    this.accountId = params.accountId;
    this.credentialId = params.credentialId;
    this.correlationId = params.correlationId;
  }

  public revoke(): void {
    this.revokedAt = new Date();
  }

  public isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }

    return this.expiresAt.getTime() < Date.now();
  }

  public isRevoked(): boolean {
    return Boolean(this.revokedAt);
  }
}

export class AccessTokenEntity extends TokenEntity<AccessTokenContent> {
  public declare type: TokenEntityType.Access;

  public constructor(params: Omit<PublicProps<AccessTokenEntity>, 'type'>) {
    super({ ...params, type: TokenEntityType.Access });
  }
}

export class RefreshTokenEntity extends TokenEntity<RefreshTokenContent> {
  public declare type: TokenEntityType.Refresh;

  public constructor(params: Omit<PublicProps<TokenEntity<RefreshTokenContent>>, 'type'>) {
    super({ ...params, type: TokenEntityType.Refresh });
  }
}

export class RestoreTokenEntity<T = any> extends TokenEntity<RestoreTokenContent<T>> {
  public declare type: TokenEntityType.Restore;

  public constructor(params: Omit<PublicProps<TokenEntity<RestoreTokenContent>>, 'type'>) {
    super({ ...params, type: TokenEntityType.Restore });
  }
}

export class VerifyTokenEntity extends TokenEntity<VerifyTokenContent> {
  public declare type: TokenEntityType.Verify;

  public constructor(params: Omit<PublicProps<TokenEntity<VerifyTokenContent>>, 'type'>) {
    super({ ...params, type: TokenEntityType.Verify });
  }
}
