import { Client } from '@notionhq/client';

import { NotionRepositoryFactory } from '../../app/production/notion-repository-factory.js';
import * as constants from '../constants.js';
import { createTestSuite } from '../utils.js';

const [test, xtest] = createTestSuite('Notion');

let client: Client;

test.before(() => {
    client = new Client({ auth: constants.TEST_NOTION_TOKEN });
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
