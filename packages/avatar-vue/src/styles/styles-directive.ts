function setProperty(el: HTMLElement, name: string, value: string): void {
  if (value) {
    el.style.setProperty(name, value);
  }
}

function setBoxProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-avatar--border-radius', style?.borderRadius);
  setProperty(el, '--kwk-avatar--border', style?.border);
  setProperty(el, '--kwk-avatar--padding', style?.padding);
  setProperty(el, '--kwk-avatar--margin', style?.margin);
  setProperty(el, '--kwk-avatar--gap', style?.gap);
  setProperty(el, '--kwk-avatar--max-width', style?.maxWidth);
  setProperty(el, '--kwk-avatar--min-width', style?.minWidth);
  setProperty(el, '--kwk-avatar--max-height', style?.maxHeight);
  setProperty(el, '--kwk-avatar--min-height', style?.minHeight);
  setProperty(el, '--kwk-avatar--width', style?.width);
  setProperty(el, '--kwk-avatar--height', style?.height);
  setProperty(el, '--kwk-avatar--box-shadow', style?.boxShadow);
}

function set9BoxProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-avatar--9box--width', style?.nineBoxWidth);
  setProperty(el, '--kwk-avatar--9box--height', style?.nineBoxHeight);
  setProperty(el, '--kwk-avatar--9box--top-left', style?.nineBoxTopLeft);
  setProperty(el, '--kwk-avatar--9box--top', style?.nineBoxTop);
  setProperty(el, '--kwk-avatar--9box--top-right', style?.nineBoxTopRight);
  setProperty(el, '--kwk-avatar--9box--left', style?.nineBoxLeft);
  setProperty(el, '--kwk-avatar--9box--center', style?.nineBoxCenter);
  setProperty(el, '--kwk-avatar--9box--right', style?.nineBoxRight);
  setProperty(el, '--kwk-avatar--9box--bottom-left', style?.nineBoxBottomLeft);
  setProperty(el, '--kwk-avatar--9box--bottom', style?.nineBoxBottom);
  setProperty(el, '--kwk-avatar--9box--bottom-right', style?.nineBoxBottomRight);
}

function setTextProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-avatar--font-family', style?.fontFamily);
  setProperty(el, '--kwk-avatar--font-size', style?.fontSize);
  setProperty(el, '--kwk-avatar--line-height', style?.lineHeight);
  setProperty(el, '--kwk-avatar--font-weight', style?.fontWeight);
  setProperty(el, '--kwk-avatar--text-align', style?.textAlign);
}

function setColorProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-avatar--color', style?.color);
  setProperty(el, '--kwk-avatar--background-color', style?.backgroundColor);
}
function setFilterProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-avatar--filter', style?.filter);
}

function setProperties(el, binding) {
  const style = binding?.value;
  if (!style) {
    return;
  }

  if (el.classList.contains('kwokka-avatar-text')) {
    setTextProperties(el, style);
  }

  if (el.classList.contains('kwokka-avatar-box')) {
    setBoxProperties(el, style);
  }

  if (el.classList.contains('kwokka-avatar-9box')) {
    set9BoxProperties(el, style);
  }

  if (el.classList.contains('kwokka-avatar-color')) {
    setColorProperties(el, style);
  }

  if (el.classList.contains('kwokka-avatar-filter')) {
    setFilterProperties(el, style);
  }

  if (el.classList.contains('kwokka-avatar-block')) {
    setTextProperties(el, style);
    setBoxProperties(el, style);
    set9BoxProperties(el, style);
    setColorProperties(el, style);
    setFilterProperties(el, style);
  }

  if (el.classList.contains('kwokka-avatar-loader')) {
    if (style?.loader?.style) {
      (el.style as any) = style?.loader?.style;
    }
  }
}

export const stylesDirective = {
  mounted(el: HTMLElement, binding: any) {
    setProperties(el, binding);
  },

  updated(el: HTMLElement, binding: any) {
    if (binding.oldValue !== binding.value) {
      setProperties(el, binding);
    }
  },
};
