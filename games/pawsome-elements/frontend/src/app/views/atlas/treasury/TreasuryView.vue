<template>
  <div class="treasury-view">
    <span class="treasury-view__text">{{ $t('general.construction') }}</span>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { ErrorTrackerService, KwokkaService, LoggerService, NotificationService } from '@/service';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      UiLoader,
    },
  })
  export default class TreasuryView extends Vue {
    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    @LazyInject(ErrorTrackerService)
    public errorTrackerService: ErrorTrackerService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public onMainMenuRedirect(): void {
      this.navigateToMain();
    }

    private navigateToMain(): void {
      this.$router.replace({ name: RouteName.Main });
    }
  }
</script>

<style scoped lang="scss">
  .treasury-view {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__text {
      @include UiTypographyHeading1();
      @include UiTextShadow(2);
    }
  }
</style>
