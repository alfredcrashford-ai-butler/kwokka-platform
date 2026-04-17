import { ActiveSkillItemKey } from './active-skill-item-key';
import { DiscardRandomCardsSkill } from './discard-random-cards-skill';
import { EmptySkill } from './empty-skill';
import { PlayAnyCardSkill } from './play-any-card-skill';
import { ReduceStartCardsSkill } from './reduce-start-cards-skill';
import { ReplaceOwnHandSkill } from './replace-own-hand-skill';
import { SelectedPlayerBurnsCardsSkill } from './selected-player-burns-cards-skill';
import { SelectedPlayerDrawsCardsSkill } from './selected-player-draws-cards-skill';
import { Skill } from './skill';
import { TransformOwnCardIntoMultidogSkill } from './transform-own-card-into-multidog-skill';
import { TransformRandomOpponentsCardIntoSelectedSkill } from './transform-random-opponents-card-into-selected-skill';

export class SkillFactory {
  public static getActiveSkillInstance(skillKey: ActiveSkillItemKey): Skill {
    switch (skillKey) {
      case ActiveSkillItemKey.ReduceStartCards:
        return new ReduceStartCardsSkill();
      case ActiveSkillItemKey.DiscardRandomCards:
        return new DiscardRandomCardsSkill();
      case ActiveSkillItemKey.PlayAnyCard:
        return new PlayAnyCardSkill();
      case ActiveSkillItemKey.ReplaceOwnHand:
        return new ReplaceOwnHandSkill();
      case ActiveSkillItemKey.SelectedPlayerBurnsCards:
        return new SelectedPlayerBurnsCardsSkill();
      case ActiveSkillItemKey.SelectedPlayerDrawsCards:
        return new SelectedPlayerDrawsCardsSkill();
      case ActiveSkillItemKey.TransormOwnCardIntoMultidog:
        return new TransformOwnCardIntoMultidogSkill();
      case ActiveSkillItemKey.TransformRandomOpponentsCardIntoSelected:
        return new TransformRandomOpponentsCardIntoSelectedSkill();
      default:
        return new EmptySkill();
    }
  }
}
