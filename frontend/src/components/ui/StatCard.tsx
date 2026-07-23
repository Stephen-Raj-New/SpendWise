import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, className, iconClassName }) => {
  return (
    <Card className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconClassName || "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400")}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center text-sm">
            <span
              className={cn(
                'flex items-center font-medium',
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              )}
            >
              {trend.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {Math.abs(trend.value)}%
            </span>
            <span className="ml-2 text-slate-500 dark:text-slate-400">{trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
