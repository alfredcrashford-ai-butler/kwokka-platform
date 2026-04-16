<template>
  <Loader />
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import { stylesDirective } from '@/styles/styles-directive';
  import Loader from '@/components/Loader.vue';

  @Component({
    components: { Loader },
    directives: { styles: stylesDirective },
  })
  export default class AddDiscordCredential extends Vue {
    @Inject()
    public discordClientId: string;

    @Inject()
    public discordRedirectUri: string;

    public created(): void {
      let url = 'https://discord.com/oauth2/authorize?response_type=token&scope=identify+email';
      url += `&client_id=${this.discordClientId}`;
      url += `&redirect_uri=${encodeURIComponent(this.discordRedirectUri)}`;
      window.open(url, '_self', 'noopener');
    }
  }
</script>
