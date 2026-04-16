<template>
  <label class="ui-checkbox-container">
    <div
      class="ui-checkbox"
      :class="[
        {
          'ui-checkbox_is-disabled': isDisabled,
          'ui-checkbox_is-checked': modelValue,
        },
        sizeClass,
      ]"
    >
      <input
        class="ui-checkbox__input"
        type="checkbox"
        :checked="modelValue"
        :disabled="isDisabled"
        @input="$emit('update:modelValue', ($event.target as any).checked)"
      />
      <UiIcon name="check" class="ui-checkbox__check-mark" :size="size" />
    </div>

    <span v-if="$slots.default" class="ui-checkbox-label">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  export type UiCheckboxSize = 'md' | 'sm';

  @Component({
    components: {
      UiIcon,
    },
    emits: ['update:modelValue'],
  })
  export default class UiCheckbox extends Vue {
    private static readonly defaultCheckboxSize = 'md';

    @Prop()
    public modelValue: boolean;

    @Prop({ default: 'md' })
    public size?: UiCheckboxSize;

    @Prop()
    public isDisabled: boolean;

    public get sizeClass() {
      const size = this.size || UiCheckbox.defaultCheckboxSize;
      return `ui-checkbox_size-${size}`;
    }
  }
</script>

<style scoped lang="scss">
  .ui-checkbox-container {
    display: flex;
    align-items: center;
    width: fit-content;
  }

  .ui-checkbox-label {
    display: block;
    @include UiMargin(4, left);
  }

  .ui-checkbox {
    @include UiButtonAppearance();
    @include UiButtonStates();

    $transition-speed: 75ms;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    border-radius: $grid-step;
    cursor: pointer;

    transition: border-color ease-out $transition-speed;

    @include UiTheme() {
      border: 2px solid UiColor(shade-100);
      background-color: UiColor(shade-800);
    }

    &_is-checked {
      @include UiTheme() {
      }
    }

    &_is-disabled {
      cursor: auto;
      pointer-events: none;
      opacity: 0.45;
    }

    &_size-md {
      $size: $grid-step * 8;
      width: $size;
      height: $size;

      .ui-checkbox__input {
        width: $size;
        height: $size;
      }
    }

    &_size-sm {
      $size: $grid-step * 6;
      width: $size;
      height: $size;

      .ui-checkbox__input {
        width: $size;
        height: $size;
      }
    }

    &__input {
      position: absolute;
      z-index: -1;
      appearance: none;
    }

    &__check-mark {
      @include UiTheme() {
        color: UiColor(shade-100);
      }

      opacity: 0;
      visibility: hidden;
      transform: rotateZ(10deg) scale(0.8);

      transition-duration: $transition-speed;
      transition-timing-function: ease-out;
      transition-property: opacity, visibility, transform;
    }

    &__input:checked ~ &__check-mark {
      opacity: 1;
      visibility: visible;
      transform: rotateZ(0deg) scale(1);
    }
  }
</style>
