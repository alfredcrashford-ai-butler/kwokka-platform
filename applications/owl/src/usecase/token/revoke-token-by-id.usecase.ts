import { inject, injectable } from 'inversify';
import { TokenEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { TokenRepository } from '../ports';

@injectable()
export class RevokeTokenByIdUsecase implements Usecase {
  public constructor(@inject(TokenRepository) private tokenRepository: TokenRepository) {}

  public async perform(id: string): Promise<TokenEntity> {
    const token = await this.tokenRepository.update({ filter: { id } }, { revokedAt: new Date() });

    if (!token) {
      return null;
    }

    return token;
  }
}
