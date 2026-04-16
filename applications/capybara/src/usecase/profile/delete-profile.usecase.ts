import { inject, injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileRepository } from '../ports';
import { ProfileUsecaseValidations } from './profile-usecase-validations';

@injectable()
export class DeleteProfileUsecase implements Usecase {
  public constructor(@inject(ProfileRepository) private profileRepository: ProfileRepository) {}

  public async perform(id: string): Promise<ProfileEntity> {
    await ProfileUsecaseValidations.validateExists(this.profileRepository, id);
    return await this.profileRepository.delete({ filter: { id } });
  }
}
