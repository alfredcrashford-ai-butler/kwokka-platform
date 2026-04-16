import { inject, injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileRepository } from '../ports';
import { ProfileUsecaseValidations } from './profile-usecase-validations';

@injectable()
export class UpdateProfileUsecase implements Usecase {
  public constructor(@inject(ProfileRepository) private profileRepository: ProfileRepository) {}

  public async perform(id: string, profile: Partial<ProfileEntity>): Promise<ProfileEntity> {
    await ProfileUsecaseValidations.validateExists(this.profileRepository, id);
    ProfileUsecaseValidations.validateNoAccountId(profile);
    if (profile.name) {
      profile.name = profile.name.trim();
      await ProfileUsecaseValidations.validateNameUnique(this.profileRepository, profile.name, id);
    }

    return await this.profileRepository.update({ filter: { id } }, profile);
  }
}
