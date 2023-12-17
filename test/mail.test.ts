import {
    buildMailOptionsForNotaEjercicio,
    buildMailOptionsForNotaExamen,
} from '../app/mail';
import { sendMail } from '../app/mail/mailer';
import { assert, createTestSuite } from './utils';

const [test, xtest] = createTestSuite('Mails');

const email4test = process.env.USER_EMAIL!;

xtest('Send a simple mail', async () => {
    const mailInfo = await sendMail(email4test, {
        subject: 'TEST MAIL SENDING',
        html: '<h1>HTML</h1>',
        text: 'Plain text',
    });
});

test('Template nota_ejercicio', () => {
    const context = {
        ejercicio: 'Ejecicio',
        grupo: 'Grupo',
        email: email4test,
        corrector: 'Corrector',
        nota: 'NOTA',
        correcciones: 'Esta es la corrección',
    };
    const options = buildMailOptionsForNotaEjercicio(context);

    const subject = `Correción de ejercicio ${context.ejercicio} - Grupo ${context.grupo}`;
    const text = `Mail para el grupo ${context.grupo}.
Corrector: ${context.corrector}.
Hola, este mail es para darles la devolución del ejercicio ${context.ejercicio}, su nota es ${context.nota}.`;
    const html = `<p>Mail para el grupo ${context.grupo}.</p>
<p>Corrector: ${context.corrector}.</p>
<p>Hola, este mail es para darles la devolución del ejercicio ${context.ejercicio}, su nota es <strong>${context.nota}</strong>.</p>`;

    assert(options.subject.includes(subject));
    text.split('\n').forEach((line) => assert(options.text.includes(line)));
    html.split('\n').forEach((line) => assert(options.html.includes(line)));

    // sendMail(email4test, options);
});

test('Template nota_examen', () => {
    const context = {
        examen: 'Examen',
        nombre: 'Nombre Estudiante',
        padron: 'PADRON',
        corrector: 'Corrector',
        correcciones: 'Esta es la correccion',
        nota: 'NOTA EXAMEN',
        puntos_extras: 'PUNTOS EXTRA',
        nota_final: 'NOTA FINAL',
    };
    const options = buildMailOptionsForNotaExamen(context);

    const subject = `Corrección de ${context.examen} - Padrón ${context.padron}`;
    const text = `Mail para ${context.nombre}.
Corrector: ${context.corrector}.
Hola, este mail es para darles la devolución del ${context.examen}. Tu nota es ${context.nota}, pero gracias a los puntos extra que te ganaste en los cuestionarios, tu nota final es ${context.nota_final}.
${context.correcciones}`;
    const html = `<p>Mail para ${context.nombre}.</p>
<p>Corrector: ${context.corrector}.</p>
<p>Hola, este mail es para darles la devolución del ${context.examen}. Tu nota es <strong>${context.nota}</strong>,
pero gracias a los puntos extra que te ganaste en los cuestionarios, tu nota final es
<strong>${context.nota_final}</strong>.</p>
${context.correcciones}`;

    assert(options.subject.includes(subject));
    text.split('\n').forEach((line) => assert(options.text.includes(line)));
    html.split('\n').forEach((line) => assert(options.html.includes(line)));

    // sendMail(email4test, options);
});
