<template>
  <div class="paper-panel ui-9-box" :class="[`paper-panel_size-${size}`]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class PaperPanel extends Vue {
    @Prop({ default: 'md' })
    public size: 'sm' | 'md' | 'lg';
  }
</script>

<style scoped lang="scss">
  .paper-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    @include Ui9BoxTopLeft('/static/ui/paper_panel/paper_panel_top_left.webp');
    @include Ui9BoxTop('/static/ui/paper_panel/paper_panel_top.webp');
    @include Ui9BoxTopRight('/static/ui/paper_panel/paper_panel_top_right.webp');
    @include Ui9BoxLeft('/static/ui/paper_panel/paper_panel_left.webp');
    @include Ui9BoxCenter('/static/ui/paper_panel/paper_panel_center.webp');
    @include Ui9BoxRight('/static/ui/paper_panel/paper_panel_right.webp');
    @include Ui9BoxBottomLeft('/static/ui/paper_panel/paper_panel_bottom_left.webp');
    @include Ui9BoxBottom('/static/ui/paper_panel/paper_panel_bottom.webp');
    @include Ui9BoxBottomRight('/static/ui/paper_panel/paper_panel_bottom_right.webp');
    @include UiBorderRadius(1);

    &_size-sm {
      @include Ui9BoxWidth(UiSpacing(4.5));
      @include Ui9BoxHeight(UiSpacing(3.85));
      @include UiPadding(1);
    }

    &_size-md {
      @include UiPadding(2);
      @include Ui9BoxWidth(UiSpacing(5.5));
      @include Ui9BoxHeight(UiSpacing(4.85));
    }

    &_size-lg {
      @include UiPadding(2.5);
      @include Ui9BoxWidth(UiSpacing(7));
      @include Ui9BoxHeight(UiSpacing(6));
    }
  }
</style>
