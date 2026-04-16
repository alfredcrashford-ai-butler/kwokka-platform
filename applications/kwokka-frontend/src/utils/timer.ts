export function timer(time: number, callback: () => void, tick: (timePassed: number) => void) {
  const startTime = Date.now();
  let nowTime = time;

  const interval = setInterval(() => {
    const currentTime = Date.now();
    const timePassed = currentTime - startTime;
    nowTime = time - timePassed;

    if (nowTime < 0) {
      callback();
    } else {
      tick(timePassed);
    }
  }, 1000 / 60);

  return () => clearInterval(interval);
}
