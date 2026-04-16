import { customAlphabet, nanoid } from 'nanoid';

export class UuidUtil {
  public static generate(size?: number): string {
    size = this.getSize(size);
    return nanoid(size);
  }

  public static generateNumeric(size?: number): string {
    size = this.getSize(size);
    const generate = customAlphabet('1234567890', size);
    return generate();
  }

  public static generateNoSpecialSymbols(size?: number): string {
    size = this.getSize(size);
    const generate = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', size);
    return generate();
  }

  private static getSize(size?: number): number {
    return typeof size !== 'number' ? 32 : size;
  }
}
