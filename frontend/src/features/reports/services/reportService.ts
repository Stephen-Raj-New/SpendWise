import httpClients from '../../../api/httpClient';
import { UserEndpoints } from '../../../api/httpEndPoints';

export interface MonthlyData {
  label: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
}

export interface SummaryReport {
  monthlyData: MonthlyData[];
  categoryBreakdown: CategoryBreakdown[];
}

export const reportService = {
  getSummaryReport: async (year: number) => {
    const response = await httpClients.get<SummaryReport>(`${UserEndpoints.reports.list}/summary`, { params: { year } });
    return response.data;
  },
};
