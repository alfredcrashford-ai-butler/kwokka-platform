function setProperty(el: HTMLElement, name: string, value: string): void {
  if (value) {
    el.style.setProperty(name, value);
  }
}

function setBoxProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-auth--border-radius', style?.borderRadius);
  setProperty(el, '--kwk-auth--border', style?.border);
  setProperty(el, '--kwk-auth--padding', style?.padding);
  setProperty(el, '--kwk-auth--margin', style?.margin);
  setProperty(el, '--kwk-auth--gap', style?.gap);
  setProperty(el, '--kwk-auth--max-width', style?.maxWidth);
  setProperty(el, '--kwk-auth--min-width', style?.minWidth);
  setProperty(el, '--kwk-auth--max-height', style?.maxHeight);
  setProperty(el, '--kwk-auth--min-height', style?.minHeight);
  setProperty(el, '--kwk-auth--width', style?.width);
  setProperty(el, '--kwk-auth--height', style?.height);
  setProperty(el, '--kwk-auth--box-shadow', style?.boxShadow);
}

function set9BoxProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-auth--9box--width', style?.nineBoxWidth);
  setProperty(el, '--kwk-auth--9box--height', style?.nineBoxHeight);
  setProperty(el, '--kwk-auth--9box--top-left', style?.nineBoxTopLeft);
  setProperty(el, '--kwk-auth--9box--top', style?.nineBoxTop);
  setProperty(el, '--kwk-auth--9box--top-right', style?.nineBoxTopRight);
  setProperty(el, '--kwk-auth--9box--left', style?.nineBoxLeft);
  setProperty(el, '--kwk-auth--9box--center', style?.nineBoxCenter);
  setProperty(el, '--kwk-auth--9box--right', style?.nineBoxRight);
  setProperty(el, '--kwk-auth--9box--bottom-left', style?.nineBoxBottomLeft);
  setProperty(el, '--kwk-auth--9box--bottom', style?.nineBoxBottom);
  setProperty(el, '--kwk-auth--9box--bottom-right', style?.nineBoxBottomRight);
}

function setTextProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-auth--font-family', style?.fontFamily);
  setProperty(el, '--kwk-auth--font-size', style?.fontSize);
  setProperty(el, '--kwk-auth--line-height', style?.lineHeight);
  setProperty(el, '--kwk-auth--font-weight', style?.fontWeight);
  setProperty(el, '--kwk-auth--text-shadow', style?.textShadow);
}

function setColorProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-auth--color', style?.color);
  setProperty(el, '--kwk-auth--background-color', style?.backgroundColor);
}
function setFilterProperties(el: HTMLElement, style: any): void {
  setProperty(el, '--kwk-auth--filter', style?.filter);
}

function setProperties(el, binding) {
  const style = binding?.value;
  if (!style) {
    return;
  }

  if (el.classList.contains('kwokka-auth-text')) {
    setTextProperties(el, style);
  }

  if (el.classList.contains('kwokka-auth-box')) {
    setBoxProperties(el, style);
  }

  if (el.classList.contains('kwokka-auth-9box')) {
    set9BoxProperties(el, style);
  }

  if (el.classList.contains('kwokka-auth-color')) {
    setColorProperties(el, style);
  }

  if (el.classList.contains('kwokka-auth-filter')) {
    setFilterProperties(el, style);
  }

  if (el.classList.contains('kwokka-auth-block')) {
    setTextProperties(el, style);
    setBoxProperties(el, style);
    set9BoxProperties(el, style);
    setColorProperties(el, style);
    setFilterProperties(el, style);
  }

  if (el.classList.contains('kwokka-auth-link')) {
    setTextProperties(el, style);
    setColorProperties(el, style);
    setFilterProperties(el, style);
  }

  if (el.classList.contains('kwokka-auth-loader')) {
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
