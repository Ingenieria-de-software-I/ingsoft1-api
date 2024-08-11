import { NoMailerClient } from '../../app/production/no-mailer-client.js';
import { Api } from '../../app/rest/api.js';
import { Request } from '../../app/rest/request.js';
import { Response } from '../../app/rest/response.js';
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

const assertCode = (res: Response, c: number) => assert.equal(res.code, c);
const assertBadResponse = (res: Response) => assertCode(res, 400);
const assertErrorResponse = (res: Response) => assertCode(res, 500);
const assertOkResponse = (res: Response) => assertCode(res, 200);

test('Parse request', () => {
    const params = {
        prueba: 'exito',
        data: {
            message: 'hi!',
        },
    };
    const request = new Request({ ...params });

    // Simple
    assert.equal(request.parseString('prueba'), 'exito');

    // Nested
    assert.equal(request.parseString('data.message'), 'hi!');

    // Missing
    const missingProperty = 'data.message_missing';
    assert.throws(() => request.parseString(missingProperty), {
        message: Request.missingPropertyErrorMessage(
            missingProperty,
            JSON.stringify(params),
        ),
    });

    const anotherMissingProperty = 'data_missing.message';
    assert.throws(() => request.parseString(anotherMissingProperty), {
        message: Request.missingPropertyErrorMessage(
            anotherMissingProperty,
            JSON.stringify(params),
        ),
    });
});

test('Send exercise feedback', async () => {
    const badResponse = await api.sendExerciseFeedbackHandler({});
    assertBadResponse(badResponse);

    const params = {
        to: 'to',
        context: {
            ejercicio: 'context.ejercicio',
            grupo: 'context.grupo',
            corrector: 'context.corrector',
            nota: 'context.nota',
            correcciones: 'context.correcciones',
        },
    };

    const errorResponse = await api.sendExerciseFeedbackHandler({
        ...params,
    });
    assertErrorResponse(errorResponse);

    mailerClientStub.changeBehaviour(async () => 'ok');
    const okResponse = await api.sendExerciseFeedbackHandler({ ...params });
    assertOkResponse(okResponse);
});

test('Send exam feedback', async () => {
    const badResponse = await api.sendExamFeedbackHandler({});
    assertBadResponse(badResponse);

    const params = {
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

    const errorResponse = await api.sendExamFeedbackHandler({ ...params });
    assertErrorResponse(errorResponse);

    mailerClientStub.changeBehaviour(async () => 'ok');
    const okResponse = await api.sendExamFeedbackHandler({ ...params });
    assertOkResponse(okResponse);
});

test('Assign exercise', async () => {
    const badResponse = await api.assignExerciseHandler({});
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
    const params = { config, asignaciones };

    const errorResponse = await api.assignExerciseHandler({ ...params });
    assertErrorResponse(errorResponse);

    repositoryFactory.changeBehaviour({
        getExercisesFrom(assigments) {
            return Promise.resolve([]);
        },
        getTeachersFrom(assignments) {
            return Promise.resolve([]);
        },
        getFeedbacksFrom(exercises) {
            return Promise.resolve([]);
        },
        createFeedbacks(feedbacks) {
            return Promise.resolve([]);
        },
        updateFeedbacks(feedbacks) {
            return Promise.resolve([]);
        },
    });
    const okResponse = await api.assignExerciseHandler({ ...params });
    assertOkResponse(okResponse);
});

test('Assign exam', async () => {
    const badResponse = await api.assignExamHandler({});
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
    const params = { config, asignaciones };

    const errorResponse = await api.assignExamHandler({ ...params });
    assertErrorResponse(errorResponse);

    repositoryFactory.changeBehaviour({
        getExercisesFrom(assigments) {
            return Promise.resolve([]);
        },
        getTeachersFrom(assignments) {
            return Promise.resolve([]);
        },
        getFeedbacksFrom(exercises) {
            return Promise.resolve([]);
        },
        createFeedbacks(feedbacks) {
            return Promise.resolve([]);
        },
        updateFeedbacks(feedbacks) {
            return Promise.resolve([]);
        },
    });
    const okResponse = await api.assignExamHandler({ ...params });
    assertOkResponse(okResponse);
});

test('Get exercise feedbacks', async () => {
    const badResponse = await api.getExerciseFeedbacksHandler({});
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
    const params = { config, ejercicio };
    const errorResponse = await api.getExerciseFeedbacksHandler({ ...params });
    assertErrorResponse(errorResponse);

    repositoryFactory.changeBehaviour({
        getExercisesFrom(assigments) {
            return Promise.resolve([{ id: '1', nombre: ejercicio }]);
        },
        getFeedbacksFrom(exercises) {
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
    const okResponse = await api.getExerciseFeedbacksHandler({ ...params });
    assertOkResponse(okResponse);
});

test('Get exam feedbacks', async () => {
    const badResponse = await api.getExamFeedbacksHandler({});
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
    const params = { config, ejercicio };
    const errorResponse = await api.getExamFeedbacksHandler({ ...params });
    assertErrorResponse(errorResponse);

    repositoryFactory.changeBehaviour({
        getExercisesFrom(assigments) {
            return Promise.resolve([{ id: '1', nombre: ejercicio }]);
        },
        getFeedbacksFrom(exercises) {
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
    const okResponse = await api.getExamFeedbacksHandler({ ...params });
    assertOkResponse(okResponse);
});

test('Get content from page', async () => {
    const response = await api.getContentFromPageHandler({
        notion: {
            token: constants.TEST_NOTION_TOKEN,
        },
        page_id: constants.TEST_NOTION_BLOCK_ID,
    });
    assertOkResponse(response);
    assert(response.content.length > 0);
});

test("Get teachers' emails", async () => {
    const okResponse = await api.getTeachersEmailsHandler({});
    assertOkResponse(okResponse);
    assert(okResponse.content.length > 0);
});

test("Send summary' feedbacks", async () => {
    const payload = {
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
    const okResponse = await api.sendSummaryFeedbackHandler(payload);
    assertOkResponse(okResponse);
    assert(okResponse.content.length > 0);
});
