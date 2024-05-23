import { SENDGRID_SERVICE } from '~/infrastructure/mail/config/constants';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';

export const sendgridProviders = [
    {
        provide: SENDGRID_SERVICE,
        useFactory: (config: ConfigService): MailService => {
            const mail = new MailService();
            mail.setApiKey(config.get('MAIL_API_KEY') as string);
            mail.setTimeout(2000);
            return mail;
        },
        inject: [ConfigService],
    },
];
