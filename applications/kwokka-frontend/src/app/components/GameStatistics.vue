<template>
  <div class="game-stats">
    <div class="game-stats__row">
      <UiCard class="game-stats__stat-card">
        <span class="game-stats__headline">{{ stats.current.currentActiveInstances }}</span>
        <span class="game-stats__caption">{{ $t('general.components.gameStats.activeInstances') }}</span>
      </UiCard>
      <UiCard class="game-stats__stat-card">
        <span class="game-stats__headline">{{ stats.current.currentPlayers }}</span>
        <span class="game-stats__caption">{{ $t('general.components.gameStats.activePlayers') }}</span>
      </UiCard>
    </div>
    <div class="game-stats__list">
      <UiCard class="game-stats__card" v-for="(period, i) in stats.periods" :key="i">
        <div class="game-stats__card-section">
          <span>{{ $t('general.components.gameStats.from') }}: {{ formatDate(period.period.from) }}</span>
          <span>{{ $t('general.components.gameStats.to') }}: {{ formatDate(period.period.to) }}</span>
        </div>
        <div class="game-stats__card-section">
          <span>{{ $t('general.components.gameStats.totalPlayers') }}: {{ period.totalPlayers }}</span>
          <span
            >{{ $t('general.components.gameStats.averagePlayers') }}: {{ formatNumber(period.averagePlayers) }}</span
          >
        </div>
        <div class="game-stats__card-section">
          <span>
            {{ $t('general.components.gameStats.averageDuration') }}:{{ formatDuration(period.averageDuration) }}
          </span>
        </div>
        <div class="game-stats__card-section">
          <span>{{ $t('general.components.gameStats.totalInstances') }}: {{ period.totalInstances }}</span>
          <span>{{ $t('general.components.gameStats.finishedInstances') }}: {{ period.finishedInstances }}</span>
          <span>{{ $t('general.components.gameStats.abandonedInstances') }}: {{ period.abandonedInstances }}</span>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { DateUtil } from '@kwokka/utils';
  import { type GameStats } from '@/api/play/game/game.api';
  import UiCard from '../ui-kit/UiCard.vue';
  import UiHeading from '../ui-kit/UiHeading.vue';

  @Component({
    components: {
      UiHeading,
      UiCard,
    },
  })
  export default class GameStatistics extends Vue {
    @Prop({ required: true })
    public stats: GameStats;

    public formatDate(date?: Date): string {
      return date ? DateUtil.format(date, 'DD.MM.YYYY (HH:mm)') : this.$t('general.components.gameStats.now');
    }

    public formatNumber(n?: number): string {
      return (n || 0).toFixed(2);
    }

    public formatDuration(durationMs?: number): string {
      const totalSeconds = Math.ceil((durationMs || 0) / 1000);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60);
      const secondsStr = `${seconds}`.padStart(2, '0');
      const minutesStr = `${minutes}`.padStart(2, '0');
      return `${minutesStr}:${secondsStr}`;
    }
  }
</script>

<style scoped lang="scss">
  .game-stats {
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__row {
      display: flex;
      @include UiGap(4);
    }

    &__stat-card {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      flex-grow: 1;
      @include UiGap(2);
      @include UiPadding(10);
    }

    &__headline {
      @include UiTypographyHeading1();
    }

    &__caption {
      @include UiTypographyParagraph2();
      opacity: 0.5;
    }

    &__list {
      display: flex;
      flex-direction: column;
      @include UiGap(4);
    }

    &__card {
      @include UiPadding(4);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__card-section {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
    }
  }
</style>
