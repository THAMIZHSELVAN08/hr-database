'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

  const colorMap: Record<string, string> = {
    'Email Sent': '#a855f7',
    'Awaiting Response': '#4f46e5',
    'Call Postponed': '#06b6d4',
    'Wrong Number': '#f97316',
  };

  const fillColor = colorMap[label] || '#6b7280';

  return (
    <div 
      className="bg-white dark:bg-[#111111] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all hover:border-gray-300 dark:hover:border-gray-700"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{label}</h3>

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
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {percentage}% of {total} total
        </div>
      </div>
    </div>
  );
}