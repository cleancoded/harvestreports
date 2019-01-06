import * as moment from 'moment';

import { Entry } from "./models/entry";
import { TimeEntryDateRange } from "./models/time-entry-date-range";

const padding = 8;
const reportStyles = {
    tableStyles: `border-collapse: collapse; border: none; padding: ${padding}px`,
    cellStyles: `border: none; padding: ${padding}px;`,
    rowStyles: `background-color: #f2f2f2; border-bottom: 1px dashed;`
};

/*
    Build header
    Build table
        table head
        table rows
        table foot
    Build footer
*/
const buildReport = (entries: Entry[], dateRange: TimeEntryDateRange, totalHours: number): string => {
    let reportHtml = '';

    reportHtml += buildHeader(dateRange);
    reportHtml += buildTable(entries);
    reportHtml += buildFooter(totalHours);

    return reportHtml;
};

const buildHeader = (dateRange: TimeEntryDateRange): string => {
    const formattedEarliestDate: string = moment(dateRange.earliestDate).format('MMMM Do YYYY');
    const formattedLatestDate: string = moment(dateRange.latestDate).format('MMMM Do YYYY');

    return `Timesheet: <b>${formattedEarliestDate} - ${formattedLatestDate}</b>\n`;
};

const buildTable = (entries: Entry[]): string => {
    const header = buildTableHeader();
    const body = buildTableBody(entries);
    const footer = buildTableFooter();

    return header + body + footer;
};

const buildTableHeader = (): string => {
    return `<table style="${reportStyles.tableStyles}" >
    <thead>
        <tr>
            <th style="${reportStyles.cellStyles}" >Project</th>
            <th style="${reportStyles.cellStyles}" >Task</th>
            <th style="${reportStyles.cellStyles}" >Hours</th>
        </tr>
    </thead>\n`;
};

const buildTableBody = (entries: Entry[]): string => {
    const entryRows = buildEntryRows(entries);

    return `<tbody>
        ${entryRows}
    </tbody>\n`;
};

const buildEntryRows = (entries: Entry[]): string => {
    let rowsHtml = '';

    entries.forEach((entry: Entry) => {
        let rowHtml = `<tr>
            <td>${entry.project}</td>
            <td>${entry.task}</td>
            <td style="text-align: center" >${entry.hours}</td>
        </tr>
        <tr style="${reportStyles.rowStyles}" >
            <td colspan="3">${entry.notes}</td>
        </tr>\n`;

        rowsHtml += rowHtml;
    });

    return rowsHtml;
};

const buildTableFooter = (): string => {
    return `</table>\n`;
};

const buildFooter = (totalHours: number): string => {
    return `<br/>Total: <b>${totalHours} Hours</b>`;
};

const TimeEntryReport = {
    BuildReport: buildReport
};

export default TimeEntryReport