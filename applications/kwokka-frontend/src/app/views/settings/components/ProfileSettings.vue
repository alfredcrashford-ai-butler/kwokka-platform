<template>
  <div class="profile-settings">
    <UiHeading size="2" sizeMobile="4">{{ $t('settings.profile.title') }}</UiHeading>

    <p class="profile-settings__caption">{{ $t('settings.profile.description') }}</p>

    <template v-if="isEditing">
      <KwokkaAvatarSettings
        class="profile-settings__avatar-settings"
        :accessToken="accessToken"
        :endpoint="configService.frontendConfig.avatarGateway"
        :styles="{
          avatar: {
            fontFamily: 'inherit',
          },
          container: {
            fontFamily: 'inherit',
          },
        }"
        @error="onError($event)"
        @updated="onAvatarUpdated($event)"
      />
    </template>
    <template v-else>
      <KwokkaAvatar
        class="profile-settings__avatar"
        :endpoint="configService.frontendConfig.avatarGateway"
        :accessToken="accessToken"
        :accountId="accessService.accountId"
        :styles="{
          avatar: {
            fontFamily: 'inherit',
          },
        }"
      />
      <UiButton class="profile-settings__edit-button" @click="isEditing = true">
        <UiIcon name="edit" />
        {{ $t('settings.profile.edit') }}
      </UiButton>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import type { DecorationEntity, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
  import { KwokkaAvatar, KwokkaAvatarSettings } from '@kwokka/avatar-vue';
  import { LazyInject } from '@/ioc';
  import { ProfileService } from '@/service/profile/profile.service';
  import { AccessService } from '@/service/access/access.service';
  import { ConfigService } from '@/service/config/config.service';
  import { LoggerService } from '@/service/logger/logger.service';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    components: {
      UiHeading,
      UiButton,
      UiIcon,
      KwokkaAvatar,
      KwokkaAvatarSettings,
    },
  })
  export default class ProfileSettings extends Vue {
    public isEditing = false;

    @LazyInject(ProfileService)
    public profileService: ProfileService;

    @LazyInject(AccessService)
    public accessService: AccessService;

    @LazyInject(ConfigService)
    public configService!: ConfigService;

    @LazyInject(NotificationService)
    public notificationService!: NotificationService;

    @LazyInject(LoggerService)
    public logger!: LoggerService;

    public get accessToken(): string {
      return this.accessService.getAccessToken();
    }

    public onAvatarUpdated(data: {
      profile: ProfileEntity;
      profileDecorations: ProfileDecorationsEntity;
      decorations: DecorationEntity[];
    }): void {
      this.isEditing = false;
      this.profileService.setDecorations(data.decorations);
      this.profileService.setProfile(data.profile);
      this.profileService.setProfileDecorations(data.profileDecorations);
      this.notificationService.show({
        type: 'success',
        text: this.$t('settings.profile.updatedSuccessfully'),
      });
    }

    public onError(error: any): void {
      this.isEditing = false;
      this.notificationService.showErrors([error]);
      this.logger.error('Error caught from KwokkaProfileSettings component: ', error);
    }
  }
</script>

<style scoped lang="scss">
  .profile-settings {
    display: flex;
    flex-direction: column;
    @include UiGap(4, false);

    &__avatar {
      margin-left: 10%;
      width: 80%;
    }

    &__caption {
      @include UiTypographyParagraph2();
      opacity: 0.7;
    }

    &__edit-button {
      align-self: flex-end;
    }
  }
</style>
