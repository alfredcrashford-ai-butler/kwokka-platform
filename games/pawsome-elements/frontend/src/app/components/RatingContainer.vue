<template>
  <div class="rating-container">
    <span class="rating-container__wing" data-side="left"></span>
    <div class="rating-container__content">
      <span class="rating-container__crown"></span>
      <slot></slot>
    </div>
    <span class="rating-container__wing" data-side="right"></span>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class RatingContainer extends Vue {}
</script>

<style scoped lang="scss">
  .rating-container {
    display: flex;
    align-items: center;
    justify-content: center;
    @include UiGap(2);

    &__content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @include UiMediaLandscape() {
        @include UiGap(1);
      }
    }

    &__crown {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -150%);
      width: 100%;
      height: 100%;
      background-image: url('/static/ui/crown.webp');
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      @include UiDropShadow(1);

      @include UiInlineAnimation(5s) {
        0%,
        100% {
          transform: translate(-50%, -150%);
        }

        75% {
          transform: translate(-50%, -175%);
        }
      }

      animation-iteration-count: infinite;
    }

    &__wing {
      height: UiSpacing(15);
      aspect-ratio: 1;
      background-image: url('/static/ui/wing.webp');
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      align-self: flex-end;
      @include UiDropShadow(1);

      --pwsm-rating-container-wing-rotate: 0deg;

      @include UiInlineAnimation(5s) {
        0%,
        100% {
          transform: rotateY(var(--pwsm-rating-container-wing-rotate)) translateX(0) rotateZ(0);
        }

        75% {
          transform: rotateY(var(--pwsm-rating-container-wing-rotate)) translateX(UiSpacing(2)) rotateZ(5deg);
        }
      }

      animation-iteration-count: infinite;

      &[data-side='left'] {
        --pwsm-rating-container-wing-rotate: 180deg;
      }
    }
  }
</style>
