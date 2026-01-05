import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

interface User {
  email: string;
  role: string;
  name?: string;
  username?: string;
  [key: string]: any;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = verifyJWT(token) as User;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      email: user.email || '',
      role: user.role || '',
      name: user.name || '',
      username: user.username || '',
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}