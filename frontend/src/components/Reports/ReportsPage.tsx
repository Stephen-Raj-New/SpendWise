import React, { useEffect, useState } from 'react';
import { useLayout } from '../../layouts/DashboardLayout';
import { Card } from '../ui/Card';
import { reportService, type SummaryReport } from '../../features/reports/services/reportService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { generatePDF } from '../../utils/generatePDF';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const ReportsPage: React.FC = () => {
  const { setNavbarProps } = useLayout();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SummaryReport | null>(null);

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search reports...',
      actionLabel: 'Export Data',
      onAction: () => console.log('Exporting data'), // Handled separately if needed
    });
  }, [setNavbarProps]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const reportData = await reportService.getSummaryReport(year);
        setData(reportData);
      } catch (err) {
        console.error('Failed to fetch report data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  const handleExportPdf = () => {
    if (!data) return;
    
    // Monthly Data Table
    const monthlyHeaders = ['Month', 'Income', 'Expense', 'Net'];
    const monthlyPdfData = data.monthlyData.map(m => [
      m.label,
      `₹${m.income.toLocaleString()}`,
      `₹${m.expense.toLocaleString()}`,
      `₹${(m.income - m.expense).toLocaleString()}`
    ]);

    generatePDF({
      title: `Financial Report ${year}`,
      filename: `report-${year}`,
      headers: monthlyHeaders,
      data: monthlyPdfData
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analyze your financial trends over time.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            {[...Array(5)].map((_, i) => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
          <button
            onClick={handleExportPdf}
            disabled={!data}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Generating report...</div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-slate-100">Income vs Expense ({year})</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-slate-100">Expenses by Category</h3>
            {data.categoryBreakdown.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {data.categoryBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `₹${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center text-slate-500">
                No expense data for {year}
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default ReportsPage;
