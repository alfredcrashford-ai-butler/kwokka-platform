<template>
  <span class="red-dot"></span>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class RedDot extends Vue {}
</script>

<style scoped lang="scss">
  .red-dot {
    position: absolute;
    display: block;
    top: UiSpacing(-1);
    right: UiSpacing(-1);
    width: UiSpacing(3);
    height: UiSpacing(3);
    @include UiBorderRadius(2);
    background-color: UiColor(negative-700);
    border: UiSpacing(0.4) solid UiColor(negative-200);
    pointer-events: none;
  }
</style>
