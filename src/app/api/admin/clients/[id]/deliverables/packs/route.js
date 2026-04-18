import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { createManualDeliverablePack } from '@/lib/portal/deliverables';

export const runtime = 'nodejs';

function parseClientUserId(value) {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return NaN;
  return Number(trimmed);
}

export async function POST(request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const clientUserId = parseClientUserId(params?.id);

  if (Number.isNaN(clientUserId)) {
    return NextResponse.json({ error: 'Client id must be numeric.' }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    await createManualDeliverablePack({
      clientUserId,
      sourceInvoiceId: body?.sourceInvoiceId,
      sourceInvoiceNumber: body?.sourceInvoiceNumber,
      sourceLineKey: body?.sourceLineKey,
      sourceLineLabel: body?.sourceLineLabel,
      packType: body?.packType,
      quantity: body?.quantity,
    });

    return NextResponse.json({ success: true }, { status: 201 });
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
      routeError?.code === 'invalid_source_invoice' ||
      routeError?.code === 'invalid_source_line' ||
      routeError?.code === 'invalid_pack_type' ||
      routeError?.code === 'invalid_quantity'
    ) {
      return NextResponse.json({ error: routeError.message }, { status: 400 });
    }

    if (routeError?.code === '23505') {
      return NextResponse.json(
        { error: 'A deliverable pack already exists for this invoice line and type.' },
        { status: 409 }
      );
    }

    console.error('Failed to create manual deliverable pack', routeError);
    return NextResponse.json(
      { error: 'Unable to create deliverable pack right now.' },
      { status: 500 }
    );
  }
}
