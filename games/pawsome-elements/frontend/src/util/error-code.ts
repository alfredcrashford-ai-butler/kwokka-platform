export enum ErrorCode {
  EntityNotFound = 'ENTITY_NOT_FOUND',
  CredentialInvalid = 'CREDENTIAL_INVALID',
  UnexpectedError = 'UNEXPECTED_ERROR',
  CaptchaError = 'CAPTCHA_ERROR',
  OauthPopupClosed = 'OAUTH_POPUP_CLOSED',
  Forbidden = 'forbidden',
  PlayerIsNotHost = 'player_is_not_host',
  PlayerIsNotInGame = 'player_is_not_in_game',
  LobbyNotFound = 'lobby_not_found',
  TooManyPlayers = 'too_many_players',
  ForbiddenGameStatus = 'forbidden_game_status',
}
