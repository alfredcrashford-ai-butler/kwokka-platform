import { container } from '@/ioc';
import { SoundService } from '@/service';

const soundService = container.get<SoundService>(SoundService);
const mouseenterEventListener = () => soundService.playUiHover();
const clickEventListener = () => soundService.playUiSelect();

export const uiSoundDirective = {
  mounted(el: any): void {
    if (!el.disabled && el.ariaDisabled === null) {
      el.addEventListener('click', clickEventListener);
      el.addEventListener('mouseenter', mouseenterEventListener);
    }
  },

  updated(el: any): void {
    setTimeout(() => {
      el.removeEventListener('click', clickEventListener);
      el.removeEventListener('mouseenter', mouseenterEventListener);
      if (!el.disabled && el.ariaDisabled === null) {
        el.addEventListener('click', clickEventListener);
        el.addEventListener('mouseenter', mouseenterEventListener);
      }
    });
  },

  unmounted(el: HTMLElement): void {
    setTimeout(() => {
      el.removeEventListener('click', clickEventListener);
      el.removeEventListener('mouseenter', mouseenterEventListener);
    });
  },
};
