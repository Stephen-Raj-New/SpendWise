import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../ui/Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createExpense, updateExpense } from '../../features/expenses/redux/expenseThunk';
import { fetchCategories, createCategoryThunk } from '../../features/categories/redux/categoryThunk';
import { CreatableSelect } from '../ui/CreatableSelect';
import type { Expense } from '../../features/expenses/services/expenseService';
import toast from 'react-hot-toast';

const expenseSchema = Yup.object().shape({
  merchant: Yup.string().required('Merchant is required'),
  category: Yup.string().required('Category is required'),
  amount: Yup.number().positive('Amount must be greater than 0').required('Amount is required'),
  date: Yup.string().required('Date is required'),
});

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Expense | null;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.category.list.filter(c => c.type === 'expense'));
  console.log("expense category", categories)

  React.useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories('expense'));
    }
  }, [isOpen, dispatch]);

  const handleCreateCategory = (inputValue: string) => {
    formik.setFieldValue('category', inputValue);
  };
  
  const formik = useFormik({
    initialValues: {
      merchant: initialData?.merchant || '',
      category: initialData?.category || '',
      amount: initialData?.amount || ('' as unknown as number),
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    },
    enableReinitialize: true,
    validationSchema: expenseSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        let finalCategory = values.category;
        
        // Check if category is new
        const exists = categories.find(c => c.name.toLowerCase() === finalCategory.toLowerCase());
        if (!exists) {
          const newCat = await dispatch(createCategoryThunk({ name: finalCategory, type: 'expense', color: '#ef4444' })).unwrap();
          finalCategory = newCat.name;
        }

        const payload = { ...values, category: finalCategory, amount: Number(values.amount) };
        
        if (initialData) {
          await dispatch(updateExpense({ id: initialData._id, payload })).unwrap();
          toast.success('Expense updated successfully');
        } else {
          await dispatch(createExpense(payload as Partial<Expense>)).unwrap();
          toast.success('Expense created successfully');
        }
        
        resetForm();
        onSuccess();
        onClose();
      } catch (err: any) {
        toast.error(err.message || 'Failed to save expense');
        console.error('Failed to save expense:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isEditMode = !!initialData;

  return (
    <Modal isOpen={isOpen} onClose={() => { formik.resetForm(); onClose(); }} title={isEditMode ? "Edit Expense" : "Add Expense"}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Merchant</label>
          <input
            name="merchant"
            value={formik.values.merchant}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            disabled={isEditMode}
            placeholder="e.g. Amazon, Uber, Whole Foods"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
          />
          {formik.touched.merchant && formik.errors.merchant && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.merchant}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
          <CreatableSelect
            name="category"
            options={categories.map(c => ({ label: c.name, value: c.name }))}
            value={formik.values.category}
            onChange={(val) => formik.setFieldValue('category', val)}
            onCreateOption={handleCreateCategory}
            placeholder="Select or add category..."
            error={formik.touched.category && formik.errors.category ? formik.errors.category as string : undefined}
            onBlur={() => formik.setFieldTouched('category', true)}
            disabled={isEditMode}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
            <input
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
            <input
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="date"
              disabled={isEditMode}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
            />
            {formik.touched.date && formik.errors.date && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.date}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => { formik.resetForm(); onClose(); }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {formik.isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Expense' : 'Save Expense')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
