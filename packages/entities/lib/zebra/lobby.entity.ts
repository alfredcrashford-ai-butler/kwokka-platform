import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export class LobbyEntity<LobbyConfig = any> extends Entity {
  // TODO: add access differentiation (i.e. alpha, beta, public beta, release)
  public key: string;
  public gameId: string;
  public minPlayers: number;
  public maxPlayers: number;
  public config: LobbyConfig;
  public availableSince?: Date;
  public availableTill?: Date;

  public constructor(params: PublicProps<LobbyEntity>) {
    super(params);
    this.key = params.key;
    this.gameId = params.gameId;
    this.minPlayers = params.minPlayers;
    this.maxPlayers = params.maxPlayers;
    this.config = params.config;
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
    return LobbyEntity.isAvailabilityRangeValid(this.availableSince!, this.availableTill!);
  }

  public isPlayerRangeValid(): boolean {
    return LobbyEntity.isPlayerRangeValid(this.minPlayers, this.maxPlayers);
  }

  public static isAvailabilityRangeValid(availableSince: Date, availableTill: Date): boolean {
    if (!availableSince || !availableTill) {
      return true;
    }
    return availableSince.getTime() < availableTill.getTime();
  }

  public static isPlayerRangeValid(minPlayers: number, maxPlayers: number): boolean {
    if (!minPlayers || !maxPlayers) {
      return false;
    }
    return minPlayers <= maxPlayers;
  }
}
