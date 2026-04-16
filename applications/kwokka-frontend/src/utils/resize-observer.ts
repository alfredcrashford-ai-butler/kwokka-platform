export function resizeObserver(element: Element, handler: (rect: DOMRectReadOnly) => void): () => void {
  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => handler(entry.contentRect));
  });

  observer.observe(element);

  return () => observer.disconnect();
}
