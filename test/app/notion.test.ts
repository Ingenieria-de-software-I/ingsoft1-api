import { Client } from '@notionhq/client';
import { assert } from 'console';

import { getContentFromBlock } from '../../app/notion/blocks';
import * as constants from '../constants';
import { createTestSuite } from '../utils';

const [test, xtest] = createTestSuite('Notion');

let client: Client;
let block_id: string;

test.before(() => {
    client = new Client({ auth: constants.TEST_NOTION_TOKEN });
    block_id = constants.TEST_NOTION_BLOCK_ID;
});

test('Get page content', async () => {
    const content = await getContentFromBlock(client, block_id);
    assert(content.trim().length > 0);
});
