<template>
  <div class="rating-results-section">
    <div class="rating-results-section__block">
      <RatingContainer class="rating-results-section__rating-container">
        <span class="rating-results-section__rating">{{ rating }}</span>
        <span
          class="rating-results-section__bonus"
          :class="{
            'rating-results-section__bonus_color-red': diff < 0,
            'rating-results-section__bonus_color-green': diff > 0,
          }"
        >
          {{ bonusSign }} {{ bonus }}
        </span>
      </RatingContainer>
      <p class="rating-results-section__caption">{{ $t('game.results.rating') }}</p>
    </div>

    <UiButton size="xl" type="link" @click="$emit('next')">
      {{ $t('general.next') }}
      <UiIcon name="arrow-right" />
    </UiButton>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import { LazyInject } from '@/ioc';
  import { TrackerService } from '@/service';
  import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import { RatingContainer } from '@/app/components';

  @Component({
    components: {
      UiButton,
      UiIcon,
      RatingContainer,
    },
    emits: ['next'],
  })
  export default class RewardResultsSection extends Vue {
    @LazyInject(TrackerService)
    public trackerService: TrackerService;

    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @Prop({ required: true })
    public playerId: string;

    public currentSection = 0;

    public get rating(): number {
      return this.gameInstance.results.rating[this.playerId].oldRating;
    }

    public get bonusSign(): '-' | '+' {
      return this.diff < 0 ? '-' : '+';
    }

    public get bonus(): number {
      return Math.abs(this.diff);
    }

    public get diff(): number {
      return this.gameInstance.results.rating[this.playerId].diff;
    }
  }
</script>

<style scoped lang="scss">
  .rating-results-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;

    &__block {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      @include UiMargin(3, bottom);
    }

    &__caption {
      @include UiTextShadow(2);
      @include UiTypographyHeading4();
      @include UiMargin(2, top);
    }

    &__rating-container {
      @include UiTextShadow(3);
    }

    &__rating {
      @include UiTypographyHeading1();
    }

    &__bonus {
      position: absolute;
      right: 0;
      bottom: 0;
      transform: translateY(50%) translateX(50%);

      &_color-red {
        color: UiColor(negative-500);
      }

      &_color-green {
        color: UiColor(positive-500);
      }
    }
  }
</style>
