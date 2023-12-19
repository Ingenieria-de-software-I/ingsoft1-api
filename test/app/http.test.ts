import { HttpApi } from '../../app/http/HttpApi';
import { HttpRequest } from '../../app/http/HttpRequest';
import { HttpResponse } from '../../app/http/HttpResponse';
import { MailerApi } from '../../app/mail/MailerApi';
import { MailerClientStub } from '../stubs';
import { assert, createTestSuite } from '../utils';

const [test, xtest] = createTestSuite('HTTP');

let api: HttpApi;
let mailerClientStub: MailerClientStub;

test.before(() => {
    mailerClientStub = new MailerClientStub();
    api = new HttpApi(new MailerApi(mailerClientStub));
});

const _assertCode = (res: HttpResponse, c: number) => assert.equal(res.code, c);
const _assertBadResponse = (res: HttpResponse) => _assertCode(res, 400);
const _assertErrorResponse = (res: HttpResponse) => _assertCode(res, 500);
const _assertOkResponse = (res: HttpResponse) => _assertCode(res, 200);

test('Parse request', () => {
    const params = {
        prueba: 'exito',
        data: {
            message: 'hi!',
        },
    };
    const request = new HttpRequest({ ...params });

    // Simple
    assert.equal(request.parseString('prueba'), 'exito');

    // Nested
    assert.equal(request.parseString('data.message'), 'hi!');

    // Missing
    const missingProperty = 'data.message_missing';
    assert.throws(() => request.parseString(missingProperty), {
        message: HttpRequest.missingPropertyErrorMessage(
            missingProperty,
            JSON.stringify(params),
        ),
    });

    const anotherMissingProperty = 'data_missing.message';
    assert.throws(() => request.parseString(anotherMissingProperty), {
        message: HttpRequest.missingPropertyErrorMessage(
            anotherMissingProperty,
            JSON.stringify(params),
        ),
    });
});

test('Send mail exercise feedback', async () => {
    const badResponse = await api.sendMailExerciseFeedbackHandler({});
    _assertBadResponse(badResponse);

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

    const errorResponse = await api.sendMailExerciseFeedbackHandler({
        ...params,
    });
    _assertErrorResponse(errorResponse);

    mailerClientStub.changeBehaviour(async () => {});
    const okResponse = await api.sendMailExerciseFeedbackHandler({ ...params });
    _assertOkResponse(okResponse);
});

test('Send mail exam feedback', async () => {
    const badResponse = await api.sendMailExamFeedbackHandler({});
    _assertBadResponse(badResponse);

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

    const errorResponse = await api.sendMailExamFeedbackHandler({ ...params });
    _assertErrorResponse(errorResponse);

    mailerClientStub.changeBehaviour(async () => {});
    const okResponse = await api.sendMailExamFeedbackHandler({ ...params });
    _assertOkResponse(okResponse);
});

test("Get teachers' emails", async () => {
    const okResponse = await api.getTeachersEmailsHandler({});
    _assertOkResponse(okResponse);
});

test('Assign exercise', async () => {
    const badResponse = await api.assignExerciseHandler({});
    _assertBadResponse(badResponse);

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
    _assertErrorResponse(errorResponse);

    const okResponse = await api.assignExerciseHandler({ ...params });
    // _assertOkResponse(okResponse);
});

test('Assign exam', async () => {
    const badResponse = await api.assignExamHandler({});
    _assertBadResponse(badResponse);

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
            nombre: 'grupo 1',
        },
    ];
    const params = { config, asignaciones };

    const errorResponse = await api.assignExerciseHandler({ ...params });
    _assertErrorResponse(errorResponse);

    const okResponse = await api.assignExerciseHandler({ ...params });
    // _assertOkResponse(okResponse);
});
