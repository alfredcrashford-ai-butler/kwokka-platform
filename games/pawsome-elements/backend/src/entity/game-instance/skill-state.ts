import { ActiveSkillItemKey } from '../skills';

export interface SkillState {
  [playerId: string]: { key: ActiveSkillItemKey; cooldown: number };
}
