<template>
  <div class="ui-loader"></div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class UiLoader extends Vue {}
</script>

<style scoped lang="scss">
  .ui-loader {
    width: UiSpacing(8);
    aspect-ratio: 1;
    border-radius: 50%;
    background:
      radial-gradient(farthest-side, currentColor 94%, transparent) top/UiSpacing(1) UiSpacing(1) no-repeat,
      conic-gradient(transparent 30%, currentColor);
    mask: radial-gradient(farthest-side, transparent calc(100% - UiSpacing(1)), currentColor 0);
    display: inline-block;
    box-sizing: border-box;
    @include UiInlineAnimation(1s) {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
</style>
