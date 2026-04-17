<template>
  <div class="onboarding-highlight">
    <div
      class="onboarding-highlight__highlight"
      :class="{
        'onboarding-highlight__highlight_is-hidden': isHidden,
        'onboarding-highlight__highlight_circle': action?.shape === 'circle',
      }"
      :style="{
        '--pwsm-onboarding-highlight-x': `${pos?.x}px`,
        '--pwsm-onboarding-highlight-y': `${pos?.y}px`,
        '--pwsm-onboarding-highlight-w': `${pos?.width}px`,
        '--pwsm-onboarding-highlight-h': `${pos?.height}px`,
      }"
    ></div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-facing-decorator';
  import { FunctionUtil } from '@kwokka/utils';
  import type { ElementHighlightByPositionOnboardingAction } from '@/service';
  import { resizeObserver, type Bounds } from '@/util';

  type Action = ElementHighlightByPositionOnboardingAction & { getPosition: () => Bounds };

  @Component
  export default class OnboardingHighlightByPosition extends Vue {
    public action: Action = null;
    public pos: Bounds = null;
    private resizeCleanupFn: Function;

    public mounted(): void {
      const resizeListener = FunctionUtil.debounce(this.onResize.bind(this), 1000);
      this.resizeCleanupFn = resizeObserver(document.body, resizeListener);
    }

    public beforeUnmount(): void {
      this.resizeCleanupFn?.();
    }

    public get isHidden(): boolean {
      return !this.action || !this.pos;
    }

    @Watch('action')
    public onActionChange(action?: Action) {
      if (action) {
        this.pos = action.getPosition();
      }
    }

    public hide(): void {
      this.action = null;
      this.pos = null;
    }

    public show(action: Action): void {
      this.action = action;
    }

    private onResize(): void {
      if (this.action) {
        this.pos = this.action.getPosition();
      }
    }
  }
</script>

<style scoped lang="scss">
  .onboarding-highlight {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;

    &__highlight {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition-duration: 1000ms;
      transition-property: max-width, max-height;
      transition-timing-function: ease;
      box-shadow:
        inset rgba(0, 0, 0, 0.65) 0px 0px 5px 5px,
        rgba(0, 0, 0, 0.65) 0px 0px 0px 50000px;
      position: absolute;
      opacity: 1;
      visibility: visible;

      transform: translate(
        calc(var(--pwsm-onboarding-highlight-x) - UiSpacing(5)),
        calc(var(--pwsm-onboarding-highlight-y) - UiSpacing(5))
      );
      max-width: calc(var(--pwsm-onboarding-highlight-w) + 2 * UiSpacing(5));
      max-height: calc(var(--pwsm-onboarding-highlight-h) + 2 * UiSpacing(5));

      &_is-hidden {
        opacity: 0;
        visibility: hidden;
      }

      &_circle {
        border-radius: 50%;
      }
    }
  }
</style>
