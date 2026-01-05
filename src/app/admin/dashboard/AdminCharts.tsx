'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const STATUSES = [
  'Email Sent',
  'Called Declined',
  'Emailed Declined',
  'Not Reachable',
  'Accepted Invite',
  'Awaiting Response',
  'Blacklisted',
  'Call Postponed',
  'Wrong Number',
];

import { STATUS_COLORS } from '@/lib/statusColors';

const COLORS = STATUS_COLORS;

function buildContactsPerMember(raw: any[]) {
  const map: Record<string, any> = {};

  raw.forEach(row => {
    if (!map[row.name]) {
      map[row.name] = { name: row.name };
    }
    map[row.name][row.status] = Number(row.count);
  });

  return Object.values(map);
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const filtered = payload.filter((p: any) => p.value > 0);

  if (filtered.length === 0) return null;

  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl border border-border shadow-2xl">
      <p className="font-semibold mb-2 text-sm tracking-tight">{label}</p>
      <div className="space-y-1">
        {filtered.map((item: any) => (
          <p key={item.name} className="text-sm font-normal" style={{ color: item.color }}>
            {item.name}: <span className="font-medium">{item.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AdminCharts({ data }: { data: any }) {
  const contactsPerMemberData = buildContactsPerMember(
    data?.contactsPerMember ?? []
  );

  const statusDistribution = data?.statusDistribution ?? [];
  const memberDistribution = data?.memberDistribution ?? [];

  return (
    <div className="p-8 space-y-8" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-heading mb-2 tracking-tight">
            Contacts per Member
          </h2>
          <p className="text-muted-foreground text-sm font-normal">
            Distribution of contact statuses across team members
          </p>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={contactsPerMemberData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF" 
              style={{ fontSize: '13px', fontFamily: '"Segoe UI", system-ui, sans-serif' }}
              tickLine={false}
            />
            <YAxis 
              allowDecimals={false} 
              stroke="#9CA3AF"
              style={{ fontSize: '13px', fontFamily: '"Segoe UI", system-ui, sans-serif' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '13px',
                fontFamily: '"Segoe UI", system-ui, sans-serif'
              }}
            />
            {STATUSES.map(status => (
              <Bar
                key={status}
                dataKey={status}
                stackId="a"
                fill={COLORS[status]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-heading mb-2 tracking-tight">
              Status Distribution
            </h2>
            <p className="text-muted-foreground text-sm font-normal">
              Overall breakdown of contact statuses
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ percent }) => 
                  percent && percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                }
                labelLine={false}
              >
                {statusDistribution.map((entry: any, i: number) => (
                  <Cell
                    key={i}
                    fill={COLORS[entry.status] ?? '#8884d8'}
                    stroke="#0A0A0A"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  return (
                    <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
                      <p className="text-card-foreground font-semibold text-sm mb-1">
                        {payload[0].name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Count: <span className="font-medium">{payload[0].value}</span>
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {statusDistribution.map((entry: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm shrink-0" 
                  style={{ backgroundColor: COLORS[entry.status] ?? '#8884d8' }}
                />
                <span className="text-muted-foreground text-sm font-normal truncate">
                  {entry.status} ({entry.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-heading mb-2 tracking-tight">
              Member Distribution
            </h2>
            <p className="text-muted-foreground text-sm font-normal">
              Contact count per team member
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={memberDistribution}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ percent }) => 
                  percent && percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                }
                labelLine={false}
              >
                {memberDistribution.map((_: any, i: number) => {
                  const colors = ['#14F287', '#7C57E6', '#38BDF8', '#F97316', '#EF4444', '#A855F7'];
                  return (
                    <Cell
                      key={i}
                      fill={colors[i % colors.length]}
                      stroke="#0A0A0A"
                      strokeWidth={3}
                    />
                  );
                })}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  return (
                    <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
                      <p className="text-card-foreground font-semibold text-sm mb-1">
                        {payload[0].name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Count: <span className="font-medium">{payload[0].value}</span>
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-6 grid grid-cols-1 gap-3">
            {memberDistribution.map((entry: any, i: number) => {
              const colors = ['#14F287', '#7C57E6', '#38BDF8', '#F97316', '#EF4444', '#A855F7'];
              return (
                <div key={i} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm shrink-0" 
                    style={{ backgroundColor: colors[i % colors.length] }}
                  />
                  <span className="text-muted-foreground text-sm font-normal truncate">
                    {entry.name} ({entry.count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}