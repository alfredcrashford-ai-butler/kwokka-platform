import { injectable } from 'inversify';
import { resizeObserver } from '@/util';
import { FunctionUtil } from '@kwokka/utils';

const RESIZE_DEBOUNCE_MS = 200;

@injectable()
export class DOMService {
  private getBoundingClientRectMemoized: (selector: string) => DOMRect;

  public constructor() {
    resizeObserver(
      document.body,
      FunctionUtil.debounce(() => this.setGetBoundingClientRectMemoized(), RESIZE_DEBOUNCE_MS),
    );
    this.setGetBoundingClientRectMemoized();
  }

  public getBoundingClientRect(selector: string): DOMRect {
    return this.getBoundingClientRectMemoized(selector);
  }

  private setGetBoundingClientRectMemoized(): void {
    this.getBoundingClientRectMemoized = FunctionUtil.memoize((selector: string) => {
      const node = document.querySelector(selector);
      return node?.getBoundingClientRect();
    });
  }
}
