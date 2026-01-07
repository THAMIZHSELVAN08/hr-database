import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import TopBar from './components/Topbar';
import Sidebar from './components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');

  const user: any = verifyJWT(token);
  if (!user) redirect('/login');

  let stats = {
    'Awaiting Response': 0,
    'Accepted Invite': 0,
    'Email Sent': 0,
    'Called Declined': 0,
    'Emailed Declined': 0,
    'Blacklisted': 0,
    'Wrong Number': 0,
    'Call Postponed': 0,
    'Not Reachable': 0,
  };

  try {
    let statsQuery = `
      SELECT status, COUNT(*) as count
      FROM hr_contacts
    `;
    
    const values: any[] = [];

    if (user.role === 'member') {
      statsQuery += ` WHERE uploaded_by = $1`;
      values.push(user.id);
    } else if (user.role === 'admin') {
      statsQuery += ` WHERE team_id = $1`;
      values.push(user.team_id);
    }

    statsQuery += ` GROUP BY status`;

    const result = await db.query(statsQuery, values);

    result.rows.forEach((row: any) => {
      if (row.status in stats) {
        stats[row.status as keyof typeof stats] = parseInt(row.count);
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  return (
    <div 
      className="min-h-screen bg-background text-foreground transition-colors"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <TopBar username={user.name || user.username || user.email} stats={stats} />
      <Sidebar />
      <main className="pt-14 min-h-screen">
        <div className="max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}