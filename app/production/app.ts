import { Assigner } from '../feedbacks/assigner';
import { Mailer } from '../feedbacks/mailer';
import { Api } from '../interfaces/api';
import { RealAssignerRepositoryFactory } from './assigner-repository-factory';
import { RealMailerClient } from './mailer-client';

const mailer = new Mailer(
    new RealMailerClient({
        user: process.env.USER_EMAIL!,
        clientId: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        refreshToken: process.env.REFRESH_TOKEN!,
    }),
    'fiuba-ingsoft1-doc@googlegroups.com',
);
const assigner = new Assigner(new RealAssignerRepositoryFactory());

export const api = new Api({ mailer, assigner });
