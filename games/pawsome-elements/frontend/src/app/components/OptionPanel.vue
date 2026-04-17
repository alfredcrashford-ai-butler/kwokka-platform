<template>
  <div class="option-panel ui-9-box" :class="[`option-panel_size-${size}`]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class OptionPanel extends Vue {
    @Prop({ default: 'md' })
    public size: 'sm' | 'md';
  }
</script>

<style scoped lang="scss">
  .option-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    @include Ui9BoxTopLeft('/static/ui/option_panel/option_panel_top_left.webp');
    @include Ui9BoxTop('/static/ui/option_panel/option_panel_top.webp');
    @include Ui9BoxTopRight('/static/ui/option_panel/option_panel_top_right.webp');
    @include Ui9BoxLeft('/static/ui/option_panel/option_panel_left.webp');
    @include Ui9BoxCenter('/static/ui/option_panel/option_panel_center.webp');
    @include Ui9BoxRight('/static/ui/option_panel/option_panel_right.webp');
    @include Ui9BoxBottomLeft('/static/ui/option_panel/option_panel_bottom_left.webp');
    @include Ui9BoxBottom('/static/ui/option_panel/option_panel_bottom.webp');
    @include Ui9BoxBottomRight('/static/ui/option_panel/option_panel_bottom_right.webp');

    &_size-sm {
      @include Ui9BoxWidth(UiSpacing(4));
      @include Ui9BoxHeight(UiSpacing(4));
      @include UiPadding(3, left);
      @include UiPadding(3, right);
      @include UiPadding(3, top);
      @include UiPadding(3, bottom);
    }

    &_size-md {
      @include UiPadding(4, left);
      @include UiPadding(4, right);
      @include UiPadding(4, top);
      @include UiPadding(4, bottom);
      @include Ui9BoxWidth(UiSpacing(6));
      @include Ui9BoxHeight(UiSpacing(6));
    }
  }
</style>
