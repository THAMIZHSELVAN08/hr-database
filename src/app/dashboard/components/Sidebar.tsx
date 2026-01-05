'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSidebarStore } from '@/lib/sidebarStore';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const { isOpen, close } = useSidebarStore();
  const router = useRouter();
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const allowedEmails = ['2023ee0724@svce.ac.in', '2023cs0051@svce.ac.in'];
  const isRestricted = (userRole === 'admin' || userRole === 'super_admin') && !allowedEmails.includes(userEmail);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={close}
        />
      )}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col overflow-y-auto shadow-xl`}
        style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <nav className="flex-1 p-6 space-y-2">
          <Link
            href="/pitch"
            className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all font-medium"
            onClick={close}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>HR PITCH</span>
          </Link>

          {!isRestricted && (
            <>
              <Link
                href="/add"
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all font-medium"
                onClick={close}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Contact</span>
              </Link>

              <Link
                href="/notifications"
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all font-medium"
                onClick={close}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Notifications</span>
              </Link>

              <Link
                href="/search"
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all font-medium"
                onClick={close}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-6 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}