<template>
  <span @click="$emit('click', $event)">{{ profile?.name }}</span>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { ProfileEntity } from '@kwokka/entities';
  import { AvatarService } from '@/service/avatar.service';
  import { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors';

  @Component({
    emits: ['click', 'error'],
  })
  export default class KwokkaAvatarName extends Vue {
    @Prop({ default: null })
    public accountId!: string;

    @Prop({ required: true })
    public accessToken: string;

    @Prop({ default: 'https://api.kwokka.co/capybara' })
    public endpoint: string;

    public profile: ProfileEntity = null;
    private avatarService = new AvatarService();
    private logger = new LoggerService();

    public created(): void {
      this.avatarService.setBaseUrl(this.endpoint);
      this.avatarService.setAccessToken(this.accessToken);

      this.setupComponent();
    }

    private async setupComponent(): Promise<void> {
      try {
        this.profile = await this.avatarService.getProfileByAccountId(this.accountId);
      } catch (e: unknown) {
        this.logger.error('Failed to set up KwokkaAvatarName component, error: ', e);
        this.$emit('error', ErrorWrapper.wrap(e));
      }
    }
  }
</script>
