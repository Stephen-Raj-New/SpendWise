import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchExpenseList, 
  fetchExpenseSummary, 
  fetchCategoryDistribution,
} from '../../features/expenses/redux/expenseThunk';
import { expenseService } from '../../features/expenses/services/expenseService';
import type { Expense } from '../../features/expenses/services/expenseService';
import { useLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { DataTable } from '../ui/DataTable';
import { ProgressBar } from '../ui/ProgressBar';
import { InsightCard } from '../ui/InsightCard';
import { Badge } from '../ui/Badge';
import { FilterBar } from '../ui/FilterBar';
import { CreditCard, TrendingDown, Award, Download, FileText } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';
import { generatePDF } from '../../utils/generatePDF';

const ExpensePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setNavbarProps } = useLayout();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('month');
  
  // Local state for pagination and filtering
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ merchant?: string; category?: string; range?: string }>({ range: 'month' });

  const {
    list,
    summary,
    distribution,
    loading
  } = useAppSelector((state) => state.expenses);

  const fetchAllData = () => {
    dispatch(fetchExpenseList({ ...filters, page, limit: 10 }));
    dispatch(fetchExpenseSummary(selectedRange));
    dispatch(fetchCategoryDistribution(selectedRange));
  };

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search expenses...',
      actionLabel: 'Add Expense',
      onAction: () => setIsAddModalOpen(true),
    });
  }, [setNavbarProps]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, range: selectedRange }));
  }, [selectedRange]);

  useEffect(() => {
    fetchAllData();
  }, [dispatch, filters, page, selectedRange]);

  const handleExportCsv = async () => {
    try {
      await expenseService.exportExpenseCsv(filters);
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  const handleExportPdf = async () => {
    try {
      // Fetch unpaginated data for export
      const response = await expenseService.getExpenseList({ ...filters, limit: 10000 });
      
      const headers = ['Date', 'Merchant', 'Category', 'Amount'];
      const pdfData = response.data.map(item => [
        new Date(item.date).toLocaleDateString(),
        item.merchant,
        item.category,
        `₹${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      ]);

      generatePDF({
        title: 'Expenses Report',
        filename: 'expenses-export',
        headers,
        data: pdfData
      });
    } catch (err) {
      console.error('Failed to export PDF', err);
    }
  };

  // Derive unique merchants for the filter dropdown
  const uniqueMerchants = useMemo(() => {
    const merchants = Array.from(new Set(list.data.map(e => e.merchant)));
    return merchants.map(m => ({ label: m, value: m }));
  }, [list.data]);

  const columns = [
    { 
      header: 'Merchant', 
      accessor: (row: Expense) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 font-bold">
            {row.merchant.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{row.merchant}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Category', 
      accessor: (row: Expense) => <Badge variant="neutral">{row.category}</Badge>
    },
    { 
      header: 'Date', 
      accessor: (row: Expense) => new Date(row.date).toLocaleDateString()
    },
    { 
      header: 'Amount', 
      accessor: (row: Expense) => (
        <div className="text-right font-medium text-slate-900 dark:text-slate-100">
          ₹{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Expenses Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage your spending.</p>
        </div>
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {['month', 'quarter', 'year'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRange(r)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                selectedRange === r
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title={`${selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)}ly Total`}
          value={summary ? `₹${summary.monthlyTotal.toLocaleString()}` : '...'}
          icon={<CreditCard />}
          trend={summary ? { 
            value: summary.monthlyTotalTrendPct, 
            label: 'vs prev period', 
            // In expenses, a negative trend (less spending) is typically positive/good.
            // But let's just display it. We'll set isPositive to true if they spent LESS.
            isPositive: summary.monthlyTotalTrendPct <= 0 
          } : undefined}
        />
        <StatCard
          title="Avg per Transaction"
          value={summary ? `₹${summary.avgPerTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '...'}
          icon={<TrendingDown />}
        />
        <StatCard
          title="Top Category"
          value={summary ? summary.topCategory.name : '...'}
          icon={<Award />}
          trend={summary && summary.topCategory.percentage > 0 ? {
            value: summary.topCategory.percentage,
            label: 'of total expenses',
            isPositive: false // spending a lot in one category might not be "positive", just neutral/red
          } : undefined}
        />
      </div>

      {/* Table & Filters Card */}
      <Card>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <FilterBar
            filters={[
              {
                id: 'merchant',
                label: 'All Merchants',
                value: filters.merchant || '',
                options: uniqueMerchants,
              }
            ]}
            onFilterChange={(id, value) => setFilters(prev => ({ ...prev, [id]: value }))}
            onClearFilters={() => setFilters(prev => ({ ...prev, merchant: '' }))}
          />
          <div className="flex gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <FileText size={16} />
              PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading expense data...</div>
        ) : (
          <>
            <DataTable
              data={list.data}
              columns={columns}
              keyExtractor={(row) => row._id}
            />
            
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700 text-sm text-slate-500">
              <div>
                Showing {(list.page - 1) * list.limit + (list.total > 0 ? 1 : 0)} - {Math.min(list.page * list.limit, list.total)} of {list.total} entries
              </div>
              <div className="flex gap-2">
                <button
                  disabled={list.page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="rounded px-3 py-1 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Prev
                </button>
                <button
                  disabled={list.page === list.totalPages || list.totalPages === 0}
                  onClick={() => setPage(p => Math.min(list.totalPages, p + 1))}
                  className="rounded px-3 py-1 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Category Distribution</h3>
          {loading ? (
            <div className="py-8 text-center text-slate-500">Loading distribution...</div>
          ) : (
            <div className="space-y-5">
              {distribution.map((item) => (
                <ProgressBar
                  key={item.category}
                  label={item.category}
                  value={item.percentage}
                  max={100}
                  variant="default"
                  showValue
                />
              ))}
              {distribution.length === 0 && (
                <div className="text-center text-slate-500 py-4">No data available</div>
              )}
            </div>
          )}
        </Card>

        <InsightCard
          title="Smart Insights"
          message={
            summary && summary.monthlyTotalTrendPct > 0
              ? `Your spending is up ${summary.monthlyTotalTrendPct.toFixed(1)}% compared to the previous period. Keep an eye on your top categories.`
              : summary && summary.monthlyTotalTrendPct < 0
              ? `Great job! Your spending has decreased by ${Math.abs(summary.monthlyTotalTrendPct).toFixed(1)}%.`
              : `You are maintaining a steady spending pattern.`
          }
          actionLabel="View Detailed Report"
          onAction={() => console.log('Navigate to reports')}
        />
      </div>

      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => {
          fetchAllData();
        }}
      />
    </div>
  );
};

export default ExpensePage;
