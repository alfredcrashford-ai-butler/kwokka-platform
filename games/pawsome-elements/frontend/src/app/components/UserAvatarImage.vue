<template>
  <KwokkaSimpleAvatarImage
    v-if="imageKey"
    :imageKey="imageKey"
    :decorationsSrc="configService.frontendConfig.kwokkaDecorationsSrc"
  />
  <KwokkaAvatarImage
    v-else
    :accountId="accountId"
    :accessToken="kwokkaService.client.accessToken"
    :decorationsSrc="configService.frontendConfig.kwokkaDecorationsSrc"
    :endpoint="configService.frontendConfig.avatarGateway"
  />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { KwokkaAvatarImage, KwokkaSimpleAvatarImage } from '@kwokka/avatar-vue';
  import { LazyInject } from '@/ioc';
  import { KwokkaService } from '@/service/kwokka/kwokka.service';
  import { ConfigService } from '@/service/config/config.service';

  @Component({
    components: {
      KwokkaAvatarImage,
      KwokkaSimpleAvatarImage,
    },
  })
  export default class UserAvatarImage extends Vue {
    @Prop({ default: null })
    public accountId: string;

    @Prop({ default: null })
    public imageKey: string;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(ConfigService)
    public configService: ConfigService;
  }
</script>
