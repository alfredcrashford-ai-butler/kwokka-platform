<template>
  <KwokkaSimpleAvatarImage
    :styles="styles"
    :imageKey="image?.key"
    :decorationsSrc="decorationsSrc"
    @click="$emit('click', $event)"
  />
</template>

<script lang="ts">
  import { Component, Prop, Provide, Vue } from 'vue-facing-decorator';
  import { DecorationEntity } from '@kwokka/entities';
  import { AvatarService } from '@/service/avatar.service';
  import { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors';
  import type { KwokkaAvatarImageStyles } from '@/styles/kwokka-avatar-styles';
  import KwokkaSimpleAvatarImage from './KwokkaSimpleAvatarImage.vue';

  @Component({
    components: { KwokkaSimpleAvatarImage },
    emits: ['click', 'error'],
  })
  export default class KwokkaAvatarImage extends Vue {
    @Provide()
    @Prop({ default: {} })
    public styles: KwokkaAvatarImageStyles;

    @Prop({ default: null })
    public accountId!: string;

    @Provide()
    @Prop({ default: '/assets/decorations' })
    public decorationsSrc: string;

    @Prop({ required: true })
    public accessToken: string;

    @Prop({ default: 'https://api.kwokka.co/capybara' })
    public endpoint: string;

    public image: DecorationEntity = null;
    private avatarService = new AvatarService();
    private logger = new LoggerService();

    public created(): void {
      this.avatarService.setBaseUrl(this.endpoint);
      this.avatarService.setAccessToken(this.accessToken);

      this.setupComponent();
    }

    private async setupComponent(): Promise<void> {
      try {
        const profile = await this.avatarService.getProfileByAccountId(this.accountId);
        if (!profile) {
          return;
        }

        const profileDecorations = await this.avatarService.getProfileDecorationsByProfileId(profile.id);
        if (!profileDecorations) {
          return;
        }

        const imageId = profileDecorations.decorations.image;
        if (!imageId) {
          return;
        }

        this.image = await this.avatarService.getDecorationById(imageId);
      } catch (e: unknown) {
        this.logger.error('Failed to set up KwokkaAvatarImage component, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }
  }
</script>
