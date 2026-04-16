import { inject, injectable } from 'inversify';
import { ItemTradeEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemTradeRepository } from '../ports';
import { ItemTradeUsecaseValidations } from './item-trade-usecase-validations';

@injectable()
export class DeleteItemTradeUsecase implements Usecase {
  public constructor(@inject(ItemTradeRepository) private itemTradeRepository: ItemTradeRepository) {}

  public async perform(id: string): Promise<ItemTradeEntity> {
    await ItemTradeUsecaseValidations.validateExists(this.itemTradeRepository, id);
    return await this.itemTradeRepository.delete({ filter: { id } });
  }
}
