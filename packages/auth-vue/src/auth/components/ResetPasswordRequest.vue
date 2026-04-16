<template>
  <div class="kwokka-auth-reset-password-request" :inert="state === states.InProgress">
    <h1
      class="kwokka-auth-reset-password-request__heading kwokka-auth-block"
      v-styles="styles?.resetPasswordRequest?.heading"
    >
      {{ $t('auth.resetPasswordRequest.heading') }}
    </h1>

    <Input
      v-model="email"
      type="email"
      class="kwokka-auth-reset-password-request__input"
      :placeholder="$t('auth.resetPasswordRequest.inputPlaceholder')"
      :disabled="state === states.InProgress"
      v-styles="styles?.resetPasswordRequest?.input"
    />
    <p
      class="kwokka-auth-reset-password-request__description kwokka-auth-block"
      v-styles="styles?.resetPasswordRequest?.description"
    >
      {{ $t('auth.resetPasswordRequest.description') }}
    </p>

    <Button
      class="kwokka-auth-reset-password-request__submit"
      :disabled="!emailIsValid || state !== states.Initial"
      v-styles="styles?.resetPasswordRequest?.submit"
      @click="onSubmitClick"
    >
      <Icon
        v-if="state === states.Success"
        name="check"
        class="kwokka-auth-reset-password-request__icon-success"
        v-styles="styles?.resetPasswordRequest?.successIcon"
      />
      <Loader
        class="kwokka-auth-reset-password-request__loader"
        v-else-if="state === states.InProgress"
        v-styles="styles?.resetPasswordRequest?.loader"
      />
      <template v-else>
        {{ $t('auth.resetPasswordRequest.submit') }}
      </template>
    </Button>
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import { EmailPasswordCredentialEntity } from '@kwokka/entities';
  import Captcha from '@/components/Captcha.vue';
  import Button from '@/components/Button.vue';
  import Input from '@/components/Input.vue';
  import Loader from '@/components/Loader.vue';
  import Icon from '@/components/Icon.vue';
  import type { AuthService } from '@/service/auth.service';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors/error-wrapper';

  enum State {
    Initial = 'initial',
    InProgress = 'in_progress',
    Success = 'success',
  }

  @Component({
    components: { Input, Button, Loader, Icon },
    directives: { styles: stylesDirective },
    emits: ['error', 'resetRequested'],
  })
  export default class ResetPasswordRequest extends Vue {
    @Inject()
    public authService: AuthService;

    @Inject()
    public styles: KwokkaAuthStyles;

    @Inject()
    public logger: LoggerService;

    @Inject()
    public captcha: Captcha;

    public email: string = '';
    public state: State = State.Initial;
    public readonly states = State;

    public get emailIsValid(): boolean {
      return EmailPasswordCredentialEntity.isEmailValid(this.email);
    }

    public async onSubmitClick(): Promise<void> {
      try {
        this.state = State.InProgress;
        const captcha = await this.captcha.execute();
        await this.authService.restoreEmail(this.email, captcha);
        this.state = State.Success;
        this.$emit('resetRequested');
      } catch (error) {
        this.logger.error('Error when requesting to restore password: ', error);
        this.$emit('error', ErrorWrapper.wrap(error));
        this.state = State.Initial;
      }
    }
  }
</script>

<style>
  .kwokka-auth-reset-password-request {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .kwokka-auth-reset-password-request__heading {
    --kwk-auth--font-size: 32px;
    --kwk-auth--line-height: 1.5;
    --kwk-auth--font-weight: 700;
    --kwk-auth--margin: 8px 0 32px 0;
  }

  .kwokka-auth-reset-password-request__description {
    --kwk-auth--font-size: 14px;
    --kwk-auth--margin: 0 0 32px 0;
    opacity: 0.75;
    text-align: center;
  }

  .kwokka-auth-reset-password-request__input {
    --kwk-auth--width: 100%;
    --kwk-auth--margin: 0 0 8px 0;
  }

  .kwokka-auth-reset-password-request__icon-success {
    --kwk-auth--color: #00bfa6;
    --kwk-auth--width: 28px;
    --kwk-auth--height: 28px;
  }

  .kwokka-auth-reset-password-request__loader {
    width: 24px;
    height: 24px;
    border-width: 3px;
  }
</style>
