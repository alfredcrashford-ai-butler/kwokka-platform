import { inject, injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileRepository } from '../ports';

@injectable()
export class GetProfileByAccountIdUsecase implements Usecase {
  public constructor(@inject(ProfileRepository) private profileRepository: ProfileRepository) {}

  public async perform(accountId: string): Promise<ProfileEntity> {
    const profile = await this.profileRepository.find({ filter: { accountId } });

    if (!profile) {
      return null;
    }

    return profile;
  }
}
