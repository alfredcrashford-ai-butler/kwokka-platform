export class TimerUtil {
  public static startTimer(
    time: number,
    callback: () => void,
    tick: (timePassed: number, timeLeft: number) => void,
  ): () => void {
    let nowTime = time;
    return this.startStopwatch((timePassed: number) => {
      nowTime = time - timePassed;

      if (nowTime < 0) {
        callback();
      } else {
        tick(timePassed, time - timePassed);
      }
    });
  }

  public static startStopwatch(tick: (timePassed: number) => void): () => void {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timePassed = currentTime - startTime;

      tick(timePassed);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }
}
