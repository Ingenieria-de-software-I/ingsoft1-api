import { Api } from '../rest/api.js';
import { Assigner } from '../services/assigner.js';
import { Mailer } from '../services/mailer.js';
import { PageExtractor } from '../services/page-extrator.js';
import { NoMailerClient } from './no-mailer-client.js';
import { NotionRepositoryFactory } from './notion-repository-factory.js';

const mailer = new Mailer(new NoMailerClient());
const assigner = new Assigner(new NotionRepositoryFactory());
const extractor = new PageExtractor();

export const api = new Api({ mailer, assigner, extractor });
