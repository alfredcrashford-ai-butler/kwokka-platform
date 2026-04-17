export enum PlayerAction {
  StartGame = 'start_game',
  SkipTurn = 'skip_turn',
  PlayCard = 'play_card',
  PlayCardInOthersTurn = 'play_card_in_others_turn',
  InteractCard = 'interact_card',
  AddBot = 'add_bot',
  PlaySkill = 'play_skill',
  DoubleReward = 'double_reward',
  // Leave = 'leave',
}

export enum RoomPlayerAction {
  UpdateRoomVisibility = 'update_room_visibility',
  KickPlayer = 'kick_player',
}
