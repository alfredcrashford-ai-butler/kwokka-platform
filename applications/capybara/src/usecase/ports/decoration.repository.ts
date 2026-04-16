import { injectable } from 'inversify';
import { DecorationEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class DecorationRepository extends Repository<DecorationEntity> {}
