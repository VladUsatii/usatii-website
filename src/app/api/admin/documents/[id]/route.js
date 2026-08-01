import { requirePortalSession } from '@/lib/portal/auth';
import {
  deleteAdminDocument,
  getAdminDocumentById,
  updateAdminDocument,
} from '@/lib/portal/admin-documents';
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

export async function GET(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const resolvedParams = await params;
  const documentId = parseRouteNumericId(resolvedParams?.id);

  if (!documentId) {
    return privateJson({ error: 'Document id must be numeric.' }, { status: 400 });
  }

  try {
    const document = await getAdminDocumentById(documentId);
    if (!document) {
      return privateJson({ error: 'Document not found.' }, { status: 404 });
    }

    return privateJson({ document }, { status: 200 });
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

    console.error('Failed to load admin document detail', routeError);
    return privateJson(
      { error: 'Unable to load this document right now.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
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
    const document = await updateAdminDocument({
      documentId,
      title: body?.title,
      updatedByUserId: session.userId,
    });

    if (!document) {
      return privateJson({ error: 'Document not found.' }, { status: 404 });
    }

    return privateJson({ document }, { status: 200 });
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

    console.error('Failed to update admin document', routeError);
    return privateJson(
      { error: 'Unable to update this document right now.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requirePortalSession('admin');
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
    const deleted = await deleteAdminDocument(documentId);
    if (!deleted) {
      return privateJson({ error: 'Document not found.' }, { status: 404 });
    }

    return privateJson({ success: true }, { status: 200 });
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

    console.error('Failed to delete admin document', routeError);
    return privateJson(
      { error: 'Unable to delete this document right now.' },
      { status: 500 }
    );
  }
}
