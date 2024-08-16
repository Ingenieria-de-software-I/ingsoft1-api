export abstract class ReqProperty<T, P> {
    constructor(protected _schema: P) {}
    abstract map(obj: unknown): T;
}

export class ReqShema<Model> extends ReqProperty<
    Model,
    { [Prop in keyof Model]: ReqProperty<Model[Prop], unknown> }
> {
    map(obj: unknown): Model {
        const model = {} as Model;
        for (const key in this._schema) {
            const prop = (obj as any)[key];
            if (prop === undefined) {
                throw new Error(`Missing property: ${key}.`);
            }
            model[key] = this._schema[key].map(prop);
        }
        return model;
    }
}

export class ReqString extends ReqProperty<string, {}> {
    map(obj: unknown): string {
        return String(obj);
    }
}

export class ReqArray<T> extends ReqProperty<T[], ReqProperty<T, unknown>> {
    map(obj: unknown[]): T[] {
        return obj.map((o) => this._schema.map(o));
    }
}
