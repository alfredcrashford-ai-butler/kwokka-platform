export enum ActiveSkillItemKey {
  ReduceStartCards = 'pwsm_spell_reduce_start_cards',
  SelectedPlayerDrawsCards = 'pwsm_spell_selected_player_draws_cards',
  TransormOwnCardIntoMultidog = 'pwsm_spell_transform_own_card_into_multidog',
  ReplaceOwnHand = 'pwsm_spell_replace_own_hand',
  SelectedPlayerBurnsCards = 'pwsm_spell_selected_player_burns_cards',
  PlayAnyCard = 'pwsm_spell_play_any_card',
  TransformRandomOpponentsCardIntoSelected = 'pwsm_spell_transform_random_opponents_card_into_selected',
  DiscardRandomCards = 'pwsm_spell_discard_random_cards',
}

export const RealActiveSkillItemKeys = [
  ActiveSkillItemKey.ReduceStartCards,
  ActiveSkillItemKey.SelectedPlayerDrawsCards,
  ActiveSkillItemKey.TransormOwnCardIntoMultidog,
  ActiveSkillItemKey.ReplaceOwnHand,
  ActiveSkillItemKey.PlayAnyCard,
  ActiveSkillItemKey.TransformRandomOpponentsCardIntoSelected,
  ActiveSkillItemKey.DiscardRandomCards,
];

export const CardPayloadSkillKeys = [
  ActiveSkillItemKey.TransormOwnCardIntoMultidog,
  ActiveSkillItemKey.PlayAnyCard,
  ActiveSkillItemKey.TransformRandomOpponentsCardIntoSelected,
];

export const PlayerPayloadSkillKeys = [
  ActiveSkillItemKey.SelectedPlayerDrawsCards,
  ActiveSkillItemKey.SelectedPlayerBurnsCards,
];

export const EmptyPayloadSkillKeys = [
  ActiveSkillItemKey.ReduceStartCards,
  ActiveSkillItemKey.ReplaceOwnHand,
  ActiveSkillItemKey.DiscardRandomCards,
];
