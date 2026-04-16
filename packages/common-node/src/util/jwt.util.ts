import jwt from 'jsonwebtoken';

export class JwtUtil {
  public static sign<T extends string | object | Buffer>(data: T, secret: string): string {
    return jwt.sign(data, secret);
  }

  public static verify<T = any>(token: string, secret: string): T {
    return jwt.verify(token, secret) as T;
  }

  public static parse<T = any>(token: string): T {
    return jwt.decode(token) as T;
  }
}
