export class HttpRequest {
    private _partial: string;
    private _json: string;

    constructor(partial: unknown) {
        this._json = JSON.stringify(partial);
        this._partial = `JSON.parse(\`${this._json}\`)`;
    }

    private _getValue(property: string): unknown {
        try {
            const value = eval(`${this._partial}.${property}`);
            if (value === undefined) {
                throw new Error(`Value: ${value}`);
            }
            return value;
        } catch (error) {
            throw new Error(
                HttpRequest.missingPropertyErrorMessage(property, this._json),
            );
        }
    }

    parseString(property: string): string {
        return String(this._getValue(property));
    }

    static missingPropertyErrorMessage(property: string, json: string) {
        return `${property} missing in ${json}`;
    }
}
