import type { TokenEntity } from '@kwokka/entities';
import type { Dto } from '@/api/dto';

export type TokenDto = Omit<Dto<TokenEntity>, 'revokedAt' | 'expiresAt'> & { revokedAt: string; expiresAt: string };
