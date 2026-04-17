<template>
  <span class="ui-icon" :class="[iconSizeClass]">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :aria-label="name">
      <use :xlink:href="iconId"></use>
    </svg>
  </span>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xs';

  @Component
  export default class UiIcon extends Vue {
    private static readonly defaultSize = 'md';

    @Prop() public name: string;

    @Prop() public size: IconSize;

    public get iconSizeClass() {
      const size = this.size || UiIcon.defaultSize;
      return `ui-icon_size-${size}`;
    }

    public get iconId() {
      return `#icon-${this.name}`;
    }
  }
</script>

<style scoped lang="scss">
  .ui-icon {
    display: flex;
    flex-shrink: 0;
    color: currentColor;

    &_size-sm {
      $size: UiSpacing(3);
      width: $size;
      height: $size;
      @include UiDropShadow(1);
    }

    &_size-xs {
      $size: UiSpacing(2);
      width: $size;
      height: $size;
      @include UiDropShadow(1);
    }

    &_size-md {
      $size: UiSpacing(5);
      width: $size;
      height: $size;
      @include UiDropShadow(1);
    }

    &_size-lg {
      $size: UiSpacing(7);
      width: $size;
      height: $size;
      @include UiDropShadow(2);
    }

    &_size-xl {
      $size: UiSpacing(10);
      width: $size;
      height: $size;
      @include UiDropShadow(2);
    }
  }
</style>
