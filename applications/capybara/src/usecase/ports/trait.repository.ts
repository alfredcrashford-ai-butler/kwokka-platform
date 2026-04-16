import { injectable } from 'inversify';
import { TraitEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class TraitRepository extends Repository<TraitEntity> {}
