import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import dashboardReducer from '../features/dashboard/redux/dashboardSlice';
import incomeReducer from '../features/income/redux/incomeSlice';
import expenseReducer from '../features/expenses/redux/expenseSlice';
import transactionReducer from '../features/transactions/redux/transactionSlice';
import budgetReducer from '../features/budget/redux/budgetSlice';
import categoryReducer from '../features/categories/redux/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    income: incomeReducer,
    expenses: expenseReducer,
    transactions: transactionReducer,
    budget: budgetReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
