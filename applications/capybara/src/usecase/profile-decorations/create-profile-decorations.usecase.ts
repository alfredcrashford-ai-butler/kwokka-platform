import { inject, injectable } from 'inversify';
import { ProfileDecorationsEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileDecorationsRepository } from '../ports/profile-decorations.repository';
import { ProfileDecorationsUsecaseValidations } from './profile-decorations-usecase-validations';
import { DecorationRepository, ProfileRepository } from '../ports';

@injectable()
export class CreateProfileDecorationsUsecase implements Usecase {
  public constructor(
    @inject(ProfileDecorationsRepository) private profileDecorationsRepository: ProfileDecorationsRepository,
    @inject(DecorationRepository) private decorationRepository: DecorationRepository,
    @inject(ProfileRepository) private profileRepository: ProfileRepository,
  ) {}

  public async perform(profileDecorations: ProfileDecorationsEntity): Promise<ProfileDecorationsEntity> {
    await ProfileDecorationsUsecaseValidations.validateProfileDecorationsNotExist(
      this.profileDecorationsRepository,
      profileDecorations.profileId,
    );
    await ProfileDecorationsUsecaseValidations.validateProfileExists(
      this.profileRepository,
      profileDecorations.profileId,
    );
    await ProfileDecorationsUsecaseValidations.validateDecorations(this.decorationRepository, profileDecorations);

    // TODO: add validation that user has decoration

    return await this.profileDecorationsRepository.create(profileDecorations);
  }
}
