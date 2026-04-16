import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class GameEntity extends Entity {
  // TODO: add access differentiation (i.e. alpha, beta, public beta, release)
  public key: string;
  public applicationAccountId: string;
  public url?: string;
  public tags?: string[];
  public availableSince?: Date;
  public availableTill?: Date;

  public constructor(params: PublicProps<GameEntity>) {
    super(params);
    this.key = params.key;
    this.url = params.url;
    this.tags = params.tags;
    this.applicationAccountId = params.applicationAccountId;
    this.availableSince = params.availableSince;
    this.availableTill = params.availableTill;
  }

  public isAvailable(): boolean {
    const now = Date.now();
    const since = this.availableSince ? now > this.availableSince.getTime() : true;
    const till = this.availableTill ? now < this.availableTill.getTime() : true;
    return since && till;
  }

  public isAvailabilityRangeValid(): boolean {
    if (!this.availableSince || !this.availableTill) {
      return true;
    }
    return this.availableSince.getTime() < this.availableTill.getTime();
  }
}
