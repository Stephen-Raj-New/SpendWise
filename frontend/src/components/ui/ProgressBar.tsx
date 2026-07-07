import React from 'react';
import { cn } from '../../lib/utils';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: ProgressVariant;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  variant = 'default',
  label,
  showValue = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getVariantClass = (pct: number, explicitVariant: ProgressVariant) => {
    if (explicitVariant !== 'default') {
      const colors = {
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-red-500',
      };
      return colors[explicitVariant];
    }
    
    if (pct < 70) return 'bg-emerald-500';
    if (pct < 90) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1 flex justify-between text-sm">
          {label && <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>}
          {showValue && <span className="text-slate-500 dark:text-slate-400">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className={cn('h-full rounded-full transition-all duration-300', getVariantClass(percentage, variant))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
