<template>
  <div class="suggestion">
    <div class="suggestion__bg"></div>
    <div class="suggestion__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class Suggestion extends Vue {}
</script>

<style scoped lang="scss">
  .suggestion {
    position: relative;
    @include UiPadding(3);
    pointer-events: none;
    text-align: center;

    &__bg {
      left: calc(-1 * UiSpacing(1.5));
      top: calc(-1 * UiSpacing(1.5));
      position: absolute;
      width: calc(100% + UiSpacing(3));
      height: calc(100% + UiSpacing(3));
      background-color: rgba(0, 0, 0, 0.8);
      @include UiBorderRadius(2);
      filter: blur(UiSpacing(1));
      transform: translate3d(0, 0, 0);
    }

    &__content {
      position: relative;
    }
  }
</style>
