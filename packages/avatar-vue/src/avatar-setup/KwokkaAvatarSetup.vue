<template>
  <Loader v-if="isLoading" />
  <div class="kwokka-avatar-setup kwokka-avatar-block" v-styles="styles?.container" v-else>
    <p
      class="kwokka-avatar-setup__description kwokka-avatar-block"
      v-styles="styles?.description"
      v-if="$te('avatar.setup.description')"
    >
      {{ $t('avatar.setup.description') }}
    </p>
    <div v-if="!profile" class="kwokka-avatar-setup__name kwokka-avatar-block" v-styles="styles?.name">
      <Input v-model="name" :placeholder="$t('avatar.setup.namePlaceholder')" :label="$t('avatar.setup.nameLabel')" />
      <Button
        class="kwokka-avatar-setup__next-button"
        v-styles="styles?.nextButton"
        :disabled="(name?.length || 0) < 3"
        @click="onProfileNameNextClick()"
      >
        {{ $t('avatar.setup.next') }}
      </Button>
    </div>
    <div
      class="kwokka-avatar-setup__decorations kwokka-avatar-block"
      v-styles="styles?.decorations"
      v-if="profile && decorations?.length"
    >
      <p
        class="kwokka-avatar-setup__caption kwokka-avatar-block"
        v-styles="styles?.caption"
        v-if="$te('avatar.setup.avatarCaption')"
      >
        {{ $t('avatar.setup.avatarCaption') }}
      </p>
      <KwokkaSimpleAvatar
        :styles="styles"
        :name="profile?.name"
        :backgroundKey="background?.key"
        :imageKey="image?.key"
        :badgeKey="badge?.key"
        :decorationsSrc="decorationsSrc"
      >
        <template v-slot:background>
          <Button
            v-if="!profileDecorations?.id"
            class="kwokka-avatar-setup__avatar-button kwokka-avatar-setup__avatar-button_left kwokka-avatar-block"
            v-styles="styles?.backgroundLeftButton"
            @click="onPreviousBackgroundClick()"
          >
            <Icon name="arrow-left" v-styles="styles?.backgroundLeftIcon" />
          </Button>
          <Button
            v-if="!profileDecorations?.id"
            class="kwokka-avatar-setup__avatar-button kwokka-avatar-setup__avatar-button_right kwokka-avatar-block"
            v-styles="styles?.backgroundRightButton"
            @click="onNextBackgroundClick()"
          >
            <Icon name="arrow-right" v-styles="styles?.backgroundRightIcon" />
          </Button>
        </template>
        <template v-slot:image>
          <Button
            v-if="!profileDecorations?.id"
            class="kwokka-avatar-setup__avatar-button kwokka-avatar-setup__avatar-button_image kwokka-avatar-setup__avatar-button_left kwokka-avatar-block"
            v-styles="styles?.imageLeftButton"
            @click="onPreviousImageClick()"
          >
            <Icon name="arrow-left" v-styles="styles?.imageLeftIcon" />
          </Button>
          <Button
            v-if="!profileDecorations?.id"
            class="kwokka-avatar-setup__avatar-button kwokka-avatar-setup__avatar-button_image kwokka-avatar-setup__avatar-button_right kwokka-avatar-block"
            v-styles="styles?.imageRightButton"
            @click="onNextImageClick()"
          >
            <Icon name="arrow-right" v-styles="styles?.imageRightIcon" />
          </Button>
        </template>
      </KwokkaSimpleAvatar>
      <Button
        v-if="!profileDecorations?.id"
        v-styles="styles?.nextButton"
        class="kwokka-avatar-setup__next-button"
        :disabled="!selectedImage || !selectedBackground"
        @click="onProfileDecorationsNextClick()"
        >{{ $t('avatar.setup.next') }}</Button
      >
    </div>
  </div>
</template>

<script lang="ts">
  import { toRaw } from 'vue';
  import { Component, Prop, Provide, Vue } from 'vue-facing-decorator';
  import { DecorationEntity, DecorationEntityType, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
  import Button from '@/components/Button.vue';
  import Icon from '@/components/Icon.vue';
  import Loader from '@/components/Loader.vue';
  import Input from '@/components/Input.vue';
  import { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors/error-wrapper';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { KwokkaAvatarSetupStyles } from '@/styles/kwokka-avatar-styles';
  import { AvatarService } from '@/service/avatar.service';
  import KwokkaSimpleAvatar from '@/avatar/KwokkaSimpleAvatar.vue';

  @Component({
    components: { Button, Icon, Input, Loader, KwokkaSimpleAvatar },
    emits: ['profileCreated', 'profileDecorationsCreated', 'completed', 'error'],
    directives: { styles: stylesDirective },
  })
  export default class KwokkaAvatarSetup extends Vue {
    public name: string = '';
    public isLoading: boolean = true;
    public profile?: ProfileEntity = null;
    public decorations?: DecorationEntity[] = [];
    public profileDecorations?: ProfileDecorationsEntity = null;
    public selectedImage: DecorationEntity = null;
    public selectedBackground: DecorationEntity = null;
    private avatarService = new AvatarService();
    private logger = new LoggerService();

    @Provide()
    @Prop({ default: {} })
    public styles: KwokkaAvatarSetupStyles;

    @Prop({ required: true })
    public accessToken: string;

    @Prop({ required: true })
    public locale: string;

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

    public async onProfileNameNextClick(): Promise<void> {
      try {
        this.profile = await this.avatarService.createOwnProfile(this.name, this.locale);
        await this.fetchAvailableDecorations();
        this.$emit('profileCreated', toRaw(this.profile));
      } catch (e: unknown) {
        this.logger.error('Failed to create profile, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }

    public async onProfileDecorationsNextClick(): Promise<void> {
      try {
        const decorations = {
          [DecorationEntityType.Background]: this.selectedBackground?.id,
          [DecorationEntityType.Image]: this.selectedImage?.id,
        };
        this.profileDecorations = await this.avatarService.createOwnProfileDecorations(decorations);
        this.$emit('profileDecorationsCreated', toRaw(this.profileDecorations));
        this.$emit('completed', {
          profile: toRaw(this.profile),
          profileDecorations: toRaw(this.profileDecorations),
          decorations: [toRaw(this.selectedBackground), toRaw(this.selectedImage)],
        });
      } catch (e: unknown) {
        this.logger.error('Failed to create profile decorations, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }

    public onPreviousImageClick(): void {
      if (!this.selectedImage) {
        this.selectedImage = this.imageDecorations[0];
        this.profileDecorations.decorations[DecorationEntityType.Image] = this.selectedImage.id;
        return;
      }
      const currentIndex = this.imageDecorations.findIndex((el) => el.id === this.selectedImage.id);
      let previousIndex = currentIndex - 1;
      if (previousIndex < 0) {
        previousIndex = this.imageDecorations.length - 1;
      }
      this.selectedImage = this.imageDecorations[previousIndex];
      this.profileDecorations.decorations[DecorationEntityType.Image] = this.selectedImage.id;
    }

    public onNextImageClick(): void {
      if (!this.selectedImage) {
        this.selectedImage = this.imageDecorations[0];
        this.profileDecorations.decorations[DecorationEntityType.Image] = this.selectedImage.id;
        return;
      }
      const currentIndex = this.imageDecorations.findIndex((el) => el.id === this.selectedImage.id);
      let nextIndex = currentIndex + 1;
      if (nextIndex === this.imageDecorations.length) {
        nextIndex = 0;
      }
      this.selectedImage = this.imageDecorations[nextIndex];
      this.profileDecorations.decorations[DecorationEntityType.Image] = this.selectedImage.id;
    }

    public onPreviousBackgroundClick(): void {
      if (!this.selectedBackground) {
        this.selectedBackground = this.backgroundDecorations[0];
        this.profileDecorations.decorations[DecorationEntityType.Background] = this.selectedBackground.id;
        return;
      }
      const currentIndex = this.backgroundDecorations.findIndex((el) => el.id === this.selectedBackground.id);
      let previousIndex = currentIndex - 1;
      if (previousIndex < 0) {
        previousIndex = this.backgroundDecorations.length - 1;
      }
      this.selectedBackground = this.backgroundDecorations[previousIndex];
      this.profileDecorations.decorations[DecorationEntityType.Background] = this.selectedBackground.id;
    }

    public onNextBackgroundClick(): void {
      if (!this.selectedBackground) {
        this.selectedBackground = this.backgroundDecorations[0];
        this.profileDecorations.decorations[DecorationEntityType.Background] = this.selectedBackground.id;
        return;
      }
      const currentIndex = this.backgroundDecorations.findIndex((el) => el.id === this.selectedBackground.id);
      let nextIndex = currentIndex + 1;
      if (nextIndex === this.backgroundDecorations.length) {
        nextIndex = 0;
      }
      this.selectedBackground = this.backgroundDecorations[nextIndex];
      this.profileDecorations.decorations[DecorationEntityType.Background] = this.selectedBackground.id;
    }

    private get backgroundDecorations(): DecorationEntity[] {
      return this.decorations.filter((el) => el.type === DecorationEntityType.Background);
    }

    private get imageDecorations(): DecorationEntity[] {
      return this.decorations.filter((el) => el.type === DecorationEntityType.Image);
    }

    private async setupComponent(): Promise<void> {
      try {
        this.profile = await this.avatarService.getOwnProfile();
        if (this.profile) {
          this.profileDecorations = await this.avatarService.getProfileDecorationsByProfileId(this.profile.id);
          await this.fetchAvailableDecorations();
        }
        this.name = this.profile?.name;
        if (this.profileDecorations) {
          const backgroundId = this.profileDecorations?.decorations[DecorationEntityType.Background];
          const background = this.backgroundDecorations.find((el) => el.id === backgroundId);
          this.selectedBackground = background || null;

          const imageId = this.profileDecorations?.decorations[DecorationEntityType.Image];
          const image = this.imageDecorations.find((el) => el.id === imageId);
          this.selectedImage = image || null;
        } else {
          this.profileDecorations = new ProfileDecorationsEntity({
            id: undefined,
            decorations: {} as any,
            profileId: this.profile?.id,
          });
        }
        this.isLoading = false;
      } catch (e: unknown) {
        this.logger.error('Failed to set up KwokkaAvatarSetup component, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }

    private async fetchAvailableDecorations(): Promise<void> {
      this.decorations = await this.avatarService.listAvailableDecorations();
    }
  }
</script>

<style>
  .kwokka-avatar-setup,
  .kwokka-avatar-setup * {
    box-sizing: border-box;
    transition: all ease-in-out 100ms;
  }

  .kwokka-avatar-setup {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    --kwk-avatar--width: 100%;
    --kwk-avatar--max-width: 400px;
    --kwk-avatar--gap: 40px;
    --kwk-avatar--font-family: sans-serif;
    --kwk-avatar--color: #fff;
    --kwk-avatar--text-align: center;
  }

  .kwokka-avatar-setup__description {
    --kwk-avatar--font-size: 14px;
  }

  .kwokka-avatar-setup__caption {
    --kwk-avatar--font-size: 14px;
  }

  .kwokka-avatar-setup__name {
    display: flex;
    flex-direction: column;
    align-items: center;
    --kwk-avatar--gap: 40px;
  }

  .kwokka-avatar-setup__next-button {
    --kwk-avatar--width: 100%;
    --kwk-avatar--max-width: 240px;
    --kwk-avatar--height: 48px;
    --kwk-avatar--font-size: 24px;
    --kwk-avatar--background-color: #ef8134;
  }

  .kwokka-avatar-setup__decorations {
    --kwk-avatar--width: 100%;
    --kwk-avatar--gap: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .kwokka-avatar-setup__avatar-button {
    position: absolute;
    --kwk-avatar--padding: 0;
    --kwk-avatar--width: 32px;
    --kwk-avatar--height: 32px;
    --kwk-avatar--border-radius: 50%;
    --kwk-avatar--background-color: rgba(255, 255, 255, 0.3);
    --kwk-avatar--border: none;
  }

  .kwokka-avatar-setup__avatar-button_image {
    bottom: 0;
    --kwk-avatar--width: 28px;
    --kwk-avatar--height: 28px;
  }

  .kwokka-avatar-setup__avatar-button_left {
    left: 0;
    margin-left: -5%;
  }

  .kwokka-avatar-setup__avatar-button_right {
    right: 0;
    margin-right: -5%;
  }
</style>
