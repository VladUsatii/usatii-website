import { requirePortalSession } from '@/lib/portal/auth';
import { getAdminDocumentExport } from '@/lib/portal/admin-documents';
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
  const exportId = parseRouteNumericId(resolvedParams?.exportId);

  if (!documentId || !exportId) {
    return privateJson(
      { error: 'Document id and export id must be numeric.' },
      { status: 400 }
    );
  }

  try {
    const exportRecord = await getAdminDocumentExport(documentId, exportId);
    if (!exportRecord) {
      return privateJson({ error: 'Export not found.' }, { status: 404 });
    }

    return privateBinaryResponse(exportRecord.pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(exportRecord.exportedFilename)}`,
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

    console.error('Failed to stream admin document export', routeError);
    return privateJson(
      { error: 'Unable to download this export right now.' },
      { status: 500 }
    );
  }
}
