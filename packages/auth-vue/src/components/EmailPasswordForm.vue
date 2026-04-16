<template>
  <div class="kwokka-auth-email-password-form" :inert="isDisabled">
    <Input
      v-model="email"
      type="email"
      class="kwokka-auth-email-password-form__email-input"
      :placeholder="$t('auth.email.emailPlaceholder')"
      :disabled="isDisabled"
      v-styles="styles?.email?.emailInput"
      @focus="emailIsFocused = true"
    />

    <Password
      v-model="password"
      :placeholder="$t('auth.email.passwordPlaceholder')"
      :disabled="isDisabled"
      class="kwokka-auth-email-password-form__password-input"
      v-styles="styles?.email?.passwordInput"
      @focus="passwordIsFocused = true"
    />

    <Button
      v-if="isResetPasswordShown"
      class="kwokka-auth-email-password-form__forgot-password kwokka-auth-block"
      v-styles="styles?.email?.resetPasswordButton"
      href="."
      @click="$emit('resetPassword')"
    >
      {{ $t('auth.email.forgotPassword') }}</Button
    >

    <div class="kwokka-auth-email-password-form__suggestions-list kwokka-auth-block" v-styles="styles?.email?.suggestionList">
      <Suggestion :isValid="emailIsValid" translationKey="auth.suggestions.emailValid" />
      <Suggestion :isValid="passwordLengthIsValid" translationKey="auth.suggestions.passwordLengthValid" />
      <Suggestion :isValid="passwordHasUppercaseLetter" translationKey="auth.suggestions.passwordHasUppercaseLetter" />
      <Suggestion :isValid="passwordHasLowercaseLetter" translationKey="auth.suggestions.passwordHasLowercaseLetter" />
      <Suggestion :isValid="passwordHasNumber" translationKey="auth.suggestions.passwordHasNumber" />
      <Suggestion
        :isValid="passwordHasOnlyAllowedCharacters"
        translationKey="auth.suggestions.passwordHasOnlyAllowedCharacters"
      />
    </div>

    <Button
      class="kwokka-auth-email-password-form__submit"
      :disabled="
        !passwordHasNumber ||
        !passwordHasLowercaseLetter ||
        !passwordHasUppercaseLetter ||
        !passwordLengthIsValid ||
        !emailIsValid
      "
      v-styles="styles?.email?.submit"
      @click="$emit('submit', { email, password })"
    >
      {{ submitText }}
    </Button>
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Prop, Vue } from 'vue-facing-decorator';
  import Button from '@/components/Button.vue';
  import Input from '@/components/Input.vue';
  import Password from '@/components/Password.vue';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import Suggestion from './Suggestion.vue';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { LoggerService } from '@/service/logger.service';
  import { EmailPasswordCredentialEntity } from '@kwokka/entities';

  @Component({
    components: { Input, Button, Password, Suggestion },
    directives: { styles: stylesDirective },
    emits: ['submit', 'resetPassword'],
  })
  export default class EmailPasswordForm extends Vue {
    @Inject()
    public styles: KwokkaAuthStyles;

    @Inject()
    public logger: LoggerService;

    @Prop({ required: true })
    public isResetPasswordShown: boolean;

    @Prop({ default: false })
    public isDisabled: boolean;

    @Prop({ required: true })
    public submitText: string;

    public email: string = '';
    public password: string = '';
    public emailIsFocused: boolean = false;
    public passwordIsFocused: boolean = false;

    public get emailIsValid(): boolean {
      if (!this.emailIsFocused) {
        return null;
      }

      return this.email ? EmailPasswordCredentialEntity.isEmailValid(this.email) : null;
    }

    public get passwordLengthIsValid(): boolean {
      if (!this.passwordIsFocused) {
        return null;
      }

      return this.password ? EmailPasswordCredentialEntity.passwordHasValidLength(this.password) : null;
    }

    public get passwordHasUppercaseLetter(): boolean {
      if (!this.passwordIsFocused) {
        return null;
      }

      return this.password ? EmailPasswordCredentialEntity.passwordHasUppercaseLetter(this.password) : null;
    }

    public get passwordHasLowercaseLetter(): boolean {
      if (!this.passwordIsFocused) {
        return null;
      }

      return this.password ? EmailPasswordCredentialEntity.passwordHasLowercaseLetter(this.password) : null;
    }

    public get passwordHasNumber(): boolean {
      if (!this.passwordIsFocused) {
        return null;
      }

      return this.password ? EmailPasswordCredentialEntity.passwordHasNumber(this.password) : null;
    }

    public get passwordHasOnlyAllowedCharacters(): boolean {
      if (!this.passwordIsFocused) {
        return null;
      }

      return this.password ? EmailPasswordCredentialEntity.passwordHasOnlyAllowedCharacters(this.password) : null;
    }
  }
</script>

<style>
  .kwokka-auth-email-password-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .kwokka-auth-email-password-form__email-input {
    --kwk-auth--width: 100%;
    --kwk-auth--margin: 0 0 16px 0;
  }

  .kwokka-auth-email-password-form__password-input {
    --kwk-auth--width: 100%;
    --kwk-auth--margin: 0 0 8px 0;
  }

  .kwokka-auth-email-password-form__suggestions-list {
    --kwk-auth--margin: 0 0 32px 0;
    --kwk-auth--padding: 8px;
    --kwk-auth--border-radius: 8px;
    --kwk-auth--background-color: #30194d;
    display: flex;
    flex-direction: column;
  }

  .kwokka-auth-email-password-form__submit {
    --kwk-auth--background-color: #ef8134;
    --kwk-auth--width: 100%;
  }

  .kwokka-auth-email-password-form__forgot-password {
    --kwk-auth--margin: 0 0 16px auto;
    --kwk-auth--border: none;
    --kwk-auth--padding: 2px 4px;
    --kwk-auth--font-weight: 400;
    --kwk-auth--font-size: 14px;
    --kwk-auth--color: #e48b4b;
    --kwk-auth--height: auto;
    --kwk-auth--border-radius: auto;
    --kwk-auth--background-color: transparent;
  }
</style>
