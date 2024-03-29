import { MailerClient } from '../../app/feedbacks/mailer';

export class MailerClientStub implements MailerClient {
    sendMail: MailerClient['sendMail'] = async () => {
        throw new Error(
            `No behaviour defined for ${this.constructor.name}.${this.sendMail.name}.`,
        );
    };

    changeBehaviour(newBehaviour: MailerClient['sendMail']) {
        this.sendMail = newBehaviour;
    }
}
