import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user: any = verifyJWT(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const result = await db.query(
      `SELECT 
        hr_contacts.*,
        uploader.name as member_name,
        uploader.email as member_email,
        admin.name as incharge,
        admin.email as incharge_email
      FROM hr_contacts
      LEFT JOIN users uploader ON hr_contacts.uploaded_by = uploader.id
      LEFT JOIN users admin ON hr_contacts.team_id = admin.team_id AND admin.role = 'admin'
      WHERE hr_contacts.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'HR record not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching HR record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch HR record' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user: any = verifyJWT(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      hr_name,
      company,
      email,
      phone,
      interview_mode,
      status,
      remark,
      hr_count,
      transport,
      internship,
      address,
      callback_date,
      callback_time,
    } = body;

    const result = await db.query(
      `UPDATE hr_contacts 
       SET hr_name = $1, 
           company = $2, 
           email = $3, 
           phone = $4, 
           interview_mode = $5, 
           status = $6, 
           remark = $7,
           hr_count = $8,
           transport = $9,
           internship = $10,
           address = $11,
           callback_date = $12,
           callback_time = $13,
           updated_at = NOW()
       WHERE id = $14 
       RETURNING *`,
      [
        hr_name,
        company,
        email,
        phone,
        interview_mode,
        status,
        remark,
        hr_count || null,
        transport || null,
        internship || null,
        address || null,
        callback_date || null,
        callback_time || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'HR record not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating HR record:', error);
    return NextResponse.json(
      { error: 'Failed to update HR record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user: any = verifyJWT(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const result = await db.query(
      'DELETE FROM hr_contacts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'HR record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'HR record deleted' });
  } catch (error) {
    console.error('Error deleting HR record:', error);
    return NextResponse.json(
      { error: 'Failed to delete HR record' },
      { status: 500 }
    );
  }
}