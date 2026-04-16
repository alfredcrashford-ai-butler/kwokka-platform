import { PublicProps } from '@kwokka/utils';
import {
  AccessTokenEntity,
  RefreshTokenEntity,
  RestoreTokenEntity,
  TokenEntity,
  TokenEntityType,
  VerifyTokenEntity,
} from './token.entity';

export class TokenFactory {
  public static get(payload: PublicProps<TokenEntity>): TokenEntity {
    if (payload.type === TokenEntityType.Access) {
      return new AccessTokenEntity(payload);
    }
    if (payload.type === TokenEntityType.Refresh) {
      return new RefreshTokenEntity(payload);
    }
    if (payload.type === TokenEntityType.Restore) {
      return new RestoreTokenEntity(payload);
    }
    if (payload.type === TokenEntityType.Verify) {
      return new VerifyTokenEntity(payload);
    }
    return new TokenEntity(payload);
  }
}
