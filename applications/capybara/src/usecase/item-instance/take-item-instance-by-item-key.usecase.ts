import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceUsecaseValidations } from './item-instance-usecase-validations';
import { ItemRepository } from '../ports';
import { TakeItemInstanceUsecase } from './take-item-instance.usecase';

@injectable()
export class TakeItemInstanceByItemKeyUsecase implements Usecase {
  public constructor(
    @inject(TakeItemInstanceUsecase) private takeItemInstanceUsecase: TakeItemInstanceUsecase,
    @inject(ItemRepository) private itemRepository: ItemRepository,
  ) {}

  public async perform(
    accountId: string,
    key: string,
    quantity: number,
    applicationAccountId?: string,
  ): Promise<ItemInstanceEntity> {
    const filter: any = { key };
    if (applicationAccountId) {
      filter.applicationAccountId = applicationAccountId;
    }
    const item = await ItemInstanceUsecaseValidations.validateItemExists(this.itemRepository, filter);
    return this.takeItemInstanceUsecase.perform(accountId, item.id, quantity, applicationAccountId);
  }
}
