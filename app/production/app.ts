import { Api } from '../interface/api';
import { Assigner } from '../system/assigner';
import { Mailer } from '../system/mailer';
import { NoMailerClient } from './no-mailer-client';
import { NotionRepositoryFactory } from './notion-repository-factory';

const mailer = new Mailer(new NoMailerClient());
const assigner = new Assigner(new NotionRepositoryFactory());

export const api = new Api({ mailer, assigner });
