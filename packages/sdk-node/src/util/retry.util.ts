export class RetryUtil {
  public static async withRetry(fn: () => any, timeoutMs?: number, maxAttempts?: number): Promise<void> {
    let attempts = 0;

    if (!timeoutMs || !maxAttempts) {
      await fn();
      return;
    }

    while (true) {
      attempts += 1;
      try {
        await fn();
        return;
      } catch (e: unknown) {
        if (attempts > maxAttempts) {
          throw e;
        }

        await new Promise<void>((resolve) => setTimeout(() => resolve(), timeoutMs));
      }
    }
  }
}
