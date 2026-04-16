import { UuidUtil } from '@kwokka/utils';
import { GameInstanceEntity, GameInstanceEntityStatus } from '@kwokka/entities';
import { ConfigService, ErrorTrackerService, Initializer, ScheduleService } from '@kwokka/common-node';
import { inject, injectable, injectFromBase } from 'inversify';
import { GameInstanceRepository } from '../../usecase';
import { EnvVarName } from '../env-var-name';

const BATCH_SIZE = 50;
const THRESHOLD_MS = 10 * 60 * 1000;

@injectable()
@injectFromBase()
export class ScheduleGameInstanceCleanupInitializer extends Initializer {
  @inject(ScheduleService)
  public scheduleService: ScheduleService;

  @inject(GameInstanceRepository)
  public gameInstanceRepository: GameInstanceRepository;

  @inject(ConfigService)
  public configService: ConfigService;

  @inject(ErrorTrackerService)
  public errorTrackerService: ErrorTrackerService;

  protected async intialize(): Promise<void> {
    this.scheduleService.schedule(this.configService.get(EnvVarName.GameInstanceCleanupCrontab), async () => {
      const uuid = UuidUtil.generate();

      try {
        this.logger.info(`Cleanup of outdated game instances started, op_id: ${uuid}`);

        await this.gameInstanceRepository.iterateActive(
          { limit: BATCH_SIZE, sort: { createdAt: 'asc' } },
          async ({ payload: activeGameInstances, metadata }) => {
            this.logger.info(`Checking batch:`, metadata, `, op_id: ${uuid}`);

            const danglingGameInstances = this.getDanglingGameInstances(activeGameInstances);
            const danglingGameInstancesIds = danglingGameInstances.map((el) => el.id);

            this.logger.info(
              `Got ${danglingGameInstancesIds.length} dangling game instances in batch:`,
              metadata,
              `, op_id: ${uuid}`,
            );

            await this.gameInstanceRepository.updateByIds(danglingGameInstancesIds, {
              status: GameInstanceEntityStatus.Abandoned,
            });

            this.logger.info('Updated batch:', metadata, `, op_id: ${uuid}`);
          },
        );
      } catch (e: any) {
        this.logger.error(`Error during cleanup of game instances, error: `, e);
        this.errorTrackerService.captureError(e);
      }
    });
  }

  private getDanglingGameInstances(gameInstances: GameInstanceEntity[]): GameInstanceEntity[] {
    return gameInstances.filter((gameInstance: GameInstanceEntity) => {
      const updatedAtMs = gameInstance.updatedAt.getTime();
      const nowMs = Date.now();
      return updatedAtMs + THRESHOLD_MS > nowMs;
    });
  }
}
