import { createAuthAdapter, handleVerifySession } from '@structcms/api';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const authAdapter = createAuthAdapter({ client: supabaseClient });

    const user = await handleVerifySession(authAdapter, {
      accessToken: token,
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Verify session error:', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Verification failed',
      },
      { status: 401 }
    );
  }
}
