import { inject, injectable } from 'inversify';
import { GameInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameInstanceRepository } from '../ports/game-instance.repository';

@injectable()
export class GetGameInstanceByIdUsecase implements Usecase {
  public constructor(@inject(GameInstanceRepository) private gameInstanceRepository: GameInstanceRepository) {}

  public async perform(id: string): Promise<GameInstanceEntity> {
    const gameInstance = await this.gameInstanceRepository.find({ filter: { id } });

    if (!gameInstance) {
      return null;
    }

    return gameInstance;
  }
}
