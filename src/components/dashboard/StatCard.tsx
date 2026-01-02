import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  valueClassName,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 animate-slide-up",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className={cn("text-3xl font-bold tracking-tight", valueClassName)}>
          {value}
        </p>
        
        {(subtitle || trend) && (
          <div className="flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-positive" : "text-negative"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
