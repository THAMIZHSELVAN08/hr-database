import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let user: any;
  try {
    user = verifyJWT(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (!user || user.role !== 'member') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const statusDistribution = await db.query(
    `
    SELECT
      status,
      COUNT(*)::int AS count
    FROM hr_contacts
    WHERE uploaded_by = $1
    GROUP BY status
    `,
    [user.id]
  );

  const totalContacts = await db.query(
    `
    SELECT COUNT(*)::int AS count
    FROM hr_contacts
    WHERE uploaded_by = $1
    `,
    [user.id]
  );

  return NextResponse.json({
    statusDistribution: statusDistribution.rows,
    totalContacts: totalContacts.rows[0]?.count || 0,
  });
}