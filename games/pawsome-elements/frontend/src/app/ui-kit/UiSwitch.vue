<template>
  <label
    v-ui-sound
    class="ui-switch"
    :class="[
      `ui-switch_orientation-${orientation}`,
      { 'ui-switch_checked': modelValue, 'ui-switch_unchecked': !modelValue, 'ui-switch_disabled': disabled },
    ]"
  >
    <span class="ui-switch__label" v-if="label">{{ label }}</span>
    <div class="ui-switch__track">
      <div class="ui-switch__thumb"></div>
    </div>
    <input
      class="ui-switch__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as any).checked)"
    />
  </label>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component({
    emits: ['update:modelValue'],
  })
  export default class UiSwitch extends Vue {
    @Prop()
    public modelValue: boolean;

    @Prop({ default: null })
    public label: string;

    @Prop({ default: 'vertical' })
    public orientation: 'vertical' | 'horizontal';

    @Prop({ default: false })
    public disabled?: boolean;
  }
</script>

<style scoped lang="scss">
  .ui-switch {
    $height: UiSpacing(4);
    $border: UiSpacing(0.3);
    display: flex;
    @include UiGap(2);

    &_disabled {
      pointer-events: none;
      cursor: not-allowed;
      opacity: 0.45;
    }

    &_orientation-vertical {
      flex-direction: column;
    }

    &_orientation-horizontal {
      flex-direction: row;
    }

    &_checked {
      .ui-switch__track {
        background-color: UiColor(secondary-900);
      }
      .ui-switch__thumb {
        transform: translateX($height);
      }
    }

    &_unchecked {
      .ui-switch__track {
        background-color: UiColor(shade-900);
      }
      .ui-switch__thumb {
        transform: translateX(0);
      }
    }

    &__label {
      @include UiTextShadow(2);
      @include UiTypographyHeading5();
      flex-shrink: 0;
    }

    &__track {
      @include UiButtonAppearance();
      display: flex;
      align-items: center;
      border-radius: $height;
      border: $border solid UiColor(secondary-500);
      width: calc(#{$height} * 2);
      height: $height;
      padding-left: $border;
      padding-right: $border;
      flex-shrink: 0;
    }

    &__thumb {
      height: calc(100% - ($border * 2));
      aspect-ratio: 1;
      background-color: UiColor(secondary-500);
      border-radius: 100%;
      transition: transform ease-out 100ms;
    }

    &__input {
      position: absolute;
      z-index: -1;
      appearance: none;
    }
  }
</style>
