import { ApiAction, OpenApi } from '@borjagaribotti/open-api';
import axios from 'axios';

import { Assigner } from '../services/assigner.js';
import { Mailer } from '../services/mailer.js';
import { PageExtractor } from '../services/page-extrator.js';
import {
    assignmentSchema,
    examFeedbackMailSchema,
    exerciseFeedbackMailSchema,
    feedbackRetrieveSchema,
    pageSchema,
    summaryFeedbackMailSchema,
} from './schemas.js';

export class Api {
    constructor(
        private _services: {
            mailer: Mailer;
            assigner: Assigner;
            extractor: PageExtractor;
        },
    ) {}

    test = ApiAction.get({
        summary: 'Health check',
        callback: async () => 'OK',
    });

    docs = ApiAction.get({
        summary: 'Generar documentación de la API',
        callback: async () => {
            const openApi = new OpenApi(this, {
                info: {
                    title: 'IS1 API',
                    description:
                        'API principal para automatizar procesos con la Planilla de alumnos',
                    version: '1.0.0',
                },
                servers: [
                    {
                        url: 'https://ingsoft1-api.vercel.app/api',
                        description: 'Main server',
                    },
                    {
                        url: 'http://localhost:3000/api',
                        description: 'Localhost (Vercel:Dev)',
                    },
                ],
            });
            return JSON.stringify(openApi.docs());
        },
    });

    getTeachersEmails = ApiAction.get({
        summary:
            'Obtener los emails de los docentes (para invitar al workspace de Notion)',
        callback: async () => {
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
        },
    });

    assignExercise = ApiAction.post({
        summary:
            'Crear en Notion las correspondientes páginas para escribir las devoluciones de los ejercicios',
        schema: assignmentSchema,
        callback: async ({ config, asignaciones }) => {
            await this._services.assigner.assignExercise(config, asignaciones);
            return `Fin asignación de ejercicio`;
        },
    });

    assignExam = ApiAction.post({
        summary:
            'Crear en Notion las correspondientes páginas para escribir las devoluciones de los examenes',
        schema: assignmentSchema,
        callback: async ({ config, asignaciones }) => {
            await this._services.assigner.assignExam(config, asignaciones);
            return `Fin asignación de examen`;
        },
    });

    getExerciseFeedbacks = ApiAction.post({
        summary:
            'Obtener los datos de las devoluciones de un ejercicio para después pedir el contenido',
        schema: feedbackRetrieveSchema,
        callback: async ({ config, ejercicio }) => {
            const feedbacks =
                await this._services.assigner.getExerciseFeedbacks(
                    config,
                    ejercicio,
                );
            return JSON.stringify(feedbacks);
        },
    });

    getExamFeedbacks = ApiAction.post({
        summary:
            'Obtener los datos de las devoluciones de un exámen para después pedir el contenido',
        schema: feedbackRetrieveSchema,
        callback: async ({ config, ejercicio }) => {
            const feedbacks = await this._services.assigner.getExamFeedbacks(
                config,
                ejercicio,
            );
            return JSON.stringify(feedbacks);
        },
    });

    getContentFromPage = ApiAction.post({
        summary: 'Obtener el contenido de una página de Notion (devolución)',
        schema: pageSchema,
        callback: async ({ notion, page_id }) => {
            return await this._services.extractor.extract(
                page_id,
                notion.token,
            );
        },
    });

    sendExerciseFeedback = ApiAction.post({
        summary:
            'Genera el mail de una corrección de un ejercicio para un grupo',
        description: 'El envio fue delegado a la planilla',
        schema: exerciseFeedbackMailSchema,
        callback: async ({ to, context }) => {
            return await this._services.mailer.sendExerciseFeedback(
                context,
                to,
            );
        },
    });

    sendExamFeedback = ApiAction.post({
        summary:
            'Genera el mail de una corrección de exámen para unx estudiante',
        description: 'El envio fue delegado a la planilla',
        schema: examFeedbackMailSchema,
        callback: async ({ to, context }) => {
            return await this._services.mailer.sendExamFeedback(context, to);
        },
    });

    sendSummaryFeedback = ApiAction.post({
        summary: 'Genera el mail sobre el resumen de notas',
        description: 'El envio fue delegado a la planilla',
        schema: summaryFeedbackMailSchema,
        callback: async ({ to, context }) => {
            return await this._services.mailer.sendSummaryFeedback(context, to);
        },
    });
}
