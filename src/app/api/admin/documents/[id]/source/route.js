import { requirePortalSession } from '@/lib/portal/auth';
import { getAdminDocumentSource } from '@/lib/portal/admin-documents';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import {
  parseRouteNumericId,
  privateBinaryResponse,
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
    const document = await getAdminDocumentSource(documentId);
    if (!document) {
      return privateJson({ error: 'Document not found.' }, { status: 404 });
    }

    return privateBinaryResponse(document.sourcePdfBytes, {
      status: 200,
      headers: {
        'Content-Type': document.sourceMimeType || 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(document.sourceFilename)}`,
      },
    });
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

    console.error('Failed to stream admin document source', routeError);
    return privateJson(
      { error: 'Unable to open this PDF right now.' },
      { status: 500 }
    );
  }
}
