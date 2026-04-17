<template>
  <div class="game-results">
    <ResultsCard :heading="$t('game.results.heading')" @transitionEnd="$emit('transitionEnd')">
      <div class="game-results__content">
        <div class="game-results__players" :data-players="playersIds.length">
          <div class="game-results__player" v-for="(id, i) in playersIds" :key="id" :style="{ gridArea: `p${i + 1}` }">
            <PlayerResultEntry
              :playerId="id"
              :gameInstance="gameInstance"
              :index="i + 1"
              :isCurrentPlayer="id === playerId"
            />
          </div>
        </div>

        <hr class="game-results__delimiter" />

        <Transition mode="out-in" name="game-results-section">
          <slot></slot>
        </Transition>
      </div>
    </ResultsCard>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import ResultsCard from './ResultsCard.vue';
  import PlayerResultEntry from './PlayerResultEntry.vue';
  import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import { LazyInject } from '@/ioc';
  import { TrackerService } from '@/service';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { AdResult, AdService, AdType } from '@/service/ad/ad.service';

  @Component({
    components: {
      PlayerResultEntry,
      ResultsCard,
    },
    emits: ['transitionEnd', 'doubleReward'],
  })
  export default class GameResults extends Vue {
    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @Prop({ required: true })
    public playerId: string;

    @LazyInject(TrackerService)
    public tracker: TrackerService;

    @LazyInject(AdService)
    public adService: AdService;

    public get playersIds(): string[] {
      return this.gameInstance.results?.positions || [];
    }

    public async showDoubleReward(): Promise<void> {
      const adResult = await this.adService.show({ type: AdType.Reward });
      if (adResult === AdResult.Viewed) {
        this.tracker.event(TrackingCategory.Ads, TrackingEvent.DoubleRewardAdCompleted);
        this.$emit('doubleReward');
        return;
      }

      this.tracker.event(TrackingCategory.Ads, TrackingEvent.DoubleRewardAdCancelled);
    }
  }
</script>

<style scoped lang="scss">
  .game-results {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    &__delimiter {
      aspect-ratio: 473 / 38;
      width: 70%;
      background-image: url('/static/ui/section_divider.webp');
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      flex-shrink: 0;
      @include UiMargin(2, bottom);
      @include UiMargin(2, top);
    }

    &__players {
      flex-shrink: 0;
      width: 100%;
      display: grid;
      justify-content: center;

      &[data-players='1'] {
        grid-template-areas: 'p1';
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        @include UiPadding(30, left);
        @include UiPadding(30, right);
      }

      &[data-players='2'] {
        grid-template-areas: 'p1 p2';
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: minmax(0, 1fr);
        @include UiGap(15);
        @include UiPadding(15, left);
        @include UiPadding(15, right);
      }

      &[data-players='3'] {
        grid-template-areas: 'p1 p2 p3';
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-template-rows: minmax(0, 1fr);
        @include UiGap(8);
        @include UiPadding(8, left);
        @include UiPadding(8, right);

        @include UiMediaPortrait() {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(0, 1fr));
          @include UiGap(4, 10);
          @include UiPadding(20, left);
          @include UiPadding(20, right);
          grid-template-areas:
            'p1 p1 p2 p2'
            '. p3 p3 .';
        }
      }

      &[data-players='4'] {
        grid-template-areas:
          'p1 p2'
          'p3 p4';
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
        @include UiGap(2, 15);
        @include UiPadding(20, left);
        @include UiPadding(20, right);
      }

      &[data-players='5'] {
        grid-template-areas:
          'p1 p1 p2 p2 p3 p3'
          '. p4 p4 p5 p5 .';
        grid-template-columns: repeat(6, UiSpacing(4));
        @include UiGap(1, 6);

        @include UiMediaPortrait() {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-template-rows: repeat(3, minmax(0, 1fr));
          @include UiGap(4, 15);
          @include UiPadding(20, left);
          @include UiPadding(20, right);
          grid-template-areas:
            'p1 p1 p2 p2'
            'p3 p3 p4 p4'
            '. p5 p5 .';
        }
      }

      &[data-players='6'] {
        grid-template-areas:
          'p1 p2 p3'
          'p4 p5 p6';
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
        @include UiGap(2, 10);
        @include UiPadding(10, left);
        @include UiPadding(10, right);

        @include UiMediaPortrait() {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-template-rows: repeat(3, minmax(0, 1fr));
          @include UiGap(4, 15);
          @include UiPadding(20, left);
          @include UiPadding(20, right);
          grid-template-areas:
            'p1 p2'
            'p3 p4'
            'p5 p6';
        }
      }
    }

    &__player {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :deep(.game-results-section-enter-from) {
      opacity: 0;
      transform: scale(0.8);
    }

    :deep(.game-results-section-enter-active) {
      pointer-events: none;
      transition:
        opacity 300ms linear,
        transform 500ms UiTransition(spring);
    }

    :deep(.game-results-section-enter-to) {
      opacity: 1;
      transform: scale(1);
    }

    :deep(.game-results-section-leave-from) {
      opacity: 1;
    }

    :deep(.game-results-section-leave-active) {
      pointer-events: none;
      transition: opacity 300ms linear;
    }

    :deep(.game-results-section-leave-to) {
      opacity: 0;
    }
  }
</style>
