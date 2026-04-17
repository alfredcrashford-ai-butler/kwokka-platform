<template>
  <label class="ui-input" :class="[widthClass, { 'ui-input_is-disabled': disabled }]">
    <span class="ui-input__label" v-if="label">
      {{ label }}
      <span v-if="required" class="ui-input__required-indicator">*</span>
    </span>
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
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
  </label>
</template>

<script lang="ts">
  import { Component, Model, Prop, Ref, Vue } from 'vue-facing-decorator';

  export type UiInputSize = 'md' | 'sm' | 'xs';
  export type UiInputWidth = 'fixed' | 'block';

  @Component({
    emits: ['focus', 'keydown', 'keyup', 'blur'],
  })
  export default class UiInput extends Vue {
    private static readonly defaultInputSize = 'md';
    private static readonly defaultInputWidth: UiInputWidth = 'fixed';

    @Ref('input-element')
    public inputElement!: HTMLInputElement;

    @Model({ required: true })
    public value!: string;

    @Prop()
    public label?: string;

    @Prop()
    public width?: UiInputWidth;

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

    public focus() {
      this.inputElement.focus();
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
      max-width: UiSpacing(40);
    }

    &_width-block {
      width: 100%;
    }

    &__required-indicator {
      color: UiColor(negative-500);
    }

    &__input {
      @include UiInputAppearance();
      position: relative;
      width: 100%;
      display: block;

      &_size-md {
        height: UiSpacing(8);
      }

      &_size-sm {
        height: UiSpacing(6);
      }
    }

    &__label {
      @include UiMargin(2, bottom);
      @include UiTextShadow(2);
      @include UiTypographyHeading5();
    }
  }
</style>
