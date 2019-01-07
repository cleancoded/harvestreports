import { Bundle, ZObject } from "zapier-platform-core";
import * as fetch from 'node-fetch';
import * as moment from 'moment';

import Constants from "./constants";
import { TimeEntries } from "./models/time-entries";
import { Entry } from "./models/entry";
import { TimeEntryDateRange } from "./models/time-entry-date-range";
import { ReportData } from "./models/report-data";
import { ReportDay } from "./models/report-day";

const buildTimeEntryReport = (entries: Entry[], dateRange: TimeEntryDateRange, totalHours: number): ReportData => {
    return {
        dateRange: dateRange,
        totalHours: totalHours,
        reportDays: groupTimeEntries(entries)
    };
};

const groupTimeEntries = (entries: Entry[]): ReportDay[] => {
    let timeEntriesMap: { [date: string]: Entry[] } = {};
    let reportDays: ReportDay[] = [];

    entries.forEach((entry: Entry) => {
        let date = entry.date.toString();
        let entries: Entry[] = timeEntriesMap[date] || [];
        entries.push(entry);
        timeEntriesMap[date] = entries;
    });
    for (let date in timeEntriesMap) {
        reportDays.push({
            date: timeEntriesMap[date][0].date,
            entries: timeEntriesMap[date]
        });
    }

    return reportDays.sort(sortReportDays);
};

const sortReportDays = (first: ReportDay, second: ReportDay): number => {
    const firstMoment: moment.Moment = moment(first.date);
    const secondMoment: moment.Moment = moment(second.date);

    if (firstMoment.isBefore(secondMoment)) {
        return -1;
    }
    if (firstMoment.isAfter(secondMoment)) {
        return 1;
    }

    return 0;
};

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

const getEntryDateRange = (entries: Entry[]): TimeEntryDateRange => {
    let earliestDate: moment.Moment = moment();
    let latestDate: moment.Moment = moment('1900-01-01');

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

const getTotalHours = (entries: Entry[], z?: ZObject): number => {
    let totalHours: number = 0.0;

    entries.forEach((entry: Entry) => {
        if (entry.hours) {
            let hours = parseFloat(entry.hours.toString());
            totalHours += hours;
        }
    });

    return totalHours;
};

const Utilities = {
    BuildTimeEntryReport: buildTimeEntryReport,
    FetchTimeEntryData: fetchTimeEntryData,
    FilterTodaysEntries: filterTodaysEntries,
    GetEntryDateRange: getEntryDateRange,
    GetTotalHours: getTotalHours,
    GroupTimeEntries: groupTimeEntries
};

export default Utilities;