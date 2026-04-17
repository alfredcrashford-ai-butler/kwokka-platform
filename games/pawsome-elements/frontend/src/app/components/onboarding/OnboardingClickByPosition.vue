<template>
  <div class="onboarding-click" :class="{ 'onboarding-click_is-hidden': !action }">
    <div class="onboarding-click__cursor" :style="{ left: `${pos?.x}px`, top: `${pos?.y}px` }">
      <div class="onboarding-click__cursor-shadow"></div>
      <div class="onboarding-click__cursor-graphics"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { FunctionUtil } from '@kwokka/utils';
  import { Component, Vue, Watch } from 'vue-facing-decorator';
  import type { ClickByPositionOnboardingAction } from '@/service';
  import { resizeObserver, type Bounds, type Position } from '@/util';

  type Action = ClickByPositionOnboardingAction & { getPosition: () => Bounds };

  @Component
  export default class OnboardingClickByPosition extends Vue {
    public action: Action = null;
    public pos: Position = null;
    private resizeCleanupFn: Function;

    public mounted(): void {
      const resizeListener = FunctionUtil.debounce(this.onResize.bind(this), 1000);
      this.resizeCleanupFn = resizeObserver(document.body, resizeListener);
    }

    public beforeUnmount(): void {
      this.resizeCleanupFn?.();
    }

    public hide(): void {
      this.action = null;
      this.pos = null;
    }

    public show(action: Action): void {
      this.action = action;
    }

    @Watch('action')
    public onActionChange(action?: Action) {
      this.setPosition(action);
    }

    private onResize(): void {
      this.setPosition(this.action);
    }

    private setPosition(action: Action): void {
      if (action) {
        const pos = action.getPosition();
        this.pos = { x: pos.x + pos.width / 2, y: pos.y + pos.height / 2 };
      }
    }
  }
</script>

<style scoped lang="scss">
  .onboarding-click {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    pointer-events: none;

    &_is-hidden {
      display: none;
    }

    &__cursor-graphics {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: url('/static/onboarding/cursor.webp');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      animation-duration: 2s;
      animation-iteration-count: infinite;

      @include UiInlineAnimation() {
        0%,
        100% {
          transform: translateY(-25%);
        }
        50% {
          transform: translateY(0%);
        }
      }
    }

    &__cursor-shadow {
      position: absolute;
      width: 60%;
      height: 20%;
      background-color: rgba(0, 0, 0, 0.75);
      box-shadow: 0 0 UiSpacing(2) UiSpacing(2) rgba(0, 0, 0, 0.75);
      border-radius: 50%;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    &__cursor {
      position: absolute;
      width: UiSpacing(12);
      height: UiSpacing(12);
      animation-duration: 2s;
      animation-iteration-count: infinite;
      @include UiInlineAnimation() {
        0%,
        100% {
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          transform: translate(-50%, -50%) scale(0.8);
        }
      }
    }
  }
</style>
