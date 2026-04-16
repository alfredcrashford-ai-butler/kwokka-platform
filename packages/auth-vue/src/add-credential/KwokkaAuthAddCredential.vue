<template>
  <div class="kwokka-auth-add-credential kwokka-auth-block" v-styles="styles?.card">
    <Button
      v-styles="styles?.backButton"
      class="kwokka-auth-add-credential__back-button"
      v-if="isStateWithBackButton"
      :title="$t('auth.back')"
      @click="setState(states.Initial)"
    >
      <Icon name="arrow-left" /> {{ $t('auth.back') }}
    </Button>

    <Options @select="onOptionSelect($event)" v-if="state === states.Initial" :items="authItems" />

    <Success v-if="state === states.Success" :isCaptionShown="false" />

    <Callback
      v-if="state === states.Callback"
      :accountId="accountId"
      @create="onCreate($event)"
      @error="onError($event)"
      @stateChange="setState($event)"
    />

    <div v-if="isAddCredentialState">
      <component
        :is="selectedComponent"
        :accountId="accountId"
        @create="onCreate($event)"
        @error="onError($event)"
        @stateChange="setState($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Prop, Provide, Vue, Watch } from 'vue-facing-decorator';
  import { CredentialEntityType, type CredentialEntity } from '@kwokka/entities';
  import Button from '@/components/Button.vue';
  import Icon from '@/components/Icon.vue';
  import { AuthService } from '@/service/auth.service';
  import { GoogleOauth2Service } from '@/service/google-oauth2.service';
  import { LoggerService } from '@/service/logger.service';
  import Options from '@/components/Options.vue';
  import Success from '@/components/Success.vue';
  import { ErrorWrapper } from '@/errors';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';
  import { KwokkaAuthAddCredentialState } from './auth-add-credential-state';
  import AddEmailPasswordCredential from './components/AddEmailPasswordCredential.vue';
  import AddGoogleCredential from './components/AddGoogleCredential.vue';
  import Callback from './components/Callback.vue';
import AddDiscordCredential from './components/AddDiscordCredential.vue';

  @Component({
    components: { Button, Icon, Options, Success, Callback },
    emits: ['update:state', 'created', 'error'],
    directives: { styles: stylesDirective },
  })
  export default class KwokkaAuthAddCredential extends Vue {
    @Prop({ default: KwokkaAuthAddCredentialState.Initial })
    public state: KwokkaAuthAddCredentialState;

    @Provide()
    @Prop({ default: {} })
    public styles: KwokkaAuthStyles;

    @Prop({ default: 'https://api.kwokka.co/owl' })
    public endpoint: string;

    @Prop({ default: null })
    public accountId: string;

    @Provide()
    @Prop({ required: true })
    public accessToken: string;

    @Provide()
    @Prop({ required: true })
    public discordClientId: string;

    @Provide()
    @Prop({ required: true })
    public discordRedirectUri: string;

    @Provide()
    @Prop({ required: true })
    public googleClientId: string;

    @Provide()
    public authService = new AuthService();

    @Provide()
    public googleOauth2Service = new GoogleOauth2Service();

    @Provide()
    public logger = new LoggerService();

    public readonly states = KwokkaAuthAddCredentialState;
    public readonly components = {
      [KwokkaAuthAddCredentialState.EmailPassword]: markRaw(AddEmailPasswordCredential),
      [KwokkaAuthAddCredentialState.Google]: markRaw(AddGoogleCredential),
      [KwokkaAuthAddCredentialState.Discord]: markRaw(AddDiscordCredential),
    };

    public get isAddCredentialState(): boolean {
      return [
        KwokkaAuthAddCredentialState.EmailPassword,
        KwokkaAuthAddCredentialState.Google,
        KwokkaAuthAddCredentialState.Discord,
      ].includes(this.state);
    }

    public created(): void {
      this.authService.setBaseUrl(this.endpoint);
      this.googleOauth2Service.setClientId(this.googleClientId);
    }

    public get selectedComponent(): typeof Vue {
      if (!this.isAddCredentialState) {
        return null;
      }

      return this.components[this.state];
    }

    public get isStateWithBackButton(): boolean {
      return [KwokkaAuthAddCredentialState.EmailPassword].includes(this.state);
    }

    public get authItems(): {} {
      return [
        {
          type: CredentialEntityType.EmailPassword,
          text: this.$t('auth.email.addCredentialName'),
        },
        {
          type: CredentialEntityType.Google,
          text: this.$t('auth.google.addCredentialName'),
        },
        {
          type: CredentialEntityType.Discord,
          text: this.$t('auth.discord.addCredentialName'),
        },
      ];
    }

    public setState(state: KwokkaAuthAddCredentialState): void {
      this.$emit('update:state', state);
    }

    @Watch('endpoint')
    public onEndpointChange(newValue: string): void {
      this.authService.setBaseUrl(newValue);
    }

    public async onCreate(credential: CredentialEntity): Promise<void> {
      this.setState(KwokkaAuthAddCredentialState.Success);
      this.$emit('created', credential);
    }

    public onOptionSelect(option: CredentialEntityType): void {
      const credentialEntityTypeToStateMap = {
        [CredentialEntityType.EmailPassword]: KwokkaAuthAddCredentialState.EmailPassword,
        [CredentialEntityType.Google]: KwokkaAuthAddCredentialState.Google,
        [CredentialEntityType.Discord]: KwokkaAuthAddCredentialState.Discord,
      };
      this.setState(credentialEntityTypeToStateMap[option]);
    }

    public onError(error: any): void {
      this.$emit('error', ErrorWrapper.wrap(error));
    }
  }
</script>

<style>
  .kwokka-auth-add-credential,
  .kwokka-auth-add-credential * {
    box-sizing: border-box;
    transition: all ease-in-out 100ms;
  }

  .kwokka-auth-add-credential {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    transition:
      max-width ease-in-out 50ms,
      min-height ease-in-out 50ms 50ms,
      max-height ease-in-out 50ms 50ms;
    --kwk-auth--max-width: 400px;
    --kwk-auth--width: 100%;
    --kwk-auth--background-color: #45305f;
    --kwk-auth--border-radius: 24px;
    --kwk-auth--border: 2px solid #fff;
    --kwk-auth--padding: 40px;
    --kwk-auth--font-family: sans-serif;
    --kwk-auth--color: #fff;
  }

  .kwokka-auth-add-credential__back-button {
    align-self: flex-start;
    --kwk-auth--margin: 0 0 16px 0;
    --kwk-auth--width: 92px;
    --kwk-auth--height: 32px;
    --kwk-auth--border-radius: 16px;
    --kwk-auth--padding: 0;
    --kwk-auth--border: none;
    --kwk-auth--background-color: none;
  }
</style>
