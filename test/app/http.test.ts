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

test('Send mail nota ejercicio', async () => {
    const badResponse = await api.sendMailNotaEjercicioHandler({});
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

    const errorResponse = await api.sendMailNotaEjercicioHandler({ ...params });
    _assertErrorResponse(errorResponse);

    mailerClientStub.changeBehaviour(async () => {});
    const okResponse = await api.sendMailNotaEjercicioHandler({ ...params });
    _assertOkResponse(okResponse);
});

test('Send mail nota examen', async () => {
    const badResponse = await api.sendMailNotaExamenHandler({});
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

    const errorResponse = await api.sendMailNotaExamenHandler({ ...params });
    _assertErrorResponse(errorResponse);

    mailerClientStub.changeBehaviour(async () => {});
    const okResponse = await api.sendMailNotaExamenHandler({ ...params });
    _assertOkResponse(okResponse);
});
