import { inject, injectable } from 'inversify';
import { ProfileDecorationsEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileDecorationsRepository } from '../ports/profile-decorations.repository';

@injectable()
export class GetProfileDecorationsByProfileIdUsecase implements Usecase {
  public constructor(
    @inject(ProfileDecorationsRepository) private profileDecorationsRepository: ProfileDecorationsRepository,
  ) {}

  public async perform(profileId: string): Promise<ProfileDecorationsEntity> {
    const profileDecorations = await this.profileDecorationsRepository.find({ filter: { profileId } });

    if (!profileDecorations) {
      return null;
    }

    return profileDecorations;
  }
}
