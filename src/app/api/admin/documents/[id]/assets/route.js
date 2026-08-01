import { requirePortalSession } from '@/lib/portal/auth';
import { createAdminDocumentAsset } from '@/lib/portal/admin-documents';
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

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return privateJson({ error: 'Invalid multipart form payload.' }, { status: 400 });
  }

  const role = String(formData.get('role') || '').trim();
  const uploadedFile = formData.get('file');

  if (!role) {
    return privateJson({ error: 'Asset role is required.' }, { status: 400 });
  }

  if (!uploadedFile || typeof uploadedFile.arrayBuffer !== 'function') {
    return privateJson({ error: 'A PNG asset file is required.' }, { status: 400 });
  }

  try {
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const asset = await createAdminDocumentAsset({
      documentId,
      assetRole: role,
      filename: uploadedFile.name,
      mimeType: uploadedFile.type,
      imageBytes: Buffer.from(arrayBuffer),
      createdByUserId: session.userId,
    });

    if (!asset) {
      return privateJson({ error: 'Document not found.' }, { status: 404 });
    }

    return privateJson({ asset }, { status: 201 });
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

    console.error('Failed to create admin document asset', routeError);
    return privateJson(
      { error: 'Unable to upload this asset right now.' },
      { status: 500 }
    );
  }
}
