<template>
  <div class="onboarding-presenter" :hidden="!scenario || !currentStep">
    <div
      ref="menu"
      class="onboarding-presenter__menu"
      :class="{ 'onboarding-presenter__menu_is-hidden': !scenario || !currentStep }"
    >
      <div class="onboarding-presenter__content" v-if="currentStep">
        <UiHeading size="4">{{ currentStep.title }} {{ stepInfo }}</UiHeading>

        <p v-if="currentStep.text">
          {{ currentStep.text }}
        </p>

        <div class="onboarding-presenter__actions">
          <UiButton
            v-if="currentStep.isSecondaryButtonHidden !== true"
            :disabled="currentStep.isSecondaryButtonDisabled"
            type="secondary"
            @click="onSecondaryButtonClick()"
          >
            {{ currentStep.secondaryButtonText || $t('general.onboarding.close') }}
          </UiButton>
          <UiButton
            :hidden="currentStep.isPrimaryButtonHidden"
            :disabled="currentStep.isPrimaryButtonDisabled"
            @click="onPrimaryButtonClick()"
          >
            {{
              currentStep.primaryButtonText ||
              `${$t(`general.onboarding.${currentStepNum === totalStepsNum ? 'finish' : 'next'}`)}`
            }}
          </UiButton>
        </div>
      </div>
    </div>
    <div
      class="onboarding-presenter__overlay"
      :class="{ 'onboarding-presenter__overlay_is-darken': currentStep && currentStep.isBlur }"
      :hidden="!scenario || !currentStep"
    ></div>
    <div
      class="onboarding-presenter__highlight"
      :style="{
        transform: `translate(${highlightCoordinates.x}px, ${highlightCoordinates.y}px)`,
        maxWidth: `${highlightCoordinates.w}px`,
        maxHeight: `${highlightCoordinates.h}px`,
      }"
      :hidden="!scenario || !currentStep || currentStep.isBlur"
    ></div>
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Watch, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { OnboardingService } from '@/service/onboarding/onboarding.service';
  import UiMenu from '@/app/ui-kit/UiMenu.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import { OnboardingScenario, type OnboardingScenarioStep } from '@/service/onboarding/onboarding-scenario';

  const DEBOUNCE_TIME = 200;
  const PADDING = 16;
  const HIGHLIGHT_PADDING = 8;

  type Coordinates = { x: number; y: number; w: number; h: number };

  @Component({
    components: {
      UiMenu,
      UiButton,
      UiHeading,
    },
  })
  export default class OnboardingPresenter extends Vue {
    @Ref()
    public menu: HTMLDivElement;

    @LazyInject(OnboardingService)
    private onboardingService: OnboardingService;

    public scenario?: OnboardingScenario = null;

    public highlightCoordinates: Coordinates = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };

    private unsubscribe?: Function;

    public get currentStep(): OnboardingScenarioStep {
      return this.scenario?.currentStep;
    }

    public get currentStepPlacement(): 'bottom' | 'top' {
      return this.currentStep?.placement || 'bottom';
    }

    public get currentStepNum(): number {
      return this.scenario.currentStepNum;
    }

    public get totalStepsNum(): number {
      return this.scenario.totalStepsNum;
    }

    public get stepInfo(): string {
      if (this.totalStepsNum === 1) {
        return null;
      }
      return `(${this.currentStepNum}/${this.totalStepsNum})`;
    }

    public mounted(): void {
      const unsubscribe = this.onboardingService.subscribe({
        onRunScenario: this.onRunScenario.bind(this),
        onFinishScenario: this.onFinishScenario.bind(this),
      });
      this.unsubscribe = unsubscribe;
    }

    public unmounted(): void {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    public onSecondaryButtonClick(): void {
      if (this.currentStep.onSecondaryButtonClick) {
        this.currentStep.onSecondaryButtonClick(this.scenario);
      }
      this.scenario.finish();
    }

    public onPrimaryButtonClick(): void {
      if (this.currentStep.onPrimaryButtonClick) {
        this.currentStep.onPrimaryButtonClick(this.scenario);
      }
      this.scenario.next();
    }

    @Watch('currentStep')
    public onStepChange(value?: OnboardingScenarioStep) {
      if (value) {
        const element = value.highlightElement;
        const elementRect = element.getBoundingClientRect();
        this.highlightCoordinates = {
          x: elementRect.x - HIGHLIGHT_PADDING,
          y: elementRect.y - HIGHLIGHT_PADDING,
          w: elementRect.width + HIGHLIGHT_PADDING * 2,
          h: elementRect.height + HIGHLIGHT_PADDING * 2,
        };
        if (!value.isSkipScroll) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
        this.runMenuPositionCalculation(Date.now());
      }
    }

    private runMenuPositionCalculation(lastRecalculationTime: number, lastTop?: number, lastLeft?: number) {
      requestAnimationFrame((time: number) => {
        if (time - lastRecalculationTime > DEBOUNCE_TIME) {
          return;
        }
        const { top, left } = this.calculateMenuPosition();
        const isDifferent = top !== lastTop || lastLeft !== left;
        this.runMenuPositionCalculation(isDifferent ? time : lastRecalculationTime, top, left);
      });
    }

    private calculateMenuPosition() {
      const elRect = this.currentStep.highlightElement.getBoundingClientRect();
      const menuRect = this.menu.getBoundingClientRect();
      const left = elRect.x + elRect.width / 2 - menuRect.width / 2;
      let top = elRect.y + elRect.height + PADDING;
      if (this.currentStepPlacement === 'top') {
        top = elRect.y - menuRect.height - PADDING;
      }
      if (top + menuRect.height > window.innerHeight) {
        this.menu.style.top = `${window.innerHeight - menuRect.height - PADDING}px`;
      } else if (top < 0) {
        this.menu.style.top = `${PADDING}px`;
      } else {
        this.menu.style.top = `${top}px`;
      }
      if (window.innerWidth <= menuRect.width + PADDING) {
        this.menu.style.left = '0px';
      } else if (left < 0) {
        this.menu.style.left = `${PADDING}px`;
      } else if (left + menuRect.width + PADDING > window.innerWidth) {
        this.menu.style.left = `${window.innerWidth - menuRect.width - PADDING}px`;
      } else {
        this.menu.style.left = `${left}px`;
      }
      return { top, left };
    }

    private onRunScenario(scenario: OnboardingScenario): void {
      setTimeout(() => (this.scenario = scenario), 300);
    }

    private onFinishScenario(): void {
      this.scenario = null;
    }
  }
</script>

<style lang="scss">
  .onboarding-presenter {
    position: absolute;
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    $z-base: 10000;
    $z-menu: $z-base + 100;
    $z-overlay: $z-base + 10;
    $z-highlight: $z-base + 20;

    &__menu {
      @include UiBorderRadius(lg);
      @include UiPadding(4);
      position: absolute;
      z-index: $z-menu;
      backdrop-filter: blur(2px);
      width: $grid-step * 80;

      transition-duration: 200ms;
      transition-timing-function: linear;
      transition-property: visibility, opacity;

      @include UiTheme() {
        background: rgba(UiColor(shade-700), 0.8) !important;
        border: 2px solid UiColor(shade-100);
      }

      &_is-hidden {
        visibility: hidden;
        opacity: 0;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      @include UiGap(4);
    }

    &__actions {
      @include UiGap(2);
      display: flex;
      align-items: center;
      justify-content: space-between;

      > * {
        flex-grow: 1;
      }
    }

    &__highlight {
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      transition-duration: 400ms;
      transition-property: transform, max-width, max-height;
      transition-timing-function: ease-in-out;
      will-change: transform, max-width, max-height;
      box-shadow:
        rgba(0, 0, 0, 0.5) 0px 0px 0px 2px,
        rgba(0, 0, 0, 0.4) 0px 0px 0px 5000px;
      position: absolute;
      z-index: $z-highlight;
      @include UiBorderRadius(sm);
    }

    &__overlay {
      z-index: $z-overlay;
      position: absolute;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;

      &_is-darken {
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
  }
</style>
