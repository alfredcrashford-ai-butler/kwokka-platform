<template>
  <div class="about-page-right">
    <p v-html="$t('journal.about.linksParagraph')"></p>
    <ul class="about-page-right__links">
      <li>
        <a :href="configService.frontendConfig.socials.discordServer" target="_blank" class="ui-link-reset">
          <UiButton type="discord" width="block"><UiIcon name="discord" /> Discord</UiButton>
        </a>
      </li>
      <li>
        <a :href="configService.frontendConfig.socials.instagram" target="_blank" class="ui-link-reset">
          <UiButton type="secondary" width="block"><UiIcon name="instagram" /> Instagram</UiButton>
        </a>
      </li>
      <li>
        <a :href="configService.frontendConfig.socials.reddit" target="_blank" class="ui-link-reset">
          <UiButton type="primary" width="block"><UiIcon name="reddit" /> Reddit</UiButton>
        </a>
      </li>
      <li>
        <a :href="configService.frontendConfig.socials.youtube" target="_blank" class="ui-link-reset">
          <UiButton type="red" width="block"><UiIcon name="youtube" /> YouTube</UiButton>
        </a>
      </li>
      <li>
        <a :href="configService.frontendConfig.socials.tiktok" target="_blank" class="ui-link-reset">
          <UiButton type="dark" width="block"><UiIcon name="tiktok" /> TikTok</UiButton>
        </a>
      </li>
    </ul>
    <hr class="about-page-right__divider" />
    <LegalInfo />
  </div>
</template>

<script lang="ts">
  import { LegalInfo } from '@/app/components';
  import { UiButton, UiIcon } from '@/app/ui-kit';
  import { LazyInject } from '@/ioc';
  import { ConfigService } from '@/service';
  import { Component, Vue } from 'vue-facing-decorator';

  @Component({
    components: { LegalInfo, UiButton, UiIcon },
  })
  export default class AboutPageRight extends Vue {
    @LazyInject(ConfigService)
    public configService: ConfigService;
  }
</script>

<style scoped lang="scss">
  .about-page-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    @include UiGap(4);

    &__links {
      @include UiTextShadow(2);
      display: flex;
      flex-direction: column;
      align-items: stretch;
      @include UiGap(2);

      a {
        width: 100%;
        display: flex;
        align-items: center;
        @include UiGap(2);
      }
    }

    &__divider {
      width: 80%;
      border-bottom: 2px dashed rgba(0, 0, 0, 0.5);
      @include UiMargin(4, top);
      @include UiMargin(4, bottom);
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
