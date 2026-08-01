import { requirePortalSession } from '@/lib/portal/auth';
import {
  createAdminDocument,
  listAdminDocuments,
} from '@/lib/portal/admin-documents';
import { isAdminDocumentPublicError } from '@/lib/portal/admin-documents-shared';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import {
  isTrustedSameOriginRequest,
  privateJson,
} from '@/lib/portal/admin-documents-route-utils';

export const runtime = 'nodejs';

export async function GET() {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  try {
    const documents = await listAdminDocuments();
    return privateJson({ documents }, { status: 200 });
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

    console.error('Failed to list admin documents', routeError);
    return privateJson(
      { error: 'Unable to load documents right now.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { session, error } = await requirePortalSession('admin');
  if (error) return error;

  if (!isTrustedSameOriginRequest(request)) {
    return privateJson({ error: 'Forbidden.' }, { status: 403 });
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return privateJson({ error: 'Invalid multipart form payload.' }, { status: 400 });
  }

  const uploadedFile = formData.get('file');
  const title = String(formData.get('title') || '').trim();

  if (!uploadedFile || typeof uploadedFile.arrayBuffer !== 'function') {
    return privateJson({ error: 'A PDF file is required.' }, { status: 400 });
  }

  try {
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const document = await createAdminDocument({
      title,
      sourceFilename: uploadedFile.name,
      sourceMimeType: uploadedFile.type,
      sourcePdfBytes: Buffer.from(arrayBuffer),
      createdByUserId: session.userId,
    });

    return privateJson({ document }, { status: 201 });
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

    console.error('Failed to create admin document', routeError);
    return privateJson(
      { error: 'Unable to upload this PDF right now.' },
      { status: 500 }
    );
  }
}
