<template>
  <SecondLevelLayout>
    <div class="setup-profile">
      <UiLoader v-if="isLoading" />
      <template v-else>
        <UiHeading>{{ $t('avatar.setup.title') }}</UiHeading>
        <KwokkaAvatarSetup
          :accessToken="accessToken"
          :locale="locale"
          :styles="{
            container: {
              fontFamily: 'inherit',
            },
            avatar: {
              fontFamily: 'inherit',
            },
          }"
          :endpoint="configService.frontendConfig.avatarGateway"
          @profileCreated="onProfileCreated($event)"
          @profileDecorationsCreated="onProfileDecorationsCreated($event)"
          @completed="onCompleted($event)"
          @error="onError($event)"
        />
      </template>
    </div>
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { KwokkaAvatarSetup } from '@kwokka/avatar-vue';
  import type { DecorationEntity, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import { LoggerService } from '@/service/logger/logger.service';
  import { PersistenceService } from '@/service/persistence/persistence.service';
  import { PersistenceKey } from '@/service/persistence/persistence-key';
  import { ConfigService } from '@/service/config/config.service';
  import { ProfileService } from '@/service/profile/profile.service';
  import { AccessService } from '@/service/access/access.service';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';

  @Component({
    components: {
      SecondLevelLayout,
      KwokkaAvatarSetup,
      UiHeading,
      UiLoader,
    },
  })
  export default class SetupProfileView extends Vue {
    public isLoading = true;

    @LazyInject(ConfigService)
    public configService!: ConfigService;

    @LazyInject(ProfileService)
    public profileService!: ProfileService;

    @LazyInject(AccessService)
    public accessService!: AccessService;

    @LazyInject(NotificationService)
    public notificationService!: NotificationService;

    @LazyInject(LoggerService)
    public logger!: LoggerService;

    @LazyInject(PersistenceService)
    public persistenceService!: PersistenceService;

    public get locale(): string {
      return this.persistenceService.loadValue(PersistenceKey.Locale);
    }

    public get accessToken(): string {
      return this.accessService.getAccessToken();
    }

    public async mounted(): Promise<void> {
      const profile = await this.profileService.fetchOwnProfile();
      const profileDecorations = await this.profileService.fetchOwnProfileDecorations();
      if (!profile || !profileDecorations) {
        this.isLoading = false;
      } else {
        this.$router.replace({ name: 'main' });
      }
    }

    public onProfileCreated(profile: ProfileEntity): void {
      this.profileService.setProfile(profile);
    }

    public onProfileDecorationsCreated(profileDecorations: ProfileDecorationsEntity): void {
      this.profileService.setProfileDecorations(profileDecorations);
    }

    public onCompleted(data: {
      profile: ProfileEntity;
      profileDecorations: ProfileDecorationsEntity;
      decorations: DecorationEntity[];
    }): void {
      this.profileService.setProfile(data.profile);
      this.profileService.setProfileDecorations(data.profileDecorations);
      this.profileService.setDecorations(data.decorations);
      this.notificationService.show({ type: 'success', text: this.$t('avatar.setup.successNotification') });
      this.$router.replace({ name: 'main' });
    }

    public onError(error: any): void {
      this.logger.error(error);
      this.notificationService.showErrors([error]);
    }
  }
</script>

<style scoped lang="scss">
  .setup-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    @include UiGap(10, false);
  }
</style>
