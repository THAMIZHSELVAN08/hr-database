'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Filter,
  Users,
  UserCheck,
} from 'lucide-react';
import AdminCharts from './AdminCharts';

type User = {
  id: number;
  name: string;
  team_id?: number;
};

export default function AdminDashboardClient({
  token,
  admins,
  members,
}: {
  token: string;
  admins: User[];
  members: User[];
}) {
  const [adminId, setAdminId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (adminId) params.append('admin', adminId);
    if (memberId) params.append('member', memberId);

    fetch(`/api/stats/admin?${params.toString()}`, {
      cache: 'no-store',
      headers: {
        Cookie: `token=${token}`,
      },
    })
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [adminId, memberId, token]);

  const filteredMembers = members.filter(
    m => !adminId || m.team_id === Number(adminId)
  );

  return (
    <div
      className="min-h-screen bg-linear-to-br from-[#0B0F05] to-[#050505]"
      style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}
    >
      <div className="bg-[#0A0A0A] border-b border-gray-800/50 shadow-xl">
        <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">
                Monitor team performance and contact statistics
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-linear-to-rrom-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl">
                <Filter className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">
                  {adminId || memberId ? 'Filtered View' : 'All Data'}
                </span>
              </div>

              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg shadow-blue-600/20"
              >
                <Users className="w-4 h-4" />
                All Data
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Users className="w-4 h-4" />
                Filter by Admin
              </label>
              <select
                className="w-full px-4 py-3 bg-linear-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-600/50 transition"
                value={adminId}
                onChange={e => {
                  setAdminId(e.target.value);
                  setMemberId('');
                }}
              >
                <option value="" className="bg-gray-900">All Admins</option>
                {admins.map(a => (
                  <option key={a.id} value={a.id} className="bg-gray-900">
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <UserCheck className="w-4 h-4" />
                Filter by Member
              </label>
              <select
                className="w-full px-4 py-3 bg-linear-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-600/50 transition"
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
              >
                <option value="" className="bg-gray-900">
                  {adminId
                    ? `All Members (${filteredMembers.length})`
                    : `All Members (${members.length})`}
                </option>
                {filteredMembers.map(m => (
                  <option key={m.id} value={m.id} className="bg-gray-900">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        {loading && (
          <div className="flex justify-center py-20 text-gray-400">
            Loading statistics…
          </div>
        )}

        {!loading && data && <AdminCharts data={data} />}

        {!loading && !data && (
          <div className="flex justify-center py-20 text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}