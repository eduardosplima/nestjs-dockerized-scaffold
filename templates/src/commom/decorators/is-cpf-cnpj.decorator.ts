import { ValidationOptions, registerDecorator } from 'class-validator';

import { CnpjValidatorUtil } from '../utils/cnpj-validator.util';
import { CpfValidatorUtil } from '../utils/cpf-validator.util';

export function IsCpfCnpj({
  type,
  onlyNumbers,
  validationOptions,
}: {
  type: 'cpf' | 'cnpj' | 'cpf/cnpj';
  onlyNumbers?: boolean;
  validationOptions?: ValidationOptions;
}) {
  return function processDecorator(
    object: InstanceType<typeof Object>,
    propertyName: string,
  ): void {
    let options: ValidationOptions = {
      message: `$property must be ${type}`,
    };

    if (!validationOptions) {
      options = { ...options, ...validationOptions };
    }

    registerDecorator({
      name: 'isCpfCnpj',
      target: object.constructor,
      propertyName,
      constraints: [],
      options,
      validator: {
        validate(value: unknown): boolean {
          const cpfCnpj = `${value}`;
          switch (type) {
            case 'cpf':
              return CpfValidatorUtil.isValid(cpfCnpj, onlyNumbers);
            case 'cnpj':
              return CnpjValidatorUtil.isValid(cpfCnpj, onlyNumbers);
            default:
              return (
                CpfValidatorUtil.isValid(cpfCnpj, onlyNumbers) ||
                CnpjValidatorUtil.isValid(cpfCnpj, onlyNumbers)
              );
          }
        },
      },
    });
  };
}
