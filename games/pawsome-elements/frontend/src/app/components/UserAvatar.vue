<template>
  <KwokkaSimpleAvatar
    v-if="config"
    translate="no"
    :styles="styles"
    :name="parsedConfig.name"
    :backgroundKey="parsedConfig.decorations.background"
    :imageKey="parsedConfig.decorations.image"
    :badgeKey="parsedConfig.decorations.badge"
    :decorationsSrc="configService.frontendConfig.kwokkaDecorationsSrc"
    @ready="$emit('ready')"
  />
  <KwokkaAvatar
    v-else
    translate="no"
    :styles="styles"
    :accountId="accountId"
    :accessToken="kwokkaService.client.accessToken"
    :decorationsSrc="configService.frontendConfig.kwokkaDecorationsSrc"
    :endpoint="configService.frontendConfig.avatarGateway"
    @ready="$emit('ready')"
  />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { toPng } from 'html-to-image';
  import { KwokkaAvatar, KwokkaSimpleAvatar } from '@kwokka/avatar-vue';
  import { DecorationEntityType } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { KwokkaService } from '@/service/kwokka/kwokka.service';
  import { ConfigService } from '@/service/config/config.service';
  import type { ProfileConfig } from '@/game-data/game-instance';

  @Component({
    components: {
      KwokkaAvatar,
      KwokkaSimpleAvatar,
    },
    emits: ['ready'],
  })
  export default class UserAvatar extends Vue {
    @Prop({ default: null })
    public accountId: string;

    @Prop({ default: null })
    public config: ProfileConfig | string;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    public toPng(): Promise<string> {
      return toPng(this.$el);
    }

    public get parsedConfig(): ProfileConfig {
      if (typeof this.config === 'string') {
        try {
          return JSON.parse(atob(this.config));
        } catch (e: any) {
          return {
            name: '?',
            decorations: {
              [DecorationEntityType.Background]: null,
              [DecorationEntityType.Image]: null,
              [DecorationEntityType.Badge]: null,
            },
          };
        }
      }

      return this.config;
    }

    public readonly styles = {
      avatar: {
        fontFamily: 'inherit',
      },
      avatarName: {
        filter: 'url(#pwsm-outline-2)',
      },
    };
  }
</script>
