import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../ui/Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createIncomeThunk, updateIncomeThunk } from '../../features/income/redux/incomeThunk';
import { fetchCategories, createCategoryThunk } from '../../features/categories/redux/categoryThunk';
import { CreatableSelect } from '../ui/CreatableSelect';
import type { Income } from '../../features/income/services/incomeService';
import toast from 'react-hot-toast';

const incomeSchema = Yup.object().shape({
  source: Yup.string().required('Source is required'),
  description: Yup.string(),
  category: Yup.string().required('Category is required'),
  amount: Yup.number().positive('Amount must be greater than 0').required('Amount is required'),
  date: Yup.string().required('Date is required'),
  status: Yup.string().oneOf(['Confirmed', 'Processing', 'Failed']).required('Status is required'),
});

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Income | null;
}

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.category.list.filter(c => c.type === 'income'));

  React.useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories('income'));
    }
  }, [isOpen, dispatch]);

  const handleCreateCategory = (inputValue: string) => {
    formik.setFieldValue('category', inputValue);
  };
  
  const formik = useFormik({
    initialValues: {
      source: initialData?.source || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      status: initialData?.status || 'Confirmed',
      amount: initialData?.amount || ('' as unknown as number), // Let it be empty initially but treat as number
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    },
    enableReinitialize: true,
    validationSchema: incomeSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        let finalCategory = values.category;
        
        // Check if category is new
        const exists = categories.find(c => c.name.toLowerCase() === finalCategory.toLowerCase());
        if (!exists) {
          const newCat = await dispatch(createCategoryThunk({ name: finalCategory, type: 'income', color: '#10b981' })).unwrap();
          finalCategory = newCat.name;
        }

        const payload = { ...values, category: finalCategory as any, amount: Number(values.amount) };
        
        if (initialData) {
          await dispatch(updateIncomeThunk({ id: initialData._id, payload })).unwrap();
          toast.success('Income updated successfully');
        } else {
          await dispatch(createIncomeThunk(payload as Partial<Income>)).unwrap();
          toast.success('Income created successfully');
        }
        
        resetForm();
        onSuccess();
        onClose();
      } catch (err: any) {
        toast.error(err.message || 'Failed to save income');
        console.error('Failed to save income:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isEditMode = !!initialData;

  return (
    <Modal isOpen={isOpen} onClose={() => { formik.resetForm(); onClose(); }} title={isEditMode ? "Edit Income" : "Add Income"}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Source</label>
          <input
            name="source"
            value={formik.values.source}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            disabled={isEditMode}
            placeholder="e.g. Nexus Holdings"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
          />
          {formik.touched.source && formik.errors.source && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.source}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
          <input
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            disabled={isEditMode}
            placeholder="e.g. Monthly Retainer"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <CreatableSelect
              name="category"
              options={categories.map(c => ({ label: c.name, value: c.name }))}
              value={formik.values.category}
              onChange={(val) => formik.setFieldValue('category', val)}
              onCreateOption={handleCreateCategory}
              placeholder="e.g. Service Revenue"
              error={formik.touched.category && formik.errors.category ? formik.errors.category as string : undefined}
              onBlur={() => formik.setFieldTouched('category', true)}
              disabled={isEditMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isEditMode}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.status}</p>
            )}
          </div>
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
            {formik.isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Income' : 'Save Income')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
