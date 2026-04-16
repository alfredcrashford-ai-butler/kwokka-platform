import { inject, injectable } from 'inversify';
import { LobbyEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameInstanceRepository, LobbyRepository } from '../ports';
import { LobbyUsecaseValidations } from './lobby-usecase-validations';

@injectable()
export class DeleteLobbyUsecase implements Usecase {
  public constructor(
    @inject(LobbyRepository) private lobbyRepository: LobbyRepository,
    @inject(GameInstanceRepository) private gameInstanceRepository: GameInstanceRepository,
  ) {}

  public async perform(id: string): Promise<LobbyEntity> {
    await LobbyUsecaseValidations.validateExists(this.lobbyRepository, id);

    await this.gameInstanceRepository.delete({ filter: { gameId: id } });
    return await this.lobbyRepository.delete({ filter: { id } });
  }
}
