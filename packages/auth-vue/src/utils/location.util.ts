export class LocationUtil {
  public static parseHashParams(): Record<string, any> {
    const hashParamString = (location.hash || '').replace(/#/g, '');
    const hashParams = {};
    hashParamString.split('&').forEach((el) => {
      const [key, value] = el.split('=');
      hashParams[key] = value;
    });
    return hashParams;
  }
}
