import dotenv from 'dotenv';
import { google } from 'googleapis';
import { marked } from 'marked';
import nodemailer from 'nodemailer';
import nunjucks from 'nunjucks';

import { ContextNotaEjercicio, ContextNotaExamen, Options } from './types';

dotenv.config();

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

const OAuth2 = google.auth.OAuth2;

async function createTransporter() {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise<string>((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                console.log('*ERR: ', err);
                reject();
            }
            resolve(token!);
        });
    });

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'oauth2',
            user: process.env.USER_EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken,
        },
    });
}

export async function sendMail(to: string, options: Options) {
    const transporter = await createTransporter();
    return await transporter.sendMail({ to, ...options });
}

export function buildMailOptionsForNotaEjercicio(
    context: ContextNotaEjercicio,
): Options {
    const subject = `Correción de ejercicio ${context.ejercicio} - Grupo ${context.grupo}`;
    const text = env.render(`emails/notas_ejercicio_plain.html`, context);
    const html = env.render(`emails/notas_ejercicio.html`, context);
    return { subject, text, html };
}

export function buildMailOptionsForNotaExamen(
    context: ContextNotaExamen,
): Options {
    const subject = `Corrección de ${context.examen} - Padrón ${context.padron}`;
    const text = env.render(`emails/notas_examen_plain.html`, context);
    const html = env.render(`emails/notas_examen.html`, context);
    return { subject, text, html };
}
