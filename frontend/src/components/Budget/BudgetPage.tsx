import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBudgets, deleteBudgetThunk } from '../../features/budget/redux/budgetThunk';
import { useLayout } from '../../layouts/DashboardLayout';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { SetBudgetModal } from './SetBudgetModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { Trash2, AlertCircle } from 'lucide-react';
import { TimeFilter } from '../ui/TimeFilter';
import type { TimeFilterState } from '../ui/TimeFilter';
import toast from 'react-hot-toast';

const BudgetPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setNavbarProps } = useLayout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilterState>({
    range: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    quarter: Math.floor(new Date().getMonth() / 3) + 1,
  });

  const { list, loading } = useAppSelector((state) => state.budget);

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search budgets...',
      actionLabel: 'Set Budget',
      onAction: () => setIsModalOpen(true),
    });
  }, [setNavbarProps]);

  useEffect(() => {
    dispatch(fetchBudgets(timeFilter));
  }, [dispatch, timeFilter]);

  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (budgetToDelete) {
      try {
        await dispatch(deleteBudgetThunk(budgetToDelete)).unwrap();
        toast.success('Budget deleted successfully');
        dispatch(fetchBudgets(timeFilter));
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete budget');
      } finally {
        setBudgetToDelete(null);
        setDeleteModalOpen(false);
      }
    }
  };

  const totalBudget = list.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = list.reduce((acc, b) => acc + b.spent, 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Budgets</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your spending limits by category.</p>
        </div>
        <div>
          <TimeFilter filter={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>

      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Overall Monthly Budget</h3>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Total Spent: ₹{totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">Budget: ₹{totalBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <ProgressBar
            value={overallProgress}
            max={100}
            variant={overallProgress > 90 ? 'danger' : overallProgress > 75 ? 'warning' : 'success'}
            className="mt-2"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">Loading budgets...</div>
        ) : list.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              <AlertCircle size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No budgets set</h3>
            <p className="mt-1 text-slate-500">Set a budget to start tracking your spending.</p>
          </div>
        ) : (
          list.map(budget => {
            const progress = (budget.spent / budget.limit) * 100;
            const variant = progress > 90 ? 'danger' : progress > 75 ? 'warning' : 'success';
            return (
              <Card key={budget._id}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{budget.category}</h4>
                  <button 
                    onClick={() => handleDeleteClick(budget._id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Spent: ₹{budget.spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">₹{budget.limit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <ProgressBar
                    value={progress}
                    max={100}
                    variant={variant}
                  />
                  {progress > 100 && (
                    <p className="text-xs text-red-500 mt-2">Over budget by ₹{(budget.spent - budget.limit).toLocaleString()}</p>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <SetBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMonth={timeFilter.month ? `${timeFilter.year}-${String(timeFilter.month).padStart(2, '0')}` : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
        onSuccess={() => dispatch(fetchBudgets(timeFilter))}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
        confirmText="Delete"
      />
    </div>
  );
};

export default BudgetPage;
