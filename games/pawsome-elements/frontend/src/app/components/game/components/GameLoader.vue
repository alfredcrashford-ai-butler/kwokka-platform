<template>
  <div class="game-loader">
    <div class="game-loader__cloud game-loader__cloud_top"></div>
    <div class="game-loader__cloud game-loader__cloud_bottom"></div>
    <div class="game-loader__cloud-screen"></div>
    <UiLoader class="game-loader__loader" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { UiLoader } from '@/app/ui-kit';

  @Component({
    components: {
      UiLoader,
    },
  })
  export default class GameLoader extends Vue {}
</script>

<style scoped lang="scss">
  .game-loader {
    pointer-events: none;
    position: absolute;
    aspect-ratio: 16 / 9;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition-duration: 2s;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: opacity;

    @include UiMediaMaxAspectRatio(16, 9) {
      height: 100%;
    }

    @include UiMediaMinAspectRatio(16, 9) {
      width: 100%;
    }

    @include UiInlineAnimation(20s) {
      from {
        transform: translate(-50%, -50%);
      }
      to {
        transform: translate(-50%, -50%) scale(1.5);
      }
    }

    &.v-leave-active {
      animation-name: none;
      animation-duration: unset;
    }

    &.v-leave-from {
      opacity: 1;

      .game-loader__cloud_top {
        transform: translateX(-50%) translateY(0) rotateZ(180deg);
      }
      .game-loader__cloud_bottom {
        transform: translateX(-50%) translateY(0);
      }
    }

    &.v-leave-to {
      opacity: 0;

      .game-loader__cloud_top {
        transform: translateX(-50%) translateY(-100%) rotateZ(180deg);
      }
      .game-loader__cloud_bottom {
        transform: translateX(-50%) translateY(100%);
      }
    }

    &__cloud-screen {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: UiColor(shade-100);
      transition-duration: inherit;
      opacity: 0.5;
    }

    &__cloud {
      position: absolute;
      aspect-ratio: 1920 / 871;
      transform: translateX(-50%);
      height: 100%;
      background-image: url('/static/clouds.webp');
      background-size: 100% 100%;
      left: 50%;
      transform-style: preserve-3d;
      transition-duration: inherit;
      will-change: transform;

      @include UiMediaMinAspectRatio(1920, 871) {
        width: 100%;
        height: auto;
      }

      &_top {
        top: 0;
        transform: translateX(-50%) rotateZ(180deg);
      }

      &_bottom {
        bottom: 0;
      }
    }

    &__loader {
      position: absolute;
      will-change: opacity;
      color: UiColor(shade-900);
      transform-style: preserve-3d;
      transition-duration: inherit;
    }
  }
</style>
