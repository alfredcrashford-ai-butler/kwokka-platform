<template>
  <div class="ui-tooltip-container">
    <div class="ui-tooltip-container__inner">
      <slot></slot>
    </div>
    <div class="ui-tooltip" v-if="isShown" :class="[sideClass, alignClass]">
      <slot name="content">
        {{ content }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  export type UiTooltipSide = 'top' | 'bottom';
  export type UiTooltipAlign = 'left' | 'right' | 'center';

  @Component
  export default class UiTooltip extends Vue {
    private static readonly defaultSide = 'top';

    private static readonly defaultAlign = 'center';

    @Prop({ required: true })
    public content: string;

    @Prop({ default: true })
    public isShown: string;

    @Prop({ default: 'top' })
    public side: UiTooltipSide;

    @Prop({ default: 'center' })
    public align: UiTooltipAlign;

    public get sideClass() {
      const side = this.side || UiTooltip.defaultSide;
      return `ui-tooltip_side-${side}`;
    }

    public get alignClass() {
      const align = this.align || UiTooltip.defaultAlign;
      return `ui-tooltip_align-${align}`;
    }
  }
</script>

<style scoped lang="scss">
  .ui-tooltip-container {
    position: relative;
    width: fit-content;
    height: fit-content;

    --tooltip-translate-x: -50%;
    --tooltip-left: 50%;
    --tooltip-right: auto;

    &:hover > .ui-tooltip,
    &:focus > .ui-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(var(--tooltip-translate-x)) translateY(#{UiGridSpacing(1)});
    }

    &:hover > .ui-tooltip_side-bottom,
    &:focus > .ui-tooltip_side-bottom {
      transform: translateX(var(--tooltip-translate-x)) translateY(#{- UiGridSpacing(3)});
    }

    &:hover > .ui-tooltip_side-top,
    &:focus > .ui-tooltip_side-top {
      transform: translateX(var(--tooltip-translate-x)) translateY(#{UiGridSpacing(3)});
    }
  }

  .ui-tooltip {
    @include UiPadding(3);
    @include UiBorderRadius(md);
    @include UiTheme() {
      border: 2px solid rgba(UiColor(shade-100), 0.5);
      background-color: rgba(UiColor(shade-800), 0.5);
      color: UiColor(shade-100);
    }
    backdrop-filter: blur(2px);
    position: absolute;
    top: 100%;
    left: var(--tooltip-left);
    right: var(--tooltip-right);
    z-index: 2;

    min-width: $grid-step * 30;
    max-width: $grid-step * 80;
    transform: translateX(-50%) translateY(#{UiGridSpacing(3)});

    opacity: 0;
    visibility: hidden;
    transition:
      ease-in-out transform 100ms,
      linear opacity 100ms,
      linear visibility 100ms;
    text-align: center;

    // SIDES

    &_align-left {
      --tooltip-translate-x: 0;
      --tooltip-left: 0;
      --tooltip-right: auto;
    }

    &_align-right {
      --tooltip-translate-x: 0;
      --tooltip-left: auto;
      --tooltip-right: 0;
    }

    &_align-center {
      --tooltip-translate-x: -50%;
      --tooltip-left: 50%;
      --tooltip-right: auto;
    }

    &_side-top {
      top: 100%;
      transform: translateX(var(--tooltip-translate-x)) translateY(#{UiGridSpacing(5)});
    }

    &_side-bottom {
      top: auto;
      bottom: 100%;
      transform: translateX(var(--tooltip-translate-x)) translateY(#{- UiGridSpacing(5)});
    }
  }
</style>
