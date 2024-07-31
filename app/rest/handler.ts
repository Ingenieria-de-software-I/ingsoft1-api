import { Request } from './request.js';
import { Response } from './response.js';

export default function handler(
    callback: (req: Request) => Promise<string>,
): (params: unknown) => Promise<Response> {
    return async (params: unknown) => {
        let result;
        const request = new Request(params);

        try {
            result = await callback(request);
        } catch (err) {
            const message = String(err);
            if (request.hasRaised(err)) {
                return Response.badRequest(message);
            }
            return Response.error(message);
        }

        return Response.ok(result);
    };
}
