'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Filter,
  Users,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useThemeStore } from '@/lib/themeStore';
import AdminCharts from './AdminCharts';
import LoginSuccessToast from '@/app/dashboard/components/LoginSuccessToast';


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
  const { isDarkMode, toggle: toggleTheme } = useThemeStore();

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
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: '\"Segoe UI\", -apple-system, BlinkMacSystemFont, system-ui' }}
    >
      <LoginSuccessToast />
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-heading mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor team performance and contact statistics
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-purple-600/10 border border-purple-500/40 rounded-xl">
                <Filter className="w-5 h-5 text-purple-500" />
                <span className="text-purple-600 text-sm font-medium">
                  {adminId || memberId ? 'Filtered View' : 'All Data'}
                </span>
              </div>

              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition shadow-lg shadow-blue-600/20"
              >
                <Users className="w-4 h-4" />
                All Data
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2.5 text-muted-foreground hover:text-card-foreground hover:bg-accent rounded-lg transition-all"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                Filter by Admin
              </label>
              <select
                className="w-full px-4 py-3 bg-card border border-input rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-600/50 transition"
                value={adminId}
                onChange={e => {
                  setAdminId(e.target.value);
                  setMemberId('');
                }}
              >
                <option value="">All Admins</option>
                {admins.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <UserCheck className="w-4 h-4" />
                Filter by Member
              </label>
              <select
                className="w-full px-4 py-3 bg-card border border-input rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-600/50 transition"
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
              >
                <option value="">
                  {adminId
                    ? `All Members (${filteredMembers.length})`
                    : `All Members (${members.length})`}
                </option>
                {filteredMembers.map(m => (
                  <option key={m.id} value={m.id}>
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
          <div className="flex justify-center py-20 text-muted-foreground">
            Loading statistics…
          </div>
        )}

        {!loading && data && <AdminCharts data={data} />}

        {!loading && !data && (
          <div className="flex justify-center py-20 text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}