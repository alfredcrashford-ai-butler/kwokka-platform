export interface DisconnectReason {
  code: string;
  message: string;
}

export enum DisconnectReasonCode {
  Kick = 'kick',
  Leave = 'leave',
  TooManyPlayers = 'too_many_players',
  GameAlreadyInProgress = 'game_already_in_progress',
  GameAbandoned = 'game_abandoned',
  PlayerLeft = 'player_left',
  GameBelongsToOtherPlayer = 'game_belongs_to_other_player',
}

export const KickDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.Kick,
  message: 'You have been kicked from the room.'
}

export const LeaveDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.Leave,
  message: 'You have left the room.'
}

export const GameAlreadyInProgressDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.GameAlreadyInProgress,
  message: 'Game is already in progress and you can not join it now.'
}

export const GameBelongsToOtherPlayerDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.GameBelongsToOtherPlayer,
  message: 'This game belongs to another player.'
}

export const TooManyPlayersDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.TooManyPlayers,
  message: 'There is no place left in this game.'
}

export const GameAbandonedDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.GameAbandoned,
  message: 'Game is abandoned and you can not join it.'
}

export const PlayerLeftDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.PlayerLeft,
  message: 'A player left this game and it can not be continued.'
}
