import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { CnpjValidatorUtil } from '../utils/cnpj-validator.util';

@Injectable()
export class ParseCnpjPipe implements PipeTransform<string, string> {
  // eslint-disable-next-line class-methods-use-this
  transform(value: string): string {
    if (CnpjValidatorUtil.isValid(value, true)) return value;
    throw new BadRequestException('Invalid CNPJ');
  }
}
