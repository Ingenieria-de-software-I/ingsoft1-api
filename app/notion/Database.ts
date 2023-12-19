import { Client } from '@notionhq/client';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

import { Schema } from './Schema';
import { Identificable, Page, SearchParams } from './types';

export class Database<T> {
    constructor(
        private _client: Client,
        private _database_id: string,
        private _schema: Schema<T>,
    ) {}

    private _mapPages(pages: Page[]): Array<Identificable<T>> {
        return pages.map((page) => this._schema.mapPage(page));
    }

    async query(attributes: SearchParams<T>): Promise<Array<Identificable<T>>> {
        const queryParameters: QueryDatabaseParameters = {
            database_id: this._database_id,
            filter_properties: this._schema.getFilterProperties(),
        };

        const filter = this._schema.getFilters(attributes);

        if (filter) {
            queryParameters['filter'] = filter;
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
                    parent: { database_id: this._database_id },
                    properties: this._schema.getProperties(
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
                    properties: this._schema.getProperties(
                        model,
                    ) as Page['properties'],
                });
                return response as Page;
            }),
        );

        return this._mapPages(pages);
    }

    async delete(models: Identificable<T>[]): Promise<Array<{ id: string }>> {
        const pages = await Promise.all(
            models.map((model) => {
                return this._client.blocks.delete({ block_id: model.id });
            }),
        );

        return pages.map(({ id }) => ({ id }));
    }
}
