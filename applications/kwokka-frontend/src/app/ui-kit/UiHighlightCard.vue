<template>
  <div
    class="ui-highlight-card"
    :class="[
      colorClass,
      sideClass,
      sizeClass,
    ]"
    @click="onClick"
  >
    <div class="ui-highlight-card__inner">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-facing-decorator';

  export type UiHighlightCardSide = 'left' | 'right';
  export type UiHighlightCardSize = 'md' | 'sm';
  export type UiHighlightCardColor = 'yellow' | 'orange' | 'blue' | 'cyan' | 'pink';

  @Component
  export default class UiHighlightCard extends Vue {

    private static readonly defaultSide: UiHighlightCardSide = 'right';

    private static readonly defaultSize: UiHighlightCardSize = 'md';

    private static readonly defaultColor: UiHighlightCardColor = 'yellow';

    @Prop()
    public side?: UiHighlightCardSide;

    @Prop()
    public size?: UiHighlightCardSize;

    @Prop()
    public color?: UiHighlightCardColor;

    public get sideClass() {
      const side = this.side || UiHighlightCard.defaultSide;
      return `ui-highlight-card_side-${side}`;
    }

    public get sizeClass() {
      const size = this.size || UiHighlightCard.defaultSize;
      return `ui-highlight-card_size-${size}`;
    }

    public get colorClass() {
      const color = this.color || UiHighlightCard.defaultColor;
      return `ui-highlight-card_color-${color}`;
    }

    @Emit('click')
    public onClick(event: Event): Event {
      return event;
    }

  }
</script>

<style scoped lang="scss">
  .ui-highlight-card {
    position: relative;

    &__inner {
      @include UiBorderRadius(xl);
      position: relative;
      z-index: 1;
      height: calc(100% - var(--ui-card-size));
      width: calc(100% - var(--ui-card-size));
      margin-left: var(--ui-card-left);
      @include UiTheme() {
        border: 2px solid UiColor(shade-100);
        background-color: UiColor(shade-700);
      }
    }

    &_size-md {
      --ui-card-size: #{$grid-step * 5};
    }

    &_size-sm {
      --ui-card-size: #{$grid-step * 3};
    }

    &_side-right {
      --ui-card-element-left: var(--ui-card-size);
      --ui-card-left: 0;
    }

    &_side-left {
      --ui-card-element-left: 0;
      --ui-card-left: var(--ui-card-size);
    }

    &::before {
      @include UiBorderRadius(xl);

      box-sizing: border-box;
      content: '';
      position: absolute;
      left: var(--ui-card-element-left);
      bottom: 0;

      height: calc(100% - var(--ui-card-size));
      width: calc(100% - var(--ui-card-size));

      @include UiTheme() {
        border: 2px solid UiColor(shade-100);
        background-color: var(--ui-card-element-color, #{UiColor(shade-700)});
        border-color: UiColor(shade-100);
      }
    }

    &_color-yellow {
      @include UiTheme() {
        --ui-card-element-color: #{UiColor(yellow-500)};
      }
    }

    &_color-orange {
      @include UiTheme() {
        --ui-card-element-color: #{UiColor(orange-500)};
      }
    }

    &_color-blue {
      @include UiTheme() {
        --ui-card-element-color: #{UiColor(blue-500)};
      }
    }

    &_color-cyan {
      @include UiTheme() {
        --ui-card-element-color: #{UiColor(cyan-500)};
      }
    }

    &_color-pink {
      @include UiTheme() {
        --ui-card-element-color: #{UiColor(pink-500)};
      }
    }

  }
</style>
