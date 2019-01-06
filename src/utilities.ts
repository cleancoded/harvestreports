import { Bundle, ZObject } from "zapier-platform-core";
import * as fetch from 'node-fetch';
import * as moment from 'moment';

import Constants from "./constants";
import { TimeEntries } from "./models/time-entries";
import { Entry } from "./models/entry";
import { TimeEntryDateRange } from "./models/time-entry-date-range";

const fetchTimeEntryData = async (bundle: Bundle | any, z?: ZObject) => {
    const response = await fetch.default(`${Constants.STORE_API_BASE}/records`, {
        method: 'GET',
        headers: {
            'X-Secret': `${bundle.inputData.storage_secret}`
        }
    });

    let entryData: TimeEntries;

    if (response.json) {
        entryData = await response.json();

        return entryData;
    }
    else {
        if (z) {
            z.console.log('Time Entry Data response: ', response);
        }
        
        throw new Error('We encountered an error trying to get the time entry data');
    }
};

const filterTodaysEntries = (timeEntries: TimeEntries, today: Date): Entry[] => {
    let filteredEntries: Entry[] = [];
    const currentDate: moment.Moment = moment(today);

    if (timeEntries.entries) {
        filteredEntries = timeEntries.entries.filter((entry: Entry) => {
            const entryDate: moment.Moment = moment(entry.date);

            return entryDate.isBefore(currentDate);
        });
    }

    return filteredEntries;
};

const formatTimeEntries = (entries: Entry[], dateRange: TimeEntryDateRange, totalHours: number): string => {
    return '';
};

const getEntryDateRange = (entries: Entry[]): TimeEntryDateRange => {
    let earliestDate: moment.Moment = moment();
    let latestDate: moment.Moment = moment();

    entries.forEach((entry: Entry) => {
        const entryDate: moment.Moment = moment(entry.date);

        if (entryDate.isBefore(earliestDate)) {
            earliestDate = entryDate;
        }

        if (entryDate.isAfter(latestDate)) {
            latestDate = entryDate;
        }
    });

    return {
        earliestDate: earliestDate.toDate(),
        latestDate: latestDate.toDate()
    };
};

const getTotalHours = (entries: Entry[]): number => {
    return 0.0;
};

const Utilities = {
    FetchTimeEntryData: fetchTimeEntryData,
    FilterTodaysEntries: filterTodaysEntries,
    FormatTimeEntries: formatTimeEntries,
    GetEntryDateRange: getEntryDateRange,
    GetTotalHours: getTotalHours,
};

export default Utilities;