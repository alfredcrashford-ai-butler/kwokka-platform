<template>
  <div class="caption-panel ui-9-box" :class="[`caption-panel_size-${size}`]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class CaptionPanel extends Vue {
    @Prop({ default: 'md' })
    public size: 'sm' | 'md' | 'lg';
  }
</script>

<style scoped lang="scss">
  .caption-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    @include Ui9BoxTopLeft('/static/ui/caption_panel/caption_panel_top_left.webp');
    @include Ui9BoxTop('/static/ui/caption_panel/caption_panel_top.webp');
    @include Ui9BoxTopRight('/static/ui/caption_panel/caption_panel_top_right.webp');
    @include Ui9BoxLeft('/static/ui/caption_panel/caption_panel_left.webp');
    @include Ui9BoxCenter('/static/ui/caption_panel/caption_panel_center.webp');
    @include Ui9BoxRight('/static/ui/caption_panel/caption_panel_right.webp');
    @include Ui9BoxBottomLeft('/static/ui/caption_panel/caption_panel_bottom_left.webp');
    @include Ui9BoxBottom('/static/ui/caption_panel/caption_panel_bottom.webp');
    @include Ui9BoxBottomRight('/static/ui/caption_panel/caption_panel_bottom_right.webp');
    @include UiBorderRadius(1);

    &_size-sm {
      @include Ui9BoxWidth(UiSpacing(1));
      @include Ui9BoxHeight(UiSpacing(1));
      @include UiPadding(0.8);
    }

    &_size-md {
      @include UiPadding(1.2);
      @include Ui9BoxWidth(UiSpacing(2));
      @include Ui9BoxHeight(UiSpacing(2));
    }

    &_size-lg {
      @include UiPadding(2);
      @include Ui9BoxWidth(UiSpacing(3));
      @include Ui9BoxHeight(UiSpacing(3));
    }
  }
</style>
