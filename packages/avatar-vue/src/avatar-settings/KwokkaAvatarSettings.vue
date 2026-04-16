<template>
  <Loader v-if="isLoading" />
  <div class="kwokka-avatar-settings kwokka-avatar-block" v-styles="styles?.container" v-else>
    <div class="kwokka-avatar-settings__row">
      <Input
        v-model="profile.name"
        class="kwokka-avatar-settings__name"
        :label="$t('avatar.settings.nameLabel')"
        :placeholder="$t('avatar.settings.namePlaceholder')"
      />
      <KwokkaSimpleAvatar
        :styles="styles"
        :name="profile?.name"
        :backgroundKey="background?.key"
        :imageKey="image?.key"
        :badgeKey="badge?.key"
        :decorationsSrc="decorationsSrc"
      />
    </div>

    <div class="kwokka-avatar-settings__tabs kwokka-avatar-block" v-styles="styles?.tabs">
      <Button
        v-styles="selectedTab === decorationTypes.Image ? styles?.tabButtonFirstActive : styles?.tabButtonFirst"
        class="kwokka-avatar-settings__tab"
        :class="{ 'kwokka-avatar-settings__tab_active': selectedTab === decorationTypes.Image }"
        @click="onTabSelected(decorationTypes.Image)"
      >
        {{ $t('avatar.settings.image') }}
      </Button>
      <Button
        v-styles="selectedTab === decorationTypes.Background ? styles?.tabButtonActive : styles?.tabButton"
        class="kwokka-avatar-settings__tab"
        :class="{ 'kwokka-avatar-settings__tab_active': selectedTab === decorationTypes.Background }"
        @click="onTabSelected(decorationTypes.Background)"
      >
        {{ $t('avatar.settings.background') }}
      </Button>
      <Button
        v-styles="selectedTab === decorationTypes.Badge ? styles?.tabButtonLastActive : styles?.tabButtonLast"
        class="kwokka-avatar-settings__tab"
        :class="{ 'kwokka-avatar-settings__tab_active': selectedTab === decorationTypes.Badge }"
        @click="onTabSelected(decorationTypes.Badge)"
      >
        {{ $t('avatar.settings.badge') }}
      </Button>
    </div>

    <div class="kwokka-avatar-settings__tab-content kwokka-avatar-block" v-styles="styles?.tabContainer">
      <div class="kwokka-avatar-settings__tab-page" :key="page">
        <div
          v-for="item in displayDecorations"
          :key="item.id"
          class="kwokka-avatar-settings__decoration kwokka-avatar-block"
          :class="{
            'kwokka-avatar-settings__decoration_active': item.id === profileDecorations.decorations[selectedTab],
          }"
          v-styles="
            item.id === profileDecorations.decorations[selectedTab]
              ? styles?.decorationActive
              : item.value
                ? styles?.decoration
                : styles?.decorationSlot
          "
          tabindex="0"
          :inert="!item.value"
          @click="onDecorationClick(item?.value)"
        >
          <div
            v-if="item.value"
            class="kwokka-avatar-settings__decoration-image kwokka-avatar-block"
            :class="{
              'kwokka-avatar-settings__decoration-image_image': item.value.type === decorationTypes.Image,
            }"
            v-styles="
              item.value.type === decorationTypes.Image ? styles?.decorationImage : styles?.decorationBackground
            "
            :style="{ backgroundImage: `url(${decorationsSrc}/${item.value.type}/${item.value.key}.webp)` }"
          ></div>
        </div>
      </div>
      <Button
        class="kwokka-avatar-settings__page-button kwokka-avatar-settings__page-button_left"
        :inert="!isPrevButtonAvailable"
        :class="{
          'kwokka-avatar-settings__page-button_hidden': !isPrevButtonAvailable,
        }"
        v-styles="styles?.prevPageButton"
        @click="page -= 1"
      >
        <Icon name="arrow-left" />
      </Button>
      <Button
        class="kwokka-avatar-settings__page-button kwokka-avatar-settings__page-button_right"
        :inert="!isNextButtonAvailable"
        :class="{
          'kwokka-avatar-settings__page-button_hidden': !isNextButtonAvailable,
        }"
        v-styles="styles?.nextPageButton"
        @click="page += 1"
      >
        <Icon name="arrow-right" />
      </Button>
    </div>

    <Button
      v-if="isConfirmEmbeded"
      v-styles="styles?.confirmButton"
      class="kwokka-avatar-settings__confirm-button"
      @click="onConfirmClick()"
    >
      {{ $t('avatar.settings.confirm') }}
    </Button>
  </div>
</template>

<script lang="ts">
  import { toRaw } from 'vue';
  import { Component, Prop, Provide, Vue } from 'vue-facing-decorator';
  import { DecorationEntity, DecorationEntityType, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
  import { UuidUtil } from '@kwokka/utils';
  import Button from '@/components/Button.vue';
  import Icon from '@/components/Icon.vue';
  import Loader from '@/components/Loader.vue';
  import Input from '@/components/Input.vue';
  import { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors/error-wrapper';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { KwokkaAvatarSettingsStyles } from '@/styles/kwokka-avatar-styles';
  import { AvatarService } from '@/service/avatar.service';
  import KwokkaSimpleAvatar from '@/avatar/KwokkaSimpleAvatar.vue';
  import { ProfileNotSetupError } from '@/errors/profile-not-setup-error';

  type DisplayDecoration = {
    value?: DecorationEntity;
    id: string;
  };

  @Component({
    components: { Button, Icon, Input, Loader, KwokkaSimpleAvatar },
    emits: ['updated', 'error'],
    directives: { styles: stylesDirective },
  })
  export default class KwokkaAvatarSettings extends Vue {
    public isLoading: boolean = true;
    public selectedTab: DecorationEntityType = DecorationEntityType.Image;
    public decorationTypes = DecorationEntityType;
    public profile?: ProfileEntity = null;
    public decorations?: DecorationEntity[] = [];
    public profileDecorations?: ProfileDecorationsEntity = null;
    public page = 0;
    private avatarService = new AvatarService();
    private logger = new LoggerService();

    @Provide()
    @Prop({ default: {} })
    public styles: KwokkaAvatarSettingsStyles;

    @Prop({ required: true })
    public accessToken: string;

    @Prop({ default: null })
    public accountId: string;

    @Prop({ default: true })
    public isConfirmEmbeded: boolean;

    @Prop({ default: 12 })
    public itemsPerPage: number;

    @Prop({ default: 'https://api.kwokka.co/capybara' })
    public endpoint: string;

    @Provide()
    @Prop({ default: '/assets/decorations' })
    public decorationsSrc: string;

    public get image(): DecorationEntity {
      return this.getDecoration(DecorationEntityType.Image);
    }

    public get background(): DecorationEntity {
      return this.getDecoration(DecorationEntityType.Background);
    }

    public get badge(): DecorationEntity {
      return this.getDecoration(DecorationEntityType.Badge);
    }

    private getDecoration(type: DecorationEntityType): DecorationEntity {
      const decorationId = this.profileDecorations?.decorations?.[type];
      return this.decorations?.find((el) => el.id === decorationId);
    }

    public created(): void {
      this.avatarService.setBaseUrl(this.endpoint);
      this.avatarService.setAccessToken(this.accessToken);
    }

    public mounted(): void {
      this.setupComponent();
    }

    public get isNextButtonAvailable(): boolean {
      return (this.page + 1) * this.itemsPerPage < this.currentDecorations.length;
    }

    public get isPrevButtonAvailable(): boolean {
      return this.page > 0;
    }

    public get displayDecorations(): DisplayDecoration[] {
      const decorations = this.currentDecorations.slice(
        this.page * this.itemsPerPage,
        this.page * this.itemsPerPage + this.itemsPerPage,
      );
      const filling = new Array(this.itemsPerPage - decorations.length).fill(null);
      return [...decorations, ...filling].map((el) => ({ value: el, id: el?.id || UuidUtil.generate(6) }));
    }

    public async confirmChanges(): Promise<void> {
      try {
        if (this.accountId) {
          this.profile = await this.avatarService.updateProfile(this.profile);
          this.profileDecorations = await this.avatarService.updateProfileDecorations(this.profileDecorations);
        } else {
          this.profile = await this.avatarService.updateOwnProfile(this.profile);
          this.profileDecorations = await this.avatarService.updateOwnProfileDecorations(this.profileDecorations);
        }
        this.$emit('updated', {
          profile: toRaw(this.profile),
          profileDecorations: toRaw(this.profileDecorations),
          decorations: [toRaw(this.selectedBackground), toRaw(this.selectedImage)],
        });
      } catch (e: unknown) {
        this.logger.error('Failed to create profile decorations, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }

    public onTabSelected(tab: DecorationEntityType): void {
      this.selectedTab = tab;
      this.page = 0;
    }

    public async onConfirmClick(): Promise<void> {
      await this.confirmChanges();
    }

    public onDecorationClick(decoration: DecorationEntity): void {
      if (!decoration) {
        return;
      }

      this.profileDecorations.decorations[this.selectedTab] = decoration.id;
    }

    public get currentDecorations(): DecorationEntity[] {
      return this.decorations.filter((el) => el.type === this.selectedTab);
    }

    private get selectedBackground(): DecorationEntity {
      return this.decorations.find(
        (el) => el.id === this.profileDecorations.decorations[DecorationEntityType.Background],
      );
    }

    private get selectedImage(): DecorationEntity {
      return this.decorations.find((el) => el.id === this.profileDecorations.decorations[DecorationEntityType.Image]);
    }

    private async setupComponent(): Promise<void> {
      try {
        this.profile = await this.avatarService.getProfileByAccountId(this.accountId);
        if (!this.profile) {
          throw new ProfileNotSetupError(this.accountId);
        }

        this.profileDecorations = await this.avatarService.getProfileDecorationsByProfileId(this.profile.id);
        if (!this.profileDecorations) {
          throw new ProfileNotSetupError(this.accountId);
        }

        this.decorations = await this.avatarService.listAvailableDecorations();
        this.isLoading = false;
      } catch (e: unknown) {
        this.logger.error('Failed to set up KwokkaAvatarSetup component, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }
  }
</script>

<style>
  .kwokka-avatar-settings,
  .kwokka-avatar-settings * {
    box-sizing: border-box;
    transition: all ease-in-out 100ms;
  }

  .kwokka-avatar-settings {
    display: flex;
    flex-direction: column;
    container-type: inline-size;
    --kwk-avatar--width: 100%;
    --kwk-avatar--max-width: 800px;
    --kwk-avatar--font-family: sans-serif;
    --kwk-avatar--color: #fff;
  }

  .kwokka-avatar-settings__row {
    display: flex;
    justify-content: space-between;
    gap: 15%;
    align-items: center;
  }

  @container (max-width: 600px) {
    .kwokka-avatar-settings__row {
      flex-direction: column;
      align-items: flex-start;
      justify-content: unset;
    }
  }

  .kwokka-avatar-settings__name {
    flex-shrink: 0;
  }

  .kwokka-avatar-settings__tabs {
    display: flex;
    align-items: center;
    --kwk-avatar--gap: 12px;
    --kwk-avatar--margin: 40px 0 0 0;
  }

  .kwokka-avatar-settings__tab {
    --kwk-avatar--border-radius: 6px;
    --kwk-avatar--border: none;
    --kwk-avatar--height: 28px;
    --kwk-avatar--font-weight: semibold;
    --kwk-avatar--background-color: rgba(255, 255, 255, 0.1);
  }

  .kwokka-avatar-settings__tab_active {
    --kwk-avatar--background-color: rgba(255, 255, 255, 0.35);
  }

  .kwokka-avatar-settings__tab-content {
    position: relative;
    display: flex;
    align-items: center;
    --kwk-avatar--margin: 12px 0 0 0;
  }

  .kwokka-avatar-settings__confirm-button {
    align-self: flex-end;
    --kwk-avatar--margin: 40px 0 0 0;
    --kwk-avatar--height: 44px;
    --kwk-avatar--width: 100%;
    --kwk-avatar--max-width: 160px;
    --kwk-avatar--background-color: #ef8134;
  }

  .kwokka-avatar-settings__tab-page {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @container (min-width: 460px) {
    .kwokka-avatar-settings__tab-page {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @container (min-width: 600px) {
    .kwokka-avatar-settings__tab-page {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .kwokka-avatar-settings__decoration {
    --kwk-avatar--height: 120px;
    --kwk-avatar--border: 1px solid rgba(255, 255, 255, 0.4);
    --kwk-avatar--border-radius: 12px;
    --kwk-avatar--padding: 12px;
    --kwk-avatar--background-color: rgba(255, 255, 255, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kwokka-avatar-settings__decoration_active {
    --kwk-avatar--background-color: rgba(255, 255, 255, 0.3);
    --kwk-avatar--border: 1px solid #ef8134;
  }

  .kwokka-avatar-settings__decoration-image {
    --kwk-avatar--width: 100%;
    --kwk-avatar--height: 100%;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }

  .kwokka-avatar-settings__decoration-image_image {
    aspect-ratio: 1;
    --kwk-avatar--border-radius: 50%;
    --kwk-avatar--width: auto;
  }

  .kwokka-avatar-settings__page-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    --kwk-avatar--width: 32px;
    --kwk-avatar--height: 32px;
    --kwk-avatar--border-radius: 32px;
    --kwk-avatar--padding: 0;
  }

  .kwokka-avatar-settings__page-button_left {
    left: -8px;
  }

  .kwokka-avatar-settings__page-button_hidden {
    opacity: 0;
    visibility: hidden;
  }

  .kwokka-avatar-settings__page-button_right {
    right: -8px;
  }
</style>
