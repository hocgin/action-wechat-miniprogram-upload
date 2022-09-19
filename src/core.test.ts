jest.mock('@actions/core');
jest.mock('@actions/github');

import * as core from '@actions/core';
import {run} from './core';

describe('action env [core.js] test', () => {
    beforeEach(() => {
        console.log('-> beforeEach');
    });

    test('DEMO TEST', async () => {
        console.log('-> DEMO TEST');
        // core.getInput = jest.fn()
        //     // .mockReturnValueOnce('upload_url')
        //     // .mockReturnValueOnce('asset_path')
        //     // .mockReturnValueOnce('asset_name')
        //     .mockReturnValueOnce('asset_content_type');
        run({} as any);
    });
});
