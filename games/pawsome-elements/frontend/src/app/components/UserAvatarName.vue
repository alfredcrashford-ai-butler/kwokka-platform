<template>
  <KwokkaAvatarName
    :accountId="accountId"
    :accessToken="kwokkaService.client.accessToken"
    :endpoint="configService.frontendConfig.avatarGateway"
  />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { KwokkaAvatarName } from '@kwokka/avatar-vue';
  import { LazyInject } from '@/ioc';
  import { KwokkaService } from '@/service/kwokka/kwokka.service';
  import { ConfigService } from '@/service/config/config.service';

  @Component({
    components: {
      KwokkaAvatarName,
    },
  })
  export default class UserAvatarName extends Vue {
    @Prop({ default: null })
    public accountId: string;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(ConfigService)
    public configService: ConfigService;
  }
</script>
