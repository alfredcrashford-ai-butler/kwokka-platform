<template>
  <MenuLayout class="ranked-match-view-animation">
    <div class="ranked-match-view">
      <TitleCard class="ranked-match-view__title-card" :heading="$t('rankedMatch.heading')" @backClick="onBackClick()">
        <div class="ranked-match-view__title-card-container">
          <RankedMatchInfoSection class="ranked-match-view__info" />

          <UiDivider direction="vertical" class="ui-hide_portrait" />
          <UiDivider direction="horizontal" class="ui-hide_landscape" />

          <RankedMatchActionSection class="ranked-match-view__action" />
        </div>
      </TitleCard>
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { UiDivider } from '@/app/ui-kit';
  import { RouteName } from '@/app/route-name';
  import { MenuLayout, TitleCard } from '@/app/components';
  import RankedMatchActionSection from './components/RankedMatchActionSection.vue';
  import RankedMatchInfoSection from './components/RankedMatchInfoSection.vue';
  import { LazyInject } from '@/ioc';
  import { KwokkaService, OnboardingService } from '@/service';
  import { TraitKey } from '@/game-data/trait-key';
  import { RankedOnboardingScenario } from './ranked-onboarding-scenario';

  @Component({
    components: {
      MenuLayout,
      TitleCard,
      RankedMatchActionSection,
      RankedMatchInfoSection,
      UiDivider,
    },
  })
  export default class RankedMatchView extends Vue {
    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(OnboardingService)
    public onboardingService: OnboardingService;

    public created(): void {
      this.setupOnboarding();
    }

    public onBackClick(): void {
      this.$router.replace({ name: RouteName.Play });
    }

    private async setupOnboarding(): Promise<void> {
      const trait = await this.kwokkaService.client.trait.getOwnTraitInstanceByTraitKey(
        TraitKey.RankedOnboardingCompleted,
      );
      if (trait.value) {
        return;
      }

      const scenario = new RankedOnboardingScenario();
      scenario.setFinishHandler(() => this.onOnboardingFinished());
      this.onboardingService.runScenario(scenario);
    }

    private onOnboardingFinished(): void {
      this.kwokkaService.client.trait.updateOwnTraitInstanceByTraitKey(TraitKey.RankedOnboardingCompleted, true);
    }
  }
</script>

<style lang="scss">
  .ranked-match-view-animation {
    &.v-enter-active {
      transition-duration: 1.3s;

      .ranked-match-view {
        animation-name: UiAnimationSlideInTop, UiAnimationFadeIn;
        animation-timing-function: UiTransition(spring), linear;
        animation-fill-mode: backwards;
        animation-duration: 1.3s, 500ms;
      }
    }

    &.v-leave-active {
      transition-duration: 500ms;

      .ranked-match-view {
        animation-name: UiAnimationSlideOutTop, UiAnimationFadeOut;
        animation-timing-function: ease, linear;
        animation-duration: 500ms;
      }
    }
  }
</style>

<style scoped lang="scss">
  .ranked-match-view {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    animation-fill-mode: both;

    &__title-card {
      height: 100%;
      width: 100%;
    }

    &__title-card-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      overflow: hidden;

      @include UiMediaPortrait() {
        flex-direction: column;
      }
    }

    &__info {
      flex-grow: 2;
      flex-shrink: 0;
      flex-basis: 0;
    }

    &__action {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>
