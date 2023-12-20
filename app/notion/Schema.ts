import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Property } from './properties/Property';
import { Filter, Identificable, PageProperty, SearchParameters } from './types';

type Properties = {
    [name: string]: PageProperty;
};

type SchemaProperties<T> = {
    [key in keyof T]: Property<T[key]>;
};

export class Schema<T> {
    constructor(public properties: SchemaProperties<T>) {}

    buildFilterFrom(params: SearchParameters<T>): Filter | null {
        const filters: Filter[] = [];

        for (const name in params) {
            const property = this.properties[name];
            const values = params[name];
            if (!property || !values) continue;
            const filter = property.filter(values);
            if (!filter) continue;
            filters.push(filter);
        }

        if (filters.length === 0) return null;

        return { and: filters } as Filter;
    }

    getFilterProperties(): Array<string> {
        return Object.keys(this.properties);
    }

    getPropertiesFrom(model: Partial<T>): Properties {
        const properties: Properties = {};

        for (const propertyName in model) {
            const property = this.properties[propertyName];
            const value = model[propertyName];
            if (!property || !value) continue;
            properties[property.name] = property.mapValue(value);
        }

        return properties;
    }

    mapPage(page: PageObjectResponse): Identificable<T> {
        const model = { id: page.id } as Identificable<T>;
        const properties = page.properties as Properties;

        if (!properties) return model;

        for (const propertyName in this.properties) {
            const property = this.properties[propertyName];
            const pageProperty = properties[property.name];
            model[propertyName] = property.mapPageProperty(pageProperty) as any;
        }

        return model;
    }
}
