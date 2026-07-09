import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../ui/Modal';
import { useAppDispatch } from '../../store/hooks';
import { createExpense } from '../../features/expenses/redux/expenseThunk';
import type { Expense } from '../../features/expenses/services/expenseService';

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
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  
  const formik = useFormik({
    initialValues: {
      merchant: '',
      category: 'Food',
      amount: '' as unknown as number,
      date: new Date().toISOString().split('T')[0],
    },
    validationSchema: expenseSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = { ...values, amount: Number(values.amount) };
        await dispatch(createExpense(payload as Partial<Expense>)).unwrap();
        resetForm();
        onSuccess();
        onClose();
      } catch (err) {
        console.error('Failed to create expense:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={() => { formik.resetForm(); onClose(); }} title="Add Expense">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Merchant</label>
          <input
            name="merchant"
            value={formik.values.merchant}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="e.g. Amazon, Uber, Whole Foods"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
          {formik.touched.merchant && formik.errors.merchant && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.merchant}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="Food">Food</option>
            <option value="Housing">Housing</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.category}</p>
          )}
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
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
            {formik.isSubmitting ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
