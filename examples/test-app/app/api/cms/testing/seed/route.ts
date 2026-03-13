import { runSeed } from '@/lib/seed-runner';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const result = await runSeed();
    return NextResponse.json({
      status: 'seeded',
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
