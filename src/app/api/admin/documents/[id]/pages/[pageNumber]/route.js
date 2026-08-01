import { requirePortalSession } from '@/lib/portal/auth';
import { getAdminDocumentPagePreview } from '@/lib/portal/admin-documents';
import { isAdminDocumentPublicError } from '@/lib/portal/admin-documents-shared';
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

export async function GET(request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const resolvedParams = await params;
  const documentId = parseRouteNumericId(resolvedParams?.id);
  const pageNumber = parseRouteNumericId(resolvedParams?.pageNumber);
  const previewWidthValue = request.nextUrl.searchParams.get('width');
  const previewWidth = previewWidthValue
    ? Number.parseInt(String(previewWidthValue), 10)
    : null;

  if (!documentId || !pageNumber) {
    return privateJson(
      { error: 'Document id and page number must be numeric.' },
      { status: 400 }
    );
  }

  try {
    const preview = await getAdminDocumentPagePreview(documentId, pageNumber, {
      targetWidthPx:
        Number.isFinite(previewWidth) && previewWidth > 0 ? previewWidth : null,
    });

    if (!preview) {
      return privateJson({ error: 'Document page not found.' }, { status: 404 });
    }

    const responseHeaders = {
      'Content-Type': preview.mimeType,
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(preview.fileName)}`,
    };

    return privateBinaryResponse(preview.previewBytes, {
      status: 200,
      headers: responseHeaders,
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

    if (isAdminDocumentPublicError(routeError)) {
      return privateJson(
        { error: routeError.message, code: routeError.code },
        { status: routeError.status || 400 }
      );
    }

    console.error('Failed to render admin document page preview', routeError);
    return privateJson(
      { error: 'Unable to render this PDF page right now.' },
      { status: 500 }
    );
  }
}
