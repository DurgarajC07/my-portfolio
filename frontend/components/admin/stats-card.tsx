import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function StatsCard({
  label,
  value,
  change,
  icon: Icon,
  color = 'blue',
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  };

  const isPositive = change && change > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-2 font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
