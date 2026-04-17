/**
 * Creates an element and injects it into document's head tag.
 * @function injectElementInHead
 * @param {string} elementTag
 * @param {object} attributes
 * @returns {Promise}
 */
export function injectElementInHead(elementTag: string, attributes: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const element = document.createElement(elementTag);

    if (attributes.dataset) {
      const dataset = attributes.dataset;
      Object.keys(dataset).forEach((key) => (element.dataset[key] = dataset[key]));

      attributes = { ...attributes };
      delete attributes.dataset;
    }

    Object.assign(element, attributes);
    element.addEventListener('load', resolve);
    element.addEventListener('error', reject);
    document.querySelector('head').appendChild(element);
  });
}

/**
 * @function injectScript
 * @param {string} src
 * @param {string} id
 * @return {Promise}
 * @public
 */
export function injectScript(src: string, attributes = {}): Promise<any> {
  const options: any = {
    ...attributes,
    src,
  };
  return injectElementInHead('script', options);
}

export function injectScriptWithContent(content: string, id: string = null): Promise<any> {
  return new Promise((resolve) => {
    const element = document.createElement('script');
    element.innerHTML = content;
    element.id = id;
    document.querySelector('head').appendChild(element);
    resolve(null);
  });
}

/**
 * @function injectStyle
 * @param {string} href
 * @returns {Promise}
 */
export function injectStyle(href: string, id: string = null): Promise<any> {
  const options: any = {
    href,
    rel: 'stylesheet',
  };
  if (id) {
    options.id = id;
  }
  return injectElementInHead('link', options);
}
