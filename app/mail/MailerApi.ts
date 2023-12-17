import { marked } from 'marked';
import { default as nunjucks } from 'nunjucks';

import { ContextNotaEjercicio, ContextNotaExamen, Options } from '../types';
import { MailerClient } from './types';

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

export class MailerApi {
    constructor(
        private _mailerClient: MailerClient,
        private _replyTo?: string,
    ) {}

    private async _sendMail(to: string, options: Options) {
        await this._mailerClient.sendMail(to, options);
    }

    private _render(name: string, context: object) {
        return env.render(name, context);
    }

    private _buildMailOptionsForNotaEjercicio(
        context: ContextNotaEjercicio,
    ): Options {
        const subject = `Correción de ejercicio ${context.ejercicio} - Grupo ${context.grupo}`;
        const text = this._render(`emails/notas_ejercicio_plain.html`, context);
        const html = this._render(`emails/notas_ejercicio.html`, context);
        const replyTo = this._replyTo;
        return { subject, text, html, replyTo };
    }

    async sendMailNotaEjercicio(context: ContextNotaEjercicio, to: string) {
        const options = this._buildMailOptionsForNotaEjercicio(context);
        await this._sendMail(to, options);
    }

    private _buildMailOptionsForNotaExamen(
        context: ContextNotaExamen,
    ): Options {
        const subject = `Corrección de ${context.examen} - Padrón ${context.padron}`;
        const text = this._render(`emails/notas_examen_plain.html`, context);
        const html = this._render(`emails/notas_examen.html`, context);
        const replyTo = this._replyTo;
        return { subject, text, html, replyTo };
    }

    async sendMailNotaExamen(context: ContextNotaExamen, to: string) {
        const options = this._buildMailOptionsForNotaExamen(context);
        await this._sendMail(to, options);
    }
}
