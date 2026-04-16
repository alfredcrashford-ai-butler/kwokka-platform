import { inject, injectable } from 'inversify';
import { ProfileDecorationsEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileDecorationsRepository } from '../ports/profile-decorations.repository';
import { ProfileDecorationsUsecaseValidations } from './profile-decorations-usecase-validations';
import { DecorationRepository } from '../ports/decoration.repository';

@injectable()
export class UpdateProfileDecorationsUsecase implements Usecase {
  public constructor(
    @inject(ProfileDecorationsRepository) private profileDecorationsRepository: ProfileDecorationsRepository,
    @inject(DecorationRepository) private decorationRepository: DecorationRepository,
  ) {}

  public async perform(
    id: string,
    profileDecorations: Partial<ProfileDecorationsEntity>,
  ): Promise<ProfileDecorationsEntity> {
    await ProfileDecorationsUsecaseValidations.validateExists(this.profileDecorationsRepository, id);
    ProfileDecorationsUsecaseValidations.validateNoProfileId(profileDecorations);
    if (profileDecorations.decorations) {
      await ProfileDecorationsUsecaseValidations.validateDecorations(this.decorationRepository, profileDecorations);
    }

    // TODO: add validation that user has decoration

    return await this.profileDecorationsRepository.update({ filter: { id } }, profileDecorations);
  }
}
