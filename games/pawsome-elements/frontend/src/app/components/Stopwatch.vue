<template>
  <span class="stopwatch">{{ time }}</span>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { TimerUtil } from '@/util';

  @Component
  export default class Stopwatch extends Vue {
    private readonly defaultTime = '00:00';
    public time = this.defaultTime;
    private cleanupStopwatch: () => void;

    public beforeUnmount(): void {
      this.stop();
    }

    public start(): void {
      this.time = this.defaultTime;
      TimerUtil.startStopwatch((timePassed: number) => {
        const totalSeconds = Math.floor(timePassed / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const minutesStringified = `${minutes}`.padStart(2, '0');
        const seconds = totalSeconds % 60;
        const secondsStringified = `${seconds}`.padStart(2, '0');
        const newTime = `${minutesStringified}:${secondsStringified}`;
        if (this.time !== newTime) {
          this.time = newTime;
        }
      });
    }

    public stop(): void {
      this.cleanupStopwatch?.();
    }
  }
</script>

<style scoped lang="scss">
  .stopwatch {
    @include UiTypographyMonospace();
  }
</style>
