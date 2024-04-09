export class Request {
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
                Request.missingPropertyErrorMessage(property, this._json),
            );
        }
    }

    parseString(property: string): string {
        return String(this._getValue(property));
    }

    map<T>(property: string, cb: (req: Request) => T): Array<T> {
        const arr = this._getValue(property) as Array<unknown>;
        return arr.map((val) => cb(new Request(val)));
    }

    static missingPropertyErrorMessage(property: string, json: string) {
        return `${property} missing in ${json}`;
    }
}
