import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories, deleteCategoryThunk } from '../../features/categories/redux/categoryThunk';
import { useLayout } from '../../layouts/DashboardLayout';
import { Card } from '../ui/Card';
import { AddCategoryModal } from './AddCategoryModal';
import { Trash2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../ui/Badge';

const CategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setNavbarProps } = useLayout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('');

  const { list, loading } = useAppSelector((state) => state.category);

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search categories...',
      actionLabel: 'Add Category',
      onAction: () => setIsModalOpen(true),
    });
  }, [setNavbarProps]);

  useEffect(() => {
    dispatch(fetchCategories(filterType || undefined));
  }, [dispatch, filterType]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await dispatch(deleteCategoryThunk(id));
      dispatch(fetchCategories(filterType || undefined));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Categories</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your custom classification tags.</p>
        </div>
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {[
            { label: 'All', value: '' },
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setFilterType(r.value)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                filterType === r.value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">Loading categories...</div>
        ) : list.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              <AlertCircle size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No categories found</h3>
            <p className="mt-1 text-slate-500">Create a category to get started.</p>
          </div>
        ) : (
          list.map(category => (
            <Card key={category._id} className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</h4>
                  <Badge variant={category.type === 'income' ? 'success' : 'neutral'}>
                    {category.type}
                  </Badge>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(category._id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </Card>
          ))
        )}
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => dispatch(fetchCategories(filterType || undefined))}
      />
    </div>
  );
};

export default CategoriesPage;
