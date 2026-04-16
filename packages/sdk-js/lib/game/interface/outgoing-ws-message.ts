export enum OutgoingWsMessageType {
  PlayerAction = 'player_action',
}

export interface PlayerActionData {
  name: string;
  content: any;
}
