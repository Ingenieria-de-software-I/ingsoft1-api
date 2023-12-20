import axios from 'axios';

import { Assigner } from '../assigment/Assigner';
import { Assignment, Config } from '../assigment/types';
import { Mailer } from '../mail/Mailer';
import { MailExamFeedback, MailExerciseFeedback } from '../mail/types';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

type Handler = (params: unknown) => Promise<HttpResponse>;

export class HttpApi {
    constructor(
        private _services: {
            mailer: Mailer;
            assigner: Assigner;
        },
    ) {}

    sendExerciseFeedbackHandler: Handler = async (params) => {
        try {
            const request = new HttpRequest(params);
            var { to, context }: MailExerciseFeedback = {
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
            await this._services.mailer.sendExerciseFeedback(context, to);
        } catch (error) {
            return HttpResponse.error(String(error));
        }

        return HttpResponse.ok(`Correo enviado a ${to}`);
    };

    sendExamFeedbackHandler: Handler = async (params) => {
        try {
            const request = new HttpRequest(params);
            var { to, context }: MailExamFeedback = {
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
            await this._services.mailer.sendExamFeedback(context, to);
        } catch (error) {
            return HttpResponse.error(String(error));
        }

        return HttpResponse.ok(`Correo enviado a ${to}`);
    };

    assignExerciseHandler: Handler = async (params) => {
        try {
            var { config, asignaciones } = this._parseAssignRequest(params);
        } catch (error) {
            return HttpResponse.badRequest(String(error));
        }

        try {
            await this._services.assigner.assignExercise(config, asignaciones);
        } catch (error) {
            return HttpResponse.error(String(error));
        }

        return HttpResponse.ok(`Fin asignación de ejercicio`);
    };

    assignExamHandler: Handler = async (params) => {
        try {
            var { config, asignaciones } = this._parseAssignRequest(params);
        } catch (error) {
            return HttpResponse.badRequest(String(error));
        }

        try {
            await this._services.assigner.assignExercise(config, asignaciones);
        } catch (error) {
            return HttpResponse.error(String(error));
        }

        return HttpResponse.ok(`Fin asignación de examen`);
    };

    getTeachersEmailsHandler: Handler = async () => {
        const source =
            'https://raw.githubusercontent.com/Ingenieria-de-software-I/ingenieria-de-software-i.github.io/main/_data/docentes.json';

        const results: Array<{ email?: string }> = await axios
            .get(source, {})
            .then((res) => res.data);
        const emails = results
            .map((d) => d.email)
            .filter(Boolean)
            .join(', ');
        return HttpResponse.ok(emails);
    };

    testHandler: Handler = async () => {
        return HttpResponse.ok('OK');
    };

    private _parseAssignRequest(params: unknown) {
        const request = new HttpRequest(params);
        var config: Config = {
            notion: {
                token: request.parseString('config.notion.token'),
                db_devolucion: request.parseString(
                    'config.notion.db_devolucion',
                ),
                db_docente: request.parseString('config.notion.db_docente'),
                db_ejercicio: request.parseString('config.notion.db_ejercicio'),
            },
        };
        var asignaciones: Assignment[] = request.map('asignaciones', (req) => ({
            docentes: req.map('docentes', (req) =>
                req.parseString('toString()'),
            ),
            ejercicio: req.parseString('ejercicio'),
            nombre: req.parseString('nombre'),
        }));
        return { config, asignaciones };
    }
}
