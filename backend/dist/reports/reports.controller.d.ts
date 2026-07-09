import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSummaryReport(req: any, year: string): Promise<{
        monthlyData: {
            label: string;
            income: any;
            expense: any;
        }[];
        categoryBreakdown: {
            category: any;
            total: any;
        }[];
    }>;
}
