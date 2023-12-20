import { Client } from '@notionhq/client';
import {
    PageObjectResponse,
    QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';

import { Schema } from './Schema';
import { Identificable, SearchParameters } from './types';

type Page = PageObjectResponse;

export class Database<T> {
    constructor(
        private _client: Client,
        private _databaseId: string,
        private _schema: Schema<T>,
    ) {}

    private _mapPages(pages: Page[]): Array<Identificable<T>> {
        return pages.map((page) => this._schema.mapPage(page));
    }

    async query(params: SearchParameters<T>): Promise<Array<Identificable<T>>> {
        const queryParameters: QueryDatabaseParameters = {
            database_id: this._databaseId,
            filter_properties: this._schema.getFilterProperties(),
        };

        const filters = this._schema.buildFilterFrom(params);

        if (filters) {
            queryParameters['filter'] = filters;
        }

        const response = await this._client.databases.query(queryParameters);
        const pages = response.results
            .map((result) => result as Page)
            .filter((p) => p.object !== 'page');

        return this._mapPages(pages);
    }

    async create(models: T[]): Promise<Array<Identificable<T>>> {
        const pages = await Promise.all(
            models.map(async (model) => {
                const response = await this._client.pages.create({
                    parent: { database_id: this._databaseId },
                    properties: this._schema.getPropertiesFrom(
                        model,
                    ) as Page['properties'],
                });
                return response as Page;
            }),
        );

        return this._mapPages(pages);
    }

    async update(models: Identificable<T>[]): Promise<Array<Identificable<T>>> {
        const pages = await Promise.all(
            models.map(async (model) => {
                const response = await this._client.pages.update({
                    page_id: model.id,
                    properties: this._schema.getPropertiesFrom(
                        model,
                    ) as Page['properties'],
                });
                return response as Page;
            }),
        );

        return this._mapPages(pages);
    }

    async delete(
        models: Identificable<T>[],
    ): Promise<Array<Identificable<{}>>> {
        const blocks = await Promise.all(
            models.map(async (model) => {
                const response = this._client.blocks.delete({
                    block_id: model.id,
                });
                return response;
            }),
        );

        return blocks.map((block) => ({ id: block.id }));
    }
}
