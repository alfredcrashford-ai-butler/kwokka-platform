<template>
  <div class="ui-skeleton"></div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class UiSkeleton extends Vue {}
</script>

<style lang="scss" scoped>
  .ui-skeleton {
    position: relative;
    width: 100%;
    min-height: $grid-step * 30;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.2);
    @include UiBorderRadius(md);

    &::before {
      content: '';
      position: absolute;
      height: 100%;
      width: 50%;
      left: -75%;
      top: 0;
      transform: skewX(-20deg);
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 70%,
        rgba(255, 255, 255, 0) 100%
      );

      @include UiInlineAnimation(1s) {
        from {
          left: -75%;
        }
        to {
          left: 125%;
        }
      }

      animation-iteration-count: infinite;
    }
  }
</style>
