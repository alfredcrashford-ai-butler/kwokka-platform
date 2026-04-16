import { CredentialFactory } from './credential-factory';
import {
  AnonymousCredentialEntity,
  CredentialEntity,
  CredentialEntityType,
  DiscordCredentialEntity,
  EmailPasswordCredentialEntity,
  GoogleCredentialEntity,
  SecretCredentialEntity,
} from './credential.entity';

describe(CredentialFactory, () => {
  it('exists', () => {
    expect(CredentialFactory).toBeTruthy();
  });

  describe('get()', () => {
    it('returns anon credential when is called with type - anonymous', () => {
      const cred = CredentialFactory.get({
        type: CredentialEntityType.Anonymous,
        accountId: 'ACC',
        identifier: 'ID',
        data: null,
        isVerified: false,
      });

      expect(cred).toBeInstanceOf(AnonymousCredentialEntity);
    });

    it('returns email password credential when is called with type - email password', () => {
      const cred = CredentialFactory.get({
        type: CredentialEntityType.EmailPassword,
        accountId: 'ACC',
        identifier: 'ID',
        data: null,
        isVerified: false,
      });

      expect(cred).toBeInstanceOf(EmailPasswordCredentialEntity);
    });

    it('returns google credential when is called with type - google', () => {
      const cred = CredentialFactory.get({
        type: CredentialEntityType.Google,
        accountId: 'ACC',
        identifier: 'ID',
        data: null,
        isVerified: false,
      });

      expect(cred).toBeInstanceOf(GoogleCredentialEntity);
    });

    it('returns discord credential when is called with type - discord', () => {
      const cred = CredentialFactory.get({
        type: CredentialEntityType.Discord,
        accountId: 'ACC',
        identifier: 'ID',
        data: null,
        isVerified: false,
      });

      expect(cred).toBeInstanceOf(DiscordCredentialEntity);
    });

    it('returns secret credential when is called with type - secret', () => {
      const cred = CredentialFactory.get({
        type: CredentialEntityType.Secret,
        accountId: 'ACC',
        identifier: 'ID',
        data: null,
        isVerified: false,
      });

      expect(cred).toBeInstanceOf(SecretCredentialEntity);
    });

    it('returns default credential when is called with unknown type', () => {
      const cred = CredentialFactory.get({
        type: 'unknown' as any,
        accountId: 'ACC',
        identifier: 'ID',
        data: null,
        isVerified: false,
      });

      expect(cred).toBeInstanceOf(CredentialEntity);
    });
  });
});
