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
  getSummaryReport: async (query?: any) => {
    const response = await httpClients.get<SummaryReport>(`${UserEndpoints.reports.list}/summary`, { params: query });
    return response.data;
  },
};
