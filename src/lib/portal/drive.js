import { google } from 'googleapis';
import { MAX_DRIVE_TREE_DEPTH, MAX_DRIVE_TREE_NODES } from '@/lib/portal/constants';

const DRIVE_SCOPE = ['https://www.googleapis.com/auth/drive'];
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

function getGoogleServiceAccountConfig() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY for Drive access.');
  }

  return { clientEmail, privateKey };
}

export function getDriveAuthClient() {
  const { clientEmail, privateKey } = getGoogleServiceAccountConfig();

  return new google.auth.JWT(clientEmail, null, privateKey, DRIVE_SCOPE);
}

export function getDriveClient() {
  const auth = getDriveAuthClient();
  return google.drive({ version: 'v3', auth });
}

async function listFolderChildren(drive, parentId) {
  const allItems = [];
  let pageToken = undefined;

  do {
    const response = await drive.files.list({
      q: `'${parentId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, parents)',
      pageSize: 200,
      pageToken,
      orderBy: 'folder,name',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    allItems.push(...(response.data.files || []));
    pageToken = response.data.nextPageToken || undefined;
  } while (pageToken);

  return allItems;
}

async function buildFolderNode(drive, folder, depth, state) {
  state.visitedNodes += 1;

  const node = {
    id: folder.id,
    name: folder.name,
    mimeType: folder.mimeType,
    webViewLink: folder.webViewLink || null,
    folders: [],
    files: [],
  };

  if (depth >= MAX_DRIVE_TREE_DEPTH || state.visitedNodes >= MAX_DRIVE_TREE_NODES) {
    return node;
  }

  const children = await listFolderChildren(drive, folder.id);

  for (const child of children) {
    if (state.visitedNodes >= MAX_DRIVE_TREE_NODES) break;

    if (child.mimeType === FOLDER_MIME_TYPE) {
      node.folders.push(await buildFolderNode(drive, child, depth + 1, state));
      continue;
    }

    node.files.push({
      id: child.id,
      name: child.name,
      mimeType: child.mimeType,
      size: child.size || null,
      modifiedTime: child.modifiedTime || null,
      webViewLink: child.webViewLink || null,
    });
  }

  return node;
}

export async function buildDriveTree(rootFolderId) {
  const drive = getDriveClient();

  const rootResponse = await drive.files.get({
    fileId: rootFolderId,
    fields: 'id, name, mimeType, webViewLink',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  const rootFolder = rootResponse.data;
  if (rootFolder.mimeType !== FOLDER_MIME_TYPE) {
    throw new Error('Configured drive_folder_id is not a folder.');
  }

  const state = { visitedNodes: 0 };
  return buildFolderNode(drive, rootFolder, 0, state);
}

export async function isItemWithinRoot(itemId, rootFolderId) {
  if (!itemId || !rootFolderId) return false;
  if (itemId === rootFolderId) return true;

  const drive = getDriveClient();
  const visited = new Set();
  const stack = [itemId];

  while (stack.length > 0) {
    const currentId = stack.pop();
    if (!currentId || visited.has(currentId)) continue;
    if (currentId === rootFolderId) return true;

    visited.add(currentId);

    try {
      const response = await drive.files.get({
        fileId: currentId,
        fields: 'id, parents',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      const parents = response.data.parents || [];
      for (const parentId of parents) {
        if (parentId === rootFolderId) return true;
        if (!visited.has(parentId)) stack.push(parentId);
      }
    } catch {
      return false;
    }
  }

  return false;
}

export async function validateUploadParentFolder(parentFolderId, rootFolderId) {
  if (!parentFolderId) return rootFolderId;

  const withinRoot = await isItemWithinRoot(parentFolderId, rootFolderId);
  if (!withinRoot) {
    throw new Error('Selected folder is outside your client Drive workspace.');
  }

  const drive = getDriveClient();
  const response = await drive.files.get({
    fileId: parentFolderId,
    fields: 'id, mimeType',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  if (response.data.mimeType !== FOLDER_MIME_TYPE) {
    throw new Error('Uploads must target a folder.');
  }

  return parentFolderId;
}

export async function getDriveAccessToken() {
  const auth = getDriveAuthClient();
  const tokenResponse = await auth.getAccessToken();

  if (typeof tokenResponse === 'string') return tokenResponse;
  if (tokenResponse?.token) return tokenResponse.token;

  throw new Error('Unable to get Google Drive access token.');
}

export { FOLDER_MIME_TYPE };
