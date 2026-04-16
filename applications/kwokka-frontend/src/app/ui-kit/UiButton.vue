<template>
  <button class="ui-button" :class="[widthClass, typeClass, sizeClass, shapeClass, shadeClass]" @click="onClick">
    <slot></slot>
  </button>
</template>

<script lang="ts">
  import { Component, Prop, Emit, Vue } from 'vue-facing-decorator';

  export type UiButtonType = 'primary' | 'secondary' | 'link' | 'subdued' | 'transparent';
  export type UiButtonSize = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
  export type UiButtonShape = 'circled' | 'rounded' | 'sharp';
  export type UiButtonWidth = 'block' | 'fit' | 'shrink';
  export type UiButtonShade = 'neutral' | 'accent' | 'negative' | 'positive' | 'blue';

  @Component
  export default class UiButton extends Vue {
    private static readonly defaultButtonType = 'primary';

    private static readonly defaultButtonSize = 'md';

    private static readonly defaultButtonShape = 'rounded';

    private static readonly defaultButtonWidth = 'fit';

    private static readonly defaultButtonShade = 'neutral';

    @Prop()
    public width?: UiButtonWidth;

    @Prop()
    public type?: UiButtonType;

    @Prop()
    public size?: UiButtonSize;

    @Prop()
    public shape?: UiButtonShape;

    @Prop()
    public shade?: UiButtonShade;

    public get typeClass() {
      const type = this.type || UiButton.defaultButtonType;
      return `ui-button_type-${type}`;
    }

    public get sizeClass() {
      const size = this.size || UiButton.defaultButtonSize;
      return `ui-button_size-${size}`;
    }

    public get shapeClass() {
      const shape = this.shape || UiButton.defaultButtonShape;
      return `ui-button_shape-${shape}`;
    }

    public get shadeClass() {
      const shade = this.shade || UiButton.defaultButtonShade;
      return `ui-button_shade-${shade}`;
    }

    public get widthClass() {
      const width = this.width || UiButton.defaultButtonWidth;
      return `ui-button_width-${width}`;
    }

    @Emit('click')
    public onClick(event: Event): Event {
      return event;
    }
  }
</script>

<style scoped lang="scss">
  .ui-button {
    @include UiTypographyParagraph1();
    @include UiButtonAppearance();
    @include UiFontWeight(bold);
    @include UiGap(2);
    @include UiPadding(1, top);
    @include UiPadding(1, bottom);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    // SIZES

    &_size-lg {
      $size: $grid-step * 10; // 40px
      min-height: $size;
      min-width: $size;
      @include UiTypographyHeading6();
      @include UiFontWeight(bold);
      @include UiBorderRadius(lg);
      @include UiPadding(8, left);
      @include UiPadding(8, right);
    }

    &_size-md {
      $size: $grid-step * 9; // 36px
      min-height: $size;
      min-width: $size;
      @include UiPadding(6, left);
      @include UiPadding(6, right);
    }

    &_size-sm {
      $size: $grid-step * 7; // 28px
      min-height: $size;
      min-width: $size;
      @include UiTypographyParagraph2();
      @include UiPadding(5, left);
      @include UiPadding(5, right);
    }

    &_size-xs {
      $size: $grid-step * 6; // 24px
      min-height: $size;
      min-width: $size;
      @include UiTypographyParagraph3();
      @include UiPadding(4, left);
      @include UiPadding(4, right);
    }

    &_size-xxs {
      $size: $grid-step * 4; // 16px
      min-height: $size;
      min-width: $size;
      @include UiTypographyParagraph4();
      @include UiPadding(1, left, false);
      @include UiPadding(1, right, false);
    }

    // SHADES

    &_shade-neutral {
      @include UiTheme() {
        --button-color: #{UiColor(yellow-500)};
      }
    }

    &_shade-accent {
      @include UiTheme() {
        --button-color: #{UiColor(pink-500)};
      }
    }

    &_shade-negative {
      @include UiTheme() {
        --button-color: #{UiColor(negative)};
      }
    }

    &_shade-positive {
      @include UiTheme() {
        --button-color: #{UiColor(positive)};
      }
    }

    &_shade-blue {
      @include UiTheme() {
        --button-color: #{UiColor(blue-500)};
      }
    }

    // TYPES

    &_type-primary {
      @include UiButtonStates();
      @include UiTheme() {
        background-color: var(--button-color);
        color: UiColor(shade-100);
        border-color: UiColor(shade-100);
      }
    }

    &_type-secondary {
      @include UiButtonStates();

      @include UiTheme() {
        background-color: UiColor(shade-800);
        color: UiColor(shade-100);
        border-color: UiColor(shade-100);
      }
    }

    &_type-link {
      @include UiTypographyLink();

      padding: 0;
      height: fit-content;
      background-color: transparent;

      &::after {
        display: none;
      }

      &:hover,
      &:focus {
        text-decoration: underline;
      }

      &:disabled {
        text-decoration: none;
      }
    }

    &_type-subdued {
      @include UiButtonStates();
      @include UiTheme() {
        background-color: UiColor(shade-700);
        color: UiColor(shade-100);
      }
    }

    &_type-transparent {
      @include UiButtonStates();
    }

    // SHAPES

    &_shape-circled {
      // border-radius: 50% makes ellips form-factor, which we don't want
      border-radius: $grid-step * 10;

      &::after {
        border-radius: $grid-step * 10;
      }
    }

    &_shape-rounded {
      @include UiBorderRadius('md');

      &::after {
        @include UiBorderRadius('md');
      }

      &.ui-button_size-lg {
        @include UiBorderRadius('lg');
        &::after {
          @include UiBorderRadius('lg');
        }
      }
    }

    &_shape-sharp {
      border-radius: 0;

      &::after {
        border-radius: 0;
      }
    }

    // WIDTHS

    &_width-block {
      width: 100%;
    }

    &_width-fit {
      width: fit-content;
    }

    &_width-shrink {
      width: fit-content;
      padding: 0;
    }
  }
</style>
