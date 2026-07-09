import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchDashboardSummary, 
  fetchIncomeVsExpense, 
  fetchSpendingByCategory, 
  fetchRecentTransactions, 
  fetchBudgetProgress 
} from '../../features/dashboard/redux/dashboardThunk';
import { useLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { LineBarComboChart, DonutChart } from '../ui/Charts';
import { DataTable } from '../ui/DataTable';
import { ProgressBar } from '../ui/ProgressBar';
import { InsightCard } from '../ui/InsightCard';
import { Wallet, CreditCard, PiggyBank, IndianRupee } from 'lucide-react';
import type { Transaction } from '../../features/dashboard/services/dashboardService';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setNavbarProps } = useLayout();
  const [period, setPeriod] = useState('this-month');

  const {
    summary,
    incomeVsExpense,
    spendingByCategory,
    recentTransactions,
    budgetProgress
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search transactions...',
      actionLabel: 'Add Transaction',
      onAction: () => console.log('Add Transaction clicked'),
    });
  }, [setNavbarProps]);

  useEffect(() => {
    dispatch(fetchDashboardSummary(period));
    dispatch(fetchIncomeVsExpense());
    dispatch(fetchSpendingByCategory());
    dispatch(fetchRecentTransactions({ page: 1, limit: 5 }));
    dispatch(fetchBudgetProgress());
  }, [dispatch, period]);

  const columns = [
    { header: 'Merchant', accessor: 'merchant' as keyof Transaction },
    { header: 'Category', accessor: 'category' as keyof Transaction },
    { 
      header: 'Date', 
      accessor: (row: Transaction) => new Date(row.date).toLocaleDateString(),
    },
    { 
      header: 'Amount', 
      accessor: (row: Transaction) => (
        <span className={row.type === 'income' ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-700 dark:text-slate-300'}>
          {row.type === 'income' ? '+' : ''}${Math.abs(row.amount).toFixed(2)}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-full sm:w-auto appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none hover:bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="this-year">This Year</option>
        </select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={summary.data ? `₹${summary.data.totalBalance.toLocaleString()}` : '...'}
          icon={<IndianRupee />}
          trend={summary.data ? { value: summary.data.totalBalanceTrendPct, label: 'vs last month', isPositive: summary.data.totalBalanceTrendPct >= 0 } : undefined}
        />
        <StatCard
          title="Total Income"
          value={summary.data ? `₹${summary.data.income.toLocaleString()}` : '...'}
          icon={<Wallet />}
          className="border-l-4 border-emerald-500"
        />
        <StatCard
          title="Total Expenses"
          value={summary.data ? `₹${summary.data.expenses.toLocaleString()}` : '...'}
          icon={<CreditCard />}
          className="border-l-4 border-red-500"
        />
        <StatCard
          title="Budget Goal"
          value={summary.data ? `₹${summary.data.budgetGoal.toLocaleString()}` : '...'}
          icon={<PiggyBank />}
          className="border-l-4 border-blue-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Income vs Expense</h3>
          {incomeVsExpense.loading ? (
            <div className="h-[300px] flex items-center justify-center text-slate-400">Loading chart...</div>
          ) : (
            <LineBarComboChart 
              data={incomeVsExpense.data} 
              xKey="label" 
              barKey="expense" 
              lineKey="income" 
            />
          )}
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Spending by Category</h3>
          {spendingByCategory.loading ? (
            <div className="h-[300px] flex items-center justify-center text-slate-400">Loading chart...</div>
          ) : (
            <DonutChart 
              data={spendingByCategory.data} 
              dataKey="amount" 
              nameKey="category" 
            />
          )}
        </Card>
      </div>

      {/* Transactions & Budget Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Transactions</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View All</button>
          </div>
          {recentTransactions.loading ? (
            <div className="py-8 text-center text-slate-400">Loading transactions...</div>
          ) : (
            <DataTable
              data={recentTransactions.data?.data || []}
              columns={columns}
              keyExtractor={(row) => row.id}
            />
          )}
        </Card>
        
        <div className="space-y-6">
          <InsightCard
            title="Smart Insight"
            message="Your spending on Food is 20% lower than last month. Keep it up!"
            actionLabel="View Details"
            onAction={() => console.log('Insight action')}
          />
          
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Budget Progress</h3>
            {budgetProgress.loading ? (
              <div className="py-4 text-center text-slate-400">Loading budget...</div>
            ) : (
              <div className="space-y-5">
                {budgetProgress.data.map((item) => (
                  <ProgressBar
                    key={item.category}
                    label={item.category}
                    value={item.spent}
                    max={item.limit}
                    variant={item.status}
                    showValue
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
