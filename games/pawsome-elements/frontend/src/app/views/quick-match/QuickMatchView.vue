<template>
  <MenuLayout class="quick-match-view-animation">
    <div class="quick-match-view">
      <TitleCard class="quick-match-view__title-card" :heading="$t('quickMatch.heading')" @backClick="onBackClick()">
        <div class="quick-match-view__container">
          <Transition>
            <UiResponsiveImage
              :key="cardSet"
              :src="`/static/card_set/${cardSet}.webp`"
              class="quick-match-view__card-set-image quick-match-view__transition"
              mode="cover"
            />
          </Transition>
          <div class="quick-match-view__card-set-image-overlay"></div>
          <div class="quick-match-view__card-set-content">
            <UiArrowButton direction="left" @click="onPreviousSetClick()" />
            <div class="quick-match-view__card-set-info">
              <Transition>
                <div class="quick-match-view__transition" :key="cardSet">
                  <h3 class="quick-match-view__card-set-heading">
                    {{ $t('cardSet.title') }}: {{ $t(`cardSet.${cardSet}.title`) }}
                  </h3>
                  <p class="quick-match-view__card-set-caption">{{ $t(`cardSet.${cardSet}.shortDescription`) }}</p>
                </div>
              </Transition>
            </div>
            <UiArrowButton direction="right" @click="onNextSetClick()" />
          </div>
        </div>
      </TitleCard>

      <ActionPanel class="quick-match-view__action-panel" size="lg">
        <UiButton size="xl" @click="onStartSearchClick()">{{ $t('quickMatch.startSearch') }}</UiButton>
      </ActionPanel>
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import MenuLayout from '@/app/components/MenuLayout.vue';
  import UiResponsiveImage from '@/app/ui-kit/UiResponsiveImage.vue';
  import TitleCard from '@/app/components/TitleCard.vue';
  import { ErrorTrackerService, KwokkaService, NotificationService, TrackerService } from '@/service';
  import { LazyInject } from '@/ioc';
  import ActionPanel from '@/app/components/ActionPanel.vue';
  import { UiArrowButton, UiButton } from '@/app/ui-kit';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { RouteName } from '@/app/route-name';
  import { PawsomeElementsCardSet } from '@/game-data/game-instance';

  @Component({
    components: {
      UiResponsiveImage,
      MenuLayout,
      TitleCard,
      ActionPanel,
      UiButton,
      UiArrowButton,
    },
  })
  export default class QuickMatchView extends Vue {
    @LazyInject(KwokkaService)
    private kwokkaService: KwokkaService;

    @LazyInject(TrackerService)
    private trackerService: TrackerService;

    @LazyInject(NotificationService)
    private notificationService: NotificationService;

    @LazyInject(ErrorTrackerService)
    private errorTrackerService: ErrorTrackerService;

    public cardSet = PawsomeElementsCardSet.Turbo;
    public readonly cardSets = [PawsomeElementsCardSet.Turbo, PawsomeElementsCardSet.Standard];

    public onBackClick(): void {
      this.$router.replace({ name: RouteName.Play });
    }

    public onPreviousSetClick(): void {
      const index = this.cardSets.indexOf(this.cardSet);
      const targetIndex = index === 0 ? this.cardSets.length - 1 : index - 1;
      this.cardSet = this.cardSets[targetIndex];
    }

    public onNextSetClick(): void {
      const index = this.cardSets.indexOf(this.cardSet);
      const targetIndex = index === this.cardSets.length - 1 ? 0 : index + 1;
      this.cardSet = this.cardSets[targetIndex];
    }

    public async onStartSearchClick(): Promise<void> {
      try {
        const gameInstance = await this.kwokkaService.findQuickMatch(this.cardSet);
        this.trackerService.event(TrackingCategory.Game, TrackingEvent.QuickMatchSearchStarted);
        this.$router.replace({ name: RouteName.Game, params: { id: gameInstance.id } });
      } catch (e: any) {
        this.errorTrackerService.captureError(e);
        this.notificationService.show({ type: 'error', text: this.$t('error.UNEXPECTED_ERROR') });
        this.$router.replace({ name: RouteName.Main });
      }
    }
  }
</script>

<style lang="scss">
  .quick-match-view-animation {
    &.v-enter-active {
      transition-duration: 1.3s;

      .quick-match-view {
        animation-name: UiAnimationSlideInTop, UiAnimationFadeIn;
        animation-timing-function: UiTransition(spring), linear;
        animation-fill-mode: backwards;
        animation-duration: 1.3s, 500ms;
      }
    }

    &.v-leave-active {
      transition-duration: 500ms;

      .quick-match-view {
        animation-name: UiAnimationSlideOutTop, UiAnimationFadeOut;
        animation-timing-function: ease, linear;
        animation-duration: 500ms;
      }
    }
  }
</style>

<style scoped lang="scss">
  .quick-match-view {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    animation-fill-mode: both;

    &__title-card {
      height: 80%;
      aspect-ratio: 16 / 10;

      @include UiMediaPortrait() {
        aspect-ratio: 10 / 16;
        height: auto;
        width: 100%;
      }
    }

    &__transition {
      transition-duration: 1s;

      &.v-enter-from,
      &.v-leave-to {
        opacity: 0;
      }

      &.v-leave-from,
      &.v-enter-to {
        opacity: 1;
        position: absolute;
      }
    }

    &__container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    &__card-set-image {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    &__card-set-image-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(transparent 0%, rgba(0, 0, 0, 0.4) 100%);
      @include UiMediaPortrait() {
        background-image: radial-gradient(transparent 0%, rgba(0, 0, 0, 0.6) 100%);
      }
    }

    &__action-panel {
      z-index: 1;
      @include UiMargin(-8, top);
    }

    &__card-set-content {
      display: flex;
      align-items: center;
      @include UiPadding(10, bottom);
      @include UiGap(10);
    }

    &__card-set-info {
      position: relative;
      height: UiSpacing(20);
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      width: UiSpacing(70);

      @include UiMediaPortrait() {
        height: UiSpacing(40);
      }
    }

    &__card-set-heading {
      @include UiTextShadow(3);
      @include UiMargin(2, bottom);

      @include UiMediaPortrait() {
        @include UiTypographyHeading1();
      }
    }

    &__card-set-caption {
      @include UiTextShadow(3);
      @include UiTypographyHeading6();
    }
  }
</style>
