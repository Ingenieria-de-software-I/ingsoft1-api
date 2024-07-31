import { Client } from '@notionhq/client';
import { default as ToMdast } from 'notion-to-mdast/src/index.js';
import remarkStringify from 'remark-stringify';
import type { Root } from 'remark-stringify/lib';
import { unified } from 'unified';

export class PageExtractor {
    async extract(pageId: string, token: string): Promise<string> {
        const client = new Client({ auth: token });
        const toMdast = new ToMdast(client);

        // ignore metadata
        toMdast.translateMetadata = async () => [];

        const root = await toMdast.translatePage(pageId);
        const content = unified()
            .use(remarkStringify, { emphasis: '_' })
            .stringify(root as Root);

        return content.toString();
    }
}
