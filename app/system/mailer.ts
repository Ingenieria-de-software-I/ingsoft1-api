import { marked } from 'marked';
import { default as nunjucks } from 'nunjucks';

export type Options = {
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
};

export interface MailerClient {
    sendMail(to: string, options: Options): Promise<string>;
}

type ExerciseFeedbackContext = {
    ejercicio: string;
    grupo: string;
    corrector: string;
    nota: string;
    correcciones: string;
};

type ExamFeedbackContext = {
    examen: string;
    nombre: string;
    padron: string;
    corrector: string;
    correcciones: string;
    nota: string;
    puntos_extras: string;
    nota_final: string;
};

type Ejercicio = {
    nota: string;
    nombre: string;
};

type SummaryFeedbackContext = {
    curso: string;
    padron: string;
    estudiante: string;
    ejercicios: Ejercicio[];
    promedio_ejercicios: string;
    parcial: string;
    primer_recu: string;
    segundo_recu: string;
    parcial_final: string;
    promedio_ej_y_parcial: string;
    tp_integrador: string;
    punto_extra_papers: string;
    punto_adicional: string;
    nota_cursada: string;
    nota_cursada_final: string;
    condicion_final: string; // 'Promociona' | 'A Final' | 'Recursa'
    fecha_finales: string[];
    fecha_final_promociones: string;
};

type Mail<Context> = { to: string; context: Context };

export type MailExerciseFeedback = Mail<ExerciseFeedbackContext>;

export type MailExamFeedback = Mail<ExamFeedbackContext>;

export type MailSummaryFeedback = Mail<SummaryFeedbackContext>;

const env = nunjucks
    .configure('templates')
    .addFilter('md', marked.parse)
    .addFilter('as_grade_str', (grade) => {
        const grade_as_number = Number(grade);
        if (Number.isNaN(grade_as_number)) {
            return grade;
        }
        return grade_as_number.toFixed(2);
    });

export class Mailer {
    constructor(private _mailerClient: MailerClient) {}

    private async _sendMail(to: string, options: Options) {
        return this._mailerClient.sendMail(to, options);
    }

    private _render(name: string, context: object) {
        return env.render(name, context);
    }

    private _buildMailOptionsForExerciseFeedback(
        context: ExerciseFeedbackContext,
    ): Options {
        const subject = `Correción de ejercicio ${context.ejercicio} - Grupo ${context.grupo}`;
        const text = this._render(`emails/notas_ejercicio_plain.html`, context);
        const html = this._render(`emails/notas_ejercicio.html`, context);
        return { subject, text, html };
    }

    sendExerciseFeedback(context: ExerciseFeedbackContext, to: string) {
        const options = this._buildMailOptionsForExerciseFeedback(context);
        return this._sendMail(to, options);
    }

    private _buildMailOptionsForExamFeedback(
        context: ExamFeedbackContext,
    ): Options {
        const subject = `Corrección de ${context.examen} - Padrón ${context.padron}`;
        const text = this._render(`emails/notas_examen_plain.html`, context);
        const html = this._render(`emails/notas_examen.html`, context);
        return { subject, text, html };
    }

    sendExamFeedback(context: ExamFeedbackContext, to: string) {
        const options = this._buildMailOptionsForExamFeedback(context);
        return this._sendMail(to, options);
    }

    private _buildMailOptionsForSummaryFeedback(
        context: SummaryFeedbackContext,
    ): Options {
        const subject = `Resumen de cursada - Padrón ${context.padron}`;
        const text = this._render(`emails/summary_grades_plain.html`, context);
        const html = this._render(`emails/summary_grades.html`, context);
        return { subject, text, html };
    }

    sendSummaryFeedback(context: SummaryFeedbackContext, to: string) {
        const options = this._buildMailOptionsForSummaryFeedback(context);
        return this._sendMail(to, options);
    }
}
