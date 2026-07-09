import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchIncomeList, 
  fetchIncomeSummary, 
  fetchSourceDistribution,
  deleteIncomeThunk
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
import { TimeFilter } from '../ui/TimeFilter';
import type { TimeFilterState } from '../ui/TimeFilter';
import { Wallet, TrendingUp, Award, Download, FileText, Edit2, Trash2 } from 'lucide-react';
import { AddIncomeModal } from './AddIncomeModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { generatePDF } from '../../utils/generatePDF';
import toast from 'react-hot-toast';

const IncomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setNavbarProps } = useLayout();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editData, setEditData] = useState<Income | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilterState>({
    range: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    quarter: Math.floor(new Date().getMonth() / 3) + 1,
  });

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
    dispatch(fetchIncomeSummary(timeFilter as any));
    dispatch(fetchSourceDistribution(timeFilter as any));
  };

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search income...',
      actionLabel: 'Add Income',
      onAction: () => {
        setEditData(null);
        setIsAddModalOpen(true);
      },
    });
  }, [setNavbarProps]);

  useEffect(() => {
    dispatch(setFilters({ 
      range: timeFilter.range,
      year: timeFilter.year as any,
      month: timeFilter.month as any,
      quarter: timeFilter.quarter as any
    }));
  }, [timeFilter, dispatch]);

  useEffect(() => {
    fetchAllData();
  }, [dispatch, filters, page]);

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

  const handleDelete = async () => {
    if (!incomeToDelete) return;
    try {
      await dispatch(deleteIncomeThunk(incomeToDelete)).unwrap();
      toast.success('Income deleted successfully');
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete income');
    } finally {
      setIsDeleteModalOpen(false);
      setIncomeToDelete(null);
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
    {
      header: 'Actions',
      accessor: (row: Income) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setEditData(row);
              setIsAddModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/50 dark:hover:text-blue-400 transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setIncomeToDelete(row._id);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Income Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage your revenue streams.</p>
        </div>
        <div className="flex">
          <TimeFilter filter={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title={`${timeFilter.range.charAt(0).toUpperCase() + timeFilter.range.slice(1)}ly Total`}
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
        onClose={() => {
          setIsAddModalOpen(false);
          setEditData(null);
        }} 
        onSuccess={() => {
          fetchAllData();
        }}
        initialData={editData}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Income"
        message="Are you sure you want to delete this income record? This action cannot be undone and will affect your total balances."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIncomeToDelete(null);
        }}
      />
    </div>
  );
};

export default IncomePage;
