import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import {
  createEducationGuide,
  listAdminEducationGuides,
} from '@/lib/portal/education';

export const runtime = 'nodejs';

export async function GET() {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  try {
    const payload = await listAdminEducationGuides();
    return NextResponse.json(payload, { status: 200 });
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

    console.error('Failed to list admin education guides', routeError);
    return NextResponse.json(
      { error: 'Unable to load education guides right now.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { session, error } = await requirePortalSession('admin');
  if (error) return error;

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const created = await createEducationGuide({
      title: body?.title,
      summary: body?.summary,
      contentMarkdown: body?.contentMarkdown,
      passingPercent: body?.passingPercent,
      quizQuestions: body?.quizQuestions,
      assignedClientUserIds: body?.assignedClientUserIds,
      createdByUserId: session.userId,
    });

    return NextResponse.json(
      {
        success: true,
        guideId: created.id,
      },
      { status: 201 }
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
      routeError?.code === 'invalid_title' ||
      routeError?.code === 'invalid_passing_percent' ||
      routeError?.code === 'invalid_quiz_questions' ||
      routeError?.code === 'invalid_quiz_question' ||
      routeError?.code === 'invalid_client_ids'
    ) {
      return NextResponse.json({ error: routeError.message }, { status: 400 });
    }

    console.error('Failed to create education guide', routeError);
    return NextResponse.json(
      { error: 'Unable to create education guide right now.' },
      { status: 500 }
    );
  }
}
