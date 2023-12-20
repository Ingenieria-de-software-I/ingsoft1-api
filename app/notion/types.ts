import type {
    QueryDatabaseParameters,
    RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type Identificable<T> = { id: string } & T;

export type SearchParameters<T> = {
    [k in keyof T]?: Array<T[k]>;
};

export type Filter = QueryDatabaseParameters['filter'];

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
