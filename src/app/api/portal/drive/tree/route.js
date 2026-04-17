import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { buildDriveTree } from '@/lib/portal/drive';

export const runtime = 'nodejs';

export async function GET() {
  const { session, error } = await requirePortalSession('client');
  if (error) return error;

  const rootFolderId = session.profile.driveFolderId;
  const rootFolderUrl = session.profile.driveFolderUrl;

  if (!rootFolderId) {
    return NextResponse.json(
      { error: 'No Drive folder is configured for this client account.' },
      { status: 400 }
    );
  }

  try {
    const tree = await buildDriveTree(rootFolderId);

    return NextResponse.json(
      {
        rootFolderId,
        rootFolderUrl,
        tree,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err?.code === 404 || err?.response?.status === 404) {
      return NextResponse.json(
        { error: 'Your Drive workspace could not be accessed. Please contact Vlad.' },
        { status: 400 }
      );
    }

    console.error('Failed to load Drive tree', err);
    return NextResponse.json(
      { error: 'Unable to load Drive files right now.' },
      { status: 500 }
    );
  }
}
