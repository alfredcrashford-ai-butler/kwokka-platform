<template>
  <button
    v-ui-sound
    class="ui-button ui-9-box"
    :class="[widthClass, typeClass, sizeClass]"
    @click="$emit('click', $event)"
  >
    <div class="ui-button__inner" :class="{ 'ui-button__inner_is-outlined': isOutlined }">
      <slot></slot>
    </div>
  </button>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  export type UiButtonType =
    | 'primary'
    | 'secondary'
    | 'link'
    | 'transparent'
    | 'green'
    | 'red'
    | 'blue'
    | 'dark'
    | 'light'
    | 'discord';
  export type UiButtonSize = 'sm' | 'md' | 'lg' | 'xl';
  export type UiButtonWidth = 'block' | 'fit' | 'shrink';

  @Component({
    emits: ['click'],
  })
  export default class UiButton extends Vue {
    private static readonly defaultButtonType = 'primary';
    private static readonly defaultButtonWidth = 'fit';
    private static readonly defaultButtonSize = 'lg';

    @Prop({ default: UiButton.defaultButtonWidth })
    public width?: UiButtonWidth;

    @Prop({ default: UiButton.defaultButtonType })
    public type?: UiButtonType;

    @Prop({ default: UiButton.defaultButtonSize })
    public size?: UiButtonSize;

    @Prop({ default: true })
    public isOutlined: boolean;

    public get typeClass() {
      const type = this.type || UiButton.defaultButtonType;
      return `ui-button_type-${type}`;
    }

    public get widthClass() {
      const width = this.width || UiButton.defaultButtonWidth;
      return `ui-button_width-${width}`;
    }

    public get sizeClass() {
      const size = this.size || UiButton.defaultButtonSize;
      return `ui-button_size-${size}`;
    }
  }
</script>

<style scoped lang="scss">
  .ui-button {
    @include UiButtonAppearance();
    @include UiPadding(1, top);
    @include UiPadding(1, bottom);
    @include Ui9BoxWidth(var(--ui-button-9-box-padding));
    @include Ui9BoxHeight(var(--ui-button-9-box-padding));

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    height: var(--ui-button-9-box-height);
    color: UiColor(shade-100);

    &__inner {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      @include UiGap(2);

      &_is-outlined {
        @include UiTextShadow(2);
      }
    }

    // SIZES

    &_size-sm {
      --ui-button-9-box-padding: #{UiSpacing(1)};
      --ui-button-9-box-height: #{UiSpacing(6)};
      @include UiPadding(2, left);
      @include UiPadding(2, right);
      @include UiTypographyParagraph1();
    }

    &_size-md {
      --ui-button-9-box-padding: #{UiSpacing(1)};
      --ui-button-9-box-height: #{UiSpacing(6)};
      @include UiPadding(3, left);
      @include UiPadding(3, right);
      @include UiTypographyParagraph1();
    }

    &_size-lg {
      --ui-button-9-box-padding: #{UiSpacing(2)};
      --ui-button-9-box-height: #{UiSpacing(8)};
      @include UiPadding(4, left);
      @include UiPadding(4, right);
      @include UiTypographyHeading6();
    }

    &_size-xl {
      --ui-button-9-box-padding: #{UiSpacing(3)};
      --ui-button-9-box-height: #{UiSpacing(12)};
      @include UiPadding(6, left);
      @include UiPadding(6, right);
      @include UiTypographyHeading5();
    }

    // TYPES

    &_type-primary {
      @include Ui9BoxTopLeft('/static/ui/button/primary/button_primary_top_left.webp');
      @include Ui9BoxTop('/static/ui/button/primary/button_primary_top.webp');
      @include Ui9BoxTopRight('/static/ui/button/primary/button_primary_top_right.webp');
      @include Ui9BoxLeft('/static/ui/button/primary/button_primary_left.webp');
      @include Ui9BoxCenter('/static/ui/button/primary/button_primary_center.webp');
      @include Ui9BoxRight('/static/ui/button/primary/button_primary_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/button/primary/button_primary_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/button/primary/button_primary_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/button/primary/button_primary_bottom_right.webp');
    }

    &_type-secondary {
      @include Ui9BoxTopLeft('/static/ui/button/secondary/button_secondary_top_left.webp');
      @include Ui9BoxTop('/static/ui/button/secondary/button_secondary_top.webp');
      @include Ui9BoxTopRight('/static/ui/button/secondary/button_secondary_top_right.webp');
      @include Ui9BoxLeft('/static/ui/button/secondary/button_secondary_left.webp');
      @include Ui9BoxCenter('/static/ui/button/secondary/button_secondary_center.webp');
      @include Ui9BoxRight('/static/ui/button/secondary/button_secondary_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/button/secondary/button_secondary_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/button/secondary/button_secondary_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/button/secondary/button_secondary_bottom_right.webp');
    }

    &_type-blue {
      @include Ui9BoxTopLeft('/static/ui/button/blue/button_blue_top_left.webp');
      @include Ui9BoxTop('/static/ui/button/blue/button_blue_top.webp');
      @include Ui9BoxTopRight('/static/ui/button/blue/button_blue_top_right.webp');
      @include Ui9BoxLeft('/static/ui/button/blue/button_blue_left.webp');
      @include Ui9BoxCenter('/static/ui/button/blue/button_blue_center.webp');
      @include Ui9BoxRight('/static/ui/button/blue/button_blue_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/button/blue/button_blue_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/button/blue/button_blue_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/button/blue/button_blue_bottom_right.webp');
    }

    &_type-green {
      @include Ui9BoxTopLeft('/static/ui/button/green/button_green_top_left.webp');
      @include Ui9BoxTop('/static/ui/button/green/button_green_top.webp');
      @include Ui9BoxTopRight('/static/ui/button/green/button_green_top_right.webp');
      @include Ui9BoxLeft('/static/ui/button/green/button_green_left.webp');
      @include Ui9BoxCenter('/static/ui/button/green/button_green_center.webp');
      @include Ui9BoxRight('/static/ui/button/green/button_green_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/button/green/button_green_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/button/green/button_green_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/button/green/button_green_bottom_right.webp');
    }

    &_type-red {
      @include Ui9BoxTopLeft('/static/ui/button/red/button_red_top_left.webp');
      @include Ui9BoxTop('/static/ui/button/red/button_red_top.webp');
      @include Ui9BoxTopRight('/static/ui/button/red/button_red_top_right.webp');
      @include Ui9BoxLeft('/static/ui/button/red/button_red_left.webp');
      @include Ui9BoxCenter('/static/ui/button/red/button_red_center.webp');
      @include Ui9BoxRight('/static/ui/button/red/button_red_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/button/red/button_red_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/button/red/button_red_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/button/red/button_red_bottom_right.webp');
    }

    &_type-dark {
      @include Ui9BoxTopLeft('/static/ui/button/dark/button_dark_top_left.webp');
      @include Ui9BoxTop('/static/ui/button/dark/button_dark_top.webp');
      @include Ui9BoxTopRight('/static/ui/button/dark/button_dark_top_right.webp');
      @include Ui9BoxLeft('/static/ui/button/dark/button_dark_left.webp');
      @include Ui9BoxCenter('/static/ui/button/dark/button_dark_center.webp');
      @include Ui9BoxRight('/static/ui/button/dark/button_dark_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/button/dark/button_dark_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/button/dark/button_dark_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/button/dark/button_dark_bottom_right.webp');
    }

    &_type-light {
      @include Ui9BoxTopLeft('/static/ui/button/light/button_light_top_left.webp');
      @include Ui9BoxTop('/static/ui/button/light/button_light_top.webp');
      @include Ui9BoxTopRight('/static/ui/button/light/button_light_top_right.webp');
      @include Ui9BoxLeft('/static/ui/button/light/button_light_left.webp');
      @include Ui9BoxCenter('/static/ui/button/light/button_light_center.webp');
      @include Ui9BoxRight('/static/ui/button/light/button_light_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/button/light/button_light_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/button/light/button_light_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/button/light/button_light_bottom_right.webp');
    }

    &_type-discord {
      @include Ui9BoxTopLeft('/static/ui/button/discord/button_discord_top_left.webp');
      @include Ui9BoxTop('/static/ui/button/discord/button_discord_top.webp');
      @include Ui9BoxTopRight('/static/ui/button/discord/button_discord_top_right.webp');
      @include Ui9BoxLeft('/static/ui/button/discord/button_discord_left.webp');
      @include Ui9BoxCenter('/static/ui/button/discord/button_discord_center.webp');
      @include Ui9BoxRight('/static/ui/button/discord/button_discord_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/button/discord/button_discord_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/button/discord/button_discord_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/button/discord/button_discord_bottom_right.webp');
    }

    &_type-link {
      @include UiTypographyLink();

      padding: 0;
      height: fit-content;
      background-color: transparent;

      &:hover,
      &:focus {
        text-decoration: underline;
      }

      &:disabled {
        text-decoration: none;
      }
    }

    &_type-transparent {
      color: currentColor;
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
