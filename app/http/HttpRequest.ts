export class HttpRequest<T> {
    private partial: string;
    private json: string;

    constructor(partial: T) {
        this.json = JSON.stringify(partial);
        this.partial = `JSON.parse(\`${this.json}\`)`;
    }

    private getValue(property: string): unknown {
        try {
            const value = eval(`${this.partial}.${property}`);
            if (value === undefined) {
                throw new Error(`Value: ${value}`);
            }
            return value;
        } catch (error) {
            throw new Error(
                HttpRequest.missingPropertyErrorMessage(property, this.json),
            );
        }
    }

    parseString(property: string): string {
        return String(this.getValue(property));
    }

    static missingPropertyErrorMessage(property: string, json: string) {
        return `${property} missing in ${json}`;
    }
}
