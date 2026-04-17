<template>
  <MenuLayout>
    <div class="practice-view">
      <UiLoader />
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import { ConfigService } from '@/service/config/config.service';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';
  import { KwokkaService } from '@/service/kwokka/kwokka.service';
  import { ErrorTrackerService, TrackerService } from '@/service';
  import MenuLayout from '@/app/components/MenuLayout.vue';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      MenuLayout,
      UiLoader,
    },
  })
  export default class PracticeView extends Vue {
    public isLoading = true;

    @LazyInject(ConfigService)
    public configService!: ConfigService;

    @LazyInject(KwokkaService)
    public kwokkaService!: KwokkaService;

    @LazyInject(NotificationService)
    public notificationService!: NotificationService;

    @LazyInject(ErrorTrackerService)
    public errorTrackerService!: ErrorTrackerService;

    @LazyInject(TrackerService)
    public trackerService!: TrackerService;

    public async mounted(): Promise<void> {
      try {
        const gameInstance = await this.kwokkaService.createPracticeMatch();
        this.trackerService.event(TrackingCategory.Game, TrackingEvent.PracticeStarted);
        this.$router.replace({ name: RouteName.Game, params: { id: gameInstance.id } });
      } catch (e: any) {
        this.errorTrackerService.captureError(e);
        this.notificationService.show({ type: 'error', text: this.$t('error.UNEXPECTED_ERROR') });
        this.$router.replace({ name: RouteName.Main });
      }
    }
  }
</script>

<style scoped lang="scss">
  .practice-view {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
