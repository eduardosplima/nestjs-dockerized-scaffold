import { pbkdf2, randomBytes } from 'crypto';

export class HashBase64Util {
  static generateSalt(size = 16): string {
    return randomBytes(size).toString('base64');
  }

  static async hashData(data: string, salt: string): Promise<string> {
    if (data && salt) {
      return new Promise((resolve, reject) => {
        pbkdf2(
          data,
          Buffer.from(salt, 'base64'),
          120000,
          64,
          'SHA512',
          (err, derivedKey) => {
            if (err) {
              reject(err);
            } else {
              resolve(derivedKey.toString('base64'));
            }
          },
        );
      });
    }

    return null;
  }
}
