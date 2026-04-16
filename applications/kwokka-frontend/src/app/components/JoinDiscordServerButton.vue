<template>
  <a
    class="join-discord-server-button ui-link-reset"
    :href="discordServerInvitationLink"
    target="_blank"
    rel="noopener noreferrer"
    @click="onClick"
  >
    <UiButton shade="accent">{{ $t('general.discordInvite') }}</UiButton>
  </a>
</template>

<script lang="ts">
  import { Component, Emit, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { ConfigService } from '@/service/config/config.service';
  import UiButton from '@/app/ui-kit/UiButton.vue';

  @Component({
    components: {
      UiButton,
    },
  })
  export default class JoinDiscordServerButton extends Vue {
    @LazyInject(ConfigService)
    public configService: ConfigService;

    public get discordServerInvitationLink(): string {
      return this.configService.frontendConfig.socials.discordServer;
    }

    @Emit('click')
    public onClick(event: Event): Event {
      return event;
    }
  }
</script>

<style scoped lang="scss">
  .join-discord-server-button {
    display: block;
  }
</style>
