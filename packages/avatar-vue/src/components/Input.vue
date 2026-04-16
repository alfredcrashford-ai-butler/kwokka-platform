<template>
  <label
    class="kwokka-avatar-input kwokka-avatar-block"
    v-styles="styles?.inputBox"
    :class="[{ 'kwokka-avatar-input_is-disabled': disabled }]"
  >
    <span class="kwokka-avatar-block" v-if="label" v-styles="styles?.inputLabel">{{ label }}</span>
    <input
      ref="input-element"
      class="kwokka-avatar-input__input kwokka-avatar-block"
      v-styles="styles?.input"
      :class="[{ 'kwokka-avatar-input__input_is-required': required }]"
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
  import type { KwokkaAvatarStyles } from '@/styles/kwokka-avatar-styles';

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
    public styles: KwokkaAvatarStyles;

    public focus() {
      this.inputElement.focus();
    }

    public blur() {
      this.inputElement.blur();
    }
  }
</script>

<style>
  .kwokka-avatar-input {
    display: flex;
    flex-direction: column;
    --kwk-avatar--gap: 8px;
  }

  .kwokka-avatar-input__input {
    --kwk-avatar--color: #fff;
    --kwk-avatar--background-color: #30194d;
    --kwk-avatar--border-radius: 8px;
    --kwk-avatar--border: 2px solid #fff;
    --kwk-avatar--height: 48px;
    --kwk-avatar--padding: 4px 12px;
    --kwk-avatar--width: 100%;
  }

  .kwokka-avatar-input__input::placeholder {
    color: inherit;
    opacity: 0.65;
  }
</style>
