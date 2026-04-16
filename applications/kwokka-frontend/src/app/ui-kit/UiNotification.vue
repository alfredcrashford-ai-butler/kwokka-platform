<template>
  <div class="ui-notification" :class="[typeClass]">
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
    @include UiBorderRadius(md);
    @include UiPadding(4, left);
    @include UiPadding(4, right);
    @include UiPadding(2, top);
    @include UiPadding(2, bottom);
    @include UiShadow(1);
    position: relative;
    animation-timing-function: ease-in-out;
    animation-name: ui-notification-frames-in;
    animation-duration: 100ms;

    display: flex;
    align-items: center;
    justify-content: center;
    min-height: $grid-step * 10;
    min-width: $grid-step * 60;
    backdrop-filter: blur(2px);

    @include UiTheme() {
      border: 2px solid rgba(UiColor(shade-100), 0.5);
      background-color: rgba(UiColor(shade-800), 0.5);
    }

    &_type-error {
      @include UiTheme() {
        --ui-notification-color: #{UiColor(negative)};
      }
    }

    &_type-info {
      @include UiTheme() {
        --ui-notification-color: #{UiColor(yellow-500)};
      }
    }

    &_type-success {
      @include UiTheme() {
        --ui-notification-color: #{UiColor(positive)};
      }
    }

    &__text {
      @include UiTypographyParagraph1();
      @include UiFontWeight(bold);
      text-align: center;
    }
  }

  @keyframes ui-notification-frames-in {
    0% {
      transform: scale(0.7);
      opacity: 0;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
