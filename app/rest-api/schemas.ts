import {
    ArrayProperty,
    Schema,
    StringProperty,
} from '@borjagaribotti/open-api';

import { Assignment, Config } from '../services/assigner.js';
import {
    ExamFeedbackMail,
    ExerciseFeedbackMail,
    SummaryFeedbackMail,
} from '../services/mailer.js';

const configSchema = new Schema<Config>({
    notion: new Schema({
        token: new StringProperty(),
        db_devolucion: new StringProperty(),
        db_docente: new StringProperty(),
        db_ejercicio: new StringProperty(),
    }),
});

export const assignmentSchema = new Schema({
    config: configSchema,
    asignaciones: new ArrayProperty<Assignment>(
        new Schema({
            docentes: new ArrayProperty(new StringProperty()),
            ejercicio: new StringProperty(),
            nombre: new StringProperty(),
        }),
    ),
});

export const feedbackRetrieveSchema = new Schema({
    config: configSchema,
    ejercicio: new StringProperty(),
});

export const pageSchema = new Schema({
    notion: new Schema({
        token: new StringProperty(),
    }),
    page_id: new StringProperty(),
});

export const exerciseFeedbackMailSchema = new Schema<ExerciseFeedbackMail>({
    to: new StringProperty(),
    context: new Schema({
        correcciones: new StringProperty(),
        corrector: new StringProperty(),
        ejercicio: new StringProperty(),
        grupo: new StringProperty(),
        nota: new StringProperty(),
    }),
});

export const examFeedbackMailSchema = new Schema<ExamFeedbackMail>({
    to: new StringProperty(),
    context: new Schema({
        correcciones: new StringProperty(),
        corrector: new StringProperty(),
        examen: new StringProperty(),
        nombre: new StringProperty(),
        nota: new StringProperty(),
        nota_final: new StringProperty(),
        padron: new StringProperty(),
        puntos_extras: new StringProperty(),
    }),
});

export const summaryFeedbackMailSchema = new Schema<SummaryFeedbackMail>({
    to: new StringProperty(),
    context: new Schema({
        condicion_final: new StringProperty(),
        curso: new StringProperty(),
        ejercicios: new ArrayProperty(
            new Schema({
                nombre: new StringProperty(),
                nota: new StringProperty(),
            }),
        ),
        estudiante: new StringProperty(),
        fecha_final_promociones: new StringProperty(),
        fecha_finales: new ArrayProperty(new StringProperty()),
        nota_cursada: new StringProperty(),
        nota_cursada_final: new StringProperty(),
        padron: new StringProperty(),
        parcial: new StringProperty(),
        parcial_final: new StringProperty(),
        primer_recu: new StringProperty(),
        promedio_ej_y_parcial: new StringProperty(),
        promedio_ejercicios: new StringProperty(),
        punto_adicional: new StringProperty(),
        punto_extra_papers: new StringProperty(),
        segundo_recu: new StringProperty(),
        tp_integrador: new StringProperty(),
    }),
});
