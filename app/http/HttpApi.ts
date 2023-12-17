import { MailerApi } from '../mail/MailerApi';
import { MailNotaEjercicio, MailNotaExamen } from '../types';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

type Handler = (params: unknown) => Promise<HttpResponse>;

export class HttpApi {
    constructor(private _mailer: MailerApi) {}

    sendMailNotaEjercicioHandler: Handler = async (params) => {
        try {
            const request = new HttpRequest(params);
            var { to, context }: MailNotaEjercicio = {
                to: request.parseString('to'),
                context: {
                    ejercicio: request.parseString('context.ejercicio'),
                    grupo: request.parseString('context.grupo'),
                    corrector: request.parseString('context.corrector'),
                    nota: request.parseString('context.nota'),
                    correcciones: request.parseString('context.correcciones'),
                },
            };
        } catch (error) {
            return HttpResponse.badRequest(String(error));
        }

        try {
            await this._mailer.sendMailNotaEjercicio(context, to);
        } catch (error) {
            return HttpResponse.error(String(error));
        }

        return HttpResponse.ok(`Correo enviado a ${to}`);
    };

    sendMailNotaExamenHandler: Handler = async (params) => {
        try {
            const request = new HttpRequest(params);
            var { to, context }: MailNotaExamen = {
                to: request.parseString('to'),
                context: {
                    examen: request.parseString('context.examen'),
                    padron: request.parseString('context.padron'),
                    nombre: request.parseString('context.nombre'),
                    corrector: request.parseString('context.corrector'),
                    nota: request.parseString('context.nota'),
                    correcciones: request.parseString('context.correcciones'),
                    nota_final: request.parseString('context.nota_final'),
                    puntos_extras: request.parseString('context.puntos_extras'),
                },
            };
        } catch (error) {
            return HttpResponse.badRequest(String(error));
        }

        try {
            await this._mailer.sendMailNotaExamen(context, to);
        } catch (error) {
            return HttpResponse.error(String(error));
        }

        return HttpResponse.ok(`Correo enviado a ${to}`);
    };

    testHandler: Handler = async () => {
        return HttpResponse.ok('OK');
    };
}
