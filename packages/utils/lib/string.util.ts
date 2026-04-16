export class StringUtil {
  public static format(template: string, data: any): string {
    return Object.keys(data ?? {}).reduce(
      (result, key) => result.replace(new RegExp(`{{${key}}}`, 'g'), data[key]),
      template,
    );
  }
}
