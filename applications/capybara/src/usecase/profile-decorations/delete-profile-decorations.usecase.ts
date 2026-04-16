import { inject, injectable } from 'inversify';
import { ProfileDecorationsEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileDecorationsRepository } from '../ports';
import { ProfileDecorationsUsecaseValidations } from './profile-decorations-usecase-validations';

@injectable()
export class DeleteProfileDecorationsUsecase implements Usecase {
  public constructor(
    @inject(ProfileDecorationsRepository) private profileDecorationsRepository: ProfileDecorationsRepository,
  ) {}

  public async perform(id: string): Promise<ProfileDecorationsEntity> {
    await ProfileDecorationsUsecaseValidations.validateExists(this.profileDecorationsRepository, id);
    return await this.profileDecorationsRepository.delete({ filter: { id } });
  }
}
