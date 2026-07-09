import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchIncomeList, 
  fetchIncomeSummary, 
  fetchSourceDistribution,
} from '../../features/income/redux/incomeThunk';
import { setFilters, setPage } from '../../features/income/redux/incomeSlice';
import { incomeService } from '../../features/income/services/incomeService';
import type { Income } from '../../features/income/services/incomeService';
import { useLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { DataTable } from '../ui/DataTable';
import { ProgressBar } from '../ui/ProgressBar';
import { InsightCard } from '../ui/InsightCard';
import { Badge } from '../ui/Badge';
import { FilterBar } from '../ui/FilterBar';
import { Wallet, TrendingUp, Award, Download, FileText } from 'lucide-react';
import { AddIncomeModal } from './AddIncomeModal';
import { generatePDF } from '../../utils/generatePDF';

const IncomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setNavbarProps } = useLayout();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('month');

  const {
    list,
    total,
    page,
    totalPages,
    filters,
    summary,
    sourceDistribution,
    loading
  } = useAppSelector((state) => state.income);

  const fetchAllData = () => {
    dispatch(fetchIncomeList({ ...filters, page, limit: 10 }));
    dispatch(fetchIncomeSummary(selectedRange));
    dispatch(fetchSourceDistribution(selectedRange));
  };

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search income...',
      actionLabel: 'Add Income',
      onAction: () => setIsAddModalOpen(true),
    });
  }, [setNavbarProps]);

  useEffect(() => {
    dispatch(setFilters({ range: selectedRange }));
  }, [selectedRange, dispatch]);

  useEffect(() => {
    fetchAllData();
  }, [dispatch, filters, page, selectedRange]);

  const handleExportCsv = async () => {
    try {
      await incomeService.exportIncomeCsv(filters);
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  const handleExportPdf = async () => {
    try {
      // Fetch unpaginated data for export
      const response = await incomeService.getIncomeList({ ...filters, limit: 10000 });
      
      const headers = ['Date', 'Source', 'Category', 'Status', 'Amount'];
      const pdfData = response.data.map(item => [
        new Date(item.date).toLocaleDateString(),
        item.source,
        item.category,
        item.status,
        `₹${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      ]);

      generatePDF({
        title: 'Income Report',
        filename: 'income-export',
        headers,
        data: pdfData
      });
    } catch (err) {
      console.error('Failed to export PDF', err);
    }
  };

  // Derive unique sources for the filter dropdown
  const uniqueSources = useMemo(() => {
    const sources = Array.from(new Set(list.map(i => i.source)));
    return sources.map(s => ({ label: s, value: s }));
  }, [list]);

  const columns = [
    { 
      header: 'Source', 
      accessor: (row: Income) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold">
            {row.source.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{row.source}</div>
            {row.description && <div className="text-xs text-slate-500 dark:text-slate-400">{row.description}</div>}
          </div>
        </div>
      )
    },
    { 
      header: 'Category', 
      accessor: (row: Income) => <Badge variant="neutral">{row.category}</Badge>
    },
    { 
      header: 'Date', 
      accessor: (row: Income) => new Date(row.date).toLocaleDateString()
    },
    { 
      header: 'Amount', 
      accessor: (row: Income) => (
        <div className="text-right font-medium text-slate-900 dark:text-slate-100">
          ₹{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (row: Income) => {
        let variant: 'success' | 'warning' | 'error' = 'success';
        if (row.status === 'Processing') variant = 'warning';
        if (row.status === 'Failed') variant = 'error';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Income Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage your revenue streams.</p>
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
          icon={<Wallet />}
          trend={summary ? { 
            value: summary.monthlyTotalTrendPct, 
            label: 'vs prev period', 
            isPositive: summary.monthlyTotalTrendPct >= 0 
          } : undefined}
        />
        <StatCard
          title="Avg per Transaction"
          value={summary ? `₹${summary.avgPerTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '...'}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Top Source"
          value={summary ? summary.topSource.name : '...'}
          icon={<Award />}
          trend={summary && summary.topSource.percentage > 0 ? {
            value: summary.topSource.percentage,
            label: 'of total income',
            isPositive: true
          } : undefined}
        />
      </div>

      {/* Table & Filters Card */}
      <Card>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <FilterBar
            filters={[
              {
                id: 'source',
                label: 'All Sources',
                value: filters.source || '',
                options: uniqueSources,
              }
            ]}
            onFilterChange={(id, value) => dispatch(setFilters({ [id]: value }))}
            onClearFilters={() => dispatch(setFilters({ source: '' }))}
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

        {loading.list ? (
          <div className="py-12 text-center text-slate-500">Loading income data...</div>
        ) : (
          <>
            <DataTable
              data={list}
              columns={columns}
              keyExtractor={(row) => row._id}
            />
            
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700 text-sm text-slate-500">
              <div>
                Showing {(page - 1) * 10 + 1} - {Math.min(page * 10, total)} of {total} entries
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => dispatch(setPage(page - 1))}
                  className="rounded px-3 py-1 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Prev
                </button>
                <button
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => dispatch(setPage(page + 1))}
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
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Source Distribution</h3>
          {loading.distribution ? (
            <div className="py-8 text-center text-slate-500">Loading distribution...</div>
          ) : (
            <div className="space-y-5">
              {sourceDistribution.map((item) => (
                <ProgressBar
                  key={item.source}
                  label={item.source}
                  value={item.percentage}
                  max={100}
                  variant="default"
                  showValue
                />
              ))}
              {sourceDistribution.length === 0 && (
                <div className="text-center text-slate-500 py-4">No data available</div>
              )}
            </div>
          )}
        </Card>

        <InsightCard
          title="Smart Insights"
          message={
            summary && summary.monthlyTotalTrendPct > 0
              ? `Your income is up ${summary.monthlyTotalTrendPct.toFixed(1)}% compared to the previous period. Great job diversifying your revenue streams!`
              : summary && summary.monthlyTotalTrendPct < 0
              ? `Your income has decreased by ${Math.abs(summary.monthlyTotalTrendPct).toFixed(1)}%. Consider analyzing your top sources for any drop-offs.`
              : `You are maintaining a steady income stream across your sources.`
          }
          actionLabel="View Detailed Report"
          onAction={() => console.log('Navigate to reports')}
        />
      </div>

      <AddIncomeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => {
          fetchAllData();
        }}
      />
    </div>
  );
};

export default IncomePage;
