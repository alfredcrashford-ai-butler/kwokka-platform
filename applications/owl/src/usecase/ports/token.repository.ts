import { injectable } from 'inversify';
import { TokenEntity, TokenEntityType } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class TokenRepository extends Repository<TokenEntity> {
  public abstract findLastTokenInCorrelation(correlationId: string, type: TokenEntityType): Promise<TokenEntity>;
}
