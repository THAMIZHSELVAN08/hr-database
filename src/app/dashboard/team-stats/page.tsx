import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/db';
import TeamStatsClient from './TeamStatsClient';
import { redirect } from 'next/navigation';

export default async function TeamStatsPage() {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const user: any = verifyJWT(token);

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const members = await db.query(`
    SELECT id, name
    FROM users
    WHERE team_id = $1 AND role = 'member'
    ORDER BY name
  `, [user.team_id]);

  return (
    <TeamStatsClient
      token={token}
      teamMembers={members.rows}
      adminName={user.name}
    />
  );
}