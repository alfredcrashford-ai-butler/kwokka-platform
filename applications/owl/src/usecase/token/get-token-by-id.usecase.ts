import { inject, injectable } from 'inversify';
import { TokenEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { TokenRepository } from '../ports/token.repository';

@injectable()
export class GetTokenByIdUsecase implements Usecase {
  public constructor(@inject(TokenRepository) private tokenRepository: TokenRepository) {}

  public async perform(id: string): Promise<TokenEntity> {
    const token = await this.tokenRepository.find({ filter: { id } });

    if (!token) {
      return null;
    }

    return token;
  }
}
