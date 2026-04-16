import { injectable } from 'inversify';
import { TraitInstanceEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class TraitInstanceRepository extends Repository<TraitInstanceEntity> {}
