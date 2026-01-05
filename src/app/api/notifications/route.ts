import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
  team_id: number | null;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let user: UserPayload;
  try {
    user = verifyJWT(token) as UserPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  let query = `
    SELECT n.id, n.contact_id, n.message, n.created_at, n.read,
           n.notify_at,
           h.hr_name, h.company
    FROM notifications n
    JOIN hr_contacts h ON h.id = n.contact_id
  `;

  const values: any[] = [];
  const whereClauses: string[] = [];

  if (user.role === 'member') {
    whereClauses.push(`h.uploaded_by = $${values.length + 1}`);
    values.push(user.id);
  }

  if (user.role === 'admin') {
    whereClauses.push(`h.team_id = $${values.length + 1}`);
    values.push(user.team_id);
  }

  whereClauses.push(`(n.notify_at IS NULL OR n.notify_at <= NOW())`);

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  query += ` ORDER BY n.notify_at ASC NULLS LAST, n.created_at DESC`;

  const result = await db.query(query, values);
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    verifyJWT(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json();
  const { contact_id, message, callback_date } = body;

  if (!contact_id || !message) {
    return NextResponse.json({ error: 'Missing contact_id or message' }, { status: 400 });
  }

  if (callback_date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(callback_date)) {
      return NextResponse.json({ error: 'Invalid callback_date format, expected YYYY-MM-DD' }, { status: 400 });
    }

    const insertSql = `
      INSERT INTO notifications (contact_id, message, notify_at, created_at, read)
      VALUES ($1, $2, ($3::date - INTERVAL '1 day')::timestamp, NOW(), FALSE)
      RETURNING id, contact_id, message, notify_at, created_at, read
    `;
    const values = [contact_id, message, callback_date];
    const result = await db.query(insertSql, values);
    return NextResponse.json(result.rows[0]);
  } else {
    const insertSql = `
      INSERT INTO notifications (contact_id, message, notify_at, created_at, read)
      VALUES ($1, $2, NOW(), NOW(), FALSE)
      RETURNING id, contact_id, message, notify_at, created_at, read
    `;
    const result = await db.query(insertSql, [contact_id, message]);
    return NextResponse.json(result.rows[0]);
  }
}