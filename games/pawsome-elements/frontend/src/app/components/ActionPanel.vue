<template>
  <div class="action-panel" :class="[`action-panel_size-${size}`]">
    <div class="action-panel__background ui-9-box"></div>
    <div class="action-panel__container">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class ActionPanel extends Vue {
    @Prop({ default: 'md' })
    public size: 'sm' | 'md';
  }
</script>

<style scoped lang="scss">
  .action-panel {
    position: relative;
    width: fit-content;
    height: fit-content;

    &__background {
      position: absolute;
      width: 100%;
      height: 100%;
      @include Ui9BoxTopLeft('/static/ui/action_panel/action_panel_top_left.webp');
      @include Ui9BoxTop('/static/ui/action_panel/action_panel_top.webp');
      @include Ui9BoxTopRight('/static/ui/action_panel/action_panel_top_right.webp');
      @include Ui9BoxLeft('/static/ui/action_panel/action_panel_left.webp');
      @include Ui9BoxCenter('/static/ui/action_panel/action_panel_center.webp');
      @include Ui9BoxRight('/static/ui/action_panel/action_panel_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/action_panel/action_panel_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/action_panel/action_panel_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/action_panel/action_panel_bottom_right.webp');
      @include UiDropShadow(1);
    }

    &__container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      @include UiPadding(2, top);
      @include UiPadding(2, bottom);
    }

    &_size-sm {
      > .action-panel__background {
        @include Ui9BoxWidth(UiSpacing(4));
        @include Ui9BoxHeight(UiSpacing(4));
      }

      > .action-panel__container {
        @include UiPadding(4, left);
        @include UiPadding(4, right);
        min-height: UiSpacing(9);
      }
    }

    &_size-md {
      > .action-panel__background {
        @include Ui9BoxWidth(UiSpacing(6));
        @include Ui9BoxHeight(UiSpacing(6));
      }

      > .action-panel__container {
        @include UiPadding(6, left);
        @include UiPadding(6, right);
        min-height: UiSpacing(14);
      }
    }

    &_size-lg {
      > .action-panel__background {
        @include Ui9BoxWidth(UiSpacing(7));
        @include Ui9BoxHeight(UiSpacing(7));
      }

      > .action-panel__container {
        @include UiPadding(8, left);
        @include UiPadding(8, right);
        min-height: UiSpacing(16);
      }
    }
  }
</style>
