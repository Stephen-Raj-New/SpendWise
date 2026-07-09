import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTransactionList } from '../../features/transactions/redux/transactionThunk';
import { transactionService } from '../../features/transactions/services/transactionService';
import type { Transaction } from '../../features/transactions/services/transactionService';
import { useLayout } from '../../layouts/DashboardLayout';
import { Card } from '../ui/Card';
import { DataTable } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { FilterBar } from '../ui/FilterBar';
import { TimeFilter } from '../ui/TimeFilter';
import type { TimeFilterState } from '../ui/TimeFilter';
import { Download, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { generatePDF } from '../../utils/generatePDF';

const TransactionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setNavbarProps } = useLayout();
  const [timeFilter, setTimeFilter] = useState<TimeFilterState>({
    range: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    quarter: Math.floor(new Date().getMonth() / 3) + 1,
  });
  
  // Local state for pagination and filtering
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ type?: string; category?: string; range?: string, year?: number, month?: number, quarter?: number }>({});

  const { list, loading } = useAppSelector((state) => state.transactions);

  const fetchAllData = () => {
    dispatch(fetchTransactionList({ ...filters, page, limit: 15 }));
  };

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search transactions...',
      actionLabel: '',
      onAction: () => {},
    });
  }, [setNavbarProps]);

  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      range: timeFilter.range,
      year: timeFilter.year,
      month: timeFilter.month,
      quarter: timeFilter.quarter
    }));
    setPage(1); // Reset page on filter change
  }, [timeFilter]);

  useEffect(() => {
    fetchAllData();
  }, [dispatch, filters, page]);

  const handleExportCsv = async () => {
    try {
      await transactionService.exportTransactionCsv(filters);
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  const handleExportPdf = async () => {
    try {
      // Fetch unpaginated data for export
      const response = await transactionService.getTransactionList({ ...filters, limit: 10000 });
      
      const headers = ['Date', 'Title / Merchant', 'Type', 'Category', 'Description', 'Amount'];
      const pdfData = response.data.map(item => [
        new Date(item.date).toLocaleDateString(),
        item.title,
        item.type.toUpperCase(),
        item.category,
        item.description || '',
        `${item.type === 'income' ? '+' : '-'}₹${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      ]);

      generatePDF({
        title: 'Transactions Ledger',
        filename: 'transactions-export',
        headers,
        data: pdfData
      });
    } catch (err) {
      console.error('Failed to export PDF', err);
    }
  };

  // Derive unique categories for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(list.data.map(e => e.category)));
    return categories.map(c => ({ label: c, value: c }));
  }, [list.data]);

  const columns = [
    { 
      header: 'Title / Merchant', 
      accessor: (row: Transaction) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold ${row.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'}`}>
            {row.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{row.title}</div>
            {row.description && <div className="text-xs text-slate-500 dark:text-slate-400">{row.description}</div>}
          </div>
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: (row: Transaction) => (
        <Badge variant={row.type === 'income' ? 'success' : 'error'}>
          {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
        </Badge>
      )
    },
    { 
      header: 'Category', 
      accessor: (row: Transaction) => <Badge variant="neutral">{row.category}</Badge>
    },
    { 
      header: 'Date', 
      accessor: (row: Transaction) => new Date(row.date).toLocaleDateString()
    },
    { 
      header: 'Amount', 
      accessor: (row: Transaction) => (
        <div className={`text-right font-medium ${row.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'}`}>
          {row.type === 'income' ? '+' : ''}₹{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transactions Ledger</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Unified view of all your incomes and expenses.</p>
        </div>
        <div className="flex">
          <TimeFilter filter={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>

      {/* Table & Filters Card */}
      <Card>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <FilterBar
            filters={[
              {
                id: 'type',
                label: 'All Types',
                value: filters.type || '',
                options: [
                  { label: 'Income', value: 'income' },
                  { label: 'Expense', value: 'expense' }
                ],
              },
              {
                id: 'category',
                label: 'All Categories',
                value: filters.category || '',
                options: uniqueCategories,
              }
            ]}
            onFilterChange={(id, value) => {
              setFilters(prev => ({ ...prev, [id]: value }));
              setPage(1);
            }}
            onClearFilters={() => {
              setFilters({ 
                range: timeFilter.range,
                year: timeFilter.year,
                month: timeFilter.month,
                quarter: timeFilter.quarter
              });
              setPage(1);
            }}
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
          <div className="py-12 text-center text-slate-500">Loading transactions...</div>
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
    </div>
  );
};

export default TransactionPage;
