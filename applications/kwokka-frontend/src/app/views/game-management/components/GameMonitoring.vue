<template>
  <div class="game-monitoring">
    <UiHeading class="game-monitoring__heading">{{ $t('gameManagement.monitoring.title') }}</UiHeading>

    <hr class="game-monitoring__divider" />

    <UiLoader v-if="!stats" />
    <GameStatistics :stats="stats" v-else />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { GameApi, type GameStats } from '@/api/play/game/game.api';
  import type { GameEntity } from '@kwokka/entities';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import GameStatistics from '@/app/components/GameStatistics.vue';
  import { NotificationService } from '@/service/notification/notification.service';

  @Component({
    components: {
      UiLoader,
      UiHeading,
      GameStatistics,
    },
  })
  export default class GameMonitoring extends Vue {
    public stats: GameStats = null;

    @LazyInject(GameApi)
    private gameApi: GameApi;

    @Prop({ required: true })
    public game: GameEntity;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public mounted(): void {
      this.fetchStats();
    }

    private async fetchStats(): Promise<void> {
      try {
        this.stats = await this.gameApi.getGameStats(this.game.id);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }
  }
</script>

<style scoped lang="scss">
  .game-monitoring {
    &__heading {
      @include UiMargin(10, bottom);
    }
  }
</style>
