import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { createDashboardRecord, deleteDashboardRecord, listDashboardRecords, updateDashboardRecord } from '@/lib/portal/dashboard-records';
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database';

export const runtime = 'nodejs';
function fail(error) {
  if (isPortalDatabaseConfigError(error)) return NextResponse.json({ error: getPortalDatabaseConfigPublicMessage() }, { status: 503 });
  if (error?.code === 'not_found') return NextResponse.json({ error: error.message }, { status: 404 });
  if (String(error?.code || '').startsWith('invalid_')) return NextResponse.json({ error: error.message }, { status: 400 });
  console.error('Dashboard records request failed', error); return NextResponse.json({ error: 'Unable to update dashboard records.' }, { status: 500 });
}
export async function GET(request) { const { error } = await requirePortalSession('admin'); if (error) return error; try { return NextResponse.json({ records: await listDashboardRecords(new URL(request.url).searchParams.get('type')) }); } catch (caught) { return fail(caught); } }
export async function POST(request) { const { error } = await requirePortalSession('admin'); if (error) return error; try { return NextResponse.json({ record: await createDashboardRecord(await request.json()) }, { status: 201 }); } catch (caught) { return fail(caught); } }
export async function PATCH(request) { const { error } = await requirePortalSession('admin'); if (error) return error; try { return NextResponse.json({ record: await updateDashboardRecord(await request.json()) }); } catch (caught) { return fail(caught); } }
export async function DELETE(request) { const { error } = await requirePortalSession('admin'); if (error) return error; try { const body = await request.json(); await deleteDashboardRecord(body.id); return NextResponse.json({ success: true }); } catch (caught) { return fail(caught); } }
