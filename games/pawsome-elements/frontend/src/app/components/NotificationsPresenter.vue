<template>
  <div class="notification-presenter">
    <UiNotification v-for="notification in notifications" :key="notification.key" :params="notification" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { UuidUtil } from '@kwokka/utils';
  import UiNotification from '@/app/ui-kit/UiNotification.vue';
  import { NotificationService, type NotificationParams } from '@/service/notification/notification.service';
  import { LazyInject } from '@/ioc';

  interface NotificationsPresenterNotificationParams extends NotificationParams {
    key: string;
  }

  @Component({
    components: { UiNotification },
  })
  export default class NotificationsPresenter extends Vue {
    private static readonly displayTime = 10000;

    @LazyInject(NotificationService)
    private notificationService: NotificationService;

    private unsubscribeFromNotifications?: Function;

    private notificationHideTimeouts: number[] = [];

    public notifications: NotificationsPresenterNotificationParams[] = [];

    protected created() {
      const notificationHandler = this.onNotificationReceive.bind(this);
      const unsubscribeFunction = this.notificationService.subscribe(notificationHandler);
      this.unsubscribeFromNotifications = unsubscribeFunction;
    }

    protected unmounted() {
      if (this.unsubscribeFromNotifications) {
        this.unsubscribeFromNotifications();
      }
      this.notificationHideTimeouts.forEach((el) => clearTimeout(el));
    }

    private onNotificationReceive(params: NotificationParams) {
      const key = UuidUtil.generate();
      this.notifications.push({ ...params, key });

      const timeout = setTimeout(() => {
        const filtered = this.notifications.filter((el) => el.key !== key);
        this.notifications = filtered;
      }, NotificationsPresenter.displayTime);

      this.notificationHideTimeouts.push(timeout);
    }
  }
</script>

<style scoped lang="scss">
  .notification-presenter {
    --pwsm--spacing-unit: 4px;
    --pwsm--font-size: 16px;
    @include UiMargin(4, bottom);
    @include UiPadding(2, left);
    @include UiPadding(2, right);
    @include UiGap(1);
    pointer-events: none;

    position: fixed;
    z-index: 2000;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>
