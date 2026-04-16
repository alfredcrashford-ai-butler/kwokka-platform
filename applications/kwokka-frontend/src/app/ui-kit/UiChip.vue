<template>
  <span class="ui-chip">
    <slot></slot>
  </span>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class UiChip extends Vue {}
</script>

<style lang="scss" scoped>
  .ui-chip {
    @include UiPadding(2, right, false);
    @include UiPadding(2, left, false);
    @include UiTypographyParagraph3();
    @include UiGap(1, false);

    $height: $grid-step * 5;
    display: inline-flex;
    align-items: center;
    height: $height;
    border-radius: $height / 2;

    background-color: rgba(0, 0, 0, 0.25);
  }
</style>
