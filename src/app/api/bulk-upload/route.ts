import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
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

  if (!user.team_id) {
    return NextResponse.json(
      { error: 'User not assigned to team' },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const text = await file.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  if (parsed.errors.length) {
    return NextResponse.json(
      { error: 'CSV parse error', details: parsed.errors },
      { status: 400 }
    );
  }

  const REQUIRED_COLUMNS = [
    'HR Name',
    'Phone',
    'Company',
  ];

  const headers = Object.keys(parsed.data[0] || {});
  const missing = REQUIRED_COLUMNS.filter(c => !headers.includes(c));

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing columns: ${missing.join(', ')}. Found headers: ${headers.join(', ')}` },
      { status: 400 }
    );
  }

  let inserted = 0;
  const duplicates: any[] = [];
  const errors: any[] = [];

  for (let i = 0; i < parsed.data.length; i++) {
    const row: any = parsed.data[i];

    try {
      const email = row['Email']?.trim() || null;
      const phone = row['Phone']?.trim();

      if (!phone) {
        throw new Error('Phone missing');
      }

      const dupCheckQuery = email 
        ? `SELECT id FROM hr_contacts WHERE email = $1 OR phone = $2`
        : `SELECT id FROM hr_contacts WHERE phone = $1`;
      
      const dupCheckParams = email ? [email, phone] : [phone];

      const dupCheck = await db.query(dupCheckQuery, dupCheckParams);

      if ((dupCheck.rowCount ?? 0) > 0) {
        duplicates.push({ row: i + 2, email, phone });
        continue;
      }

      await db.query(
        `
        INSERT INTO hr_contacts (
          hr_name,
          phone,
          company,
          email,
          status,
          interview_mode,
          remark,
          uploaded_by,
          team_id
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        `,
        [
          row['HR Name'],
          phone,
          row['Company'],
          email,
          'Select Status',
          'Select Mode', 
          '',  
          user.id,
          user.team_id,
        ]
      );

      inserted++;
    } catch (err: any) {
      errors.push({
        row: i + 2,
        message: err.message,
      });
    }
  }

  return NextResponse.json({
    inserted,
    duplicates,
    errors,
  });
}