import type { VercelRequest, VercelResponse } from '@vercel/node';

import { api } from '../app/production/api';

export default async function (req: VercelRequest, res: VercelResponse) {
    const response = await api.getTeachersEmailsHandler({});
    res.status(response.code).send(response.message);
}
