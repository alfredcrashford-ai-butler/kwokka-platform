<template>
  <div class="reward-results-section">
    <div class="reward-results-section__block">
      <p class="reward-results-section__subheading">{{ $t('game.results.rewards') }}</p>
      <Essence class="reward-results-section__essence" :isGlowing="true" />
      <span class="reward-results-section__reward">{{ $t('game.results.essenceReward', rewardEssence) }}</span>
      <FadeTransition>
        <div class="reward-results-section__button-wrapper" v-if="isBonusClickShown">
          <UiButton type="blue" @click="onGetBonusClick()">
            {{ $t('game.results.getBonusReward', bonusRewardEssence) }}
            <UiIcon name="monitor-play" />
          </UiButton>
          <div class="reward-results-section__bonus">
            <span>{{ $t('game.results.x2') }}</span>
          </div>
        </div>
      </FadeTransition>
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
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import Essence from '@/app/components/Essence.vue';
  import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';

  @Component({
    components: {
      UiButton,
      UiIcon,
      FadeTransition,
      Essence,
    },
    emits: ['next', 'doubleReward'],
  })
  export default class RewardResultsSection extends Vue {
    @LazyInject(TrackerService)
    public trackerService: TrackerService;

    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @Prop({ required: true })
    public playerId: string;

    public currentSection = 0;

    public get rewardEssence(): number {
      return this.gameInstance.results.essence[this.playerId];
    }

    public get bonusRewardEssence(): number {
      return this.rewardEssence * 2;
    }

    public get isBonusClickShown(): boolean {
      return this.gameInstance.results?.canDoubleEssence?.[this.playerId];
    }

    public onGetBonusClick(): void {
      this.trackerService.event(TrackingCategory.Ads, TrackingEvent.AfterGameRewardBonusAdClick, {
        reward: this.rewardEssence,
        bonus: this.bonusRewardEssence,
      });

      this.$emit('doubleReward');
    }
  }
</script>

<style scoped lang="scss">
  .reward-results-section {
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

    &__subheading {
      @include UiTextShadow(3);
      @include UiTypographyHeading3();
      @include UiMargin(2, bottom);
    }

    &__essence {
      width: UiSpacing(10);
    }

    &__bonus {
      aspect-ratio: 1;
      @include UiPadding(0.75);
      @include UiBorderRadius(5);
      border: UiSpacing(0.5) solid UiColor(negative-200);
      position: absolute;
      right: calc(-1 * UiSpacing(1));
      top: calc(-1 * UiSpacing(1));
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      @include UiTypographyParagraph2();
      background-color: UiColor(negative-500);
      pointer-events: none;
      transform: rotateZ(15deg);

      > * {
        @include UiTextShadow(2);
      }
    }

    &__button-wrapper {
      position: relative;
    }

    &__reward {
      @include UiTypographyHeading5();
      @include UiMargin(2, bottom);
      @include UiTextShadow(2);
    }
  }
</style>
