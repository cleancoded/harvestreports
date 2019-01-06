import * as should from 'should';
import { fail } from 'assert';

import Utilities from "../utilities";
import { TimeEntries } from "../models/time-entries";
import { Entry } from '../models/entry';
import { TimeEntryDateRange } from '../models/time-entry-date-range';

describe('Utilities', () => {
    describe('fetchTimeEntryData', () => {
        it('should retrieve time entry data from Zapier Storage', async () => {
            const bundle = {
                inputData: {
                    storage_secret: 'EuTwg3WFsUsvB6hL'
                }
            };

            const entryData: TimeEntries = await Utilities.FetchTimeEntryData(bundle)
            
            if (entryData.entries) {
                should(entryData.entries.length).be.greaterThan(0);
            }
            else {
                fail('Should have fetched time entires, but got none');
            }
        });
    });

    describe('filterTodaysEntries', () => {
        it('should return empty array given a single entry from today', () => {
            const currentDate = new Date('2019-01-01');
            const timeEntries: TimeEntries = {
                entries: [
                    {
                        date: currentDate,
                        hours: 2.0,
                        task: 'some task',
                        project: 'some project',
                        notes: 'some notes'
                    }
                ]
            };

            const filteredEntries: Entry[] = Utilities.FilterTodaysEntries(timeEntries, currentDate);

            should(filteredEntries.length).be.eql(0);
        });

        it('should return expected entries given entry from previous day', () => {
            const currentDate = new Date('2019-01-02');
            const timeEntries: TimeEntries = {
                entries: [
                    {
                        date: new Date('2019-01-01'),
                        hours: 2.0,
                        task: 'some task',
                        project: 'some project',
                        notes: 'some notes'
                    }
                ]
            };

            const filteredEntries: Entry[] = Utilities.FilterTodaysEntries(timeEntries, currentDate);

            should(filteredEntries.length).be.eql(1);
        });

        it('should return expected entries given entries from various days', () => {
            const currentDate = new Date('2019-01-02');
            const timeEntries: TimeEntries = {
                entries: [
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
                ]
            };

            const filteredEntries: Entry[] = Utilities.FilterTodaysEntries(timeEntries, currentDate);

            should(filteredEntries.length).be.eql(1);
        });

        it('should return empty array given zero time entries', () => {
            const currentDate = new Date('2019-01-02');
            const timeEntries: TimeEntries = { };

            const filteredEntries: Entry[] = Utilities.FilterTodaysEntries(timeEntries, currentDate);

            should(filteredEntries.length).be.eql(0);
        });
    });

    describe('getEntryDateRange', () => {
        it('should return TimeEntryDateRange with expected dates', () => {
            const expectedEarliestDate = new Date('2019-01-02');
            const expectedLatestDate = new Date('2019-01-10');
            const entries: Entry[] = [
                {
                    date: expectedEarliestDate
                },
                {
                    date: expectedLatestDate
                }
            ];

            const entryDateRange: TimeEntryDateRange = Utilities.GetEntryDateRange(entries);

            should(entryDateRange.earliestDate).eql(expectedEarliestDate);
            should(entryDateRange.latestDate).eql(expectedLatestDate);
        });

        it('should return TimeEntryDateRange with expected dates', () => {
            const expectedEarliestDate = new Date('2019-01-02');
            const expectedLatestDate = new Date('2019-01-10');
            const entries: Entry[] = [
                {
                    date: expectedEarliestDate
                },
                {
                    date: new Date('2019-01-05')
                },
                {
                    date: expectedLatestDate
                }
            ];

            const entryDateRange: TimeEntryDateRange = Utilities.GetEntryDateRange(entries);

            should(entryDateRange.earliestDate).eql(expectedEarliestDate);
            should(entryDateRange.latestDate).eql(expectedLatestDate);
        });
    });

    describe('getTotalHours', () => {
        it('should return zero given empty entries array', () => {
            const expectedTotalHours: number = 0.0;
            const entries: Entry[] = [];

            const totalHours = Utilities.GetTotalHours(entries);

            should(totalHours).eql(expectedTotalHours);
        });

        it('should return 1 hours given single entry of 1 hours', () => {
            const expectedTotalHours: number = 1.0;
            const entries: Entry[] = [
                {
                    date: new Date(),
                    hours: 1.0
                }
            ];

            const totalHours = Utilities.GetTotalHours(entries);

            should(totalHours).eql(expectedTotalHours);
        });

        it('should return expected hours given multiple entries', () => {
            const expectedTotalHours: number = 6.5;
            const entries: Entry[] = [
                {
                    date: new Date(),
                    hours: 1.5
                },
                {
                    date: new Date(),
                    hours: 2.0
                },
                {
                    date: new Date(),
                    hours: 3.0
                }
            ];

            const totalHours = Utilities.GetTotalHours(entries);

            should(totalHours).eql(expectedTotalHours);
        });
    });
});