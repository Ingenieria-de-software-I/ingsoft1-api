import axios from 'axios';

import { Assigner } from '../services/assigner.js';
import { Mailer } from '../services/mailer.js';
import { PageExtractor } from '../services/page-extrator.js';
import { ApiAction } from './api-action.js';
import {
    assignmentSchema,
    examFeedbackMailSchema,
    exerciseFeedbackMailSchema,
    feedbackRetrieveSchema,
    noSchema,
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

    test = new ApiAction({
        schema: noSchema,
        callback: async () => 'OK',
    });

    getTeachersEmails = new ApiAction({
        schema: noSchema,
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

    assignExercise = new ApiAction({
        schema: assignmentSchema,
        callback: async ({ config, asignaciones }) => {
            await this._services.assigner.assignExercise(config, asignaciones);
            return `Fin asignación de ejercicio`;
        },
    });

    assignExam = new ApiAction({
        schema: assignmentSchema,
        callback: async ({ config, asignaciones }) => {
            await this._services.assigner.assignExam(config, asignaciones);
            return `Fin asignación de examen`;
        },
    });

    getExerciseFeedbacks = new ApiAction({
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

    getExamFeedbacks = new ApiAction({
        schema: feedbackRetrieveSchema,
        callback: async ({ config, ejercicio }) => {
            const feedbacks = await this._services.assigner.getExamFeedbacks(
                config,
                ejercicio,
            );
            return JSON.stringify(feedbacks);
        },
    });

    getContentFromPage = new ApiAction({
        schema: pageSchema,
        callback: async ({ notion, page_id }) => {
            return await this._services.extractor.extract(
                page_id,
                notion.token,
            );
        },
    });

    sendSummaryFeedback = new ApiAction({
        schema: summaryFeedbackMailSchema,
        callback: async ({ to, context }) => {
            return await this._services.mailer.sendSummaryFeedback(context, to);
        },
    });

    sendExerciseFeedback = new ApiAction({
        schema: exerciseFeedbackMailSchema,
        callback: async ({ to, context }) => {
            return await this._services.mailer.sendExerciseFeedback(
                context,
                to,
            );
        },
    });

    sendExamFeedback = new ApiAction({
        schema: examFeedbackMailSchema,
        callback: async ({ to, context }) => {
            return await this._services.mailer.sendExamFeedback(context, to);
        },
    });
}
