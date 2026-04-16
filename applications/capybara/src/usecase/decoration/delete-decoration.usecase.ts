import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { DecorationEntity } from '@kwokka/entities';
import { DecorationRepository, ItemRepository, ProfileDecorationsRepository } from '../ports';
import { DecorationUsecaseValidations } from './decoration-usecase-validations';

@injectable()
export class DeleteDecorationUsecase implements Usecase {
  public constructor(
    @inject(DecorationRepository) private decorationRepository: DecorationRepository,
    @inject(ProfileDecorationsRepository) private profileDecorationsRepository: ProfileDecorationsRepository,
    @inject(ItemRepository) private itemRepository: ItemRepository,
  ) {}

  public async perform(id: string): Promise<DecorationEntity> {
    const decoration = await DecorationUsecaseValidations.validateExists(this.decorationRepository, id);
    await this.cleanupRelatedEntities(decoration);
    return await this.decorationRepository.delete({ filter: { id } });
  }

  private async cleanupRelatedEntities(decoration: DecorationEntity) {
    await this.profileDecorationsRepository.removeDecorationFromProfileDecorations(decoration);
    await this.itemRepository.removeDecorationFromItems(decoration);
  }
}
