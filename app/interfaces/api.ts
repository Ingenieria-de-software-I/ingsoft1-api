import { Client } from '@notionhq/client';
import axios from 'axios';

import { Assigner, Assignment, Config } from '../feedbacks/assigner';
import { Mailer } from '../feedbacks/mailer';
import { MailExamFeedback, MailExerciseFeedback } from '../feedbacks/mailer';
import { getContentFromBlock } from '../persistance/notion/blocks';
import { Request } from './request';
import { Response } from './response';

type Handler = (params: unknown) => Promise<Response>;

export class Api {
    constructor(
        private _services: {
            mailer: Mailer;
            assigner: Assigner;
        },
    ) {}

    sendExerciseFeedbackHandler: Handler = async (params) => {
        try {
            const request = new Request(params);
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
            return Response.badRequest(String(error));
        }

        try {
            await this._services.mailer.sendExerciseFeedback(context, to);
        } catch (error) {
            return Response.error(String(error));
        }

        return Response.ok(`Correo enviado a ${to}`);
    };

    sendExamFeedbackHandler: Handler = async (params) => {
        try {
            const request = new Request(params);
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
            return Response.badRequest(String(error));
        }

        try {
            await this._services.mailer.sendExamFeedback(context, to);
        } catch (error) {
            return Response.error(String(error));
        }

        return Response.ok(`Correo enviado a ${to}`);
    };

    assignExerciseHandler: Handler = async (params) => {
        try {
            var { config, asignaciones } = this._parseAssignRequest(params);
        } catch (error) {
            return Response.badRequest(String(error));
        }

        try {
            await this._services.assigner.assignExercise(config, asignaciones);
        } catch (error) {
            return Response.error(String(error));
        }

        return Response.ok(`Fin asignación de ejercicio`);
    };

    assignExamHandler: Handler = async (params) => {
        try {
            var { config, asignaciones } = this._parseAssignRequest(params);
        } catch (error) {
            return Response.badRequest(String(error));
        }

        try {
            await this._services.assigner.assignExercise(config, asignaciones);
        } catch (error) {
            return Response.error(String(error));
        }

        return Response.ok(`Fin asignación de examen`);
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
        return Response.ok(emails);
    };

    getContentFromPageHandler: Handler = async (params) => {
        try {
            const request = new Request(params);
            var token = request.parseString('notion.token');
            var blockId = request.parseString('page_id');
        } catch (error) {
            return Response.badRequest(String(error));
        }
        try {
            var content = await getContentFromBlock(
                new Client({ auth: token }),
                blockId,
            );
        } catch (error) {
            return Response.error(String(error));
        }
        return Response.ok(content);
    };

    testHandler: Handler = async () => {
        return Response.ok('OK');
    };

    private _parseAssignRequest(params: unknown) {
        const request = new Request(params);
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
