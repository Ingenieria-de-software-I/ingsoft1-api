import { MailerClient } from '../app/mail/types';

export class MailerClientStub implements MailerClient {
    sendMail: MailerClient['sendMail'] = async () => {
        throw new Error(
            `No behaviour defined for ${this.constructor.name}.sendMail.`,
        );
    };

    changeBehaviour(newBehaviour: MailerClient['sendMail']) {
        this.sendMail = newBehaviour;
    }
}
