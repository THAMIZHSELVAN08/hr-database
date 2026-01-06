import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  id: number;
  email?: string;
  role: string;
  team_id: number | null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id: idParam } = await params;
  const id = Number(idParam);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  let result;
  try {
    if (user.role === 'member') {
      result = await db.query(
        `
        UPDATE notifications n
        SET read = true
        FROM hr_contacts h
        WHERE n.contact_id = h.id
          AND h.uploaded_by = $2
          AND n.id = $1
        RETURNING n.id
        `,
        [id, user.id]
      );
    } else if (user.role === 'admin') {
      result = await db.query(
        `
        UPDATE notifications n
        SET read = true
        FROM hr_contacts h
        WHERE n.contact_id = h.id
          AND h.team_id = $2
          AND n.id = $1
        RETURNING n.id
        `,
        [id, user.team_id]
      );
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (err) {
    console.error('Error marking notification read:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  if (!result || result.rowCount === 0) {
    return NextResponse.json({ error: 'Not found or not permitted' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}