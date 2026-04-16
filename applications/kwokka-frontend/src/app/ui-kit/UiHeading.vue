<template>
  <component :is="sizeTag" class="ui-heading" :class="[typeClass, sizeMobileClass, colorClass]">
    <UiIllustration
      v-if="type === 'headline'"
      class="ui-heading__headline-element"
      :option="2"
    />
    <span class="ui-heading__text">
      <slot></slot>
    </span>
    <UiIllustration
      v-if="type === 'headline'"
      class="ui-heading__headline-element ui-heading__headline-element_is-mirrored"
      :option="2"
    />
  </component>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiIllustration from '@/app/ui-kit/UiIllustration.vue';

  export type UiHeadingColor = 'yellow' | 'orange' | 'blue' | 'cyan' | 'pink';
  export type UiHeadingType = 'label' | 'headline';

  @Component({
    components: {
      UiIllustration,
    },
  })
  export default class UiHeading extends Vue {

    public static defaultSize = 1;

    @Prop() public size: number;

    @Prop() public sizeMobile: number;

    @Prop() public type?: UiHeadingType;

    @Prop()
    public color?: UiHeadingType;

    public get sizeTag(): string {
      const size = this.size || UiHeading.defaultSize;
      return `h${size}`;
    }

    public get sizeMobileClass(): string {
      const sizeMobile = this.sizeMobile || this.size || UiHeading.defaultSize;
      return `ui-heading_size-mobile-${sizeMobile}`;
    }

    public get colorClass(): string {
      const color = this.color || 'cyan';
      return `ui-heading_color-${color}`;
    }

    public get typeClass(): string {
      if (!this.type) {
        return undefined;
      }
      return `ui-heading_type-${this.type}`;
    }

  }
</script>

<style scoped lang="scss">
  .ui-heading {

    @include UiTheme() {
      --ui-heading-bg-color: #{UiColor(cyan-500)};
      &_color-yellow {
        --ui-heading-bg-color: #{UiColor(yellow-500)};
      }
      &_color-cyan {
        --ui-heading-bg-color: #{UiColor(cyan-500)};
      }
      &_color-orange {
        --ui-heading-bg-color: #{UiColor(orange-500)};
      }
      &_color-blue {
        --ui-heading-bg-color: #{UiColor(blue-500)};
      }
      &_color-pink {
        --ui-heading-bg-color: #{UiColor(pink-500)};
      }
    }

    @include UiMediaMobile() {
      &.ui-heading_size-mobile-1 {
        @include UiTypographyHeading1();
      }

      &.ui-heading_size-mobile-2 {
        @include UiTypographyHeading2();
      }

      &.ui-heading_size-mobile-3 {
        @include UiTypographyHeading3();
      }

      &.ui-heading_size-mobile-4 {
        @include UiTypographyHeading4();
      }

      &.ui-heading_size-mobile-5 {
        @include UiTypographyHeading5();
      }

      &.ui-heading_size-mobile-6 {
        @include UiTypographyHeading6();
      }
    }

    &_type-label {
      @include UiPadding(4, left);
      @include UiPadding(4, right);
      @include UiPadding(1, top);
      @include UiPadding(1, bottom);
      border-radius: UiGridSpacing(1) UiGridSpacing(5);
      width: fit-content;
      background-color: var(--ui-heading-bg-color);
    }

    &_type-headline {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: UiGridSpacing(5);

      @include UiMediaMobile() {
        gap: UiGridSpacing(3);
      }
    }

    &__headline-element {
      @include UiMediaTabletAndDesktop() {
        width: $grid-step * 34;
      }
      &_is-mirrored {
        transform: rotateY(180deg);
      }
    }

    &__text {
      flex-shrink: 0;
    }

  }

  h1.ui-heading {
    @include UiTypographyHeading1();
  }

  h2.ui-heading {
    @include UiTypographyHeading2();
  }

  h3.ui-heading {
    @include UiTypographyHeading3();
  }

  h4.ui-heading {
    @include UiTypographyHeading4();
  }

  h5.ui-heading {
    @include UiTypographyHeading5();
  }

  h6.ui-heading {
    @include UiTypographyHeading6();
  }
</style>
