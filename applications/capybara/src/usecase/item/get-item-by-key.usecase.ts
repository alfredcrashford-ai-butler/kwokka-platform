import { inject, injectable } from 'inversify';
import { ItemEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemRepository } from '../ports';

@injectable()
export class GetItemByKeyUsecase implements Usecase {
  public constructor(@inject(ItemRepository) private itemRepository: ItemRepository) {}

  public async perform(key: string): Promise<ItemEntity> {
    const item = await this.itemRepository.find({ filter: { key } });
    return item || null;
  }
}
