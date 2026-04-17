import { Component, Prop, Vue } from 'vue-facing-decorator';
import { GameInstanceEntityStatus, type GameEntity, type LobbyEntity } from '@kwokka/entities';
import { LazyInject } from '@/ioc';
import { ErrorTrackerService, KwokkaService, LoggerService, TrackerService } from '@/service';
import type { PwsmGameInstanceEntity } from '@/game-data/game-instance/pwsm-game-instance.entity';
import type { PwsmGameController } from '../controller';
import type { GameConnection } from '@kwokka/sdk-js';

@Component
export class CommonGameComponent extends Vue {
  @LazyInject(KwokkaService)
  public kwokkaService: KwokkaService;

  @LazyInject(TrackerService)
  public trackerService: TrackerService;

  @LazyInject(ErrorTrackerService)
  public errorTracker: ErrorTrackerService;

  @LazyInject(LoggerService)
  public logger: LoggerService;

  @Prop({ required: true })
  public game: GameEntity;

  @Prop({ required: true })
  public gameInstance: PwsmGameInstanceEntity;

  @Prop({ required: true })
  public lobby: LobbyEntity;

  @Prop({ required: true })
  public controller: PwsmGameController;

  @Prop({ required: true })
  public connection: GameConnection;

  @Prop({ required: true })
  public playerId: string;

  public get playerCount(): number {
    return this.gameInstance.players?.length || 0;
  }

  public get isPlayerHost(): boolean {
    return this.gameInstance?.lobbySettings?.hostAccountId === this.playerId;
  }

  public get isFinished(): boolean {
    return this.gameInstance.status === GameInstanceEntityStatus.Finished;
  }
}
