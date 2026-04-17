<template>
  <div>{{ secondsLeft }}</div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { TimerUtil } from '@/util';

  @Component({
    emits: ['tick', 'end'],
  })
  export default class Timer extends Vue {
    public secondsLeft: number = 0;
    public totalSeconds: number = 0;
    private timerCleanupFn: () => void;

    public beforeUnmount(): void {
      this.cleanupTimer();
    }

    public start(time: number): void {
      this.cleanupTimer();
      this.totalSeconds = this.getSecondsFromMilliseconds(time);
      this.secondsLeft = this.totalSeconds;
      this.timerCleanupFn = TimerUtil.startTimer(
        time,
        () => this.onTimerEnd(),
        (timePassed: number) => this.onTimerTick(timePassed, time - timePassed),
      );
    }

    public stop(): void {
      this.cleanupTimer();
    }

    private onTimerTick(timePassed: number, timeLeft: number): void {
      const secondsLeft = this.getSecondsFromMilliseconds(timeLeft);
      this.secondsLeft = secondsLeft;
      this.$emit('tick', { timePassed, timeLeft });
    }

    private cleanupTimer(): void {
      this.secondsLeft = 0;
      this.totalSeconds = 0;
      if (this.timerCleanupFn) {
        this.timerCleanupFn();
      }
    }

    private onTimerEnd(): void {
      this.cleanupTimer();
      this.$emit('end');
    }

    private getSecondsFromMilliseconds(milliseconds: number): number {
      return Math.ceil(milliseconds / 1000);
    }
  }
</script>
