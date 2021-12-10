import { createTransport } from 'nodemailer';
import type { SendMailOptions, Transporter } from 'nodemailer';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { LoggerService } from '../logger/logger.service';
import emailConfig from './config/email.config';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(
    @Inject(emailConfig.KEY)
    config: ConfigType<typeof emailConfig>,
    private readonly logger: LoggerService,
  ) {
    logger.setContext(EmailService.name);
    this.transporter = createTransport(config.options);
  }

  async sendMail(mail: SendMailOptions): Promise<void> {
    await this.transporter.verify();
    const info = await this.transporter.sendMail(mail);
    this.logger.debug({
      subject: mail.subject,
      ...info,
    });
  }
}
