<template>
  <div class="control-panel ui-9-box">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class ControlPanel extends Vue {}
</script>

<style scoped lang="scss">
  .control-panel {
    width: 100%;
    height: 100%;
    @include Ui9BoxLeft('/static/ui/control_panel/control_panel_left.webp');
    @include Ui9BoxCenter('/static/ui/control_panel/control_panel_center.webp');
    @include Ui9BoxRight('/static/ui/control_panel/control_panel_right.webp');
    @include Ui9BoxWidth(UiSpacing(28));
    @include UiDropShadow(1);
  }
</style>
