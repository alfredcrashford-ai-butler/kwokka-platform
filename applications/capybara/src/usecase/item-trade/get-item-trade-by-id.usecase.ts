import { inject, injectable } from 'inversify';
import { ItemTradeEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemTradeRepository } from '../ports';

@injectable()
export class GetItemTradeByIdUsecase implements Usecase {
  public constructor(@inject(ItemTradeRepository) private itemTradeRepository: ItemTradeRepository) {}

  public async perform(id: string): Promise<ItemTradeEntity> {
    const itemTrade = await this.itemTradeRepository.find({ filter: { id } });
    return itemTrade || null;
  }
}
