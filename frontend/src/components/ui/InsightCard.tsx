import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InsightCardProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  message,
  icon = <Sparkles className="text-blue-200" size={24} />,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <Card className={cn('bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0', className)}>
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-blue-100">{message}</p>
      </div>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            onClick={onAction}
            className="flex items-center text-sm font-medium text-white hover:text-blue-100 transition-colors group"
          >
            {actionLabel}
            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </Card>
  );
};
