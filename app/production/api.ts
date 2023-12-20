import { Assigner } from '../assigment/Assigner';
import { HttpApi } from '../http/HttpApi';
import { Mailer } from '../mail/Mailer';
import { RealAssignerRepositoryFactory } from './RealAssignerRepositoryFactory';
import { RealMailer } from './RealMailerClient';

const mailer = new Mailer(
    new RealMailer({
        user: process.env.USER_EMAIL!,
        clientId: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        refreshToken: process.env.REFRESH_TOKEN!,
    }),
    'fiuba-ingsoft1-doc@googlegroups.com',
);
const assigner = new Assigner(new RealAssignerRepositoryFactory());

export const api = new HttpApi({ mailer, assigner });
