<template>
  <div class="ui-notification" :class="[typeClass]">
    <div class="ui-notification__type-indicator"></div>
    <p class="ui-notification__text">{{ $te(params.text) ? $t(params.text) : params.text }}</p>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { NotificationParams } from '@/service/notification/notification.service';

  @Component
  export default class UiNotification extends Vue {
    private static readonly defaultType = 'error';

    @Prop()
    public params?: NotificationParams;

    public get typeClass(): string {
      const type = (this.params && this.params.type) || UiNotification.defaultType;
      return `ui-notification_type-${type}`;
    }
  }
</script>

<style scoped lang="scss">
  .ui-notification {
    @include UiPadding(4, left);
    @include UiPadding(4, right);
    @include UiPadding(2, top);
    @include UiPadding(2, bottom);
    @include UiGap(2);
    @include UiBoxShadow(1);
    position: relative;
    animation-timing-function: ease-in-out;
    animation-name: UiAnimationScaleIn, UiAnimationFadeIn;
    animation-duration: 100ms;

    display: flex;
    align-items: center;
    justify-content: center;
    min-height: UiSpacing(7);
    min-width: UiSpacing(70);

    border: 1px solid UiColor(shade-400, 0.75);
    border-radius: UiSpacing(1);
    background-color: UiColor(shade-800, 0.75);

    &_type-error {
      --ui-notification-color: #{UiColor(negative-600)};
    }

    &_type-info {
      --ui-notification-color: #{UiColor(blue-600)};
    }

    &_type-success {
      --ui-notification-color: #{UiColor(positive-600)};
    }

    &__text {
      @include UiTypographyParagraph1();
      text-align: center;
    }

    &__type-indicator {
      left: 0;
      position: absolute;
      width: UiSpacing(1);
      height: 100%;
      border-top-left-radius: calc(UiSpacing(1) - 1px);
      border-bottom-left-radius: calc(UiSpacing(1) - 1px);
      background-color: var(--ui-notification-color);
    }
  }
</style>
