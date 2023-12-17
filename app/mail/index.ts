import { ContextNotaEjercicio, ContextNotaExamen, Options } from '../types';
import { env, sendMail } from './mailer';

const emailDocente = 'fiuba-ingsoft1-doc@googlegroups.com';

export function buildMailOptionsForNotaEjercicio(
    context: ContextNotaEjercicio,
): Options {
    const subject = `Correción de ejercicio ${context.ejercicio} - Grupo ${context.grupo}`;
    const text = env.render(`emails/notas_ejercicio_plain.html`, context);
    const html = env.render(`emails/notas_ejercicio.html`, context);
    const replyTo = emailDocente;
    return { subject, text, html, replyTo };
}

export async function sendMailNotaEjercicio(
    context: ContextNotaEjercicio,
    to: string,
) {
    const options = buildMailOptionsForNotaEjercicio(context);
    await sendMail(to, options);
}

export function buildMailOptionsForNotaExamen(
    context: ContextNotaExamen,
): Options {
    const subject = `Corrección de ${context.examen} - Padrón ${context.padron}`;
    const text = env.render(`emails/notas_examen_plain.html`, context);
    const html = env.render(`emails/notas_examen.html`, context);
    const replyTo = emailDocente;
    return { subject, text, html, replyTo };
}

export async function sendMailNotaExamen(
    context: ContextNotaExamen,
    to: string,
) {
    const options = buildMailOptionsForNotaExamen(context);
    await sendMail(to, options);
}
