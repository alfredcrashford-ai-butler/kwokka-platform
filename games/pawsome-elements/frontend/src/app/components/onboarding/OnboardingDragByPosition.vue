<template>
  <div class="onboarding-drag" :class="{ 'onboarding-drag_is-hidden': !action }">
    <div
      class="onboarding-drag__cursor"
      :style="{
        '--pwsm--onboarding-drag-from-x': `calc(${from?.x}px - 50%)`,
        '--pwsm--onboarding-drag-from-y': `calc(${from?.y}px - 50%)`,
        '--pwsm--onboarding-drag-to-x': `calc(${to?.x}px - 50%)`,
        '--pwsm--onboarding-drag-to-y': `calc(${to?.y}px - 50%)`,
      }"
    >
      <div class="onboarding-drag__cursor-shadow"></div>
      <div class="onboarding-drag__cursor-graphics"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-facing-decorator';
  import { FunctionUtil } from '@kwokka/utils';
  import type { DragByPositionOnboardingAction } from '@/service';
  import { resizeObserver, type Bounds, type Position } from '@/util';

  type Action = DragByPositionOnboardingAction & {
    getFromPosition: () => Bounds;
    getToPosition: () => Bounds;
  };

  @Component
  export default class OnboardingDragByPosition extends Vue {
    public action: Action = null;
    public from: Position = null;
    public to: Position = null;
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
      this.from = null;
      this.to = null;
    }

    public show(action: Action): void {
      this.action = action;
    }

    @Watch('action')
    public onActionChange(action?: Action) {
      if (action) {
        this.from = this.getPosition(action.getFromPosition());
        this.to = this.getPosition(action.getToPosition());
      }
    }

    private onResize(): void {
      if (this.action) {
        this.from = this.getPosition(this.action.getFromPosition());
        this.to = this.getPosition(this.action.getToPosition());
      }
    }

    public getPosition(pos: Bounds): Position {
      return { x: pos.x + pos.width / 2, y: pos.y + pos.height / 2 };
    }
  }
</script>

<style scoped lang="scss">
  .onboarding-drag {
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
      animation-duration: 3s;
      animation-iteration-count: infinite;

      @include UiInlineAnimation() {
        0%,
        10%,
        70%,
        100% {
          transform: translateY(-25%);
        }
        20%,
        60% {
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
      top: 0;
      left: 0;
      width: UiSpacing(12);
      height: UiSpacing(12);
      animation-duration: 3s;
      animation-iteration-count: infinite;
      @include UiInlineAnimation() {
        0% {
          opacity: 0;
          transform: translateX(var(--pwsm--onboarding-drag-from-x)) translateY(var(--pwsm--onboarding-drag-from-y));
        }
        10% {
          opacity: 1;
          transform: translateX(var(--pwsm--onboarding-drag-from-x)) translateY(var(--pwsm--onboarding-drag-from-y));
        }
        20% {
          transform: translateX(var(--pwsm--onboarding-drag-from-x)) translateY(var(--pwsm--onboarding-drag-from-y))
            scale(0.8);
        }
        60% {
          transform: translateX(var(--pwsm--onboarding-drag-to-x)) translateY(var(--pwsm--onboarding-drag-to-y))
            scale(0.8);
        }
        70% {
          opacity: 1;
          transform: translateX(var(--pwsm--onboarding-drag-to-x)) translateY(var(--pwsm--onboarding-drag-to-y))
            scale(1);
        }
        80%,
        100% {
          opacity: 0;
          transform: translateX(var(--pwsm--onboarding-drag-to-x)) translateY(var(--pwsm--onboarding-drag-to-y));
        }
      }
    }
  }
</style>
