import { Client } from '@notionhq/client';
import axios from 'axios';

import { getContentFromBlock } from '../persistance/notion/blocks';
import { Assigner, Assignment, Config } from '../system/assigner';
import { Mailer } from '../system/mailer';
import {
    MailExamFeedback,
    MailExerciseFeedback,
    MailSummaryFeedback,
} from '../system/mailer';
import handler from './handler';
import { Request } from './request';

export class Api {
    constructor(
        private _services: {
            mailer: Mailer;
            assigner: Assigner;
        },
    ) {}

    //#region handlers

    sendSummaryFeedbackHandler = handler(async (request) => {
        const { to, context }: MailSummaryFeedback = {
            to: request.parseString('to'),
            context: {
                curso: request.parseString('context.curso'),
                estudiante: request.parseString('context.estudiante'),
                padron: request.parseString('context.padron'),
                ejercicios: request.map('context.ejercicios', (req) => ({
                    nombre: req.parseString('nombre'),
                    nota: req.parseString('nota'),
                })),
                promedio_ejercicios: request.parseString(
                    'context.promedio_ejercicios',
                ),
                parcial: request.parseString('context.parcial'),
                primer_recu: request.parseString('context.primer_recu'),
                segundo_recu: request.parseString('context.segundo_recu'),
                parcial_final: request.parseString('context.parcial_final'),
                promedio_ej_y_parcial: request.parseString(
                    'context.promedio_ej_y_parcial',
                ),
                punto_adicional: request.parseString('context.punto_adicional'),
                nota_cursada: request.parseString('context.nota_cursada'),
                nota_cursada_final: request.parseString(
                    'context.nota_cursada_final',
                ),
                condicion_final: request.parseString('context.condicion_final'),
                fecha_finales: request.map('context.fecha_finales', (req) =>
                    req.parseString('toString()'),
                ),
            },
        };
        return await this._services.mailer.sendSummaryFeedback(context, to);
    });

    sendExerciseFeedbackHandler = handler(async (request) => {
        const { to, context }: MailExerciseFeedback = {
            to: request.parseString('to'),
            context: {
                ejercicio: request.parseString('context.ejercicio'),
                grupo: request.parseString('context.grupo'),
                corrector: request.parseString('context.corrector'),
                nota: request.parseString('context.nota'),
                correcciones: request.parseString('context.correcciones'),
            },
        };
        return await this._services.mailer.sendExerciseFeedback(context, to);
    });

    sendExamFeedbackHandler = handler(async (request) => {
        const { to, context }: MailExamFeedback = {
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
        return await this._services.mailer.sendExamFeedback(context, to);
    });

    assignExerciseHandler = handler(async (request) => {
        const { config, asignaciones } = this._parseAssignRequest(request);
        await this._services.assigner.assignExercise(config, asignaciones);
        return `Fin asignación de ejercicio`;
    });

    assignExamHandler = handler(async (request) => {
        const { config, asignaciones } = this._parseAssignRequest(request);
        await this._services.assigner.assignExam(config, asignaciones);
        return `Fin asignación de examen`;
    });

    getExerciseFeedbacksHandler = handler(async (request) => {
        const { config, ejercicio } = this._parseGetFeedbackRequest(request);
        const feedbacks = await this._services.assigner.getExerciseFeedbacks(
            config,
            ejercicio,
        );
        return JSON.stringify(feedbacks);
    });

    getExamFeedbacksHandler = handler(async (request) => {
        const { config, ejercicio } = this._parseGetFeedbackRequest(request);
        const feedbacks = await this._services.assigner.getExamFeedbacks(
            config,
            ejercicio,
        );
        return JSON.stringify(feedbacks);
    });

    getContentFromPageHandler = handler(async (request) => {
        const token = request.parseString('notion.token');
        const blockId = request.parseString('page_id');
        const content = await getContentFromBlock(
            new Client({ auth: token }),
            blockId,
        );
        return content;
    });

    getTeachersEmailsHandler = handler(async () => {
        const source =
            'https://raw.githubusercontent.com/Ingenieria-de-software-I/ingenieria-de-software-i.github.io/main/_data/docentes.json';
        const results: Array<{ email?: string }> = await axios
            .get(source, {})
            .then((res) => res.data);
        const emails = results
            .map((d) => d.email)
            .filter(Boolean)
            .join(', ');
        return emails;
    });

    testHandler = handler(async () => 'OK');

    //#endregion

    //#region parsing

    private _parseNotionConfig(request: Request): Config {
        return {
            notion: {
                token: request.parseString('config.notion.token'),
                db_devolucion: request.parseString(
                    'config.notion.db_devolucion',
                ),
                db_docente: request.parseString('config.notion.db_docente'),
                db_ejercicio: request.parseString('config.notion.db_ejercicio'),
            },
        };
    }

    private _parseAssignRequest(request: Request): {
        config: Config;
        asignaciones: Array<Assignment>;
    } {
        const config = this._parseNotionConfig(request);
        const asignaciones: Array<Assignment> = request.map(
            'asignaciones',
            (req) => ({
                docentes: req.map('docentes', (req) =>
                    req.parseString('toString()'),
                ),
                ejercicio: req.parseString('ejercicio'),
                nombre: req.parseString('nombre'),
            }),
        );
        return { config, asignaciones };
    }

    private _parseGetFeedbackRequest(request: Request): {
        config: Config;
        ejercicio: string;
    } {
        const config = this._parseNotionConfig(request);
        const ejercicio = request.parseString('ejercicio');
        return { config, ejercicio };
    }

    //#endregion
}
