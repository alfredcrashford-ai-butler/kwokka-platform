import { GameInstanceEntity, GameInstanceEntityStatus } from '@kwokka/entities';
import { PauseReason, PauseState, PauseStateDetails } from '../pause-state';
import { PublicState } from '../public-state';

const MAX_DISCONNECT_PAUSE_DURATION_MS = 10000;

export class PauseGameFeature {
  public constructor(private game: GameInstanceEntity<PublicState>) {}

  public get isPaused(): boolean {
    return Boolean(this.game.state.publicState.pause);
  }

  public get canPause(): boolean {
    return !this.isPaused && this.game.status === GameInstanceEntityStatus.InProgress;
  }

  public pause(reason: PauseReason, details?: PauseStateDetails, pauseEndsAt?: number): void {
    const pausedAt = this.game.state.publicState.pause?.pausedAt || Date.now();
    this.game.state.publicState.pause = {
      reason,
      pauseEndsAt,
      pausedAt,
      details: details || undefined,
    };
  }

  public pauseOnDisconnected(accountId: string): void {
    const now = Date.now();
    const reason = PauseReason.PlayerDisconnected;
    const details = {
      entries: [
        ...(this.game.state.publicState.pause?.details?.entries || []),
        { accountId, disconnectedAt: now, removeAt: now + MAX_DISCONNECT_PAUSE_DURATION_MS },
      ],
    };
    const pauseEndsAt = this.getLastReconnectAt(details.entries);
    this.pause(reason, details, pauseEndsAt);
  }

  public get canResume(): boolean {
    return this.isPaused && this.game.status === GameInstanceEntityStatus.InProgress;
  }

  public get isPausedForPlayerDisconnect(): boolean {
    return this.isPaused && this.game.state.publicState?.pause?.reason === PauseReason.PlayerDisconnected;
  }

  public resume(): void {
    if (!this.isPaused) {
      return;
    }

    const now = Date.now();
    const pause = this.game.state.publicState.pause || ({} as PauseState);
    const pausedAt = pause.pausedAt ?? now;
    const pauseDuration = Math.max(now - pausedAt, 0);
    this.advanceTimers(pauseDuration);
    delete this.game.state.publicState.pause;
  }

  public resumeAfterDisconnected(accountId: string): void {
    const pause = this.game.state.publicState.pause || ({} as PauseState);
    pause.details = { entries: (pause.details?.entries || []).filter((el) => el.accountId !== accountId) };
    if (!pause.details?.entries?.length) {
      this.resume();
    } else {
      pause.pauseEndsAt = this.getLastReconnectAt(pause.details.entries);
    }
  }

  public getMillisecondsTillPauseEnd(): number {
    if (!this.game.state.publicState.pause?.pauseEndsAt) {
      return 0;
    }

    const now = Date.now();
    return Math.max(this.game.state.publicState.pause?.pauseEndsAt - now, 0);
  }

  private advanceTimers(duration: number): void {
    this.game.state.publicState.turnEndAt = this.game.state.publicState.turnEndAt + duration;
  }

  private getLastReconnectAt(entries: { removeAt: number }[]): number {
    return entries.map((el) => el.removeAt).reduce((max, n) => (n > max ? n : max), 0);
  }
}
