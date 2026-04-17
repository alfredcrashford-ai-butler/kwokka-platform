export class FileUtil {
  public static getDisplayFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0KB';
    }

    const kbSize = bytes / 1024;
    if (kbSize < 1024) {
      return `${Math.ceil(kbSize)}KB`;
    }

    const mbSize = kbSize / 1024;
    return `${mbSize.toFixed(2)}MB`;
  }
}
