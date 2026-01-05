import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user: any = verifyJWT(token);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('member');

    let memberCondition = 'u.team_id = $1';
    const params: any[] = [user.team_id];

    if (memberId) {
      memberCondition += ' AND u.id = $2';
      params.push(Number(memberId));
    }

    const contactsPerMember = await db.query(`
      SELECT u.name, c.status, COUNT(c.id)::int as count
      FROM hr_contacts c
      JOIN users u ON c.uploaded_by = u.id
      WHERE ${memberCondition}
      GROUP BY u.name, c.status
      ORDER BY u.name, c.status
    `, params);

    const statusDistribution = await db.query(`
      SELECT c.status, COUNT(c.id)::int as count
      FROM hr_contacts c
      JOIN users u ON c.uploaded_by = u.id
      WHERE ${memberCondition}
      GROUP BY c.status
      ORDER BY count DESC
    `, params);

    const memberDistribution = await db.query(`
      SELECT u.name, COUNT(c.id)::int as count
      FROM users u
      LEFT JOIN hr_contacts c ON u.id = c.uploaded_by
      WHERE ${memberCondition}
      GROUP BY u.name
      HAVING COUNT(c.id) > 0
      ORDER BY count DESC
    `, params);

    return NextResponse.json({
      contactsPerMember: contactsPerMember.rows,
      statusDistribution: statusDistribution.rows,
      memberDistribution: memberDistribution.rows,
    });
  } catch (error) {
    console.error('Team stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team statistics' },
      { status: 500 }
    );
  }
}