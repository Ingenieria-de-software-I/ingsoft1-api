import type { VercelRequest, VercelResponse } from '@vercel/node';

import { api } from '../app/production/app.js';

export default async function (req: VercelRequest, res: VercelResponse) {
    const response = await api.sendExerciseFeedbackHandler({ ...req.body });
    res.status(response.code).send(response.message);
}
