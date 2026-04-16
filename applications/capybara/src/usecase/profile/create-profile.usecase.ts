import { inject, injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ProfileRepository } from '../ports/profile.repository';
import { ProfileUsecaseValidations } from './profile-usecase-validations';
import { GiveItemInstanceUsecase } from '../item-instance/give-item-instance.usecase';
import { ItemRepository } from '../ports/item.repository';
import { ItemKey } from '../item-key';
import { ItemInstanceRepository } from '../ports';

@injectable()
export class CreateProfileUsecase implements Usecase {
  public constructor(
    @inject(ProfileRepository) private profileRepository: ProfileRepository,
    @inject(ItemRepository) private itemRepository: ItemRepository,
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
    @inject(GiveItemInstanceUsecase) private giveItemInstanceUsecase: GiveItemInstanceUsecase,
  ) {}

  public async perform(profile: ProfileEntity): Promise<ProfileEntity> {
    profile.name = profile.name.trim();
    await ProfileUsecaseValidations.validateNoProfileForAccount(this.profileRepository, profile.accountId);
    await ProfileUsecaseValidations.validateNameUnique(this.profileRepository, profile.name);

    profile = await this.profileRepository.create(profile);

    const beginnerItem = await this.itemRepository.find({ filter: { key: ItemKey.RookiesBackpack } });

    const existingItemInstance = await this.itemInstanceRepository.find({
      filter: { accountId: profile.accountId, itemId: beginnerItem.id },
    });
    if (!existingItemInstance || !existingItemInstance.quantity) {
      await this.giveItemInstanceUsecase.perform(profile.accountId, beginnerItem.id, 1);
    }

    return profile;
  }
}
