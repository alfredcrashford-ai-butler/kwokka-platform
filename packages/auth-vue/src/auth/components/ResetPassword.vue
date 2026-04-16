<template>
  <div class="kwokka-auth-reset-password" :inert="state === states.InProgress">
    <h1 class="kwokka-auth-reset-password__heading kwokka-auth-block" v-styles="styles?.resetPassword?.heading">
      {{ $t('auth.resetPassword.heading') }}
    </h1>

    <p class="kwokka-auth-reset-password__description kwokka-auth-block" v-styles="styles?.resetPassword?.description">
      {{ $t('auth.resetPassword.description') }}
    </p>

    <Password
      v-model="password"
      class="kwokka-auth-reset-password__input"
      :placeholder="$t('auth.resetPassword.inputPlaceholder')"
      :disabled="state === states.InProgress"
      v-styles="styles?.resetPassword?.input"
      @focus="passwordIsFocused = true"
    />
    <div
      class="kwokka-auth-reset-password__suggestions-list kwokka-auth-block"
      v-styles="styles?.resetPassword?.suggestionList"
    >
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
      class="kwokka-auth-reset-password__submit"
      :disabled="!isPasswordValid || state !== states.Initial"
      v-styles="styles?.resetPassword?.submit"
      @click="onSubmitClick"
    >
      <Icon
        v-if="state === states.Success"
        name="check"
        class="kwokka-auth-reset-password__icon-success"
        v-styles="styles?.resetPassword?.successIcon"
      />
      <Loader
        class="kwokka-auth-reset-password__loader"
        v-else-if="state === states.InProgress"
        v-styles="styles?.resetPassword?.loader"
      />
      <template v-else>
        {{ $t('auth.resetPassword.submit') }}
      </template>
    </Button>
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import { EmailPasswordCredentialEntity } from '@kwokka/entities';
  import Button from '@/components/Button.vue';
  import Loader from '@/components/Loader.vue';
  import Icon from '@/components/Icon.vue';
  import Suggestion from '@/components/Suggestion.vue';
  import Password from '@/components/Password.vue';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { AuthService } from '@/service/auth.service';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import type { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors/error-wrapper';

  enum State {
    Initial = 'initial',
    InProgress = 'in_progress',
    Success = 'success',
  }

  @Component({
    components: { Button, Loader, Icon, Password, Suggestion },
    directives: { styles: stylesDirective },
    emits: ['error', 'resetCompleted'],
  })
  export default class ResetPassword extends Vue {
    @Inject()
    public authService: AuthService;

    @Inject()
    public styles: KwokkaAuthStyles;

    @Inject()
    public logger: LoggerService;

    @Inject()
    public hcaptchakey: string;

    @Inject()
    public resetPasswordToken: string;

    public password: string = '';
    public passwordIsFocused: boolean = false;
    public state: State = State.Initial;
    public readonly states = State;

    public get isPasswordValid(): boolean {
      return (
        this.passwordLengthIsValid &&
        this.passwordHasUppercaseLetter &&
        this.passwordHasLowercaseLetter &&
        this.passwordHasNumber &&
        this.passwordHasOnlyAllowedCharacters
      );
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

    public async onSubmitClick(): Promise<void> {
      try {
        if (!this.resetPasswordToken) {
          throw new TypeError('Reset password token is not provided, can not reset password without it.');
        }
        this.state = State.InProgress;
        const data = await this.authService.completeRestoreEmail(this.resetPasswordToken, this.password);
        this.state = State.Success;
        this.$emit('resetCompleted', data?.data);
      } catch (error) {
        this.logger.error('Error when resetting password: ', error);
        this.$emit('error', ErrorWrapper.wrap(error));
        this.state = State.Initial;
      }
    }
  }
</script>

<style>
  .kwokka-auth-reset-password {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .kwokka-auth-reset-password__heading {
    --kwk-auth--font-size: 32px;
    --kwk-auth--line-height: 1.5;
    --kwk-auth--font-weight: 700;
    --kwk-auth--margin: 8px 0 32px 0;
  }

  .kwokka-auth-reset-password__description {
    --kwk-auth--font-size: 14px;
    --kwk-auth--margin: 0 0 32px 0;
    opacity: 0.75;
    text-align: center;
  }

  .kwokka-auth-reset-password__input {
    --kwk-auth--width: 100%;
    --kwk-auth--margin: 0 0 8px 0;
  }

  .kwokka-auth-reset-password__icon-success {
    --kwk-auth--color: #00bfa6;
    --kwk-auth--width: 28px;
    --kwk-auth--height: 28px;
  }

  .kwokka-auth-reset-password__loader {
    width: 24px;
    height: 24px;
    border-width: 3px;
  }

  .kwokka-auth-reset-password__suggestions-list {
    --kwk-auth--margin: 0 0 32px 0;
    --kwk-auth--padding: 8px;
    --kwk-auth--border-radius: 8px;
    --kwk-auth--background-color: #30194d;
    display: flex;
    flex-direction: column;
  }
</style>
