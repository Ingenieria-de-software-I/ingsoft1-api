import { Assigner } from '../system/assigner';
import { Mailer } from '../system/mailer';
import { Api } from '../interface/api';
import * as constants from './constants';
import { RealMailerClient } from './mailer-client';
import { RealRepositoryFactory } from './repository-factory';

const mailer = new Mailer(
    new RealMailerClient({
        user: constants.USER_EMAIL,
        clientId: constants.CLIENT_ID,
        clientSecret: constants.CLIENT_SECRET,
        refreshToken: constants.REFRESH_TOKEN,
    }),
    constants.REPLY_TO,
);
const assigner = new Assigner(new RealRepositoryFactory());

export const api = new Api({ mailer, assigner });
