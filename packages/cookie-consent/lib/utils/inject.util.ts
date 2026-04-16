export class InjectUtil {
  public static injectElementInHead(elementTag: string, attributes: object = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const element = document.createElement(elementTag);
      Object.assign(element, attributes);
      element.addEventListener('load', resolve);
      element.addEventListener('error', reject);
      document.querySelector('head')!.appendChild(element);
    });
  }

  public static injectScript(src: string, id: string | null = null): Promise<any> {
    const options: any = {
      src,
      async: true,
    };
    if (id) {
      options.id = id;
    }
    return this.injectElementInHead('script', options);
  }

  public static injectScriptWithContent(content: string, id: string | null = null): Promise<any> {
    return new Promise((resolve) => {
      const element = document.createElement('script');
      element.innerHTML = content;
      if (id) {
        element.id = id;
      }
      document.querySelector('head')!.appendChild(element);
      resolve(null);
    });
  }

  public static injectStyle(href: string, id: string | null = null): Promise<any> {
    const options: any = {
      href,
      rel: 'stylesheet',
    };
    if (id) {
      options.id = id;
    }
    return this.injectElementInHead('link', options);
  }
}
