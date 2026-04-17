import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';

export const runtime = 'nodejs';

export async function GET() {
  const { session, error } = await requirePortalSession();
  if (error) return error;

  return NextResponse.json(
    {
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
      profile: session.profile,
      expiresAt: session.expiresAt,
    },
    { status: 200 }
  );
}
