import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signJWT } from '@/lib/jwt';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  console.log('=== CALLBACK STARTED ===');
  console.log('URL:', req.url);
  console.log('Cookies before:', req.cookies.getAll());

  const code = req.nextUrl.searchParams.get('code');
  console.log('Code from query:', code);

  if (!code) {
    console.log('❌ No code found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    console.log('📡 Fetching token from Google...');
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: 'http://localhost:3000/api/auth/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    console.log('Token response status:', tokenRes.status);
    console.log('Token response:', tokenData);

    if (!tokenData.id_token) {
      console.log('❌ No id_token in response');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log('✅ Got id_token');
    const base64Payload = tokenData.id_token.split('.')[1];
    const decoded = JSON.parse(
      Buffer.from(base64Payload, 'base64').toString()
    );

    const email = decoded.email;
    console.log('📧 Email from token:', email);

    if (!email || !email.endsWith('@svce.ac.in')) {
      console.log('❌ Email validation failed');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log('✅ Email validated');
    const dbUser = await db.query(
      'SELECT id, name, role, team_id FROM users WHERE email = $1',
      [email]
    );

    console.log('👤 DB query result:', dbUser.rowCount, 'rows');

    if (dbUser.rowCount === 0) {
      console.log('❌ User not found in database');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const user = dbUser.rows[0];
    console.log('✅ User found:', user);

    const jwtToken = signJWT({
      id: user.id,
      email,
      role: user.role,
      team_id: user.team_id,
      name: user.name,
    });

    console.log('🔑 JWT token created');

    let redirectPath = '/dashboard'; 
    
    // Exceptions: These super_admins stay on regular dashboard
    const exceptions = ['2023ee0724@svce.ac.in', '2023cs0051@svce.ac.in'];
    const isException = exceptions.includes(email);
    
    if (user.role === 'super_admin' && !isException) {
      redirectPath = '/admin/dashboard';
      console.log('🔵 Redirecting super_admin to:', redirectPath);
    } else if (user.role === 'admin') {
      redirectPath = '/dashboard/team-stats';
      console.log('🟢 Redirecting admin to:', redirectPath);
    } else {
      console.log('⚪ Redirecting member/exception to:', redirectPath);
    }

    const dashboardUrl = new URL(redirectPath, req.url);
    dashboardUrl.searchParams.set('login', 'success');
    dashboardUrl.searchParams.set('username', user.name);

    const response = NextResponse.redirect(dashboardUrl);

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log(`✅ Cookie set, redirecting to ${redirectPath} with success message`);
    console.log('=== CALLBACK COMPLETED SUCCESSFULLY ===');
    return response;
  } catch (error) {
    console.error('❌ Auth callback error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}