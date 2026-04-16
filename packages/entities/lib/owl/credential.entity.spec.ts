import {
  AnonymousCredentialEntity,
  CredentialEntity,
  CredentialEntityType,
  DiscordCredentialEntity,
  EmailPasswordCredentialEntity,
  GoogleCredentialEntity,
  SecretCredentialEntity,
} from './credential.entity';

describe(CredentialEntity, () => {
  it('exists', () => {
    expect(CredentialEntity).toBeTruthy();
  });

  it('works', () => {
    const credential = new CredentialEntity({
      type: CredentialEntityType.Anonymous,
      accountId: 'acc_1',
      identifier: 'acc_1',
      data: null,
      isVerified: false,
    });

    expect(credential).toBeTruthy();
  });

  describe(CredentialEntity.prototype.isVerifiable, () => {
    let credential: CredentialEntity;

    beforeEach(() => {
      credential = new CredentialEntity({
        type: CredentialEntityType.Anonymous,
        accountId: 'acc_1',
        identifier: 'acc_1',
        data: null,
        isVerified: false,
      });
    });

    it('exists', () => {
      expect(credential.isVerifiable).toBeInstanceOf(Function);
    });

    it('returns true for email', () => {
      credential.type = CredentialEntityType.EmailPassword;

      expect(credential.isVerifiable()).toEqual(true);
    });

    it('returns false for anon', () => {
      credential.type = CredentialEntityType.Anonymous;

      expect(credential.isVerifiable()).toEqual(false);
    });
  });
});

describe(AnonymousCredentialEntity, () => {
  it('exists', () => {
    expect(AnonymousCredentialEntity).toBeTruthy();
  });

  it('has anonymous type when created', () => {
    const entity = new AnonymousCredentialEntity({
      accountId: 'acc_1',
      identifier: 'acc_1',
      data: { accountId: 'acc_1' },
      isVerified: false,
    });

    expect(entity.type).toEqual(CredentialEntityType.Anonymous);
  });
});

describe(EmailPasswordCredentialEntity, () => {
  it('exists', () => {
    expect(EmailPasswordCredentialEntity).toBeTruthy();
  });

  it('has email_password type when created', () => {
    const entity = new EmailPasswordCredentialEntity({
      accountId: 'acc_1',
      identifier: 'example@example.com',
      data: { email: 'example@example.com', password: '***' },
      isVerified: false,
    });

    expect(entity.type).toEqual(CredentialEntityType.EmailPassword);
  });

  describe('isEmailValid', () => {
    it('returns true for gmail email', () => {
      expect(EmailPasswordCredentialEntity.isEmailValid('test@gmail.com')).toEqual(true);
    });
  });

  describe('isPasswordValid', () => {
    it('returns true for password with uppercase and lowercase letters, numbers, allowed symbols and of correct length', () => {
      expect(EmailPasswordCredentialEntity.isPasswordValid('Qwerty12345')).toEqual(true);
    });

    it('returns false for empty password', () => {
      expect(EmailPasswordCredentialEntity.isPasswordValid('')).toEqual(false);
      expect(EmailPasswordCredentialEntity.isPasswordValid(null as any)).toEqual(false);
      expect(EmailPasswordCredentialEntity.isPasswordValid(undefined as any)).toEqual(false);
    });

    it('returns false for short password of 5 characters or less', () => {
      expect(EmailPasswordCredentialEntity.isPasswordValid('abc')).toEqual(false);
      expect(EmailPasswordCredentialEntity.isPasswordValid('abcd')).toEqual(false);
      expect(EmailPasswordCredentialEntity.isPasswordValid('abcde')).toEqual(false);
    });

    it('returns false for long password of 31 characters or more', () => {
      expect(EmailPasswordCredentialEntity.isPasswordValid('abcdefghijklmnopqrstuvwxyz12345')).toEqual(false);
    });

    it('returns false for password without uppercase letter', () => {
      expect(EmailPasswordCredentialEntity.isPasswordValid('qwerty12345')).toEqual(false);
    });

    it('returns false for password without lowercase letter', () => {
      expect(EmailPasswordCredentialEntity.isPasswordValid('QWERTY12345')).toEqual(false);
    });

    it('returns false for password without digits', () => {
      expect(EmailPasswordCredentialEntity.isPasswordValid('QWERTYqwerty')).toEqual(false);
    });

    it('returns false for password with unallowed symbols', () => {
      expect(EmailPasswordCredentialEntity.isPasswordValid('Qwerty12345{\\')).toEqual(false);
    });
  });
});

describe(GoogleCredentialEntity, () => {
  it('exists', () => {
    expect(GoogleCredentialEntity).toBeTruthy();
  });

  it('has google type when created', () => {
    const entity = new GoogleCredentialEntity({
      accountId: 'acc_1',
      identifier: '***',
      data: { sub: '***', email: '***', scopes: ['***'], azp: '***', aud: '***' },
      isVerified: false,
    });

    expect(entity.type).toEqual(CredentialEntityType.Google);
  });
});

describe(DiscordCredentialEntity, () => {
  it('exists', () => {
    expect(DiscordCredentialEntity).toBeTruthy();
  });

  it('has google type when created', () => {
    const entity = new DiscordCredentialEntity({
      accountId: 'acc_1',
      identifier: '***',
      data: { id: '***', discriminator: '***', global_name: '***', username: '***' },
      isVerified: false,
    });

    expect(entity.type).toEqual(CredentialEntityType.Discord);
  });
});

describe(SecretCredentialEntity, () => {
  it('exists', () => {
    expect(SecretCredentialEntity).toBeTruthy();
  });

  it('has secret type when created', () => {
    const entity = new SecretCredentialEntity({
      accountId: 'acc_1',
      identifier: '***',
      data: { clientId: '***', secret: '***' },
      isVerified: false,
    });

    expect(entity.type).toEqual(CredentialEntityType.Secret);
  });
});
