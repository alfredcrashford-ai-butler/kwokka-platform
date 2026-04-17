<template>
  <label class="ui-slider" :class="[{ 'ui-slider_is-disabled': disabled }]">
    <span class="ui-slider__label" v-if="label">
      {{ label }}
      <span v-if="required" class="ui-slider__required-indicator">*</span>
    </span>
    <input
      v-ui-sound
      ref="input-element"
      class="ui-slider__input"
      type="range"
      :min="min"
      :max="max"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      v-model="value"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <div class="ui-slider__ticks">
      <div class="ui-slider__tick" :data-tick="min"></div>
      <div class="ui-slider__tick" :data-tick="(min + max) * (1 / 4)"></div>
      <div class="ui-slider__tick" :data-tick="(min + max) * (1 / 2)"></div>
      <div class="ui-slider__tick" :data-tick="(min + max) * (3 / 4)"></div>
      <div class="ui-slider__tick" :data-tick="max"></div>
    </div>
  </label>
</template>

<script lang="ts">
  import { Component, Model, Prop, Ref, Vue } from 'vue-facing-decorator';

  @Component({
    emits: ['focus', 'keydown', 'keyup', 'blur'],
  })
  export default class UiSlider extends Vue {
    @Ref('input-element')
    public inputElement!: HTMLInputElement;

    @Model({ required: true })
    public value!: string;

    @Prop()
    public label?: string;

    @Prop()
    public min?: number;

    @Prop()
    public max?: number;

    @Prop({ default: false })
    public required?: boolean;

    @Prop({ default: false })
    public readonly?: boolean;

    @Prop({ default: false })
    public disabled?: boolean;

    @Prop({ default: false })
    public autofocus?: boolean;

    public focus() {
      this.inputElement.focus();
    }
  }
</script>

<style scoped lang="scss">
  .ui-slider {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;

    &_is-disabled {
      opacity: 0.45;
    }

    &__required-indicator {
      color: UiColor(negative-500);
    }

    &__input {
      width: 100%;
      appearance: none;
      background: transparent;
      cursor: pointer;

      @mixin UiSliderTrack() {
        background-color: UiColor(shade-900, 0.75);
        border: 1px solid UiColor(shade-100, 0.75);
        @include UiBorderRadius(1);
        height: UiSpacing(2);
      }

      @mixin UiSliderThumb() {
        background-color: UiColor(secondary-500);
        border: 1px solid UiColor(secondary-100);
        @include UiBorderRadius(2);
        height: UiSpacing(4);
        width: UiSpacing(4);
        box-sizing: border-box;
        appearance: none;
        position: relative;
        top: 50%;
        transform: translateY(-50%);

        &:hover,
        &:focus {
          filter: brightness(1.1);
        }
      }

      &::-webkit-slider-runnable-track {
        @include UiSliderTrack();
      }

      &::-moz-range-track {
        @include UiSliderTrack();
      }

      &::-webkit-slider-thumb {
        @include UiSliderThumb();
      }

      &::-moz-range-thumb {
        @include UiSliderThumb();
      }
    }

    &__label {
      @include UiMargin(2, bottom);
      @include UiTextShadow(2);
      @include UiTypographyParagraph1();
    }

    &__ticks {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      @include UiPadding(2, left);
      @include UiPadding(2, right);
      pointer-events: none;
      @include UiMargin(1, top);
      opacity: 0.75;
      height: UiSpacing(5);
    }

    &__tick {
      width: 1px;
      height: UiSpacing(1);
      background-color: UiColor(shade-100);
      position: relative;
      @include UiTypographyParagraph3();

      &::before {
        content: attr(data-tick);
        position: absolute;
        left: 50%;
        @include UiMargin(2, top);
        transform: translateX(-50%);
      }
    }
  }
</style>
