import { ScryptHashUtil } from '@kwokka/common-node';
import {
  EmailPasswordCredentialEntity as CommonEmailPasswordCredentialEntity,
  SecretCredentialEntity as CommonSecretCredentialEntity,
} from '@kwokka/entities';

export class EmailPasswordCredentialEntity extends CommonEmailPasswordCredentialEntity {
  public static hash(password: string): Promise<string> {
    return ScryptHashUtil.hash(password);
  }

  public verify(password: string): Promise<boolean> {
    return ScryptHashUtil.verify(this.data.password, password);
  }
}

export class SecretCredentialEntity extends CommonSecretCredentialEntity {
  public static hash(secret: string): Promise<string> {
    return ScryptHashUtil.hash(secret);
  }

  public verify(secret: string): Promise<boolean> {
    return ScryptHashUtil.verify(this.data.secret, secret);
  }
}
