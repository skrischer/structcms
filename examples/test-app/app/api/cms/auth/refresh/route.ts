import { createAuthAdapter, handleRefreshSession } from '@structcms/api';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token provided' }, { status: 401 });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const authAdapter = createAuthAdapter({ client: supabaseClient });

    const session = await handleRefreshSession(authAdapter, refreshToken);

    return NextResponse.json(session);
  } catch (error) {
    console.error('Refresh session error:', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Refresh failed',
      },
      { status: 401 }
    );
  }
}
