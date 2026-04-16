<template>
  <div
    class="kwokka-auth-password kwokka-auth-block"
    v-styles="styles?.passwordBox"
  >
    <Input
      ref="input"
      class="kwokka-auth-password__input"
      autocomplete="off"
      v-model="value"
      v-styles="styles?.passwordInput"
      :placeholder="placeholder"
      :readonly="readonly"
      :type="isPasswordShown ? 'text' : 'password'"
      :disabled="disabled"
      :value="value"
      @keydown="$emit('keydown', $event)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />

    <Button
      class="kwokka-auth-password__button"
      shape="circled"
      type="subdued"
      width="shrink"
      v-styles="styles?.passwordButton"
      :aria-label="isPasswordShown ? 'Hide' : 'Show'"
      :disabled="isShowDisabled"
      @click="isPasswordShown = !isPasswordShown"
    >
      <Icon v-styles="styles?.passwordButtonIcon" :name="isPasswordShown ? 'eye-slash' : 'eye'" />
    </Button>
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Model, Prop, Ref, Vue } from 'vue-facing-decorator';
  import Button from './Button.vue';
  import Icon from './Icon.vue';
  import Input from './Input.vue';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';

  @Component({
    emits: ['keydown', 'focus', 'blur'],
    components: { Button, Input, Icon },
    directives: { styles: stylesDirective },
  })
  export default class Password extends Vue {
    @Inject()
    public styles: KwokkaAuthStyles;

    @Prop({ default: false })
    public readonly?: boolean;

    @Prop({ required: false })
    public placeholder?: string;

    @Prop({ default: false })
    public isShowDisabled?: boolean;

    @Prop({ default: false })
    public disabled?: boolean;

    @Model()
    public value!: string;

    @Ref()
    public input: Input;

    public isPasswordShown: boolean = false;

    public focus() {
      this.input.focus();
    }
  }
</script>

<style>
  .kwokka-auth-password {
    position: relative;
  }

  .kwokka-auth-password__button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    --kwk-auth--margin: 0 14px 0 0;
    --kwk-auth--border: none;
    --kwk-auth--background-color: #45305F;
    --kwk-auth--width: 28px;
    --kwk-auth--height: 28px;
    --kwk-auth--border-radius: 16px;
    --kwk-auth--padding: 0;
  }
</style>
