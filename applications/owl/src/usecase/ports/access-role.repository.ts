import { injectable } from 'inversify';
import { AccessRoleEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class AccessRoleRepository extends Repository<AccessRoleEntity> {}
