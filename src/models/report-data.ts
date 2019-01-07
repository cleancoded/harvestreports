import { TimeEntryDateRange } from "./time-entry-date-range";
import { ReportDay } from "./report-day";

export interface ReportData {
    dateRange: TimeEntryDateRange,
    totalHours: number,
    reportDays: ReportDay[]
};