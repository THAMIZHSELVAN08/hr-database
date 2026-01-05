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

  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const adminId = req.nextUrl.searchParams.get('admin');
  const memberId = req.nextUrl.searchParams.get('member');

  const filters: string[] = [];
  const values: any[] = [];

  if (adminId) {
    const adminTeam = await db.query(
      `SELECT team_id FROM users WHERE id = $1 AND role = 'admin'`,
      [adminId]
    );

    if (adminTeam.rowCount > 0) {
      values.push(adminTeam.rows[0].team_id);
      filters.push(`h.team_id = $${values.length}`);
    }
  }

  if (memberId) {
    values.push(memberId);
    filters.push(`u.id = $${values.length}`);
  }

  const whereClause =
    filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  const contactsPerMember = await db.query(
    `
    SELECT
      COALESCE(u.name, 'Unknown') AS name,
      h.status,
      COUNT(*)::int AS count
    FROM hr_contacts h
    LEFT JOIN users u ON u.id = h.uploaded_by
    LEFT JOIN teams t ON t.id = h.team_id
    ${whereClause}
    GROUP BY u.name, h.status
    ORDER BY name
    `,
    values
  );

  const statusDistribution = await db.query(
    `
    SELECT
      h.status,
      COUNT(*)::int AS count
    FROM hr_contacts h
    LEFT JOIN users u ON u.id = h.uploaded_by
    LEFT JOIN teams t ON t.id = h.team_id
    ${whereClause}
    GROUP BY h.status
    `,
    values
  );

  const memberDistribution = await db.query(
    `
    SELECT
      COALESCE(u.name, 'Unknown') AS name,
      COUNT(*)::int AS count
    FROM hr_contacts h
    LEFT JOIN users u ON u.id = h.uploaded_by
    LEFT JOIN teams t ON t.id = h.team_id
    ${whereClause}
    GROUP BY u.name
    ORDER BY name
    `,
    values
  );

  return NextResponse.json({
    contactsPerMember: contactsPerMember.rows,
    statusDistribution: statusDistribution.rows,
    memberDistribution: memberDistribution.rows,
  });
}
