import { NoMailerClient } from '../../app/production/no-mailer-client.js';
import { ApiResponse } from '../../app/rest/api-action.js';
import { Api } from '../../app/rest/api.js';
import { Assigner } from '../../app/services/assigner.js';
import { Mailer } from '../../app/services/mailer.js';
import { PageExtractor } from '../../app/services/page-extrator.js';
import * as constants from '../constants.js';
import { MailerClientStub } from '../helpers/mailer-client-stub.js';
import { RepositoryFactoryStub } from '../helpers/repository-factory-stub.js';
import { assert, createTestSuite } from '../utils.js';

const [test, xtest] = createTestSuite('Api');

let api: Api;
let mailerClientStub: MailerClientStub;
let repositoryFactory: RepositoryFactoryStub;

test.before(() => {
    mailerClientStub = new MailerClientStub();
    repositoryFactory = new RepositoryFactoryStub();
    api = new Api({
        mailer: new Mailer(mailerClientStub),
        assigner: new Assigner(repositoryFactory),
        extractor: new PageExtractor(),
    });
});

function fixRepositoryFactory() {
    repositoryFactory.changeBehaviour({
        getExercisesFrom(_assigments) {
            return Promise.resolve([]);
        },
        getTeachersFrom(_assignments) {
            return Promise.resolve([]);
        },
        getFeedbacksFrom(_exercises) {
            return Promise.resolve([]);
        },
        createFeedbacks(_feedbacks) {
            return Promise.resolve([]);
        },
        updateFeedbacks(_feedbacks) {
            return Promise.resolve([]);
        },
    });
}

const assertCode = (res: ApiResponse, c: number) => assert.equal(res.code, c);
const assertBadResponse = (res: ApiResponse) => assertCode(res, 400);
const assertErrorResponse = (res: ApiResponse) => assertCode(res, 500);
const assertOkResponse = (res: ApiResponse) => assertCode(res, 200);

test("Get teachers' emails", async () => {
    const okResponse = await api.getTeachersEmails.handle({});
    assertOkResponse(okResponse);
    assert(okResponse.content.length > 0);
});

test('Assign exercise', async () => {
    const badResponse = await api.assignExercise.handle({});
    assertBadResponse(badResponse);

    const config = {
        notion: {
            token: 'notion.token',
            db_devolucion: 'notion.db_devolucion',
            db_docente: 'notion.db_docente',
            db_ejercicio: 'notion.db_ejercicio',
        },
    };
    const asignaciones = [
        {
            docentes: ['docente 1', 'docente 2'],
            ejercicio: 'ejercicio 1',
            nombre: 'grupo 1',
        },
    ];
    const body = { config, asignaciones };
    const errorResponse = await api.assignExercise.handle({ body });
    assertErrorResponse(errorResponse);

    fixRepositoryFactory();
    const okResponse = await api.assignExercise.handle({ body });
    assertOkResponse(okResponse);
});

test('Assign exam', async () => {
    const badResponse = await api.assignExam.handle({});
    assertBadResponse(badResponse);

    const config = {
        notion: {
            token: 'notion.token',
            db_devolucion: 'notion.db_devolucion',
            db_docente: 'notion.db_docente',
            db_ejercicio: 'notion.db_ejercicio',
        },
    };
    const asignaciones = [
        {
            docentes: ['docente 1', 'docente 2'],
            ejercicio: 'examen 1',
            nombre: 'estudiante 1',
        },
    ];
    const body = { config, asignaciones };
    const errorResponse = await api.assignExam.handle({ body });
    assertErrorResponse(errorResponse);

    fixRepositoryFactory();
    const okResponse = await api.assignExam.handle({ body });
    assertOkResponse(okResponse);
});

test('Get exercise feedbacks', async () => {
    const badResponse = await api.getExerciseFeedbacks.handle({});
    assertBadResponse(badResponse);

    const config = {
        notion: {
            token: 'notion.token',
            db_devolucion: 'notion.db_devolucion',
            db_docente: 'notion.db_docente',
            db_ejercicio: 'notion.db_ejercicio',
        },
    };
    const ejercicio = 'ejercicio 1';
    const body = { config, ejercicio };
    const errorResponse = await api.getExerciseFeedbacks.handle({ body });
    assertErrorResponse(errorResponse);

    repositoryFactory.changeBehaviour({
        getExercisesFrom(_assigments) {
            return Promise.resolve([{ id: '1', nombre: ejercicio }]);
        },
        getFeedbacksFrom(_exercises) {
            return Promise.resolve([
                {
                    id: '1',
                    nombre: 'grupo 1',
                    id_ejercicio: '1',
                    id_docentes: [],
                },
            ]);
        },
    });
    const okResponse = await api.getExerciseFeedbacks.handle({ body });
    assertOkResponse(okResponse);
});

test('Get exam feedbacks', async () => {
    const badResponse = await api.getExamFeedbacks.handle({});
    assertBadResponse(badResponse);

    const config = {
        notion: {
            token: 'notion.token',
            db_devolucion: 'notion.db_devolucion',
            db_docente: 'notion.db_docente',
            db_ejercicio: 'notion.db_ejercicio',
        },
    };
    const ejercicio = 'examen 1';
    const body = { config, ejercicio };
    const errorResponse = await api.getExamFeedbacks.handle({ body });
    assertErrorResponse(errorResponse);

    repositoryFactory.changeBehaviour({
        getExercisesFrom(_assigments) {
            return Promise.resolve([{ id: '1', nombre: ejercicio }]);
        },
        getFeedbacksFrom(_exercises) {
            return Promise.resolve([
                {
                    id: '1',
                    nombre: 'alumno 1',
                    id_ejercicio: '1',
                    id_docentes: [],
                },
            ]);
        },
    });
    const okResponse = await api.getExamFeedbacks.handle({ body });
    assertOkResponse(okResponse);
});

xtest('Get content from page', async () => {
    const response = await api.getContentFromPage.handle({
        body: {
            notion: {
                token: constants.TEST_NOTION_TOKEN,
            },
            page_id: constants.TEST_NOTION_BLOCK_ID,
        },
    });
    assertOkResponse(response);
    assert(response.content.length > 0);
});

test('Send exercise feedback', async () => {
    const badResponse = await api.sendExerciseFeedback.handle({});
    assertBadResponse(badResponse);

    const body = {
        to: 'to',
        context: {
            ejercicio: 'context.ejercicio',
            grupo: 'context.grupo',
            corrector: 'context.corrector',
            nota: 'context.nota',
            correcciones: 'context.correcciones',
        },
    };

    const errorResponse = await api.sendExerciseFeedback.handle({ body });
    assertErrorResponse(errorResponse);

    mailerClientStub.changeBehaviour(async () => 'ok');
    const okResponse = await api.sendExerciseFeedback.handle({ body });
    assertOkResponse(okResponse);
});

test('Send exam feedback', async () => {
    const badResponse = await api.sendExamFeedback.handle({});
    assertBadResponse(badResponse);

    const body = {
        to: 'to',
        context: {
            examen: 'context.examen',
            padron: 'context.padron',
            nombre: 'context.nombre',
            corrector: 'context.corrector',
            nota: 'context.nota',
            correcciones: 'context.correcciones',
            nota_final: 'context.nota_final',
            puntos_extras: 'context.puntos_extras',
        },
    };
    const errorResponse = await api.sendExamFeedback.handle({ body });
    assertErrorResponse(errorResponse);

    mailerClientStub.changeBehaviour(async () => 'ok');
    const okResponse = await api.sendExamFeedback.handle({ body });
    assertOkResponse(okResponse);
});

test('Send summary feedbacks', async () => {
    const body = {
        to: 'bg@fi.uba.ar',
        context: {
            curso: 'Ingeniería de Software I',
            padron: 69,
            estudiante: 'Garibotti, Borja',
            ejercicios: [
                { nombre: 'Combatientes Fantásticos', nota: 7 },
                { nombre: 'Números', nota: 10 },
                { nombre: 'Mars rover', nota: 6 },
                { nombre: 'Servicios Financieros', nota: 10 },
            ],
            promedio_ejercicios: 8.25,
            parcial: 6,
            primer_recu: '',
            segundo_recu: '',
            parcial_final: 6,
            promedio_ej_y_parcial: 7.125,
            tp_integrador: 7,
            punto_extra_papers: 0.5,
            punto_adicional: 0.5,
            nota_cursada: 8,
            nota_cursada_final: 8,
            condicion_final: 'Promociona',
            fecha_finales: [
                'Viernes 12 de Julio, a las 17.00',
                'Martes 16 de Julio, a las 18.00',
                'Martes 23 de Julio, a las 18.00',
                'Martes 30 de Julio, a las 18.00',
            ],
            fecha_final_promociones: 'Viernes 12 de Julio, a las 17.00',
        },
    };
    const mailerClient = new NoMailerClient();
    mailerClientStub.changeBehaviour(mailerClient.sendMail);
    const okResponse = await api.sendSummaryFeedback.handle({ body });
    assertOkResponse(okResponse);
    assert(okResponse.content.length > 0);
});
