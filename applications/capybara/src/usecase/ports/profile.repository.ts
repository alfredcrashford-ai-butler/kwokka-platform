import { injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class ProfileRepository extends Repository<ProfileEntity> {}
