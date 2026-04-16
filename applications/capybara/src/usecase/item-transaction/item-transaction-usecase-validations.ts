import { ItemEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { ItemRepository } from '../ports';

export class ItemTransactionUsecaseValidations {
  public static async validateItemExists(repo: ItemRepository, id: string): Promise<ItemEntity> {
    const item = await repo.find({ filter: { id } });
    if (!item) {
      throw new UsecaseException(ExceptionCode.ItemDoesNotExist, `Item does not exist, id: ${id}`);
    }

    return item;
  }
}
