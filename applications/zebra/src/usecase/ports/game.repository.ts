import { injectable } from 'inversify';
import { GameEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class GameRepository extends Repository<GameEntity> {}
