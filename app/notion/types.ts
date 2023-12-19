import type {
    PageObjectResponse,
    QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';

import { PageProperty } from './properties/Property';

export type Id = string;

export type Identificable<T> = { id: Id } & T;

export type SearchParams<T> = {
    [k in keyof T]?: Array<T[k]>;
};

export type Page = PageObjectResponse;

export type Filter = QueryDatabaseParameters['filter'];

export type Properties = {
    [name: string]: PageProperty;
};
