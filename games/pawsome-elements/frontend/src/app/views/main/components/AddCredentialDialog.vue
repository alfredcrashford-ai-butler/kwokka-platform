<template>
  <UiDialog
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
    :isCloseButtonShown="true"
    :title="state === states.Initial ? $t('main.signUp.heading') : null"
    ref="dialog"
    @hide="state = states.Initial"
  >
    <template v-slot:body>
      <div class="add-credential-dialog">
        <template v-if="state === states.Initial">
          <p class="add-credential-dialog__paragraph">{{ $t('main.signUp.description') }}</p>
          <ul class="add-credential-dialog__list">
            <li>{{ $t('main.signUp.saveProgress') }}</li>
            <li>{{ $t('main.signUp.shareProgress') }}</li>
          </ul>
          <UiButton
            class="add-credential-dialog__have-account-button"
            width="block"
            size="lg"
            @click="onHaveAccountClick()"
          >
            {{ $t('main.signUp.alreadyHaveAccount') }}
          </UiButton>
          <div class="add-credential-dialog__divider">&#8766; {{ $t('main.signUp.or') }} &#8766;</div>
          <h4 class="add-credential-dialog__subheading">{{ $t('main.signUp.createNewAccount') }}</h4>
        </template>
        <KwokkaAuthAddCredential
          v-model:state="state"
          :styles="{
            card: {
              border: 'none',
              borderRadius: 'none',
              padding: '0',
              width: '100%',
              maxWidth: 'auto',
              minHeight: 'auto',
              maxHeight: 'auto',
              fontSize: 'var(--pwsm--font-size)',
              fontFamily: 'inherit',
              backgroundColor: 'transparent',
            },
            backButton: {
              margin: 'var(--pwsm--auth--back-button-margin)',
            },
            heading: {
              filter: 'url(#pwsm-outline-4)',
              fontSize: '2em',
              margin: '0 0 calc(2 * var(--pwsm--spacing-unit)) 0',
            },
            button: {
              fontSize: '1.25em',
              nineBoxWidth: 'calc(4 * var(--pwsm--spacing-unit))',
              nineBoxHeight: 'calc(4 * var(--pwsm--spacing-unit))',
              borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
              height: 'calc(14 * var(--pwsm--spacing-unit))',
            },
            optionsList: {
              gap: 'calc(3 * var(--pwsm--spacing-unit))',
            },
            googleButton: {
              nineBoxTopLeft: 'url(/static/ui/button/light/button_light_top_left.webp)',
              nineBoxTop: 'url(/static/ui/button/light/button_light_top.webp)',
              nineBoxTopRight: 'url(/static/ui/button/light/button_light_top_right.webp)',
              nineBoxLeft: 'url(/static/ui/button/light/button_light_left.webp)',
              nineBoxCenter: 'url(/static/ui/button/light/button_light_center.webp)',
              nineBoxRight: 'url(/static/ui/button/light/button_light_right.webp)',
              nineBoxBottomLeft: 'url(/static/ui/button/light/button_light_bottom_left.webp)',
              nineBoxBottom: 'url(/static/ui/button/light/button_light_bottom.webp)',
              nineBoxBottomRight: 'url(/static/ui/button/light/button_light_bottom_right.webp)',
              border: 'none',
              backgroundColor: 'none',
            },
            discordButton: {
              nineBoxTopLeft: 'url(/static/ui/button/discord/button_discord_top_left.webp)',
              nineBoxTop: 'url(/static/ui/button/discord/button_discord_top.webp)',
              nineBoxTopRight: 'url(/static/ui/button/discord/button_discord_top_right.webp)',
              nineBoxLeft: 'url(/static/ui/button/discord/button_discord_left.webp)',
              nineBoxCenter: 'url(/static/ui/button/discord/button_discord_center.webp)',
              nineBoxRight: 'url(/static/ui/button/discord/button_discord_right.webp)',
              nineBoxBottomLeft: 'url(/static/ui/button/discord/button_discord_bottom_left.webp)',
              nineBoxBottom: 'url(/static/ui/button/discord/button_discord_bottom.webp)',
              nineBoxBottomRight: 'url(/static/ui/button/discord/button_discord_bottom_right.webp)',
              border: 'none',
              backgroundColor: 'none',
            },
            emailButton: darkButton,
            input: {
              backgroundColor: 'rgba(82, 60, 48, 0.5)',
              border: 'calc(0.25 * var(--pwsm--spacing-unit)) solid rgba(82, 60, 48, 0.75)',
              borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
              padding: 'calc(1 * var(--pwsm--spacing-unit)) calc(3 * var(--pwsm--spacing-unit))',
              height: 'calc(14 * var(--pwsm--spacing-unit))',
              fontSize: '1.25em',
            },
            icon: {
              width: 'calc(6 * var(--pwsm--spacing-unit))',
              height: 'calc(6 * var(--pwsm--spacing-unit))',
            },
            passwordButton: {
              backgroundColor: 'none',
            },
            email: {
              submit: primaryButton,
              emailInput: {
                margin: '0 0 calc(3 * var(--pwsm--spacing-unit)) 0',
              },
              passwordInput: {
                margin: '0 0 calc(3 * var(--pwsm--spacing-unit)) 0',
              },
              resetPasswordButton: {
                filter: 'url(#pwsm-outline-1)',
                color: 'rgb(var(--pwsm-primary-500))',
                padding: '0',
                margin: '0 0 calc(3 * var(--pwsm--spacing-unit)) auto',
                fontSize: '0.8em',
                height: 'calc(4 * var(--pwsm--spacing-unit))',
              },
              suggestionList: {
                margin: '0 0 calc(6 * var(--pwsm--spacing-unit)) 0',
                padding: 'calc(2 * var(--pwsm--spacing-unit))',
                backgroundColor: 'rgba(82, 60, 48, 0.5)',
                border: 'calc(0.25 * var(--pwsm--spacing-unit)) solid rgba(82, 60, 48, 0.75)',
                borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
              },
            },
            suggestion: {
              fontSize: '0.8em',
            },
            suggestionPositive: {
              color: 'rgb(var(--pwsm-positive-400))',
            },
            suggestionNegative: {
              color: 'rgb(var(--pwsm-negative-300))',
            },
          }"
          :googleClientId="googleClientId"
          :accountId="accountId"
          :accessToken="accessToken"
          :endpoint="authEndpoint"
          :discordClientId="discordClientId"
          :discordRedirectUri="discordRedirectUri"
          @created="onCreated($event)"
          @error="onError($event)"
        />
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { KwokkaAuthAddCredential, KwokkaAuthAddCredentialState } from '@kwokka/auth-vue';
  import type { CredentialEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { ConfigService } from '@/service/config/config.service';
  import { NotificationService } from '@/service/notification/notification.service';
  import { KwokkaService } from '@/service';
  import { RouteName } from '@/app/route-name';
  import { UiButton, UiDialog } from '@/app/ui-kit';

  @Component({
    components: {
      KwokkaAuthAddCredential,
      UiDialog,
      UiButton,
    },
    emits: ['created'],
  })
  export default class AddCredentialDialog extends Vue {
    public state: KwokkaAuthAddCredentialState = KwokkaAuthAddCredentialState.Initial;
    public states = KwokkaAuthAddCredentialState;

    @Ref()
    public dialog: UiDialog;

    @Prop({ default: null })
    public accountId: string;

    @LazyInject(KwokkaService)
    private kwokkaService: KwokkaService;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public get authEndpoint(): string {
      return this.configService.frontendConfig.authGateway;
    }

    public get googleClientId(): string {
      return this.configService.frontendConfig.oauth.googleClientId;
    }

    public get accessToken(): string {
      return this.kwokkaService.client.accessToken;
    }

    public get discordClientId(): string {
      return this.configService.frontendConfig.oauth.discordClientId;
    }

    public get discordRedirectUri(): string {
      return this.configService.frontendConfig.oauth.discordAddCredentialRedirectUri;
    }

    public showCallback(): void {
      this.state = KwokkaAuthAddCredentialState.Callback;
      this.show();
    }

    public show() {
      this.dialog.show();
    }

    public readonly darkButton = {
      nineBoxTopLeft: 'url(/static/ui/button/dark/button_dark_top_left.webp)',
      nineBoxTop: 'url(/static/ui/button/dark/button_dark_top.webp)',
      nineBoxTopRight: 'url(/static/ui/button/dark/button_dark_top_right.webp)',
      nineBoxLeft: 'url(/static/ui/button/dark/button_dark_left.webp)',
      nineBoxCenter: 'url(/static/ui/button/dark/button_dark_center.webp)',
      nineBoxRight: 'url(/static/ui/button/dark/button_dark_right.webp)',
      nineBoxBottomLeft: 'url(/static/ui/button/dark/button_dark_bottom_left.webp)',
      nineBoxBottom: 'url(/static/ui/button/dark/button_dark_bottom.webp)',
      nineBoxBottomRight: 'url(/static/ui/button/dark/button_dark_bottom_right.webp)',
      border: 'none',
      backgroundColor: 'none',
    };
    public readonly primaryButton = {
      nineBoxTopLeft: 'url(/static/ui/button/primary/button_primary_top_left.webp)',
      nineBoxTop: 'url(/static/ui/button/primary/button_primary_top.webp)',
      nineBoxTopRight: 'url(/static/ui/button/primary/button_primary_top_right.webp)',
      nineBoxLeft: 'url(/static/ui/button/primary/button_primary_left.webp)',
      nineBoxCenter: 'url(/static/ui/button/primary/button_primary_center.webp)',
      nineBoxRight: 'url(/static/ui/button/primary/button_primary_right.webp)',
      nineBoxBottomLeft: 'url(/static/ui/button/primary/button_primary_bottom_left.webp)',
      nineBoxBottom: 'url(/static/ui/button/primary/button_primary_bottom.webp)',
      nineBoxBottomRight: 'url(/static/ui/button/primary/button_primary_bottom_right.webp)',
      border: 'none',
      backgroundColor: 'none',
    };

    public onCreated(credential: CredentialEntity): void {
      this.$emit('created', credential);
      this.notificationService.show({ type: 'success', text: this.$t('main.signUp.success') });
      this.state = KwokkaAuthAddCredentialState.Initial;
      this.dialog.hide();
    }

    public onError(error: any): void {
      this.notificationService.showErrors([error]);
      this.$emit('error', error);
    }

    public onHaveAccountClick(): void {
      this.$router.replace(RouteName.Auth);
    }
  }
</script>

<style scoped lang="scss">
  .add-credential-dialog {
    @include UiPadding(4, bottom);
    @include UiTypographyHeading5();

    &__paragraph {
      color: UiColor(shade-900);
      @include UiMargin(5, bottom);
    }

    &__list {
      color: UiColor(shade-900);
      @include UiPadding(10, left);
      @include UiMargin(10, bottom);

      > li {
        list-style: disc;
      }
    }

    &__have-account-button {
      --pwsm--spacing-unit: 8px;
    }

    &__divider {
      @include UiMargin(5, top);
      @include UiMargin(5, bottom);
      @include UiTypographyHeading6();
      text-align: center;
      color: UiColor(shade-900);
    }

    &__subheading {
      @include UiMargin(5, bottom);
      color: UiColor(shade-900);
      text-align: center;
      @include UiTypographyHeading4();
    }
  }
</style>
