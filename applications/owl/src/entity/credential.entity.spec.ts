import { EmailPasswordCredentialEntity, SecretCredentialEntity } from './credential.entity';

describe(EmailPasswordCredentialEntity, () => {
  it('exists', () => {
    expect(EmailPasswordCredentialEntity).toBeTruthy();
  });

  describe('hash()', () => {
    it('returns a string', async () => {
      expect(typeof (await EmailPasswordCredentialEntity.hash('Hey'))).toEqual('string');
    });

    it('returns different result for each hash of the same string', async () => {
      const str = 'My name is John!';

      const result1 = await EmailPasswordCredentialEntity.hash(str);
      const result2 = await EmailPasswordCredentialEntity.hash(str);

      expect(result1).not.toEqual(result2);
    });
  });

  describe('verify()', () => {
    it('verifies the same string correctly for two different hashes', async () => {
      const str = 'My name is John!';
      const hash = await EmailPasswordCredentialEntity.hash(str);
      const entity = new EmailPasswordCredentialEntity({
        accountId: 'ACCOUNT',
        identifier: 'email@example.com',
        data: { email: 'email@example.com', password: hash },
        isVerified: false,
      });

      const isValid = await entity.verify(str);

      expect(isValid).toEqual(true);
    });
  });
});

describe(SecretCredentialEntity, () => {
  it('exists', () => {
    expect(SecretCredentialEntity).toBeTruthy();
  });

  describe('hash()', () => {
    it('returns a string', async () => {
      expect(typeof (await SecretCredentialEntity.hash('Hey'))).toEqual('string');
    });

    it('returns different result for each hash of the same string', async () => {
      const str = 'My name is John!';

      const result1 = await SecretCredentialEntity.hash(str);
      const result2 = await SecretCredentialEntity.hash(str);

      expect(result1).not.toEqual(result2);
    });
  });

  describe('verify()', () => {
    it('verifies the same string correctly for two different hashes', async () => {
      const str = 'My name is John!';
      const hash = await SecretCredentialEntity.hash(str);
      const entity = new SecretCredentialEntity({
        accountId: 'ACCOUNT',
        identifier: 'email@example.com',
        data: { clientId: 'email@example.com', secret: hash },
        isVerified: true,
      });

      const isValid = await entity.verify(str);

      expect(isValid).toEqual(true);
    });
  });
});
