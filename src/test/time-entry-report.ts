import * as should from 'should';

import TimeEntryReport from '../time-entry-report';
import { Entry } from '../models/entry';
import { TimeEntryDateRange } from '../models/time-entry-date-range';

describe('TimeEntryReport', () => {
    describe('buildReport', () => {
        it('should return expected report HTML', () => {
            const totalHours = 4;
            const dateRange: TimeEntryDateRange = {
                earliestDate: new Date('2019-01-01'),
                latestDate: new Date('2019-01-02')
            }
            const entries: Entry[] = [
                {
                    date: new Date('2019-01-01'),
                    hours: 2.0,
                    task: 'some task',
                    project: 'some project',
                    notes: 'some notes'
                },
                {
                    date: new Date('2019-01-02'),
                    hours: 2.0,
                    task: 'some task',
                    project: 'some project',
                    notes: 'some notes'
                }
            ];

            const result = TimeEntryReport.BuildReport(entries, dateRange, totalHours);
            console.log(result);
        });
    });
});