import { inject, injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileRepository } from '../ports';

@injectable()
export class GetProfileByIdUsecase implements Usecase {
  public constructor(@inject(ProfileRepository) private profileRepository: ProfileRepository) {}

  public async perform(id: string): Promise<ProfileEntity> {
    const profile = await this.profileRepository.find({ filter: { id } });

    if (!profile) {
      return null;
    }

    return profile;
  }
}
