<template>
  <div class="main-bottom-section">
    <SignUpBanner
      v-if="isSignupBannerShown"
      @error="onCredentialsError($event)"
      @created="onCredentialsCreated($event)"
    />
    <a
      v-else
      class="ui-link-reset"
      :href="configService.frontendConfig.socials.discordServer"
      :title="$t('general.socials.discord')"
      target="_blank"
      @click="onDiscordClick()"
    >
      <UiButton type="discord" size="lg">
        <UiIcon name="discord" />
        {{ $t('general.socials.discord') }}
      </UiButton>
    </a>
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { CredentialEntityType, type CredentialEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { TrackerService, ConfigService, KwokkaService, ErrorTrackerService } from '@/service';
  import { UiButton, UiIcon } from '@/app/ui-kit';
  import SignUpBanner from './SignUpBanner.vue';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';

  @Component({
    components: {
      UiButton,
      UiIcon,
      SignUpBanner,
    },
  })
  export default class MainBottomSection extends Vue {
    @LazyInject(ConfigService)
    private configService: ConfigService;

    @LazyInject(TrackerService)
    private trackerService!: TrackerService;

    @LazyInject(ErrorTrackerService)
    private errorTrackerService!: ErrorTrackerService;

    @LazyInject(KwokkaService)
    private kwokkaService: KwokkaService;

    @Ref()
    public signUpBanner: SignUpBanner;

    private credentials: CredentialEntity[] = null;

    public get isSignupBannerShown(): boolean {
      if (!this.credentials) {
        return false;
      }

      return !this.credentials.some((el) => el.type !== CredentialEntityType.Anonymous);
    }

    public async mounted(): Promise<void> {
      if (this.$route.query.callback) {
        this.signUpBanner.showCallback();
      } else {
        this.fetchCredentials();
      }
    }

    public async fetchCredentials(): Promise<void> {
      this.credentials = null;
      this.credentials = await this.kwokkaService.client.getCredentials();
    }

    public onCredentialsError(e: any): void {
      this.errorTrackerService.captureError(e);
      this.fetchCredentials();
      this.$route.query = {};
    }

    public onCredentialsCreated(credential: CredentialEntity): void {
      this.trackerService.event(TrackingCategory.Menu, TrackingEvent.CredentialsAdded, { type: credential?.type });
      this.fetchCredentials();
    }

    public onDiscordClick(): void {
      this.trackerService.event(TrackingCategory.Menu, TrackingEvent.JoinDiscordClick);
    }
  }
</script>

<style scoped lang="scss">
  .main-bottom-section {
    > * {
      display: block;
    }
  }
</style>
