import { ZObject, Bundle } from "zapier-platform-core";

import Utilities from "../utilities";
import { TimeEntries } from "../models/time-entries";
import { Entry } from "../models/entry";
import { TimeEntryDateRange } from "../models/time-entry-date-range";

/*
    Fetch time entries
    Given today's date, filter entries that are before this date
    Find earliest and latest date
    Calculate total hours
    Format entries with HTML
*/
const formatTimeEntries = async (z: ZObject, bundle: Bundle) => {
    const timeEntries: TimeEntries = await Utilities.FetchTimeEntryData(bundle, z);
    const filteredEntries: Entry[] = Utilities.FilterTodaysEntries(timeEntries, bundle.inputData.current_date);
    const reportDateRange: TimeEntryDateRange = Utilities.GetEntryDateRange(filteredEntries);
    const totalHours: number = Utilities.GetTotalHours(filteredEntries);

    return {};
};

const FormattedEntry = {
    key: 'formatted-html',
    noun: 'FormattedHtml',
    display: {
        label: 'Format Time Entries',
        description: 'Embed time entries within HTML to be sent in an email body'
    },

    operation: {
        inputFields: [
            {
                key: 'storage_secret',
                label: 'Storage Secret',
                helpText: 'The Secret key for the Zapier Storage containing the time entry data',
                required: true,
                type: 'string'
            },
            {
                key: 'current_date',
                label: 'Current date',
                required: true,
                type: 'datetime'
            }
        ],
        perform: formatTimeEntries
    },
};

export default FormattedEntry;