import React from 'react';

export type TimeRange = 'month' | 'quarter' | 'year';

export interface TimeFilterState {
  range: TimeRange;
  year: number;
  month: number; // 1-12
  quarter: number; // 1-4
}

interface TimeFilterProps {
  filter: TimeFilterState;
  onChange: (newFilter: TimeFilterState) => void;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({ filter, onChange }) => {
  const currentYear = new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1;
  const currentQuarterNum = Math.floor(new Date().getMonth() / 3) + 1;

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // e.g. 2026, 2025...

  let months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  let quarters = [
    { value: 1, label: 'Q1 (Jan-Mar)' },
    { value: 2, label: 'Q2 (Apr-Jun)' },
    { value: 3, label: 'Q3 (Jul-Sep)' },
    { value: 4, label: 'Q4 (Oct-Dec)' },
  ];

  if (filter.year === currentYear) {
    months = months.filter(m => m.value <= currentMonthNum);
    quarters = quarters.filter(q => q.value <= currentQuarterNum);
  }

  // Ensure selected month/quarter is valid if user changes year to currentYear
  React.useEffect(() => {
    if (filter.year === currentYear) {
      if (filter.month > currentMonthNum) onChange({ ...filter, month: currentMonthNum });
      if (filter.quarter > currentQuarterNum) onChange({ ...filter, quarter: currentQuarterNum });
    }
  }, [filter.year, currentYear, currentMonthNum, currentQuarterNum]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
      <div className="flex rounded-md bg-slate-200/50 p-1 dark:bg-slate-700 w-full sm:w-auto">
        {(['month', 'quarter', 'year'] as TimeRange[]).map((r) => (
          <button
            key={r}
            onClick={() => onChange({ ...filter, range: r })}
            className={`flex-1 rounded px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter.range === r
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex w-full sm:w-auto items-center gap-2">
        {filter.range === 'month' && (
          <select
            value={filter.month}
            onChange={(e) => onChange({ ...filter, month: Number(e.target.value) })}
            className="flex-1 sm:flex-none appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-200"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        )}

        {filter.range === 'quarter' && (
          <select
            value={filter.quarter}
            onChange={(e) => onChange({ ...filter, quarter: Number(e.target.value) })}
            className="flex-1 sm:flex-none appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-200"
          >
            {quarters.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        )}

        <select
          value={filter.year}
          onChange={(e) => onChange({ ...filter, year: Number(e.target.value) })}
          className="flex-1 sm:flex-none appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-200"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
