import { Api } from '../rest-api/api.js';
import { Assigner } from '../services/assigner.js';
import { Mailer } from '../services/mailer.js';
import { PageExtractor } from '../services/page-extrator.js';
import { NoMailerClient } from './no-mailer-client.js';
import { NotionRepositoryFactory } from './notion-repository-factory.js';

export const api = new Api({
    assigner: new Assigner(new NotionRepositoryFactory()),
    extractor: new PageExtractor(),
    mailer: new Mailer(new NoMailerClient()),
});
