<template>
  <component
    v-if="activeComponent"
    :is="activeComponent"
    :game="game"
    :connection="connection"
    :gameInstance="gameInstance"
    :lobby="lobby"
    :controller="controller"
    :playerId="playerId"
    :inert="isFinished"
  />

  <QuickMatchGameResults
    v-if="isFinished"
    :game="game"
    :connection="connection"
    :gameInstance="gameInstance"
    :lobby="lobby"
    :controller="controller"
    :playerId="playerId"
    @doubleReward="onDoubleReward()"
  />
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Vue, Watch } from 'vue-facing-decorator';
  import { GameInstanceEntityStatus } from '@kwokka/entities';
  import QuickMatchGameResults from '../results/QuickMatchGameResults.vue';
  import { AbandonedGameState, GameState, QuickMatchSearchState } from '../states';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { CommonGameViewComponent } from '../components/common-game-view-component';

  @Component({
    components: {
      QuickMatchGameResults,
    },
  })
  export default class QuickMatchGameView extends CommonGameViewComponent {
    @Watch('gameInstance.status')
    public onStatusChange(newStatus: GameInstanceEntityStatus, oldStatus: GameInstanceEntityStatus): void {
      if (newStatus !== oldStatus && newStatus === GameInstanceEntityStatus.Finished) {
        this.trackerService.event(TrackingCategory.Game, TrackingEvent.QuickMatchLobbyTypeFinished);
      }
    }

    public get activeComponent(): typeof Vue {
      if (this.gameInstance.status === GameInstanceEntityStatus.Initial) {
        return markRaw(QuickMatchSearchState);
      }

      if ([GameInstanceEntityStatus.InProgress, GameInstanceEntityStatus.Finished].includes(this.gameInstance.status)) {
        return markRaw(GameState);
      }

      if (this.gameInstance.status === GameInstanceEntityStatus.Abandoned) {
        return markRaw(AbandonedGameState);
      }

      return null;
    }

    public onDoubleReward(): void {
      this.controller.sendDoubleRewardAction();
    }
  }
</script>
