'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { STATUS_COLORS } from '@/lib/statusColors';

export default function ContactsPerMember({ data }: { data: any[] }) {
  const grouped: any = {};

  data.forEach((row) => {
    if (!grouped[row.name]) grouped[row.name] = { name: row.name };
    grouped[row.name][row.status] = row.count;
  });

  const chartData = Object.values(grouped);

  return (
    <div className="bg-black p-4 rounded">
      <h2 className="mb-2 font-semibold">Contacts per Member</h2>
      <BarChart width={900} height={300} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <Bar
            key={status}
            dataKey={status}
            stackId="a"
            fill={color}
          />
        ))}
      </BarChart>
    </div>
  );
}
