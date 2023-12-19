import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { Filter, Identificable } from '../types';

type RecursivePartial<T> = {
    [K in keyof T]?: T[K] extends Array<infer I>
        ? Array<RecursivePartial<I>>
        : RecursivePartial<T[K]>;
};

export type PageProperty = RecursivePartial<{
    title: Array<RichTextItemResponse>;
    rich_text: Array<RichTextItemResponse>;
    relation: Array<Identificable<void>>;
}>;

export abstract class Property<TValue> {
    constructor(public name: string) {}

    filter(values: TValue[]): Filter {
        const filters = { or: values.map((value) => this._filter(value)) };
        return filters as Filter;
    }

    protected abstract _filter(value: TValue): Filter;

    abstract mapValue(value: TValue): PageProperty;

    abstract mapPageProperty(pageProperty: PageProperty): TValue | undefined;
}
