import { injectable } from 'inversify';
import { DecorationEntity, ProfileDecorationsEntity } from '@kwokka/entities';
import { Repository } from '@kwokka/common-node';

@injectable()
export abstract class ProfileDecorationsRepository extends Repository<ProfileDecorationsEntity> {
  public abstract removeDecorationFromProfileDecorations(decoration: DecorationEntity): Promise<void>;
}
