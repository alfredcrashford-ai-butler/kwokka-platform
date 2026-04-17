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

  <RankedMatchGameResults
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
  import { AbandonedGameState, GameState, RankedMatchSearchState } from '../states';
  import { RankedMatchGameResults } from '../results';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { CommonGameViewComponent } from '../components/common-game-view-component';

  @Component({
    components: {
      RankedMatchGameResults,
    },
  })
  export default class RankedMatchGameView extends CommonGameViewComponent {
    @Watch('gameInstance.status')
    public onStatusChange(newStatus: GameInstanceEntityStatus, oldStatus: GameInstanceEntityStatus): void {
      if (newStatus !== oldStatus && newStatus === GameInstanceEntityStatus.Finished) {
        this.trackerService.event(TrackingCategory.Game, TrackingEvent.RankedMatchLobbyTypeFinished);
      }
    }

    public get activeComponent(): typeof Vue {
      if (this.gameInstance.status === GameInstanceEntityStatus.Initial) {
        return markRaw(RankedMatchSearchState);
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
