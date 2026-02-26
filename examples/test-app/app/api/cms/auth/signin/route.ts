import { createAuthAdapter, handleSignInWithPassword } from '@structcms/api';
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const authAdapter = createAuthAdapter({ client: supabaseClient });

    const session = await handleSignInWithPassword(authAdapter, {
      email,
      password,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Sign in failed',
      },
      { status: 401 }
    );
  }
}
