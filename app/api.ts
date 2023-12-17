import { HttpApi } from './http/HttpApi';
import { MailerApi } from './mail/MailerApi';
import { RealMailer } from './mail/RealMailer';

const mailer = new MailerApi(
    new RealMailer({
        user: process.env.USER_EMAIL!,
        clientId: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        refreshToken: process.env.REFRESH_TOKEN!,
    }),
    'fiuba-ingsoft1-doc@googlegroups.com',
);
export const api = new HttpApi(mailer);
