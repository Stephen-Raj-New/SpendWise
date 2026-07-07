import React from 'react';
import { cn } from '../../lib/utils';
import { Filter, SortDesc } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterBarProps {
  filters: FilterGroup[];
  onFilterChange: (id: string, value: string) => void;
  onClearFilters?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">
        <Filter size={16} className="mr-2" />
        Filters:
      </div>
      
      {filters.map((filter) => (
        <select
          key={filter.id}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.id, e.target.value)}
          className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600"
        >
          <option value="" disabled>
            {filter.label}
          </option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="ml-auto text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Clear All
        </button>
      )}
    </div>
  );
};
