<template>
  <figure
    aria-label="Kwokka"
    class="ui-logo"
    :class="[
      sizeClass,
      mobileSizeClass,
    ]"
  >
    <UiResponsiveImage class="ui-logo__image" src="/assets/logo.svg"/>
  </figure>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiResponsiveImage from '@/app/ui-kit/UiResponsiveImage.vue';

  export type UiLogoSize = 'md' | 'lg' | 'sm' | 'xs';

  @Component({
    components: {
      UiResponsiveImage,
    },
  })
  export default class UiLogo extends Vue {

    private static defaultSize = 'md';

    @Prop({ default: 'md' })
    public size: UiLogoSize;

    @Prop()
    public mobileSize: UiLogoSize;

    public get mobileSizeClass() {
      const size = this.mobileSize || this.size || UiLogo.defaultSize;
      return `ui-logo_size-mobile-${size}`;
    }

    public get sizeClass() {
      const size = this.size || UiLogo.defaultSize;
      return `ui-logo_size-${size}`;
    }

  }
</script>

<style lang="scss" scoped>
  .ui-logo {

    &_size-xs {
      $width: $grid-step * 28;
      width: $width;
      height: $width / 2;
    }

    &_size-sm {
      $width: $grid-step * 38;
      width: $width;
      height: $width / 2;
    }

    &_size-md {
      $width: $grid-step * 70;
      width: $width;
      height: $width / 2;
    }

    &_size-lg {
      $width: $grid-step * 100;
      width: $width;
      height: $width / 2;
    }

    &_size-mobile-xs {
      @include UiMediaMobile() {
        $width: $grid-step * 28;
        width: $width;
        height: $width / 2;
      }
    }

    &_size-mobile-sm {
      @include UiMediaMobile() {
        $width: $grid-step * 38;
        width: $width;
        height: $width / 2;
      }
    }

    &_size-mobile-md {
      @include UiMediaMobile() {
        $width: $grid-step * 70;
        width: $width;
        height: $width / 2;
      }
    }

    &_size-mobile-lg {
      @include UiMediaMobile() {
        $width: $grid-step * 100;
        width: $width;
        height: $width / 2;
      }
    }

    &__image {
      height: 100%;
    }

  }
</style>
