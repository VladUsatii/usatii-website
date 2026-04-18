import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { fulfillInvoiceDeliverables } from '@/lib/portal/deliverables';

export const runtime = 'nodejs';

function parseNumericId(value) {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return NaN;
  return Number(trimmed);
}

export async function POST(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const clientUserId = parseNumericId(params?.id);
  const sourceInvoiceId = String(params?.invoiceId || '').trim();

  if (Number.isNaN(clientUserId)) {
    return NextResponse.json({ error: 'Client id must be numeric.' }, { status: 400 });
  }

  if (!sourceInvoiceId) {
    return NextResponse.json({ error: 'Invoice id is required.' }, { status: 400 });
  }

  try {
    const result = await fulfillInvoiceDeliverables({ clientUserId, sourceInvoiceId });

    return NextResponse.json(
      {
        success: true,
        updatedItemCount: result.updatedItemCount,
        updatedPackCount: result.updatedPackCount,
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

    if (routeError?.code === 'invalid_source_invoice') {
      return NextResponse.json({ error: routeError.message }, { status: 400 });
    }

    console.error('Failed to fulfill invoice deliverables', routeError);
    return NextResponse.json(
      { error: 'Unable to fulfill invoice deliverables right now.' },
      { status: 500 }
    );
  }
}
