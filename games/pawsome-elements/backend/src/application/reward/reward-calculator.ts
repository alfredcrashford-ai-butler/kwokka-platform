import { KwokkaSdkNodeClient } from '@kwokka/sdk-node';
import { PwsmGameInstanceEntity } from '../../entity/game-instance/pwsm-game-instance.entity';
import { PassiveSkillItemKey } from '../../entity/skills';
import { ErrorTrackerUtil } from '../../util/error-tracker.util';
import { EssenceRewardConfig } from '../../entity';

export class RewardCalculator {
  public constructor(protected client: KwokkaSdkNodeClient) {}

  public async calculateRewards(
    gameInstance: PwsmGameInstanceEntity,
    positions: string[],
  ): Promise<Record<string, number>> {
    const rewardConfig = gameInstance.lobbySettings.essence;
    const multipliers = await this.getMultipliers(gameInstance);
    const rewards = this.getRewards(positions, rewardConfig, multipliers);
    return rewards;
  }

  private async getMultipliers(gameInstance: PwsmGameInstanceEntity): Promise<Record<string, number>> {
    const multipliers: Record<string, number> = {};
    const multipliersKeys = Object.values(PassiveSkillItemKey);
    const playerIds = gameInstance.getRealPlayersIds();
    playerIds.forEach((id) => (multipliers[id] = 1));

    try {
      const promises = playerIds.map((playerId) =>
        Promise.all(
          multipliersKeys.map(async (key) => {
            const itemInstance = await this.client.inventory.getItemInstanceByItemKey(key, playerId);
            if (itemInstance?.quantity) {
              multipliers[playerId] += 1;
            }
          }),
        ),
      );
      await Promise.all(promises);
    } catch (e: any) {
      ErrorTrackerUtil.captureException(e);
    } finally {
      return multipliers;
    }
  }

  private getRewards(
    playerIds: string[],
    config: EssenceRewardConfig,
    multipliers: Record<string, number>,
  ): Record<string, number> {
    const rewards: Record<string, number> = {};
    playerIds.forEach((id, i) => (rewards[id] = this.calculateEssence(config, i, playerIds.length, multipliers[id])));
    return rewards;
  }

  private calculateEssence(config: EssenceRewardConfig, index: number, count: number, multiplier: number): number {
    const multipliers = config.multipliers.slice(0, count).reverse();
    return Math.ceil(config.base * multipliers[index]) * multiplier;
  }
}
