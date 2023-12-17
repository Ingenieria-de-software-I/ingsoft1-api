import type { VercelRequest, VercelResponse } from '@vercel/node';

import { sendMailNotaEjercicioHandler } from '../app/http';

export default async function (req: VercelRequest, res: VercelResponse) {
    const response = await sendMailNotaEjercicioHandler({ ...req.body });
    res.status(response.code).send(response.message);
}
