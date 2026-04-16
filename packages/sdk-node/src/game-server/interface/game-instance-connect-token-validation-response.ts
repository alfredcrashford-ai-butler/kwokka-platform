export interface GameInstanceConnectTokenValidationResponse {
  isValid: boolean;
  content?: {
    accountId: string;
    gameInstanceId: string;
  };
}
