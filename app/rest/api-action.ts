import { ReqShema } from './req-schema.js';

export type ApiRequest = {
    body?: unknown;
};

export type ApiResponse = {
    code: number;
    content: string;
};

export class ApiAction<Model> {
    constructor(
        private _props: {
            schema: ReqShema<Model>;
            callback: (model: Model) => Promise<string>;
        },
    ) {}

    async handle(req: ApiRequest): Promise<ApiResponse> {
        let model: Model;

        try {
            model = this._props.schema.map(req.body);
        } catch (err) {
            return this._respond(400, String(err));
        }

        try {
            const content = await this._props.callback(model);
            return this._respond(200, content);
        } catch (err) {
            return this._respond(500, String(err));
        }
    }

    private _respond(statusCode: number, content: string): ApiResponse {
        return { code: statusCode, content };
    }
}
