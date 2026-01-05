import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { handleNotification } from '@/lib/notifications';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contactId = Number(id);

  if (isNaN(contactId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    verifyJWT(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const result = await db.query(
    `SELECT * FROM hr_contacts WHERE id = $1`,
    [contactId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contactId = Number(id);

  if (isNaN(contactId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let user;
  try {
    user = verifyJWT(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json();
  const { status, interview_mode, remark } = body;

  const result = await db.query(
    `
    UPDATE hr_contacts
    SET
      status = COALESCE($1, status),
      interview_mode = COALESCE($2, interview_mode),
      remark = COALESCE($3, remark),
      updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
    [status, interview_mode, remark, contactId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  const updated = result.rows[0];

  await handleNotification({
    contactId,
    hrName: updated.hr_name,
    company: updated.company,
    status: updated.status,
    remark: updated.remark,
  });

  return NextResponse.json(updated);
}
