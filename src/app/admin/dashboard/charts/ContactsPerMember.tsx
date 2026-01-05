'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  'Accepted Invite': '#14F287',
  'Awaiting Response': '#805FF4',
  'Blacklisted': '#555',
  'Call Postponed': '#4FC3F7',
  'Called Declined': '#BE7C43',
  'Email Sent': '#7C57E6',
  'Emailed Declined': '#F44336',
  'Not Reachable': '#9C27B0',
  'Wrong Number': '#FF9800',
};

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
