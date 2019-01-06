import { Bundle, ZObject } from "zapier-platform-core";
import * as fetch from 'node-fetch';
import * as moment from 'moment';

import Constants from "./constants";
import { TimeEntries } from "./models/time-entries";
import { Entry } from "./models/entry";

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
}

const Utilities = {
    FetchTimeEntryData: fetchTimeEntryData,
    FilterTodaysEntries: filterTodaysEntries
};

export default Utilities;