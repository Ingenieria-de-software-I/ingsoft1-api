import type { VercelRequest, VercelResponse } from '@vercel/node';

import { testHandler } from '../app/http';

export default async function (req: VercelRequest, res: VercelResponse) {
    const response = await testHandler({});
    res.status(response.code).send(response.message);
}
