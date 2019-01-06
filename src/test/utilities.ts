import * as should from 'should';

import { TimeEntries } from "../models/time-entries";
import Utilities from "../utilities";
import { fail } from 'assert';
import { Entry } from '../models/entry';

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
});