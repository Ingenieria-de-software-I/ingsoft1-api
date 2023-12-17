import type { VercelApiHandler } from '@vercel/node';

import { buildMailOptionsForNotaEjercicio, sendMail } from '../app/mail';
import { ContextNotaEjercicio } from '../app/types';

const handler: VercelApiHandler = async function (req, res) {
    try {
        const to = '';
        const context: ContextNotaEjercicio = {
            ejercicio: '',
            grupo: '',
            corrector: '',
            nota: '',
            correcciones: '',
        };
        const options = buildMailOptionsForNotaEjercicio(context);
        await sendMail('', options);
    } catch (error) {
        res.status(500).send(error);
        return;
    }
    res.send(':)');
};

export default handler;
