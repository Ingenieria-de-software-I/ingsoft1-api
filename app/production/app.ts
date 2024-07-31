import { Api } from '../rest/api';
import { Assigner } from '../services/assigner';
import { Mailer } from '../services/mailer';
import { NoMailerClient } from './no-mailer-client';
import { NotionRepositoryFactory } from './notion-repository-factory';

const mailer = new Mailer(new NoMailerClient());
const assigner = new Assigner(new NotionRepositoryFactory());

export const api = new Api({ mailer, assigner });
