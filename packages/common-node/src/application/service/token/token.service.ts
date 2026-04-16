import { inject, injectable } from 'inversify';
import { ConfigService } from '../config';
import { EnvVarName, JwtUtil } from '../../../util';

export type TokenPayload = string | object;

@injectable()
export class TokenService {
  private jwtKey: string;

  public constructor(@inject(ConfigService) private configService: ConfigService) {
    this.jwtKey = this.configService.get(EnvVarName.JwtKey);
  }

  public sign<T extends TokenPayload>(data: T): string {
    return JwtUtil.sign(data, this.jwtKey);
  }

  public verify<T extends TokenPayload>(token: string): T {
    try {
      const data = JwtUtil.verify<T>(token, this.jwtKey);
      return data;
    } catch (e) {
      return null;
    }
  }
}
