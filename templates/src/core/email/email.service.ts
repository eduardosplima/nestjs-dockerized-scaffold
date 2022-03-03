import { createTransport } from 'nodemailer';
import type { SendMailOptions, Transporter } from 'nodemailer';

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import emailConfig from './config/email.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly transporter: Transporter;

  constructor(
    @Inject(emailConfig.KEY)
    config: ConfigType<typeof emailConfig>,
  ) {
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
