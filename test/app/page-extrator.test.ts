import { PageExtractor } from '../../app/services/page-extrator.js';
import * as constants from '../constants.js';
import { assert, createTestSuite } from '../utils.js';

const [test] = createTestSuite('Page extractor');

test('Extract page', async () => {
    const extractor = new PageExtractor();
    const content = await extractor.extract(
        constants.TEST_NOTION_BLOCK_ID,
        constants.TEST_NOTION_TOKEN,
    );
    assert(content.length);
});
