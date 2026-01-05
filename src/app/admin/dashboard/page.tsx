import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const token = (await cookies()).get('token')?.value;
  if (!token) throw new Error('Unauthorized');

  const user: any = verifyJWT(token);
  if (!user || user.role !== 'super_admin') {
    throw new Error('Forbidden');
  }

  const admins = await db.query(`
    SELECT id, name
    FROM users
    WHERE role = 'admin'
    ORDER BY name
  `);

  const members = await db.query(`
    SELECT id, name, team_id
    FROM users
    WHERE role = 'member'
    ORDER BY name
  `);

  return (
    <AdminDashboardClient
      token={token}
      admins={admins.rows}
      members={members.rows}
    />
  );
}