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

  <RoomGameResults
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
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import RoomGameResults from '../results/RoomGameResults.vue';
  import { AbandonedGameState, GameState, RoomPreparationState } from '../states';
  import { CommonGameViewComponent } from '../components/common-game-view-component';

  @Component({
    components: {
      RoomGameResults,
    },
  })
  export default class RoomGameView extends CommonGameViewComponent {
    @Watch('gameInstance.status')
    public onLastPlayedCardChange(newStatus: GameInstanceEntityStatus, oldStatus: GameInstanceEntityStatus): void {
      if (newStatus !== oldStatus && newStatus === GameInstanceEntityStatus.Finished) {
        this.trackerService.event(TrackingCategory.Game, TrackingEvent.RoomLobbyTypeFinished);
      }
    }

    public get activeComponent(): typeof Vue {
      if (this.gameInstance.status === GameInstanceEntityStatus.Initial) {
        return markRaw(RoomPreparationState);
      }

      if ([GameInstanceEntityStatus.Finished, GameInstanceEntityStatus.InProgress].includes(this.gameInstance.status)) {
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
