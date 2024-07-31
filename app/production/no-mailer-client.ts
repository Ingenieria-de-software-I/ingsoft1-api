import { MailerClient, Options } from '../services/mailer';

export class NoMailerClient implements MailerClient {
    async sendMail(to: string, options: Options) {
        return JSON.stringify({ to, options });
    }
}
