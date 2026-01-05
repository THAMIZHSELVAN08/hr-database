import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export async function POST(req: NextRequest) {
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

  const {
    hr_name,
    company,
    email,
    phone,
    interview_mode,
    status,
    remark,
  } = await req.json();

  if (!hr_name || !company || !status) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const result = await db.query(
    `
    INSERT INTO hr_contacts (
      hr_name,
      company,
      email,
      phone,
      interview_mode,
      status,
      remark,
      uploaded_by,
      team_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [
      hr_name,
      company,
      email || null,
      phone || null,
      interview_mode || null,
      status,
      remark || '',
      user.id,
      user.team_id,
    ]
  );


  return NextResponse.json(result.rows[0], { status: 201 });
}

