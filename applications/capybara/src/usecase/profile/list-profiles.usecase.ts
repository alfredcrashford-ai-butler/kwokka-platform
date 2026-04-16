import { inject, injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { ProfileRepository } from '../ports';

@injectable()
export class ListProfilesUsecase implements Usecase {
  public constructor(@inject(ProfileRepository) private profileRepository: ProfileRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<ProfileEntity>> {
    return await this.profileRepository.list({ offset, limit });
  }
}
