import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../ui/Modal';
import { useAppDispatch } from '../../store/hooks';
import { createCategoryThunk } from '../../features/categories/redux/categoryThunk';

const categorySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  color: Yup.string().required('Color is required'),
  type: Yup.string().oneOf(['income', 'expense']).required('Type is required'),
});

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  
  const formik = useFormik({
    initialValues: {
      name: '',
      color: '#3b82f6',
      type: 'expense' as 'income' | 'expense',
    },
    validationSchema: categorySchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(createCategoryThunk(values)).unwrap();
        resetForm();
        onSuccess();
        onClose();
      } catch (err) {
        console.error('Failed to create category:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={() => { formik.resetForm(); onClose(); }} title="Create Category">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
          <input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="e.g. Groceries"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <select
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Color</label>
            <input
              name="color"
              value={formik.values.color}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="color"
              className="h-[38px] w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-1 py-1 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
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
            {formik.isSubmitting ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
