import { Mailer } from '../../app/system/mailer';
import { TEST_USER_EMAIL } from '../constants';
import { MailerClientStub } from '../helpers/mailer-client-stub';
import { assert, createTestSuite } from '../utils';

const [test, xtest] = createTestSuite('Mailer');

let mailer: Mailer;
let mailerClientStub: MailerClientStub;

test.before(() => {
    mailerClientStub = new MailerClientStub();
    mailer = new Mailer(mailerClientStub);
});

const changeStubBehaviourToAssertContent = (
    subject: string,
    text: string,
    html: string,
) => {
    mailerClientStub.changeBehaviour(async (to, options) => {
        assert(options.subject.includes(subject));
        text.split('\n').forEach((line) => assert(options.text.includes(line)));
        html.split('\n').forEach((line) => assert(options.html.includes(line)));
        return 'ok';
    });
};

test('Template nota_ejercicio', async () => {
    const context = {
        ejercicio: 'Ejecicio',
        grupo: 'Grupo',
        corrector: 'Corrector',
        nota: 'NOTA',
        correcciones: 'Esta es la corrección',
    };

    const subject = `Correción de ejercicio ${context.ejercicio} - Grupo ${context.grupo}`;
    const text = `Mail para el grupo ${context.grupo}.
Corrector: ${context.corrector}.
Hola, este mail es para darles la devolución del ejercicio ${context.ejercicio}, su nota es ${context.nota}.`;
    const html = `<p>Mail para el grupo ${context.grupo}.</p>
<p>Corrector: ${context.corrector}.</p>
<p>Hola, este mail es para darles la devolución del ejercicio ${context.ejercicio}, su nota es <strong>${context.nota}</strong>.</p>`;

    changeStubBehaviourToAssertContent(subject, text, html);
    await mailer.sendExerciseFeedback(context, TEST_USER_EMAIL);
});

test('Template nota_examen', async () => {
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

    changeStubBehaviourToAssertContent(subject, text, html);
    await mailer.sendExamFeedback(context, TEST_USER_EMAIL);
});

test('Template summary_grades', async () => {
    const context = {
        estudiante: 'Borja',
        padron: '123',
        ejercicios: [
            { nombre: 'Ej1', nota: '6' },
            { nombre: 'Ej2', nota: '8' },
        ],
        promedio_ejercicios: '7',
        parcial: '2',
        primer_recu: '2',
        segundo_recu: '10',
        parcial_final: '10',
        promedio_ej_y_parcial: '8',
        tp_integrador: '8',
        punto_extra_papers: '',
        punto_adicional: '',
        nota_cursada: '7',
        nota_cursada_final: '7',
        condicion_final: 'A Final' as const,
        fecha_finales: ['Martes 2 de Julio a las 18:00 hs'],
        fecha_final_promociones: 'Martes 2 de Julio a las 18:00 hs',
        curso: 'Ingeniería de Software I',
    };
    const subject = `Resumen de cursada - Padrón ${context.padron}`;
    const text = `Mail para ${context.estudiante}.`;
    const html = `<p>Mail para ${context.estudiante}.</p>`;

    changeStubBehaviourToAssertContent(subject, text, html);
    await mailer.sendSummaryFeedback(context, TEST_USER_EMAIL);
});
