import { sendMail } from '../app/mail';
import { createTestSuite } from './utils';

const [test, xtest] = createTestSuite('My app');

test.before(() => {});
test.after(() => {});

test('Send a simple mail', async () => {
    const emailAddress = process.env.USER_EMAIL!;
    const mailInfo = await sendMail(emailAddress, emailAddress);
});
