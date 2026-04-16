<template>
  <KwokkaSimpleAvatar
    :styles="styles"
    :name="profile?.name"
    :backgroundKey="background?.key"
    :imageKey="image?.key"
    :badgeKey="badge?.key"
    :decorationsSrc="decorationsSrc"
    @click="$emit('click', $event)"
    @ready="$emit('ready', $event)"
  />
</template>

<script lang="ts">
  import { Component, Prop, Provide, Vue } from 'vue-facing-decorator';
  import { DecorationEntity, DecorationEntityType, ProfileEntity, type ProfileDecorationsEntity } from '@kwokka/entities';
  import KwokkaSimpleAvatar from './KwokkaSimpleAvatar.vue';
  import { AvatarService } from '@/service/avatar.service';
  import { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors';
  import type { KwokkaAvatarStyles } from '@/styles/kwokka-avatar-styles';

  @Component({
    components: { KwokkaSimpleAvatar },
    emits: ['click', 'ready', 'error'],
  })
  export default class KwokkaAvatar extends Vue {
    @Provide()
    @Prop({ default: {} })
    public styles: KwokkaAvatarStyles;

    @Prop({ default: null })
    public accountId!: string;

    @Provide()
    @Prop({ default: '/assets/decorations' })
    public decorationsSrc: string;

    @Prop({ required: true })
    public accessToken: string;

    @Prop({ default: 'https://api.kwokka.co/capybara' })
    public endpoint: string;

    public profile: ProfileEntity = null;
    public decorations: DecorationEntity[] = [];
    public profileDecorations: ProfileDecorationsEntity = null;
    private avatarService = new AvatarService();
    private logger = new LoggerService();

    public created(): void {
      this.avatarService.setBaseUrl(this.endpoint);
      this.avatarService.setAccessToken(this.accessToken);

      this.setupComponent();
    }

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
      return this.decorations?.find(el => el.id === decorationId);
    }

    private async setupComponent(): Promise<void> {
      try {
        this.profile = await this.avatarService.getProfileByAccountId(this.accountId);
        if (!this.profile) {
          return;
        }

        this.profileDecorations = await this.avatarService.getProfileDecorationsByProfileId(this.profile.id);
        if (!this.profileDecorations) {
          return;
        }

        const decorationIds = Object.values(this.profileDecorations.decorations).filter(Boolean);
        this.decorations = await this.avatarService.getDecorationsByIds(decorationIds);
      } catch (e: unknown) {
        this.logger.error('Failed to set up KwokkaAvatar component, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }
  }
</script>
