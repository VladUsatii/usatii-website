import { requirePortalSession } from '@/lib/portal/auth';
import { exportAdminDocument } from '@/lib/portal/admin-documents';
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

export async function POST(_request, { params }) {
  const { session, error } = await requirePortalSession('admin');
  if (error) return error;

  if (!isTrustedSameOriginRequest(_request)) {
    return privateJson({ error: 'Forbidden.' }, { status: 403 });
  }

  const resolvedParams = await params;
  const documentId = parseRouteNumericId(resolvedParams?.id);

  if (!documentId) {
    return privateJson({ error: 'Document id must be numeric.' }, { status: 400 });
  }

  try {
    const result = await exportAdminDocument({
      documentId,
      createdByUserId: session.userId,
    });

    if (!result) {
      return privateJson({ error: 'Document not found.' }, { status: 404 });
    }

    return privateJson(result, { status: 201 });
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

    console.error('Failed to export admin document', routeError);
    return privateJson(
      { error: 'Unable to export this PDF right now.' },
      { status: 500 }
    );
  }
}
