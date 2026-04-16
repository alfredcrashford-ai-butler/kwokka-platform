import { inject, injectable } from 'inversify';
import { LobbyEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { LobbyRepository } from '../ports';

@injectable()
export class GetLobbyByKeyUsecase implements Usecase {
  public constructor(@inject(LobbyRepository) private lobbyRepository: LobbyRepository) {}

  public async perform(key: string): Promise<LobbyEntity> {
    const lobby = await this.lobbyRepository.find({ filter: { key } });

    if (!lobby) {
      return null;
    }

    return lobby;
  }
}
