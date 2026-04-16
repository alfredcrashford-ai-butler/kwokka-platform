<template>
  <div class="credential">
    <div class="credential__header">
      <div
        class="credential__type"
        :class="{
          credential__type_google: credential.type === credentialTypes.Google,
          credential__type_discord: credential.type === credentialTypes.Discord,
        }"
      >
        <UiIcon name="letter" v-if="credential.type === credentialTypes.EmailPassword" />
        <UiIcon name="incognito" v-if="credential.type === credentialTypes.Anonymous" />
        <UiIcon name="google" v-if="credential.type === credentialTypes.Google" />
        <UiIcon name="discord" v-if="credential.type === credentialTypes.Discord" />
        <div
          v-if="credential.isVerifiable()"
          class="credential__verification-mark"
          :class="{
            'credential__verification-mark_verified': credential.isVerified,
            'credential__verification-mark_unverified': !credential.isVerified,
          }"
        >
          <UiIcon :name="credential.isVerified ? 'check' : 'x'" size="sm" />
        </div>
      </div>
      <span class="credential__heading">
        <template v-if="credential.type === credentialTypes.Anonymous">
          {{ $t('settings.credentials.guestLogin') }}
        </template>
        <template v-else-if="credential.type === credentialTypes.Google">
          {{ credential.data.email }}
        </template>
        <template v-else-if="credential.type === credentialTypes.Discord">
          {{ credential.data.username }}
        </template>
        <template v-else>
          {{ credential.identifier }}
        </template>
      </span>
    </div>

    <template v-if="areActionsShown">
      <hr class="credential__delimeter" />

      <div class="credential__actions">
        <UiButton v-if="isDeleteEnabled" size="sm" type="subdued" shade="negative" @click="$emit('delete', credential)">
          {{ $t('settings.credentials.delete') }}
        </UiButton>
        <UiButton
          v-if="credential.isVerifiable() && !credential.isVerified"
          size="sm"
          type="subdued"
          :disabled="isVerificationSent"
          @click="
            $emit('sendVerification', credential);
            isVerificationSent = true;
          "
        >
          {{ $t('settings.credentials.sendVerification') }}
        </UiButton>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { CredentialEntityType, type CredentialEntity } from '@kwokka/entities';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiTooltip from '@/app/ui-kit/UiTooltip.vue';

  @Component({
    components: {
      UiButton,
      UiIcon,
      UiTooltip,
    },
    emits: ['delete', 'sendVerification'],
  })
  export default class Credential extends Vue {
    public isVerificationSent = false;

    @Prop({ required: true })
    public credential: CredentialEntity;

    @Prop({ required: true })
    public isDeleteEnabled: boolean;

    public readonly credentialTypes = CredentialEntityType;

    public get areActionsShown(): boolean {
      return this.isDeleteEnabled || (this.credential.isVerifiable() && !this.credential.isVerified);
    }
  }
</script>

<style scoped lang="scss">
  .credential {
    @include UiPadding(2, null, false);
    @include UiBorderRadius(sm);
    @include UiTheme() {
      background-color: UiColor(shade-600);
    }

    &__type {
      position: relative;
      $size: $grid-step * 8;
      width: $size;
      height: $size;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $size;
      flex-shrink: 0;

      @include UiTheme() {
        background-color: UiColor(shade-400);
      }

      &_google {
        @include UiTheme() {
          background-color: UiColor(shade-100);
        }
      }

      &_discord {
        @include UiTheme() {
          background-color: UiColor(palette-discord);
        }
      }
    }

    &__header {
      display: flex;
      align-items: center;
      @include UiGap(2, false);
    }

    &__actions {
      @include UiGap(2, false);
      display: flex;
      align-items: center;
      justify-content: flex-end;

      @include UiMediaMobileAndTablet() {
        @include UiGap(1, false);
        flex-direction: column;
        & > * {
          width: 100%;
        }
      }
    }

    &__delimeter {
      width: 100%;
      border-bottom: 1px solid rgba(#fff, 0.25);
      @include UiMargin(2, top, false);
      @include UiMargin(2, bottom, false);
    }

    &__heading {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__verification-mark {
      position: absolute;
      right: -$grid-step;
      bottom: -$grid-step;
      $size: $grid-step * 4;
      width: $size;
      height: $size;
      border-radius: $size;
      display: flex;
      align-items: center;
      justify-content: center;

      &_verified {
        @include UiTheme() {
          background-color: UiColor(positive);
          color: UiColor(positive-dark);
        }
      }

      &_unverified {
        @include UiTheme() {
          background-color: UiColor(negative);
          color: UiColor(negative-dark);
        }
      }
    }
  }
</style>
