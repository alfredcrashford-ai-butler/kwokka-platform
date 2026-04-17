export class ShareUtil {
  public static get canShare(): boolean {
    return Boolean(navigator.share);
  }

  public static share(url: string, text: string, title: string) {
    navigator.share({ url, text, title });
  }
}
