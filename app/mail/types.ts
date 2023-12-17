import { Options } from '../types';

export interface MailerClient {
    sendMail(to: string, options: Options): Promise<void>;
}
