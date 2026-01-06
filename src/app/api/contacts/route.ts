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
      { error: 'Missing required fields: HR Name, Company, and Status are required' },
      { status: 400 }
    );
  }

  try {
    if (email) {
      const existingEmail = await db.query(
        'SELECT id, hr_name, company FROM hr_contacts WHERE email = $1',
        [email]
      );

      if (existingEmail.rows.length > 0) {
        const existing = existingEmail.rows[0];
        return NextResponse.json(
          { 
            error: `This email is already registered for ${existing.hr_name} at ${existing.company}`,
            type: 'duplicate_email'
          },
          { status: 409 }
        );
      }
    }

    if (phone) {
      const existingPhone = await db.query(
        'SELECT id, hr_name, company FROM hr_contacts WHERE phone = $1',
        [phone]
      );

      if (existingPhone.rows.length > 0) {
        const existing = existingPhone.rows[0];
        return NextResponse.json(
          { 
            error: `This phone number is already registered for ${existing.hr_name} at ${existing.company}`,
            type: 'duplicate_phone'
          },
          { status: 409 }
        );
      }
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
  } catch (error: any) {
    console.error('Database error:', error);

    if (error.code === '23505') {
      if (error.constraint === 'hr_contacts_email_key') {
        return NextResponse.json(
          { 
            error: 'This email address is already registered in the database',
            type: 'duplicate_email'
          },
          { status: 409 }
        );
      }
      if (error.constraint === 'hr_contacts_phone_key') {
        return NextResponse.json(
          { 
            error: 'This phone number is already registered in the database',
            type: 'duplicate_phone'
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'A contact with this information already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create contact. Please try again.' },
      { status: 500 }
    );
  }
}