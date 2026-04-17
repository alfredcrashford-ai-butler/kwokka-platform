export enum PauseReason {
  PlayerDisconnected = 'player_disconnected',
}

export interface PlayerDisconnectedPauseDetails {
  entries: { accountId: string; disconnectedAt: number, removeAt: number }[];
}

export type PauseStateDetails = undefined | null | PlayerDisconnectedPauseDetails;

export interface PauseState {
  pausedAt: number;
  reason: PauseReason;
  details: PauseStateDetails;
  pauseEndsAt?: number;
}
