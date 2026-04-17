import { Component, Watch } from 'vue-facing-decorator';
import { CommonGameComponent } from './common-game-component';
import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
import { GameInstanceEntityStatus } from '@kwokka/entities';

@Component
export class CommonGameViewComponent extends CommonGameComponent {
  @Watch('gameInstance.status')
  protected trackGameFinished(newStatus: GameInstanceEntityStatus, oldStatus: GameInstanceEntityStatus): void {
    if (newStatus !== oldStatus && newStatus === GameInstanceEntityStatus.Finished) {
      this.trackerService.event(TrackingCategory.Game, TrackingEvent.GameFinished);
    }
  }

  @Watch('gameInstance.status')
  protected trackGameStarted(newStatus: GameInstanceEntityStatus, oldStatus: GameInstanceEntityStatus): void {
    if (newStatus !== oldStatus && newStatus === GameInstanceEntityStatus.InProgress) {
      this.trackerService.event(TrackingCategory.Game, TrackingEvent.GameStarted);
    }
  }
}
