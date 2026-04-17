<template>
  <div
    class="hydrant-deco-bubble"
    :style="{
      '--pwsm--hydrant-deco-delay': delay,
      '--pwsm--hydrant-deco-scale': scale,
      '--pwsm--hydrant-deco-size': `${size}px`,
    }"
  >
    <transition leave-active-class="hydrant-deco-bubble__inner_leave">
      <div v-if="isShown" class="hydrant-deco-bubble__inner"></div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class HydrantDecoBubble extends Vue {
    @Prop({ required: true })
    public isShown: boolean;

    @Prop({ required: true })
    public size: number;

    @Prop({ required: true })
    public scale: number;

    @Prop({ required: true })
    public delay: number;
  }
</script>

<style scoped lang="scss">
  .hydrant-deco-bubble {
    --pwsm--hydrant-deco-delay: 0ms;
    --pwsm--hydrant-deco-scale: 1;
    --pwsm--hydrant-deco-size: 0;
    opacity: 0.9;
    position: absolute;
    width: calc(var(--pwsm--hydrant-deco-scale) * var(--pwsm--hydrant-deco-size));
    aspect-ratio: 1;
    @include UiInlineAnimation(3s) {
      0% {
        transform: translate3d(0, 0, 0) translateY(0);
      }
      50% {
        transform: translate3d(0, 0, 0) translateY(-10px);
      }
      100% {
        transform: translate3d(0, 0, 0) translateY(0);
      }
    }
    animation-delay: var(--pwsm--hydrant-deco-delay);
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    filter: blur(2px) grayscale(0.3);
    transform-style: preserve-3d;

    &__inner {
      width: 100%;
      height: 100%;
      background-image:
        url('/static/elements/bubble.webp'), radial-gradient(var(--pwsm--hydrant-button-color) 0, transparent 120%);
      opacity: 0.6;
      border-radius: 50%;

      background-position: center;
      background-size: cover;
      background-blend-mode: luminosity;
      pointer-events: none;
      animation-delay: var(--pwsm--hydrant-deco-delay);
      animation-timing-function: UiTransition(bounce);
      animation-fill-mode: both;

      @include UiInlineAnimation(500ms) {
        0% {
          opacity: 0;
          transform: scale(0.5);
        }
        100% {
          opacity: 0.6;
          transform: scale(1);
        }
      }

      &_leave {
        animation-timing-function: ease-out;
        @include UiInlineAnimation(100ms) {
          from {
            opacity: 0.6;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(2.5);
          }
        }
      }
    }
  }
</style>
