import type { ActiveSkillItemKey } from './active-skill-item-key';
import type { PassiveSkillItemKey } from './passive-skill-item-key';

export interface SkillTreeItem {
  cost: number;
  key: ActiveSkillItemKey | PassiveSkillItemKey;
  requires?: (ActiveSkillItemKey | PassiveSkillItemKey)[];
  type: 'active' | 'passive';
  tier: number;
  itemTradeKey: string;
}

export interface SkillTree {
  items: SkillTreeItem[];
}
