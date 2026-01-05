'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSidebarStore } from '@/lib/sidebarStore';
import { Home, Search, Plus, Bell, BarChart3, Menu } from 'lucide-react';
import StatsModal from './StatsModal';

interface TopBarProps {
  username: string;
  stats: {
    'Awaiting Response': number;
    'Accepted Invite': number;
    'Email Sent': number;
    'Called Declined': number;
    'Emailed Declined': number;
    'Blacklisted': number;
    'Wrong Number': number;
    'Call Postponed': number;
    'Not Reachable': number;
  };
}

export default function TopBar({ username, stats }: TopBarProps) {
  const { toggle } = useSidebarStore();
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserEmail(data.email || '');
          setUserRole(data.role || '');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    fetchUserInfo();
  }, []);

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const res = await fetch('/api/notifications', {
          cache: 'no-store',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          const unread = data.filter((n: any) => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const allowedEmails = ['2023ee0724@svce.ac.in', '2023cs0051@svce.ac.in'];
  const isRestricted = (userRole === 'admin' || userRole === 'super_admin') && 
                       !allowedEmails.includes(userEmail);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-white dark:bg-[#0B0F05] border-b border-gray-200 dark:border-gray-800 shadow-sm"
        style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            title="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <span className="font-bold text-gray-900 dark:text-white text-base">
            Hello, <span className="font-bold">{username}</span>
          </span>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            HR DATABASE
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!isRestricted && (
            <>
              <Link
                href="/dashboard"
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                title="Dashboard"
              >
                <Home className="w-6 h-6" />
              </Link>

              <Link
                href="/search"
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                title="Search"
              >
                <Search className="w-6 h-6" />
              </Link>

              <Link
                href="/add"
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                title="Add New"
              >
                <Plus className="w-6 h-6" />
              </Link>

              <Link
                href="/notifications"
                className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                title="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                )}
              </Link>

              <button
                onClick={() => setShowStatsModal(true)}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                title="Statistics"
              >
                <BarChart3 className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
            <Link
              href="/pitch"
              className="px-4 py-2 text-base font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-600/10 active:bg-blue-100 dark:active:bg-blue-600/20 transition-all shadow-sm"
            >
              HR PITCH
            </Link>
          </div>
        </div>
      </div>

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={stats}
      />
    </>
  );
}