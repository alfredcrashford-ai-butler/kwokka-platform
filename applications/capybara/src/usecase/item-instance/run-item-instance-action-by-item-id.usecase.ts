import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceUsecaseValidations } from './item-instance-usecase-validations';
import { ItemInstanceRepository } from '../ports';
import { RunItemInstanceActionUsecase } from './run-item-instance-action.usecase';

@injectable()
export class RunItemInstanceActionByItemIdUsecase implements Usecase {
  public constructor(
    @inject(RunItemInstanceActionUsecase) private runItemInstanceActionUsecase: RunItemInstanceActionUsecase,
    @inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository,
  ) {}

  public async perform(itemId: string, accountId: string, actionKey: string): Promise<ItemInstanceEntity> {
    const itemInstance = await ItemInstanceUsecaseValidations.validateItemInstanceExists(this.itemInstanceRepository, {
      itemId,
      accountId,
    });
    return this.runItemInstanceActionUsecase.perform(itemInstance, actionKey);
  }
}
