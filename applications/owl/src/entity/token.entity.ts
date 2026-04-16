import { AccessTokenEntity, RefreshTokenEntity } from '@kwokka/entities';

export type TokenPair = { access: AccessTokenEntity; refresh: RefreshTokenEntity };
