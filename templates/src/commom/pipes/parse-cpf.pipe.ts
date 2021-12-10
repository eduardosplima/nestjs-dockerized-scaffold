import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { CpfValidatorUtil } from '../utils/cpf-validator.util';

@Injectable()
export class ParseCpfPipe implements PipeTransform<string, string> {
  // eslint-disable-next-line class-methods-use-this
  transform(value: string): string {
    if (CpfValidatorUtil.isValid(value, true)) return value;
    throw new BadRequestException('Invalid CPF');
  }
}
