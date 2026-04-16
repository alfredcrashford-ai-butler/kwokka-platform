const DEFAULT_FORMAT = 'DD.MM.YYYY HH:mm';

export class DateUtil {
  public static format(date: Date, format: string = DEFAULT_FORMAT): string {
    let result = format || DEFAULT_FORMAT;
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString();
    const valuesMap = {
      YYYY: year,
      YY: year.slice(-2),
      MM: month.padStart(2, '0'),
      DD: day.padStart(2, '0'),
      HH: hours.padStart(2, '0'),
      mm: minutes.padStart(2, '0'),
    };

    const keys = Object.keys(valuesMap) as [keyof typeof valuesMap];
    keys.forEach((key) => (result = result.replace(new RegExp(key, 'g'), valuesMap[key])));

    return result;
  }
}
