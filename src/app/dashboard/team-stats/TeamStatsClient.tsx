'use client';

import { useEffect, useState } from 'react';
import { Filter, Users, TrendingUp } from 'lucide-react';
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

const COLORS: Record<string, string> = {
  'Accepted Invite': '#14F287',
  'Awaiting Response': '#7C57E6',
  'Email Sent': '#805FF4',
  'Called Declined': '#BE7C43',
  'Emailed Declined': '#EF4444',
  'Blacklisted': '#6B7280',
  'Wrong Number': '#F97316',
  'Call Postponed': '#38BDF8',
  'Not Reachable': '#A855F7',
};

type TeamMember = {
  id: number;
  name: string;
};

type TeamStatsData = {
  contactsPerMember: any[];
  statusDistribution: any[];
  memberDistribution: any[];
};

function buildContactsPerMember(raw: any[] | undefined) {
  if (!raw || raw.length === 0) return [];
  
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
    <div className="bg-[#0A0A0A] text-white p-4 rounded-xl border border-gray-700/50 shadow-2xl">
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

export default function TeamStatsClient({
  token,
  teamMembers,
  adminName,
}: {
  token: string;
  teamMembers: TeamMember[];
  adminName: string;
}) {
  const [memberId, setMemberId] = useState('');
  const [data, setData] = useState<TeamStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (memberId) params.append('member', memberId);

    fetch(`/api/stats/team?${params.toString()}`, {
      cache: 'no-store',
      headers: {
        Cookie: `token=${token}`,
      },
    })
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [memberId, token]);

  const contactsPerMemberData = buildContactsPerMember(
    data?.contactsPerMember ?? []
  );
  const statusDistribution = data?.statusDistribution ?? [];
  const memberDistribution = data?.memberDistribution ?? [];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0B0F05] to-[#050505]" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      <div className="bg-[#0A0A0A] border-b border-gray-800/50 shadow-xl">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-semibold text-white mb-2 tracking-tight">
                Team Performance
              </h1>
              <p className="text-gray-400 text-base font-normal">
                Monitor your team's contact statistics and progress
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-5 py-3 bg-linear-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-400" strokeWidth={2} />
              <span className="text-green-300 font-medium text-sm tracking-tight">
                Team: {adminName}
              </span>
            </div>
          </div>

          <div className="max-w-md">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2.5 tracking-wide">
              <Users className="w-4 h-4" strokeWidth={2} />
              Filter by Team Member
            </label>
            <select
              className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 font-normal [&>option]:bg-[#1a1a1a] [&>option]:text-white [&>option]:py-2"
              value={memberId}
              onChange={e => setMemberId(e.target.value)}
            >
              <option value="">All Team Members ({teamMembers.length})</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {memberId && (
            <div className="mt-5 flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Active filter:</span>
              <div className="px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 text-sm font-medium flex items-center gap-2">
                Member: {teamMembers.find(m => m.id === Number(memberId))?.name}
                <button
                  onClick={() => setMemberId('')}
                  className="text-green-400 hover:text-green-200 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400 font-medium">Loading team statistics...</p>
            </div>
          </div>
        )}

        {!loading && data && (
          <div className="p-8 space-y-8">
            <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800/50 p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                  Contacts per Team Member
                </h2>
                <p className="text-gray-400 text-sm font-normal">
                  Distribution of contact statuses across your team members
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
              <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800/50 p-8 shadow-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                    Status Distribution
                  </h2>
                  <p className="text-gray-400 text-sm font-normal">
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
                          <div className="bg-[#0A0A0A] border border-gray-700/50 rounded-xl p-3 shadow-xl">
                            <p className="text-white font-semibold text-sm mb-1">
                              {payload[0].name}
                            </p>
                            <p className="text-gray-300 text-sm">
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
                      <span className="text-gray-300 text-sm font-normal truncate">
                        {entry.status} ({entry.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800/50 p-8 shadow-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                    Member Distribution
                  </h2>
                  <p className="text-gray-400 text-sm font-normal">
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
                          <div className="bg-[#0A0A0A] border border-gray-700/50 rounded-xl p-3 shadow-xl">
                            <p className="text-white font-semibold text-sm mb-1">
                              {payload[0].name}
                            </p>
                            <p className="text-gray-300 text-sm">
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
                        <span className="text-gray-300 text-sm font-normal truncate">
                          {entry.name} ({entry.count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !data && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                <Filter className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
              </div>
              <p className="text-gray-500 font-medium">No data available</p>
              <p className="text-gray-600 text-sm mt-2">Your team hasn't created any contacts yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}