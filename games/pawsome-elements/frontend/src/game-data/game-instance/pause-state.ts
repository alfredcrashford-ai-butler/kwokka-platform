export enum PauseReason {
  HostPaused = 'host_paused',
  PlayerDisconnected = 'player_disconnected',
}

export interface PlayerDisconnectedPauseDetails {
  entries: { playerId: string; disconnectedAt: number; removeAt: number };
}

export type PauseStateDetails = undefined | null | PlayerDisconnectedPauseDetails;

export interface PauseState {
  pausedAt: number;
  reason: PauseReason;
  details: PauseStateDetails;
  pauseEndsAt?: number;
}
