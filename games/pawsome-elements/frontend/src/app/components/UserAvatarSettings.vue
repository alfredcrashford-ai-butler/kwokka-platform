<template>
  <div class="user-avatar-settings">
    <button class="user-avatar-settings__avatar" v-ui-sound @click="dialog.show()">
      <Transition>
        <UserAvatar :key="avatarKey" />
      </Transition>
    </button>

    <UiDialog
      ref="dialog"
      :title="$t('general.avatarSettings.title')"
      :primaryButtonText="$t('general.save')"
      :isCloseButtonShown="true"
      @primaryButtonClick="onConfirmClick()"
    >
      <template v-slot:body>
        <KwokkaAvatarSettings
          class="user-avatar-settings__avatar-settings"
          ref="avatarSettings"
          :accessToken="kwokkaService?.client?.accessToken"
          :endpoint="configService.frontendConfig.avatarGateway"
          :decorationsSrc="configService.frontendConfig.kwokkaDecorationsSrc"
          :isConfirmEmbeded="false"
          :itemsPerPage="6"
          :styles="{
            inputBox: {
              margin: '0 auto 0 auto',
              width: 'fit-content',
            },
            input: {
              backgroundColor: 'rgba(82, 60, 48, 0.5)',
              border: 'calc(0.25 * var(--pwsm--spacing-unit)) solid rgba(82, 60, 48, 0.75)',
              borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
              padding: 'calc(1 * var(--pwsm--spacing-unit)) calc(3 * var(--pwsm--spacing-unit))',
              height: 'calc(10 * var(--pwsm--spacing-unit))',
              fontSize: '1.25em',
            },
            inputLabel: {
              filter: 'url(#pwsm-outline-1)',
            },
            tabs: {
              gap: 'var(--pwsm--spacing-unit)',
              margin: 'calc(4 * var(--pwsm--spacing-unit)) 0 0 0',
            },
            tabButtonFirst: tabButtonStyle,
            tabButton: tabButtonStyle,
            tabButtonLast: tabButtonStyle,
            tabButtonFirstActive: tabButtonActiveStyle,
            tabButtonActive: tabButtonActiveStyle,
            tabButtonLastActive: tabButtonActiveStyle,
            prevPageButton: pageButtonStyle,
            nextPageButton: pageButtonStyle,
            avatar: {
              fontFamily: 'inherit',
            },
            container: {
              fontFamily: 'inherit',
              fontSize: 'var(--pwsm--font-size)',
            },
          }"
          @error="onError($event)"
          @updated="onAvatarUpdated($event)"
        />
      </template>
    </UiDialog>
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import UserAvatar from '@/app/components/UserAvatar.vue';
  import { UiDialog } from '@/app/ui-kit';
  import { KwokkaAvatarSettings } from '@kwokka/avatar-vue';
  import { LazyInject } from '@/ioc';
  import {
    ConfigService,
    ErrorTrackerService,
    KwokkaService,
    LoggerService,
    NotificationService,
    SoundService,
  } from '@/service';
  import type { DecorationEntity, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
  import { UuidUtil } from '@kwokka/utils';

  @Component({
    components: {
      UiDialog,
      UserAvatar,
      KwokkaAvatarSettings,
    },
  })
  export default class UserAvatarSettings extends Vue {
    @Ref()
    public dialog: UiDialog;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(ErrorTrackerService)
    public errorTrackerService: ErrorTrackerService;

    @LazyInject(SoundService)
    public soundService: SoundService;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    @Ref()
    public avatarSettings: KwokkaAvatarSettings;

    @Ref()
    public avatar: UserAvatar;

    public avatarKey: string = null;

    public created(): void {
      this.updateAvatarKey();
    }

    public readonly tabButtonActiveStyle = {
      border: '1px solid rgba(var(--pwsm-primary-100))',
      backgroundColor: 'rgba(var(--pwsm-primary-900))',
      padding: 'var(--pwsm--spacing-unit)',
    };

    public readonly tabButtonStyle = {
      border: '1px solid rgba(var(--pwsm-secondary-100))',
      backgroundColor: 'rgba(var(--pwsm-secondary-900), 0.5)',
      padding: 'var(--pwsm--spacing-unit)',
    };

    public readonly pageButtonStyle = {
      border: '1px solid rgba(var(--pwsm-secondary-100))',
      backgroundColor: 'rgba(var(--pwsm-secondary-900))',
    };

    public onError(error: any): void {
      this.notificationService.showErrors([error]);
      this.logger.error('Error in UserAvatarSettings: ', error);
    }

    public onAvatarUpdated(data: {
      profile: ProfileEntity;
      profileDecorations: ProfileDecorationsEntity;
      decorations: DecorationEntity[];
    }): void {
      this.updateAvatarKey();
      this.logger.log('Updated avatar successfully, profile: ', data.profile);
      this.soundService.playSkillEquip();
    }

    public async onConfirmClick(): Promise<void> {
      try {
        await this.avatarSettings.confirmChanges();
      } catch (e: any) {
        this.errorTrackerService.captureError(e);
        this.notificationService.showErrors([e]);
        this.logger.error(e);
      }
    }

    private updateAvatarKey(): void {
      this.avatarKey = UuidUtil.generate(4);
    }
  }
</script>

<style scoped lang="scss">
  .user-avatar-settings {
    width: 100%;
    height: auto;

    &__avatar {
      @include UiButtonAppearance();
      width: 100%;
    }
  }
</style>
