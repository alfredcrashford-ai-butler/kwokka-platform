<template>
  <UiCard v-if="account" class="account-profile-card">
    <UiHeading size="2">{{ $t('account.profile.title') }}</UiHeading>

    <KwokkaAvatar
      v-if="profile && profileDecorations && decorations?.length"
      class="account-profile-card__avatar"
      :endpoint="configService.frontendConfig.avatarGateway"
      :accessToken="accessToken"
      :accountId="account?.id"
      :styles="{
        avatar: {
          margin: '0 10%',
          width: '80%',
          fontSize: 'var(--avatar-font-size)',
        },
      }"
    />
    <div v-else class="account-profile-card__empty-profile">{{ $t('account.profile.empty') }}</div>

    <template v-if="profile && profileDecorations && decorations">
      <UiButton @click="dialog.show()" shade="accent" class="account-profile-card__button">{{
        $t('account.profile.setup')
      }}</UiButton>

      <UiDialog ref="dialog" size="lg" :isSecondaryButtonShown="false" :isPrimaryButtonShown="false">
        <template v-slot:body>
          <KwokkaAvatarSettings
            class="account-profile-card__avatar-settings"
            :accessToken="accessToken"
            :accountId="account?.id"
            :endpoint="configService.frontendConfig.avatarGateway"
            :styles="{
              avatar: {
                margin: '0 4%',
                width: '92%',
                fontSize: 'var(--avatar-font-size)',
              },
              container: {
                fontFamily: 'inherit',
              },
            }"
            @error="onError($event)"
            @updated="onAvatarUpdated($event)"
          />
        </template>
      </UiDialog>
    </template>
  </UiCard>
  <UiSkeleton v-else />
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import type { AccountEntity, DecorationEntity, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
  import { KwokkaAvatar, KwokkaAvatarSettings } from '@kwokka/avatar-vue';
  import { LazyInject } from '@/ioc';
  import { AccessService } from '@/service/access/access.service';
  import { ConfigService } from '@/service/config/config.service';
  import { NotificationService } from '@/service/notification/notification.service';
  import { LoggerService } from '@/service/logger/logger.service';
  import { ProfileApi } from '@/api/avatar/profile/profile.api';
  import { ProfileDecorationsApi } from '@/api/avatar/profile-decorations/profile-decorations.api';
  import { DecorationApi } from '@/api/avatar/decoration/decoration.api';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiSkeleton from '@/app/ui-kit/UiSkeleton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import { ErrorCode } from '@/utils/error-code';

  @Component({
    components: {
      UiCard,
      UiSkeleton,
      UiHeading,
      UiButton,
      UiDialog,
      KwokkaAvatar,
      KwokkaAvatarSettings,
    },
  })
  export default class AccountProfileCard extends Vue {
    public profile: ProfileEntity = null;
    public profileDecorations: ProfileDecorationsEntity = null;
    public decorations: DecorationEntity[] = [];

    @Ref()
    public dialog: UiDialog;

    @Prop({ required: true })
    public account: AccountEntity = null;

    @LazyInject(AccessService)
    public accessService: AccessService;

    @LazyInject(ConfigService)
    public configService!: ConfigService;

    @LazyInject(NotificationService)
    public notificationService!: NotificationService;

    @LazyInject(LoggerService)
    public logger!: LoggerService;

    @LazyInject(ProfileApi)
    public profileApi!: ProfileApi;

    @LazyInject(ProfileDecorationsApi)
    public profileDecorationsApi!: ProfileDecorationsApi;

    @LazyInject(DecorationApi)
    public decorationApi!: DecorationApi;

    public get accessToken(): string {
      return this.accessService.getAccessToken();
    }

    public onAvatarUpdated(data: {
      profile: ProfileEntity;
      profileDecorations: ProfileDecorationsEntity;
      decorations: DecorationEntity[];
    }): void {
      this.profile = data.profile;
      this.profileDecorations = data.profileDecorations;
      this.decorations = data.decorations;
      this.dialog.hide();
      this.notificationService.show({
        type: 'success',
        text: this.$t('account.profile.successfullyUpdated'),
      });
    }

    public onError(error: any): void {
      this.notificationService.showErrors([error]);
      this.logger.error('Error caught from KwokkaProfileSettings component: ', error);
    }

    public async mounted(): Promise<void> {
      try {
        this.profile = await this.profileApi.getByAccountId(this.account.id);
        if (!this.profile) {
          return;
        }
        this.profileDecorations = await this.profileDecorationsApi.getProfileDecorationsByProfileId(this.profile.id);
      } catch (e: any) {
        if (e.code === ErrorCode.EntityNotFound) {
          this.logger.warn(`Profile not set up, accountId: ${this.account.id}`);
          return;
        }

        throw e;
      }

      let decorationsIds = Object.values(this.profileDecorations.decorations);
      decorationsIds = Array.from(new Set(decorationsIds));
      this.decorations = await Promise.all(decorationsIds.map((id) => this.decorationApi.getById(id)));
    }
  }
</script>

<style scoped lang="scss">
  .account-profile-card {
    @include UiPadding(4);
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__empty-profile {
      @include UiPadding(10, top);
      @include UiPadding(10, bottom);
      display: flex;
      justify-content: center;
      @include UiTypographyHeading4();
      background-color: rgba(10, 6, 6, 0.4);
      @include UiBorderRadius(lg);
    }

    &__avatar {
      margin-left: 10%;
      width: 80%;
      @include UiMediaTabletAndDesktop() {
        --avatar-font-size: min(3.5vw, 40px);
      }

      @include UiMediaMobile() {
        --avatar-font-size: min(8vw, 40px);
      }
    }

    &__avatar-settings {
      @include UiMediaTabletAndDesktop() {
        --avatar-font-size: min(5vw, 32px);
      }

      @include UiMediaMobile() {
        --avatar-font-size: min(9vw, 60px);
      }
    }

    &__button {
      align-self: flex-end;
    }
  }
</style>
