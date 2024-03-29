import { Client } from '@notionhq/client';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { RichTextProperty } from './properties';

export async function getContentFromBlock(client: Client, block_id: string) {
    const blocks = await client.blocks.children
        .list({ block_id })
        .then((res) => res.results as Array<BlockObjectResponse>);

    const content = await Promise.all(
        blocks.map((block) =>
            getContentAsMarkdown(client, block).then((content) =>
                content.trim(),
            ),
        ),
    );
    return content.join('\n\n');
}

async function getContentAsMarkdown(
    client: Client,
    block: BlockObjectResponse,
): Promise<string> {
    const textProperty = new RichTextProperty(block.type);
    const text = getTextFromBlock(textProperty, block);
    if (block.has_children) return text || '';

    const children = await getContentFromBlock(client, block.id);
    const content = [text, children];
    return content.join('');
}

function getTextFromBlock(
    textProperty: RichTextProperty,
    block: BlockObjectResponse,
): string | undefined {
    switch (block.type) {
        case 'paragraph': {
            const text = textProperty.mapPageProperty(block[block.type]);
            return text;
        }
        case 'heading_1': {
            const text = textProperty.mapPageProperty(block[block.type]);
            return `# ${text}`;
        }
        case 'heading_2': {
            const text = textProperty.mapPageProperty(block[block.type]);
            return `## ${text}`;
        }
        case 'heading_3': {
            const text = textProperty.mapPageProperty(block[block.type]);
            return `### ${text}`;
        }
        case 'bulleted_list_item': {
            const text = textProperty.mapPageProperty(block[block.type]);
            return `- ${text}`;
        }
        case 'numbered_list_item': {
            const text = textProperty.mapPageProperty(block[block.type]);
            return `1. ${text}`;
        }
        case 'quote': {
            const text = textProperty.mapPageProperty(block[block.type]);
            return `> ${text}`;
        }
        case 'code': {
            const text = textProperty.mapPageProperty(block[block.type]);
            return `> ${text}`;
        }
        case 'divider': {
            return '---';
        }
        default: {
            throw new Error(`Unsupported block: ${block.type}`);
        }
    }
}
