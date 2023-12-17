export class HttpResponse {
    constructor(public code: number, public message: string) {}

    static ok(message: string): HttpResponse {
        return new this(200, message);
    }

    static badRequest(message: string): HttpResponse {
        return new this(400, message);
    }

    static error(message: string): HttpResponse {
        return new this(500, message);
    }
}
