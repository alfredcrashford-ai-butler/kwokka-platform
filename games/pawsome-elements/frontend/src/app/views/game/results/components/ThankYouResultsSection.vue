<template>
  <div class="thank-you-results-section">
    <div class="thank-you-results-section__block">
      <p class="thank-you-results-section__subheading">{{ $t('game.results.thankYou') }}</p>
      <i18n-t keypath="game.results.feedbackQuestion" tag="p" class="thank-you-results-section__caption" scope="global">
        <a :href="$t('game.results.feedbackUrl')" target="_blank" @click="onFeedbackClick()">
          {{ $t('game.results.shareFeedback') }}
        </a>
      </i18n-t>
    </div>

    <div class="thank-you-results-section__actions">
      <UiButton type="secondary" @click="onMainMenuClick()" v-if="actions.includes(possibleActions.Menu)">
        <UiIcon name="arrow-left" />
        {{ $t('game.results.toMainMenu') }}
      </UiButton>

      <UiButton @click="onReplayPracticeClick()" v-if="actions.includes(possibleActions.ReplayPractice)">
        <UiIcon name="arrow-clockwise" />
        {{ $t('game.results.playAgain') }}
      </UiButton>

      <UiButton @click="onReplayRoomClick()" v-if="actions.includes(possibleActions.ReplayRoom)">
        <UiIcon name="arrow-clockwise" />
        {{ $t('game.results.playAgain') }}
      </UiButton>

      <UiButton @click="onReplayQuickMatch()" v-if="actions.includes(possibleActions.ReplayQuickMatch)">
        <UiIcon name="arrow-clockwise" />
        {{ $t('game.results.playAgain') }}
      </UiButton>

      <UiButton @click="onReplayRankedMatch()" v-if="actions.includes(possibleActions.ReplayRankedMatch)">
        <UiIcon name="arrow-clockwise" />
        {{ $t('game.results.playAgain') }}
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import { LazyInject } from '@/ioc';
  import { TrackerService } from '@/service';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import { ThankYouAction } from './thank-you-action';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      UiButton,
      UiIcon,
    },
  })
  export default class ThankYouResultsSection extends Vue {
    @LazyInject(TrackerService)
    public trackerService: TrackerService;

    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @Prop({ required: true })
    public actions: ThankYouAction[];

    public currentSection = 0;
    public readonly possibleActions = ThankYouAction;

    public get playerCount(): number {
      return this.gameInstance.players?.length || 0;
    }

    public get rating(): number {
      return this.gameInstance.lobbySettings?.rating?.average;
    }

    public onMainMenuClick(): void {
      this.$router.replace({ name: RouteName.Main });
    }

    public onReplayPracticeClick(): void {
      this.trackerService.event(TrackingCategory.Game, TrackingEvent.PracticePlayAgainClick, {
        playerCount: this.playerCount,
      });
      this.$router.replace({ name: RouteName.Practice });
    }

    public onReplayRoomClick(): void {
      this.trackerService.event(TrackingCategory.Game, TrackingEvent.RoomPlayAgainClick, {
        playerCount: this.playerCount,
      });
      this.$router.replace({ name: RouteName.Lobby });
    }

    public onReplayQuickMatch(): void {
      this.trackerService.event(TrackingCategory.Game, TrackingEvent.QuickMatchPlayAgainClick, {
        playerCount: this.playerCount,
      });
      this.$router.replace({ name: RouteName.QuickMatch });
    }

    public onReplayRankedMatch(): void {
      this.trackerService.event(TrackingCategory.Game, TrackingEvent.RankedMatchPlayAgainClick, {
        rating: this.rating,
      });
      this.$router.replace({ name: RouteName.RankedMatch });
    }

    public onFeedbackClick(): void {
      this.trackerService.event(TrackingCategory.Feedback, TrackingEvent.FeedbackFormAfterRoomLobbyClick, {
        playerCount: this.playerCount,
      });
    }
  }
</script>

<style scoped lang="scss">
  .thank-you-results-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;

    &__block {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
    }

    &__subheading {
      @include UiTextShadow(3);
      @include UiTypographyHeading3();
      @include UiMargin(2, bottom);
    }

    &__caption {
      @include UiTextShadow(2);
      @include UiTypographyHeading6();
      @include UiMargin(4, bottom);
      max-width: 80%;
      margin-left: auto;
      margin-right: auto;
    }

    &__actions {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      @include UiPadding(2);
      @include UiGap(2);

      > * {
        flex: 1;
      }
    }
  }
</style>
