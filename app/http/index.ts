import { sendMailNotaEjercicio, sendMailNotaExamen } from '../mail';
import { MailNotaEjercicio, MailNotaExamen } from '../types';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

type Handler<T> = (params: Partial<T>) => Promise<HttpResponse>;

export const sendMailNotaEjercicioHandler: Handler<MailNotaEjercicio> = async (
    params,
) => {
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
        await sendMailNotaEjercicio(context, to);
    } catch (error) {
        return HttpResponse.error(String(error));
    }

    return HttpResponse.ok(`Correo enviado a ${to}`);
};

export const sendMailNotaExamenHandler: Handler<MailNotaExamen> = async (
    params,
) => {
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
        await sendMailNotaExamen(context, to);
    } catch (error) {
        return HttpResponse.error(String(error));
    }

    return HttpResponse.ok(`Correo enviado a ${to}`);
};

export const testHandler: Handler<unknown> = async (params) => {
    return HttpResponse.ok('OK');
};
