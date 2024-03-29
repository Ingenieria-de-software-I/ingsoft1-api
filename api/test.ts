import type { VercelRequest, VercelResponse } from '@vercel/node';

import { api } from '../app/production/app';

export default async function (req: VercelRequest, res: VercelResponse) {
    const response = await api.testHandler({});
    res.status(response.code).send(response.message);
}
