import { MailerClient, Options } from '../services/mailer.js';

export class NoMailerClient implements MailerClient {
    async sendMail(to: string, options: Options) {
        return JSON.stringify({ to, options });
    }
}
