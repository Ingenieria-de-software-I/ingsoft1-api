import type { VercelApiHandler } from '@vercel/node';

import { buildMailOptionsForNotaExamen, sendMail } from '../app/mail';
import { ContextNotaExamen } from '../app/types';

const handler: VercelApiHandler = async function (req, res) {
    try {
        const to = '';
        const context: ContextNotaExamen = {
            examen: '',
            padron: '',
            nombre: '',
            corrector: '',
            nota: '',
            correcciones: '',
            nota_final: '',
            puntos_extras: '',
        };
        const options = buildMailOptionsForNotaExamen(context);
        await sendMail('', options);
    } catch (error) {
        res.status(500).send(error);
        return;
    }
    res.send(':)');
};

export default handler;
