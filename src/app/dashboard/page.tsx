import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import StatusDonutCard from '@/app/dashboard/components/StatusDonutCard';
import HRTable from '@/app/dashboard/components/HRTable';

const STATUS_COLORS: Record<string, string> = {
  'Awaiting Response': '#4f46e5',
  'Email Sent': '#a855f7',
  'Call Postponed': '#06b6d4',
  'Wrong Number': '#f97316',
};

export default async function DashboardPage() {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');

  const user: any = verifyJWT(token);
  if (!user) redirect('/login');

  let query = `
    SELECT 
      hr_contacts.*,
      uploader.name as member_name,
      admin.name as incharge
    FROM hr_contacts
    LEFT JOIN users uploader ON hr_contacts.uploaded_by = uploader.id
    LEFT JOIN users admin ON hr_contacts.team_id = admin.team_id AND admin.role = 'admin'
  `;
  
  const values: any[] = [];

  if (user.role === 'member') {
    query += ` WHERE hr_contacts.uploaded_by = $1`;
    values.push(user.id);
  }

  if (user.role === 'admin') {
    query += ` WHERE hr_contacts.team_id = $1`;
    values.push(user.team_id);
  }

  query += ` ORDER BY hr_contacts.created_at DESC`;

  const result = await db.query(query, values);
  const contacts = result.rows;

  const total = contacts.length;

  const statusCounts = contacts.reduce((acc: any, c: any) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div 
      className="p-8"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track and manage your HR contacts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <StatusDonutCard
            key={status}
            label={status}
            value={statusCounts[status] || 0}
            total={total}
            color={color}
          />
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All Contacts
        </h3>
      </div>

      <HRTable contacts={contacts} />
    </div>
  );
}