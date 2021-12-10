import type { TransportOptions } from 'nodemailer';
import type JSONTransport from 'nodemailer/lib/json-transport';
import type SendmailTransport from 'nodemailer/lib/sendmail-transport';
import type SESTransport from 'nodemailer/lib/ses-transport';
import type SMTPPool from 'nodemailer/lib/smtp-pool';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type StreamTransport from 'nodemailer/lib/stream-transport';

import { registerAs } from '@nestjs/config';

export default registerAs('core-email-config', () => ({
  options: JSON.parse(process.env.EMAIL_CONFIGURATION) as
    | SMTPTransport.Options
    | SMTPPool.Options
    | SendmailTransport.Options
    | StreamTransport.Options
    | JSONTransport.Options
    | SESTransport.Options
    | TransportOptions,
}));
