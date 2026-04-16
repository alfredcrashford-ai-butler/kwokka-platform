import { PublicProps } from '@kwokka/utils';
import {
  AnonymousCredentialEntity,
  CredentialEntity,
  CredentialEntityType,
  DiscordCredentialEntity,
  EmailPasswordCredentialEntity,
  GoogleCredentialEntity,
  SecretCredentialEntity,
} from './credential.entity';

export class CredentialFactory {
  public static get(payload: PublicProps<CredentialEntity>): CredentialEntity {
    if (payload.type === CredentialEntityType.Anonymous) {
      return new AnonymousCredentialEntity(payload);
    }
    if (payload.type === CredentialEntityType.EmailPassword) {
      return new EmailPasswordCredentialEntity(payload);
    }
    if (payload.type === CredentialEntityType.Google) {
      return new GoogleCredentialEntity(payload);
    }
    if (payload.type === CredentialEntityType.Discord) {
      return new DiscordCredentialEntity(payload);
    }
    if (payload.type === CredentialEntityType.Secret) {
      return new SecretCredentialEntity(payload);
    }
    return new CredentialEntity(payload);
  }
}
