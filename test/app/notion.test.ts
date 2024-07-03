import { Client } from '@notionhq/client';
import { assert } from 'console';

import { getContentFromBlock } from '../../app/persistance/notion/blocks';
import { NotionRepositoryFactory } from '../../app/production/notion-repository-factory';
import * as constants from '../constants';
import { createTestSuite } from '../utils';

const [test, xtest] = createTestSuite('Notion');

let client: Client;
let block_id: string;

test.before(() => {
    client = new Client({ auth: constants.TEST_NOTION_TOKEN });
    block_id = constants.TEST_NOTION_BLOCK_ID;
});

test('Get page content', async () => {
    const content = await getContentFromBlock(client, block_id);
    assert(content.trim().length > 0);
});

test('Test Real Repository', async () => {
    const repositoryFactory = new NotionRepositoryFactory();
    const repository = repositoryFactory.forExercise({
        notion: {
            token: constants.TEST_NOTION_TOKEN,
            db_ejercicio: constants.TEST_NOTION_EXERCISE,
            db_docente: constants.TEST_NOTION_TEACHER,
            db_devolucion: constants.TEST_NOTION_EXERCISE_FEEDBACK,
        },
    });
    const assignments = [
        {
            nombre: 'Grupo 1',
            ejercicio: 'Números',
            docentes: ['Borja'],
        },
    ];
    const e = await repository.getExercisesFrom(assignments);
    const t = await repository.getTeachersFrom(assignments);
    const f = await repository.getFeedbacksFrom(e);
    const c = await repository.createFeedbacks([
        {
            nombre: 'Grupo X',
            id_docentes: t.map((x) => x.id),
            id_ejercicio: e.map((x) => x.id)[0],
        },
    ]);
    const u = await repository.updateFeedbacks([
        {
            ...c[0],
            nombre: 'Grupo XX',
        },
    ]);
});
