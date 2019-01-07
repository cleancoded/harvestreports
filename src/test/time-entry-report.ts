import * as should from 'should';

import TimeEntryReport from '../time-entry-report';
import { Entry } from '../models/entry';
import { TimeEntryDateRange } from '../models/time-entry-date-range';
import { ReportData } from '../models/report-data';
import Utilities from '../utilities';

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
                    task: 'some project 1 task',
                    project: 'project 1',
                    notes: 'some notes'
                },
                {
                    date: new Date('2019-01-01'),
                    hours: 3.0,
                    task: 'some other project 1 task',
                    project: 'project 1',
                    notes: 'some notes'
                },
                {
                    date: new Date('2019-01-15'),
                    hours: 2.0,
                    task: 'some project 3 task',
                    project: 'project 3',
                    notes: 'some very, very, very, very, very, very, very, very, very long notes'
                },
                {
                    date: new Date('2019-01-02'),
                    hours: 2.0,
                    task: 'some project 2 task',
                    project: 'project 2',
                    notes: 'some notes'
                },
                {
                    date: new Date('2019-01-02'),
                    hours: 2.0,
                    task: 'some project 2 task',
                    project: 'project 2',
                    notes: 'some notes'
                }
            ];
            const reportData: ReportData = {
                dateRange: dateRange,
                totalHours: totalHours,
                reportDays: Utilities.GroupTimeEntries(entries)
            };

            const result = TimeEntryReport.BuildReport(reportData);
            console.log(result);
        });
    });
});