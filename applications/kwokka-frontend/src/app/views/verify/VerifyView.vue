<template>
  <TopLevelLayout>
    <div class="verify">
      <template v-if="status === statuses.InProgress">
        <UiLoader />
        <UiHeading class="verify__heading">{{ $t('verify.progress.heading') }}</UiHeading>
        <p class="verify__caption">{{ $t('verify.progress.caption') }}</p>
      </template>
      <template v-if="status === statuses.Error">
        <UiHeading class="verify__heading">{{ $t('verify.error.heading') }}</UiHeading>
        <p class="verify__caption">{{ $t('verify.error.caption') }}</p>
        <router-link :to="{ name: 'main' }">
          <UiButton>{{ $t('verify.navigateToMain') }}</UiButton>
        </router-link>
      </template>
      <template v-if="status === statuses.Success">
        <UiHeading class="verify__heading">{{ $t('verify.success.heading') }}</UiHeading>
        <p class="verify__caption">{{ $t('verify.success.caption') }}</p>
        <router-link :to="{ name: 'main' }">
          <UiButton>{{ $t('verify.navigateToMain') }}</UiButton>
        </router-link>
      </template>
    </div>
  </TopLevelLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { RouteUtil } from '@/utils/route-util';
  import { CredentialApi } from '@/api/auth/credential/credential.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import { LoggerService } from '@/service/logger/logger.service';
  import TopLevelLayout from '@/app/layouts/TopLevelLayout.vue';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';

  enum Status {
    InProgress = 'in_progress',
    Success = 'success',
    Error = 'error',
  }

  @Component({
    components: {
      TopLevelLayout,
      UiLoader,
      UiButton,
      UiHeading,
    },
  })
  export default class VerifyView extends Vue {
    public status: Status = Status.InProgress;
    public statuses = Status;

    @LazyInject(CredentialApi)
    public credentialApi!: CredentialApi;

    @LazyInject(NotificationService)
    public notificationService!: NotificationService;

    @LazyInject(LoggerService)
    public logger!: LoggerService;

    public mounted(): void {
      // vt stands for verify token
      // cid stands for credential id
      const token = RouteUtil.getQueryParam(this.$route.query.vt);
      const credentialId = RouteUtil.getQueryParam(this.$route.query.cid);
      if (!token || !credentialId) {
        this.$router.replace({ name: 'main' });
        return;
      }

      this.verifyAccess(credentialId, token);
    }

    public async verifyAccess(credentialId: string, token: string): Promise<void> {
      try {
        await this.credentialApi.completeVerifyOwnCredential(credentialId, token);
        this.status = Status.Success;
      } catch (e) {
        this.status = Status.Error;
        this.notificationService.showErrors([e]);
        this.logger.error(e);
      }
    }
  }
</script>

<style scoped lang="scss">
  .verify {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &__heading {
      @include UiMargin(4, bottom, false);
    }

    &__caption {
      max-width: $content-max-width-small;
      @include UiMargin(15, bottom, false);
    }
  }
</style>
