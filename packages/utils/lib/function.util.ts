export class FunctionUtil {
  public static withRetry(fn: (...args: any[]) => any, attempts: number): (attempt: number, ...args: any[]) => any {
    return (...args: any[]) => {
      let attempt = 0;
      while (attempt < attempts) {
        attempt += 1;
        try {
          return fn(attempt, ...args);
        } catch (e: any) {
          if (attempt >= attempts) {
            throw e;
          }
        }
      }
    };
  }

  public static throttle<T extends (...args: any[]) => any>(f: T, wait: number): T {
    let lastCallAt = 0;

    const transformedFn = ((...args: any[]) => {
      const now = Date.now();
      if (lastCallAt + wait > now) {
        return undefined;
      }

      lastCallAt = now;

      return f(...args);
    });

    return transformedFn as unknown as T;
  }

  public static debounce<T, F extends (...args: any[]) => any>(
    func: F,
    wait: number,
  ): F {

    let timeout: any;
    let args: any[];
    let context: any;
    let timestamp: number;
    let result: T;

    function later() {
      const last = Date.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        result = func.apply(context, args);
        context = null;
        args = null as any;
      }
    }

    const debounced = function debounced(this: any) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      context = this;
      // eslint-disable-next-line prefer-rest-params
      args = arguments as any;
      timestamp = Date.now();
      if (!timeout) timeout = setTimeout(later, wait);

      return result;
    };

    return debounced as any;
  }

  public static memoize<A extends any[], P = any>(func: (...args: A) => P): (...args: A) => P {
    const results: { [key: string]: P } = {};
    return (...args) => {
      const argsKey = JSON.stringify(args);
      if (!results[argsKey]) {
        results[argsKey] = func(...args);
      }
      return results[argsKey];
    };
  }
}
