export interface DisconnectReason {
  code: string;
  message: string;
}

export enum DisconnectReasonCode {
  IncorrectConnectionParams = 'incorrect_connection_params',
  NewConnection = 'new_connection',
}

export const IncorrectConnectionParamsDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.IncorrectConnectionParams,
  message: 'Incorrect connection params.',
};

export const NewConnectionDisconnectReason: DisconnectReason = {
  code: DisconnectReasonCode.NewConnection,
  message: 'New client has connected with the same account id.',
};
