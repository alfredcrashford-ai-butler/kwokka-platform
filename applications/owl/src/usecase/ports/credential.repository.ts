import { injectable } from 'inversify';
import { CredentialEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class CredentialRepository extends Repository<CredentialEntity> {}
