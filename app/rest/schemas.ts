import { Assignment, Config } from '../services/assigner.js';
import {
    ExamFeedbackMail,
    ExerciseFeedbackMail,
    SummaryFeedbackMail,
} from '../services/mailer.js';
import { ReqArray, ReqShema, ReqString } from './req-schema.js';

export const noSchema = new ReqShema({});

const configSchema = new ReqShema<Config>({
    notion: new ReqShema({
        token: new ReqString({}),
        db_devolucion: new ReqString({}),
        db_docente: new ReqString({}),
        db_ejercicio: new ReqString({}),
    }),
});

export const assignmentSchema = new ReqShema({
    config: configSchema,
    asignaciones: new ReqArray<Assignment>(
        new ReqShema({
            docentes: new ReqArray(new ReqString({})),
            ejercicio: new ReqString({}),
            nombre: new ReqString({}),
        }),
    ),
});

export const feedbackRetrieveSchema = new ReqShema({
    config: configSchema,
    ejercicio: new ReqString({}),
});

export const pageSchema = new ReqShema({
    notion: new ReqShema({
        token: new ReqString({}),
    }),
    page_id: new ReqString({}),
});

export const exerciseFeedbackMailSchema = new ReqShema<ExerciseFeedbackMail>({
    to: new ReqString({}),
    context: new ReqShema({
        correcciones: new ReqString({}),
        corrector: new ReqString({}),
        ejercicio: new ReqString({}),
        grupo: new ReqString({}),
        nota: new ReqString({}),
    }),
});

export const examFeedbackMailSchema = new ReqShema<ExamFeedbackMail>({
    to: new ReqString({}),
    context: new ReqShema({
        correcciones: new ReqString({}),
        corrector: new ReqString({}),
        examen: new ReqString({}),
        nombre: new ReqString({}),
        nota: new ReqString({}),
        nota_final: new ReqString({}),
        padron: new ReqString({}),
        puntos_extras: new ReqString({}),
    }),
});

export const summaryFeedbackMailSchema = new ReqShema<SummaryFeedbackMail>({
    to: new ReqString({}),
    context: new ReqShema({
        condicion_final: new ReqString({}),
        curso: new ReqString({}),
        ejercicios: new ReqArray(
            new ReqShema({
                nombre: new ReqString({}),
                nota: new ReqString({}),
            }),
        ),
        estudiante: new ReqString({}),
        fecha_final_promociones: new ReqString({}),
        fecha_finales: new ReqArray(new ReqString({})),
        nota_cursada: new ReqString({}),
        nota_cursada_final: new ReqString({}),
        padron: new ReqString({}),
        parcial: new ReqString({}),
        parcial_final: new ReqString({}),
        primer_recu: new ReqString({}),
        promedio_ej_y_parcial: new ReqString({}),
        promedio_ejercicios: new ReqString({}),
        punto_adicional: new ReqString({}),
        punto_extra_papers: new ReqString({}),
        segundo_recu: new ReqString({}),
        tp_integrador: new ReqString({}),
    }),
});
