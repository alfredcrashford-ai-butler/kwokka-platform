import { injectable } from 'inversify';
import { AccessRightEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class AccessRightRepository extends Repository<AccessRightEntity> {}
