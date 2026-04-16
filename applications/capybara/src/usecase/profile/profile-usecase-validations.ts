import { ProfileEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { ProfileRepository } from '../ports';

export class ProfileUsecaseValidations {
  public static async validateNoAccountId(profile: Partial<ProfileEntity>): Promise<void> {
    if (profile.accountId) {
      throw new UsecaseException(
        ExceptionCode.UpdateOfAccountIdInProfileNotAllowed,
        'Update of account id in Profile is not allowed',
      );
    }
  }

  public static async validateExists(profileRepository: ProfileRepository, id: string): Promise<void> {
    const profile = await profileRepository.find({ filter: { id } });
    if (!profile) {
      throw new UsecaseException(ExceptionCode.ProfileDoesNotExist, `Profile do not exist, id: ${id}`);
    }
  }

  public static async validateNoProfileForAccount(profileRepository: ProfileRepository, accountId: string): Promise<void> {
    const profile = await profileRepository.find({ filter: { accountId } });
    if (profile) {
      throw new UsecaseException(
        ExceptionCode.ProfileAlreadyExist,
        `Profile for this account already exist, accountId: ${accountId}`,
      );
    }
  }

  public static async validateNameUnique(
    profileRepository: ProfileRepository,
    name: string,
    id?: string,
  ): Promise<void> {
    const filter: any = { name };
    if (id) {
      filter.id = { $ne: id };
    }
    const profile = await profileRepository.find({ filter });
    if (profile) {
      throw new UsecaseException(
        ExceptionCode.ProfileNameIsAlreadyTaken,
        `Profile with given name already exists, name: ${name}`,
      );
    }
  }
}
