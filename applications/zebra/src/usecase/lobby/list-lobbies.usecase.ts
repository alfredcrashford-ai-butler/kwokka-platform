import { inject, injectable } from 'inversify';
import { LobbyEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { LobbyRepository } from '../ports';

@injectable()
export class ListLobbiesUsecase implements Usecase {
  public constructor(@inject(LobbyRepository) private lobbyRepository: LobbyRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<LobbyEntity>> {
    return await this.lobbyRepository.list({ offset, limit });
  }
}
