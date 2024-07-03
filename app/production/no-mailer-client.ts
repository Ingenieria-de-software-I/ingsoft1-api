import { MailerClient, Options } from '../system/mailer';

export class NoMailerClient implements MailerClient {
    async sendMail(to: string, options: Options) {
        return JSON.stringify({ to, options });
    }
}
