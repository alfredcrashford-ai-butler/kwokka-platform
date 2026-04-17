<template>
  <div class="ranked-match-action-section" data-ranked-action-section>
    <div class="ranked-match-action-section__background ranked-match-action-section__background_animated"></div>
    <div class="ranked-match-action-section__background ranked-match-action-section__background_gradient"></div>

    <FadeTransition>
      <div class="ranked-match-action-section__content" v-if="!isLoading">
        <RatingContainer>
          <p class="ranked-match-action-section__heading-text">{{ rating }}</p>
          <p class="ranked-match-action-section__caption">{{ $t('rankedMatch.yourRating') }}</p>
        </RatingContainer>

        <UiButton type="blue" @click="onSeeLeaderboardClick()">{{ $t('rankedMatch.leaderboard.open') }}</UiButton>
        <LeaderboardDialog ref="leaderboardDialog" />

        <hr class="ranked-match-action-section__delimiter" />

        <div class="ranked-match-action-section__vertical-block">
          <p class="ranked-match-action-section__caption">{{ $t('rankedMatch.totalMatches') }}: {{ totalMatches }}</p>
          <p class="ranked-match-action-section__caption">{{ $t('rankedMatch.wonMatches') }}: {{ wonMatches }}</p>
        </div>
      </div>
      <div class="ranked-match-action-section__content" v-else>
        <UiLoader />
      </div>
    </FadeTransition>

    <CardActionSection :buttonText="$t('rankedMatch.startSearch')" @buttonClick="onStartSearchClick()" />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { ErrorTrackerService, KwokkaService, NotificationService, TrackerService } from '@/service';
  import { LazyInject } from '@/ioc';
  import { UiButton, UiLoader } from '@/app/ui-kit';
  import { CardActionSection, RatingContainer } from '@/app/components';
  import { FadeTransition } from '@/app/transitions';
  import { RouteName } from '@/app/route-name';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import LeaderboardDialog from './LeaderboardDialog.vue';

  @Component({
    components: {
      CardActionSection,
      FadeTransition,
      UiLoader,
      UiButton,
      RatingContainer,
      LeaderboardDialog,
    },
    emits: ['start'],
  })
  export default class RankedMatchActionSection extends Vue {
    public rating = 0;
    public totalMatches = 0;
    public wonMatches = 0;
    public isLoading = true;

    @Ref()
    public leaderboardDialog: LeaderboardDialog;

    @LazyInject(KwokkaService)
    private kwokkaService: KwokkaService;

    @LazyInject(NotificationService)
    private notificationService: NotificationService;

    @LazyInject(ErrorTrackerService)
    private errorTrackerService: ErrorTrackerService;

    @LazyInject(TrackerService)
    private trackerService: TrackerService;

    public mounted(): void {
      this.setup();
    }

    private async setup(): Promise<void> {
      const [rating, totalMatches, wonMatches] = await Promise.all([
        this.fetchRating(),
        this.fetchTotalMatchesCount(),
        this.fetchWonMatchesCount(),
      ]);

      this.rating = rating;
      this.totalMatches = totalMatches;
      this.wonMatches = wonMatches;
      this.isLoading = false;
    }

    private async fetchRating(): Promise<number> {
      try {
        return this.kwokkaService.getCurrentRankedSeasonRating();
      } catch (error: any) {
        this.errorTrackerService.captureError(error);
        this.notificationService.showErrors(error);
        return 0;
      }
    }

    private async fetchTotalMatchesCount(): Promise<number> {
      try {
        return this.kwokkaService.getTotalRankedMatchesCount();
      } catch (error: any) {
        this.errorTrackerService.captureError(error);
        this.notificationService.showErrors(error);
        return 0;
      }
    }

    private async fetchWonMatchesCount(): Promise<number> {
      try {
        return this.kwokkaService.getWonRankedMatchesCount();
      } catch (error: any) {
        this.errorTrackerService.captureError(error);
        this.notificationService.showErrors(error);
        return 0;
      }
    }

    public async onStartSearchClick(): Promise<void> {
      try {
        const gameInstance = await this.kwokkaService.findRankedMatch(this.rating);
        this.trackerService.event(TrackingCategory.Game, TrackingEvent.RankedMatchSearchStarted);
        this.$router.replace({ name: RouteName.Game, params: { id: gameInstance.id } });
      } catch (e: any) {
        this.errorTrackerService.captureError(e);
        this.notificationService.show({ type: 'error', text: this.$t('error.UNEXPECTED_ERROR') });
        this.$router.replace({ name: RouteName.Main });
      }
    }

    public onSeeLeaderboardClick(): void {
      this.leaderboardDialog.show();
    }
  }
</script>

<style scoped lang="scss">
  .ranked-match-action-section {
    position: relative;
    display: flex;
    flex-direction: column;

    > * {
      position: relative;
    }

    &__background {
      position: absolute;
      width: 100%;
      height: 100%;

      &_gradient {
        background: linear-gradient(UiColor(shade-900, 0.1), UiColor(shade-900, 0.8));
      }

      &_animated {
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        @include UiInlineAnimation(5s) {
          0%,
          100% {
            background-color: UiColor(secondary-900);
          }
          75% {
            background-color: UiColor(secondary-300);
          }
        }
      }
    }

    &__content {
      flex-grow: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @include UiPadding(4);
      @include UiTextShadow(3);
      @include UiMediaLandscape() {
        @include UiGap(4);
      }
    }

    &__delimiter {
      aspect-ratio: 473 / 38;
      width: 70%;
      background-image: url('/static/ui/section_divider.webp');
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      flex-shrink: 0;
      @include UiDropShadow(1);
      @include UiMargin(2, bottom);
      @include UiMargin(2, top);
    }

    &__vertical-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @include UiMediaLandscape() {
        @include UiGap(1);
      }
    }

    &__heading-text {
      position: relative;
      @include UiTypographyHeading1();
      width: 100%;
      text-align: center;
    }

    &__caption {
      @include UiTypographyHeading5();
      white-space: nowrap;
    }
  }
</style>
