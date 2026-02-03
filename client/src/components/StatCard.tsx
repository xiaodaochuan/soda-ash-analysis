import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  description?: string;
}

export function StatCard({
  title,
  value,
  unit,
  change,
  icon,
  description,
}: StatCardProps) {
  return (
    <div className="data-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="data-card-title">{title}</p>
        </div>
        {icon && <div className="text-accent text-2xl">{icon}</div>}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="data-card-value">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </div>

      {change && (
        <div className={`text-sm font-medium ${change.isPositive ? "text-green-400" : "text-red-400"}`}>
          {change.isPositive ? "↑" : "↓"} {Math.abs(change.value)}%
        </div>
      )}
    </div>
  );
}
