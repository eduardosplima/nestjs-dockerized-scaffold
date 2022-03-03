export class CnpjValidatorUtil {
  private static match(number: string, onlyNumbers?: boolean): boolean {
    if (!number) return false;
    return onlyNumbers
      ? !!number.match(/^\d{14}$/)
      : !!number.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
  }

  private static verifierDigit(digits: string): number {
    let index = 2;
    const reverse: number[] = digits.split('').reduce((buffer, number) => {
      return [Number.parseInt(number, 10)].concat(buffer);
    }, []);

    const sum: number = reverse.reduce((buffer, number) => {
      const acc = buffer + number * index;
      index = index === 9 ? 2 : index + 1;
      return acc;
    }, 0);

    const mod: number = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  }

  static isValid(number: string, onlyNumbers?: boolean): boolean {
    if (!this.match(number, onlyNumbers)) return false;

    const stripped = number.replace(/[^\d]/g, '');

    const blacklist: string[] = [
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999',
    ];
    if (blacklist.includes(stripped)) return false;

    let numbers: string = stripped.substr(0, 12);
    numbers += this.verifierDigit(numbers);
    numbers += this.verifierDigit(numbers);

    return numbers.substr(-2) === stripped.substr(-2);
  }
}
