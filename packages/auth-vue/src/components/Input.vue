<template>
  <label
    class="kwokka-auth-input kwokka-auth-block"
    v-styles="styles?.inputBox"
    :class="[{ 'kwokka-auth-input_is-disabled': disabled }]"
  >
    <span class="kwokka-auth-input__label kwokka-auth-block" v-if="label" v-styles="styles?.inputLabel">{{ label }}</span>
    <input
      ref="input-element"
      class="kwokka-auth-input__input kwokka-auth-block"
      v-styles="styles?.input"
      :class="[{ 'kwokka-auth-input__input_is-required': required }]"
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
      @keydown="$emit('keyup', $event)"
      @keyup="$emit('keyup', $event)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
  </label>
</template>

<script lang="ts">
  import { Component, Inject, Model, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';

  @Component({
    emits: ['keyup', 'keyup', 'blur', 'focus'],
    directives: { styles: stylesDirective },
  })
  export default class Input extends Vue {
    @Ref('input-element')
    public inputElement!: HTMLInputElement;

    @Model({ required: true })
    public value!: string;

    @Prop()
    public label?: string;

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

    @Prop()
    public required?: boolean;

    @Prop()
    public readonly?: boolean;

    @Prop()
    public disabled?: boolean;

    @Prop()
    public autofocus?: boolean;

    @Prop()
    public autocomplete?: string;

    @Inject()
    public styles: KwokkaAuthStyles;

    public focus() {
      this.inputElement.focus();
    }

    public blur() {
      this.inputElement.blur();
    }
  }
</script>

<style>
  .kwokka-auth-input {
    --kwk-auth--gap: 8px;
  }

  .kwokka-auth-input__input {
    --kwk-auth--color: #fff;
    --kwk-auth--background-color: #30194d;
    --kwk-auth--border-radius: 8px;
    --kwk-auth--border: 2px solid #fff;
    --kwk-auth--height: 48px;
    --kwk-auth--padding: 4px 12px;
    --kwk-auth--width: 100%;
  }

  .kwokka-auth-input__input::placeholder {
    color: inherit;
    opacity: 0.65;
  }
</style>
