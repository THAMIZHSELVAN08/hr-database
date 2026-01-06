'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { STATUS_COLORS } from '@/lib/statusColors';

interface StatusDonutCardProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

export default function StatusDonutCard({
  label,
  value,
  total,
}: StatusDonutCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const data = [
    { name: 'filled', value: value },
    { name: 'empty', value: total - value },
  ];

  const fillColor = STATUS_COLORS[label] || '#6b7280';

  return (
    <div 
      className="bg-card text-card-foreground rounded-xl p-6 border border-border hover:shadow-lg transition-all hover:border-border/80"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <h3 className="text-xs font-semibold text-heading uppercase tracking-wider mb-4">{label}</h3>

      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
          >
            <Cell fill={fillColor} />
            <Cell fill="#e5e7eb" className="dark:fill-gray-700" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="text-center mt-3">
        <div className="text-3xl font-bold text-card-foreground mb-1">{value}</div>
        <div className="text-xs text-muted-foreground">
          {percentage}% of {total} total
        </div>
      </div>
    </div>
  );
}