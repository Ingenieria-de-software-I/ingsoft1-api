export class Response {
    constructor(public code: number, public message: string) {}

    static ok(message: string): Response {
        return new this(200, message);
    }

    static badRequest(message: string): Response {
        return new this(400, message);
    }

    static error(message: string): Response {
        return new this(500, message);
    }
}
