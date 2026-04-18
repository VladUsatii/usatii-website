import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { submitClientEducationQuiz } from '@/lib/portal/education';

export const runtime = 'nodejs';

function parseAssignmentId(value) {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return NaN;
  return Number(trimmed);
}

export async function POST(request, { params }) {
  const { session, error } = await requirePortalSession('client');
  if (error) return error;

  const assignmentId = parseAssignmentId(params?.assignmentId);
  if (Number.isNaN(assignmentId)) {
    return NextResponse.json({ error: 'Assignment id must be numeric.' }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const result = await submitClientEducationQuiz({
      assignmentId,
      clientUserId: session.userId,
      answers: body?.answers,
    });

    if (!result) {
      return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (routeError) {
    if (isPortalDatabaseConfigError(routeError)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    if (
      routeError?.code === 'invalid_assignment_id' ||
      routeError?.code === 'invalid_answers' ||
      routeError?.code === 'invalid_quiz_questions'
    ) {
      return NextResponse.json({ error: routeError.message }, { status: 400 });
    }

    console.error('Failed to submit education quiz', routeError);
    return NextResponse.json(
      { error: 'Unable to submit quiz right now.' },
      { status: 500 }
    );
  }
}
