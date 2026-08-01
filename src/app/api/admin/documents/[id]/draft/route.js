import { requirePortalSession } from '@/lib/portal/auth';
import { saveAdminDocumentDraft } from '@/lib/portal/admin-documents';
import { isAdminDocumentPublicError } from '@/lib/portal/admin-documents-shared';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import {
  isTrustedSameOriginRequest,
  parseRouteNumericId,
  privateJson,
} from '@/lib/portal/admin-documents-route-utils';

export const runtime = 'nodejs';

export async function POST(request, { params }) {
  const { session, error } = await requirePortalSession('admin');
  if (error) return error;

  if (!isTrustedSameOriginRequest(request)) {
    return privateJson({ error: 'Forbidden.' }, { status: 403 });
  }

  const resolvedParams = await params;
  const documentId = parseRouteNumericId(resolvedParams?.id);

  if (!documentId) {
    return privateJson({ error: 'Document id must be numeric.' }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return privateJson({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const result = await saveAdminDocumentDraft({
      documentId,
      draft: body?.draft,
      updatedByUserId: session.userId,
    });

    if (!result) {
      return privateJson({ error: 'Document not found.' }, { status: 404 });
    }

    return privateJson(result, { status: 200 });
  } catch (routeError) {
    if (isPortalDatabaseConfigError(routeError)) {
      return privateJson(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    if (isAdminDocumentPublicError(routeError)) {
      return privateJson(
        { error: routeError.message, code: routeError.code },
        { status: routeError.status || 400 }
      );
    }

    console.error('Failed to save admin document draft', routeError);
    return privateJson(
      { error: 'Unable to save the draft right now.' },
      { status: 500 }
    );
  }
}
