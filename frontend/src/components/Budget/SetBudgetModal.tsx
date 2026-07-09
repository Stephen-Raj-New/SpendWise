import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../ui/Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBudgetThunk } from '../../features/budget/redux/budgetThunk';
import { fetchCategories, createCategoryThunk } from '../../features/categories/redux/categoryThunk';
import { CreatableSelect } from '../ui/CreatableSelect';

const budgetSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  limit: Yup.number().positive('Limit must be greater than 0').required('Limit is required'),
});

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedMonth: string;
}

export const SetBudgetModal: React.FC<SetBudgetModalProps> = ({ isOpen, onClose, onSuccess, selectedMonth }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.category.list.filter(c => c.type === 'expense'));

  React.useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories('expense'));
    }
  }, [isOpen, dispatch]);

  const handleCreateCategory = async (inputValue: string) => {
    try {
      const res = await dispatch(createCategoryThunk({ name: inputValue, type: 'expense', color: '#ef4444' })).unwrap();
      formik.setFieldValue('category', res.name);
      dispatch(fetchCategories('expense'));
    } catch (err) {
      console.error('Failed to create category', err);
    }
  };
  
  const formik = useFormik({
    initialValues: {
      category: '',
      limit: '' as unknown as number,
    },
    validationSchema: budgetSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(setBudgetThunk({ 
          category: values.category, 
          limit: Number(values.limit),
          month: selectedMonth
        })).unwrap();
        resetForm();
        onSuccess();
        onClose();
      } catch (err) {
        console.error('Failed to set budget:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={() => { formik.resetForm(); onClose(); }} title="Set Category Budget">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Limit (₹)</label>
          <input
            name="limit"
            value={formik.values.limit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
          {formik.touched.limit && formik.errors.limit && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.limit}</p>
          )}
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
            {formik.isSubmitting ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
