<template>
  <div class="ui-loader">
    <UiIcon class="ui-loader__icon" name="game-controller" />
    <div class="ui-loader__element-container">
      <div class="ui-loader__element"></div>
      <div class="ui-loader__element"></div>
      <div class="ui-loader__element"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    components: {
      UiIcon,
    },
  })
  export default class UiLoader extends Vue {}
</script>

<style lang="scss" scoped>
  .ui-loader {
    display: flex;
    flex-direction: column;
    @include UiGap(6);
    width: fit-content;
    height: fit-content;
    margin-left: auto;
    margin-right: auto;
    animation-name: UiTransitionScaleIn, UiTransitionFadeIn;
    animation-delay: 500ms;
    animation-duration: 200ms;
    animation-timing-function: UiTransition(bounce);
    animation-fill-mode: both;

    &__icon {
      animation-timing-function: UiTransition(bounce);
      animation-iteration-count: infinite;
      $size: $grid-step * 22;
      width: $size;
      height: $size;
      transform-origin: center;

      @include UiInlineAnimation(3s) {
        from {
          transform: scale(1) rotateZ(0);
        }

        25% {
          transform: scale(1.1) rotateZ(-20deg);
        }

        50% {
          transform: scale(1) rotateZ(0);
        }

        75% {
          transform: scale(1.1) rotateZ(20deg);
        }

        to {
          transform: scale(1) rotateZ(0);
        }
      }

      @include UiTheme() {
        color: UiColor(yellow-500);
      }
    }

    &__element-container {
      @include UiGap(2);
      display: flex;
      width: 100%;
      justify-content: center;
    }

    &__element {
      $size: $grid-step * 2;
      width: $size;
      height: $size;
      @include UiTheme() {
        background-color: UiColor(orange-500);
      }

      border-radius: 100%;
      display: inline-block;
      animation-timing-function: ease-in-out;
      animation-fill-mode: both;
      animation-iteration-count: infinite;

      &:nth-child(2) {
        animation-delay: 0.16s;
      }

      &:nth-child(3) {
        animation-delay: 0.32s;
      }

      @include UiInlineAnimation(1.5s) {
        0%,
        80%,
        100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    }
  }
</style>
