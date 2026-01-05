'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Notification = {
  id: number;
  contact_id: number;
  message: string;
  read: boolean;
  created_at: string;
  notify_at: string | null;
  hr_name: string;
  company: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await fetch('/api/notifications', {
        cache: 'no-store',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to load notifications');
      }

      const data = await res.json();
  
      const sorted = data.sort((a: Notification, b: Notification) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setNotifications(sorted);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: number) {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
      });

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  const formatNotificationDate = (notify_at: string | null) => {
    if (!notify_at) return '';
    
    const date = new Date(notify_at);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center"
        style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <div className="text-foreground text-xl font-medium">Loading notifications...</div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="min-h-screen bg-background py-12 px-6"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                {unreadCount} new
              </div>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground text-lg font-medium">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(n => (
              <Link
                key={n.id}
                href={`/dashboard/hr/${n.contact_id}/edit`}
                onClick={() => {
                  if (!n.read) {
                    markAsRead(n.id);
                  }
                }}
                className={`block p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
                  n.read
                    ? 'bg-card border-border hover:border-border/80 hover:bg-accent'
                    : 'bg-muted border-primary/50 hover:border-primary hover:bg-accent shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      {!n.read && (
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 animate-pulse" />
                      )}
                      <h3 className={`font-semibold text-lg leading-tight ${n.read ? 'text-muted-foreground' : 'text-card-foreground'}`}>
                        Follow-up: {n.hr_name} – {n.company}
                      </h3>
                    </div>
                    
                    {n.notify_at && (
                      <p className="text-sm text-muted-foreground ml-5 mb-2 font-medium">
                        📅 Scheduled for: {formatNotificationDate(n.notify_at)}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground ml-5 font-medium">
                      Created {new Date(n.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <svg 
                    className={`w-6 h-6 shrink-0 mt-1 transition-colors ${
                      n.read ? 'text-muted-foreground' : 'text-primary'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}