import { injectable } from 'inversify';
import { LobbyEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class LobbyRepository extends Repository<LobbyEntity> {}
