import * as moment from 'moment';

import { Entry } from "./models/entry";
import { TimeEntryDateRange } from "./models/time-entry-date-range";
import { ReportData } from './models/report-data';
import { ReportDay } from './models/report-day';

const padding = 8;
const reportStyles = {
    tableStyles: `border-collapse: collapse; border: none; padding: ${padding}px`,
    cellStyles: `border: none; padding: ${padding}px;`,
    notesRowStyles: `background-color: #f2f2f2; border-bottom: 1px dashed;`,
    dateRowStyles: `background-color: #f2f2f2; font-weight: bold;`
};
const dateFormatString = 'MMM D, YYYY';

/*
    Build header
    Build table
        table head
        table rows
        table foot
    Build footer
*/
const buildReport = (reportData: ReportData): string => {
    let reportHtml = '';

    reportHtml += buildHeader(reportData.dateRange);
    reportHtml += buildTable(reportData.reportDays);
    reportHtml += buildFooter(reportData.totalHours);

    return reportHtml;
};

const buildHeader = (dateRange: TimeEntryDateRange): string => {
    const formattedEarliestDate: string = moment(dateRange.earliestDate).format(dateFormatString);
    const formattedLatestDate: string = moment(dateRange.latestDate).format(dateFormatString);

    return `Timesheet: <b>${formattedEarliestDate} - ${formattedLatestDate}</b>\n`;
};

const buildTable = (reportDays: ReportDay[]): string => {
    const header = buildTableHeader();
    const body = buildTableBody(reportDays);
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

const buildTableBody = (reportDays: ReportDay[]): string => {
    const entryDays = buildEntryDays(reportDays);

    return `<tbody>
        ${entryDays}
    </tbody>\n`;
};

const buildEntryDays = (reportDays: ReportDay[]): string => {
    let daysHtml = '';

    for (let reportDay of reportDays) {
        const formattedDate = moment(reportDay.date).format(dateFormatString);
        const entryRows = buildEntryRows(reportDay.entries);
        let dayHtml = `<tr>
            <td colspan="3" style="${reportStyles.dateRowStyles}" >${formattedDate}</td>
        </tr>
        ${entryRows}`;

        daysHtml += dayHtml;
    }

    return daysHtml;
};

const buildEntryRows = (entries: Entry[]): string => {
    let rowsHtml = '';

    entries.forEach((entry: Entry) => {
        let rowHtml = `<tr>
            <td>${entry.project}</td>
            <td>${entry.task}</td>
            <td style="text-align: center" >${entry.hours}</td>
        </tr>
        <tr style="${reportStyles.notesRowStyles}" >
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