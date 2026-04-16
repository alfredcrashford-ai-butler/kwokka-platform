import crypto from 'crypto';

export class ScryptHashUtil {
  public static hash(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');

      crypto.scrypt(content, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  public static verify(hash: string, content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      crypto.scrypt(content, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(key === derivedKey.toString('hex'));
      });
    });
  }
}
