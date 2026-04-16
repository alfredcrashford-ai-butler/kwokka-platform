import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export enum CredentialEntityType {
  Anonymous = 'anonymous',
  EmailPassword = 'email_password',
  Google = 'google',
  Discord = 'discord',
  Secret = 'secret',
}

export class CredentialEntity<T = any> extends Entity {
  public accountId: string;
  public type: CredentialEntityType;
  public identifier: string;
  public data: T;
  public isVerified: boolean;

  public constructor(params: PublicProps<CredentialEntity>) {
    super(params);
    this.type = params.type;
    this.accountId = params.accountId;
    this.identifier = params.identifier;
    this.data = params.data;
    this.isVerified = params.isVerified || false;
  }

  public isVerifiable(): boolean {
    return [CredentialEntityType.EmailPassword].includes(this.type);
  }
}

export class AnonymousCredentialEntity extends CredentialEntity<{ accountId: string }> {
  public declare type: CredentialEntityType.Anonymous;

  public constructor(params: Omit<PublicProps<CredentialEntity<{ accountId: string }>>, 'type'>) {
    super({ ...params, type: CredentialEntityType.Anonymous });
  }
}

export class EmailPasswordCredentialEntity extends CredentialEntity<{ email: string; password: string }> {
  public static readonly PasswordMinLength = 6;
  public static readonly PasswordMaxLength = 30;
  public declare type: CredentialEntityType.EmailPassword;

  public constructor(params: Omit<PublicProps<CredentialEntity<{ email: string; password: string }>>, 'type'>) {
    super({ ...params, type: CredentialEntityType.EmailPassword });
  }

  public static isPasswordValid(password: string): boolean {
    if (!password) {
      return false;
    }

    if (!this.passwordHasValidLength(password)) {
      return false;
    }

    if (!this.passwordHasUppercaseLetter(password)) {
      return false;
    }

    if (!this.passwordHasLowercaseLetter(password)) {
      return false;
    }

    if (!this.passwordHasNumber(password)) {
      return false;
    }

    if (!this.passwordHasOnlyAllowedCharacters(password)) {
      return false;
    }

    return true;
  }

  public static passwordHasValidLength(password: string): boolean {
    return password.length >= this.PasswordMinLength && password.length <= this.PasswordMaxLength;
  }

  public static passwordHasUppercaseLetter(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  public static passwordHasLowercaseLetter(password: string): boolean {
    return /[a-z]/.test(password);
  }

  public static passwordHasNumber(password: string): boolean {
    return /[0-9]/.test(password);
  }

  public static passwordHasOnlyAllowedCharacters(password: string): boolean {
    return /^[A-Za-z0-9!$%&?]+$/.test(password);
  }

  public static isEmailValid(email: string): boolean {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  }
}

export interface GoogleCredentialData {
  // unique user identifier for google account
  sub: string;
  email: string;
  scopes: string[];
  azp: string;
  aud: string;
}

export class GoogleCredentialEntity extends CredentialEntity<GoogleCredentialData> {
  public declare type: CredentialEntityType.Google;

  public constructor(params: Omit<PublicProps<CredentialEntity<GoogleCredentialData>>, 'type'>) {
    super({ ...params, type: CredentialEntityType.Google });
  }
}

export interface DiscordCredentialData {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  verified?: string;
  email?: string;
}

export class DiscordCredentialEntity extends CredentialEntity<DiscordCredentialData> {
  public declare type: CredentialEntityType.Discord;

  public constructor(params: Omit<PublicProps<CredentialEntity<DiscordCredentialData>>, 'type'>) {
    super({ ...params, type: CredentialEntityType.Discord });
  }
}

export interface SecretCredentialData {
  clientId: string;
  secret: string;
}

export class SecretCredentialEntity extends CredentialEntity<SecretCredentialData> {
  public declare type: CredentialEntityType.Secret;

  public constructor(params: Omit<PublicProps<CredentialEntity<SecretCredentialData>>, 'type'>) {
    super({ ...params, type: CredentialEntityType.Secret });
  }
}
