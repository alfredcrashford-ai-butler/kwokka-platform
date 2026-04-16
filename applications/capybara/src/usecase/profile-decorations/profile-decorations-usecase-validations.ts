import { UsecaseException } from '@kwokka/common-node';
import { ProfileDecorationsEntity } from '@kwokka/entities';
import { ListAvailableDecorationsUsecase } from '../decoration/list-available-decorations.usecase';
import { ExceptionCode } from '../exception-code';
import { DecorationRepository, ProfileDecorationsRepository, ProfileRepository } from '../ports';

export class ProfileDecorationsUsecaseValidations {
  public static validateNoProfileId(profileDecorations: Partial<ProfileDecorationsEntity>): void {
    if (profileDecorations.profileId) {
      throw new UsecaseException(
        ExceptionCode.UpdateOfProfileIdInProfileDecorationsNotAllowed,
        'Change of profile id not allowed in profile decorations',
      );
    }
  }

  public static async validateExists(repo: ProfileDecorationsRepository, id: string): Promise<void> {
    const profileDecorations = await repo.find({ filter: { id } });
    if (!profileDecorations) {
      throw new UsecaseException(
        ExceptionCode.ProfileDecorationsDoNotExist,
        `Profile decorations do not exist, id: ${id}`,
      );
    }
  }

  public static async validateProfileExists(profileRepository: ProfileRepository, id: string): Promise<void> {
    const profile = await profileRepository.find({ filter: { id } });
    if (!profile) {
      throw new UsecaseException(ExceptionCode.ProfileDoesNotExist, `Profile do not exist, id: ${id}`);
    }
  }

  public static async validateProfileDecorationsNotExist(
    profileDecorationsRepository: ProfileDecorationsRepository,
    profileId: string,
  ): Promise<void> {
    const profileDecorations = await profileDecorationsRepository.find({ filter: { profileId } });
    if (profileDecorations) {
      throw new UsecaseException(
        ExceptionCode.ProfileDecorationsAlreadyExist,
        `Profile already has profile decorations, profileId: ${profileId}`,
      );
    }
  }

  public static async validateDecorations(
    repo: DecorationRepository,
    profileDecorations: Partial<ProfileDecorationsEntity>,
  ): Promise<void> {
    const uniqueDecorationIds = Object.values(profileDecorations.decorations).filter(Boolean);
    const result = await repo.listByIds(uniqueDecorationIds);
    if (result.payload.length < uniqueDecorationIds.length) {
      throw new UsecaseException(
        ExceptionCode.DecorationDoesNotExist,
        `Some of the decorations could not be found: ${uniqueDecorationIds}`,
      );
    }

    Object.keys(profileDecorations.decorations).forEach((type) => {
      const decorationId = profileDecorations.decorations[type];
      if (!decorationId) {
        return;
      }

      const decoration = result.payload.find((el) => el.id === decorationId);

      if (decoration.type !== type) {
        throw new UsecaseException(
          ExceptionCode.InvalidDecorationTypeInProfileDecorations,
          `Invalid type, decoration id: ${decorationId}, decoration type: ${decoration.type}, provided type: ${type}`,
        );
      }
    });
  }
}
