<template>
  <Loader v-if="isLoading" />
  <div class="kwokka-avatar-setup kwokka-avatar-block" v-styles="styles?.container" v-else-if="!profile">
    <p
      class="kwokka-avatar-setup__description kwokka-avatar-block"
      v-styles="styles?.description"
      v-if="$te('avatar.setup.description')"
    >
      {{ $t('avatar.setup.description') }}
    </p>
    <div class="kwokka-avatar-setup__name kwokka-avatar-block" v-styles="styles?.name">
      <Input v-model="name" :placeholder="$t('avatar.setup.namePlaceholder')" :label="$t('avatar.setup.nameLabel')" />
      <Button
        class="kwokka-avatar-setup__next-button"
        v-styles="styles?.nextButton"
        :disabled="(name?.length || 0) < 3"
        @click="onNextClick()"
      >
        {{ $t('avatar.setup.next') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
  import { toRaw } from 'vue';
  import { Component, Prop, Provide, Vue } from 'vue-facing-decorator';
  import { DecorationEntityType, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
  import Button from '@/components/Button.vue';
  import Loader from '@/components/Loader.vue';
  import Input from '@/components/Input.vue';
  import { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors/error-wrapper';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { KwokkaSimpleAvatarSetupStyles } from '@/styles/kwokka-avatar-styles';
  import { AvatarService } from '@/service/avatar.service';
  import { BackgroundDecorationKey, ImageDecorationKey } from './decoration-key';

  const IMAGE_DEFAULT_DECORATION = ImageDecorationKey.Jimmy;
  const BACKGROUND_DEFAULT_DECORATION = BackgroundDecorationKey.RunicBoard;

  @Component({
    components: { Button, Input, Loader },
    emits: ['completed', 'error'],
    directives: { styles: stylesDirective },
  })
  export default class KwokkaSimpleAvatarSetup extends Vue {
    public name: string = '';
    public isLoading: boolean = true;
    public profile?: ProfileEntity = null;
    private avatarService = new AvatarService();
    private logger = new LoggerService();

    @Provide()
    @Prop({ default: {} })
    public styles: KwokkaSimpleAvatarSetupStyles;

    @Prop({ required: true })
    public accessToken: string;

    @Prop({ required: true })
    public locale: string;

    @Prop({ default: 'https://api.kwokka.co/capybara' })
    public endpoint: string;

    @Provide()
    @Prop({ default: '/assets/decorations' })
    public decorationsSrc: string;

    public created(): void {
      this.avatarService.setBaseUrl(this.endpoint);
      this.avatarService.setAccessToken(this.accessToken);
    }

    public mounted(): void {
      this.setupComponent();
    }

    public async onNextClick(): Promise<void> {
      try {
        this.profile = await this.avatarService.createOwnProfile(this.name, this.locale);
        const profileDecorations = await this.setupDefaultDecorations();
        this.$emit('completed', {
          profile: toRaw(this.profile),
          profileDecorations: profileDecorations,
        });
      } catch (e: unknown) {
        this.logger.error('Failed to create profile, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }

    private async setupComponent(): Promise<void> {
      try {
        this.profile = await this.avatarService.getOwnProfile();
        this.isLoading = false;
        if (!this.profile) {
          return;
        }

        let profileDecorations = await this.avatarService.getProfileDecorationsByProfileId(this.profile.id);
        profileDecorations ||= await this.setupDefaultDecorations();

        this.$emit('completed', {
          profile: toRaw(this.profile),
          profileDecorations: profileDecorations,
        });
      } catch (e: unknown) {
        this.logger.error('Failed to set up KwokkaAvatarSetup component, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }

    private async setupDefaultDecorations(): Promise<ProfileDecorationsEntity> {
      const image = await this.avatarService.getDecorationByKey(IMAGE_DEFAULT_DECORATION);
      const background = await this.avatarService.getDecorationByKey(BACKGROUND_DEFAULT_DECORATION);
      const profileDecorations = await this.avatarService.createOwnProfileDecorations({
        [DecorationEntityType.Background]: background?.id,
        [DecorationEntityType.Image]: image?.id,
      });
      return profileDecorations;
    }
  }
</script>
