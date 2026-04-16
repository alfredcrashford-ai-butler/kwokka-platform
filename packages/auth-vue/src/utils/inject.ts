export function injectElementInHead(elementTag: string, attributes: object = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const element = document.createElement(elementTag);
    Object.assign(element, attributes);
    element.addEventListener('load', resolve);
    element.addEventListener('error', reject);
    document.querySelector('head').appendChild(element);
  });
}

export function injectScript(src: string, id: string = null): Promise<any> {
  const options: any = {
    src,
    async: true,
  };
  if (id) {
    options.id = id;
  }
  return injectElementInHead('script', options);
}
