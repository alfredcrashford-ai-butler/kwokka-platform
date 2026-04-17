<template>
  <div class="arrow-panel ui-9-box">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class ArrowPanel extends Vue {}
</script>

<style scoped lang="scss">
  .arrow-panel {
    width: 100%;
    height: 100%;
    @include Ui9BoxTopLeft('/static/ui/arrow_panel/arrow_panel_top_left.webp');
    @include Ui9BoxTop('/static/ui/arrow_panel/arrow_panel_top.webp');
    @include Ui9BoxTopRight('/static/ui/arrow_panel/arrow_panel_top_right.webp');
    @include Ui9BoxLeft('/static/ui/arrow_panel/arrow_panel_left.webp');
    @include Ui9BoxCenter('/static/ui/arrow_panel/arrow_panel_center.webp');
    @include Ui9BoxRight('/static/ui/arrow_panel/arrow_panel_right.webp');
    @include Ui9BoxBottomLeft('/static/ui/arrow_panel/arrow_panel_bottom_left.webp');
    @include Ui9BoxBottom('/static/ui/arrow_panel/arrow_panel_bottom.webp');
    @include Ui9BoxBottomRight('/static/ui/arrow_panel/arrow_panel_bottom_right.webp');
    @include Ui9BoxWidth(UiSpacing(20));
    @include Ui9BoxHeight(UiSpacing(8));
    @include UiDropShadow(1);
  }
</style>
