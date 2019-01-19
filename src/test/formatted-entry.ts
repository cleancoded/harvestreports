import { createAppTester } from 'zapier-platform-core';

import App from '../index';
import Constants from '../constants';
import { Z_ASCII } from 'zlib';

const appTester = createAppTester(App);

describe('FormattedEntry', () => {
    describe('formatTimeEntries', () => {
        it('should return time entries with expected HTML format', async () => {
            const bundle = {
                inputData: {
                    storage_secret: 'EuTwg3WFsUsvB6hL',
                    current_date: '2019-01-19T08:00:00-06:00'
                }
            };

            const report = await appTester(App.creates.formatted_entry.operation.perform, bundle);

            console.log('REPORT: ', report);
        });
    });
});