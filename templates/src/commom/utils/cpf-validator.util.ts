export class CpfValidatorUtil {
  private static match(number: string, onlyNumbers?: boolean): boolean {
    if (!number) return false;
    return onlyNumbers
      ? !!number.match(/^\d{11}$/)
      : !!number.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  }

  private static verifierDigit(digits: string): number {
    const numbers: number[] = digits.split('').map((number) => {
      return Number.parseInt(number, 10);
    });

    const modulus: number = numbers.length + 1;
    const multiplied: number[] = numbers.map(
      (number, index) => number * (modulus - index),
    );
    const mod: number =
      multiplied.reduce((buffer, number) => buffer + number) % 11;

    return mod < 2 ? 0 : 11 - mod;
  }

  static isValid(number: string, onlyNumbers?: boolean): boolean {
    if (!this.match(number, onlyNumbers)) return false;

    const stripped = number.replace(/[^\d]/g, '');

    const blacklist = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999',
      '12345678909',
    ];
    if (blacklist.includes(stripped)) return false;

    let numbers = stripped.substr(0, 9);
    numbers += this.verifierDigit(numbers);
    numbers += this.verifierDigit(numbers);

    return numbers.substr(-2) === stripped.substr(-2);
  }
}
