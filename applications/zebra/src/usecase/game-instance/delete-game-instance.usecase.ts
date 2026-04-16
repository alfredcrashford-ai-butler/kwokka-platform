import { inject, injectable } from 'inversify';
import { GameInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { GameInstanceUsecaseValidations } from './game-instance-usecase-validations';
import { GameInstanceRepository } from '../ports/game-instance.repository';

@injectable()
export class DeleteGameInstanceUsecase implements Usecase {
  public constructor(@inject(GameInstanceRepository) private gameInstanceRepository: GameInstanceRepository) {}

  public async perform(id: string): Promise<GameInstanceEntity> {
    await GameInstanceUsecaseValidations.validateExists(this.gameInstanceRepository, id);

    return await this.gameInstanceRepository.delete({ filter: { id } });
  }
}
