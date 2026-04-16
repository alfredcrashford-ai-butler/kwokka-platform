export enum DisconnectReasonCode {
  ApplicationOffline = 'application_offline',
  IncorrectConnectionParams = 'incorrect_connection_params',
  NewConnection = 'new_connection',
  Unknown = 'unknown',
}

export interface DisconnectReason {
  code: string;
  message: string;
}

export const UnknownDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.Unknown,
  message: 'Disconnected from the server due to unknown reason.',
}