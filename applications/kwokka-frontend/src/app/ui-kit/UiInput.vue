<template>
  <label class="ui-input" :class="[widthClass, modeClass, { 'ui-input_is-disabled': disabled }]">
    <span class="ui-input__label" v-if="label">
      {{ label }}
      <span v-if="required" class="ui-input__required-indicator">*</span>
    </span>
    <div class="ui-input__wrapper">
      <div class="ui-input__element" />
      <input
        ref="input-element"
        class="ui-input__input"
        :class="[sizeClass]"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :pattern="pattern"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :aria-label="!label && placeholder"
        v-model="value"
        @keydown="onKeydown"
        @keyup="onKeyup"
        @blur="onBlur"
        @focus="$emit('focus', $event)"
      />
    </div>
  </label>
</template>

<script lang="ts">
  import { Component, Emit, Model, Prop, Ref, Vue } from 'vue-facing-decorator';

  export type UiInputSize = 'md' | 'sm' | 'xs';
  export type UiInputWidth = 'fixed' | 'block';
  export type UiInputMode = 'compact' | 'rich';

  @Component({
    emits: ['focus'],
  })
  export default class UiInput extends Vue {
    private static readonly defaultInputSize = 'md';

    private static readonly defaultInputWidth: UiInputWidth = 'fixed';

    private static readonly defaultInputMode: UiInputMode = 'rich';

    @Ref('input-element')
    public inputElement!: HTMLInputElement;

    @Model({ required: true })
    public value!: string;

    @Prop()
    public label?: string;

    @Prop()
    public width?: UiInputWidth;

    @Prop()
    public mode?: UiInputMode;

    @Prop()
    public type?: string;

    @Prop()
    public placeholder?: string;

    @Prop()
    public min?: number;

    @Prop()
    public max?: number;

    @Prop()
    public pattern?: string;

    @Prop({ default: false })
    public required?: boolean;

    @Prop({ default: false })
    public readonly?: boolean;

    @Prop({ default: false })
    public disabled?: boolean;

    @Prop({ default: false })
    public autofocus?: boolean;

    @Prop()
    public autocomplete?: string;

    @Prop({ default: 'md' })
    public size?: UiInputSize;

    public get sizeClass(): string {
      const size = this.size || UiInput.defaultInputSize;
      return `ui-input__input_size-${size}`;
    }

    public get widthClass(): string {
      const width = this.width || UiInput.defaultInputWidth;
      return `ui-input_width-${width}`;
    }

    public get modeClass(): string {
      const mode = this.mode || UiInput.defaultInputMode;
      return `ui-input_mode-${mode}`;
    }

    public focus() {
      this.inputElement.focus();
    }

    @Emit('keydown')
    public onKeydown(event: Event): Event {
      return event;
    }

    @Emit('keyup')
    public onKeyup(event: Event): Event {
      return event;
    }

    @Emit('blur')
    public onBlur(event: Event): Event {
      return event;
    }
  }
</script>

<style scoped lang="scss">
  .ui-input {
    display: flex;
    flex-direction: column;
    position: relative;

    &_is-disabled {
      opacity: 0.45;
    }

    &_width-fixed {
      width: 100%;
      max-width: $grid-step * 72; // 288px
    }

    &_width-block {
      width: 100%;
    }

    &__required-indicator {
      @include UiTheme() {
        color: UiColor(negative);
      }
    }

    &__wrapper {
      position: relative;
      padding-bottom: 6px;
    }

    &__input {
      @include UiInputAppearance();
      position: relative;
      width: 100%;
      display: block;

      &_size-md {
        $height: $grid-step * 12;
        height: $height;
      }

      &_size-sm {
        $height: $grid-step * 9;
        height: $height;
      }

      &_size-xs {
        $height: $grid-step * 6;
        height: $height;
      }
    }

    &__element {
      @include UiBorderRadius(md);
      $padding: $grid-step * 2;
      width: calc(100% - #{$padding * 2});
      height: 100%;
      bottom: 0;
      left: $padding;
      position: absolute;
      @include UiTheme() {
        background-color: UiColor(cyan-500);
        border: 2px solid UiColor(shade-100);
      }
    }

    &__label {
      @include UiFontWeight(semibold);
      @include UiMargin(2, bottom);
    }

    &_mode-compact {
      .ui-input__wrapper {
        padding-bottom: 0;
      }
      .ui-input__element {
        display: none;
      }
    }
  }
</style>
