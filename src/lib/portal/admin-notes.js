import { randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MARKDOWN_EXTENSION = '.md';
const NOTE_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.md$/;
const DEFAULT_NOTE_CONTENT = '# Untitled\n\n';

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function resolveNotesDirectory() {
  const configuredDirectory = String(process.env.ADMIN_NOTES_DIR || '').trim();

  if (!configuredDirectory) {
    return path.join(process.cwd(), 'data', 'admin-notes');
  }

  return path.isAbsolute(configuredDirectory)
    ? configuredDirectory
    : path.join(process.cwd(), configuredDirectory);
}

async function ensureNotesDirectory() {
  const directory = resolveNotesDirectory();
  await mkdir(directory, { recursive: true });
  return directory;
}

function normalizeNoteId(noteId) {
  const normalized = String(noteId || '').trim();

  if (!NOTE_ID_PATTERN.test(normalized) || normalized.includes('..')) {
    throw createError('admin_note_invalid_id', 'Invalid note id.');
  }

  return normalized;
}

function normalizeContent(content) {
  if (typeof content !== 'string') {
    throw createError('admin_note_invalid_content', 'Note content must be a string.');
  }

  return content.replace(/\r\n/g, '\n');
}

function normalizeTitle(title) {
  if (typeof title !== 'string') {
    throw createError('admin_note_invalid_title', 'Note title must be a string.');
  }

  const normalized = title
    .replace(/\r\n/g, '\n')
    .trim()
    .replace(/\s+/g, ' ');

  if (!normalized) {
    throw createError('admin_note_invalid_title', 'Note title cannot be empty.');
  }

  return normalized.slice(0, 80);
}

function applyTitleToContent(content, title) {
  const normalizedContent = normalizeContent(content);
  const normalizedTitle = normalizeTitle(title);
  const lines = normalizedContent.split('\n');
  const firstContentLineIndex = lines.findIndex((line) => line.trim().length > 0);
  const headingLine = `# ${normalizedTitle}`;

  if (firstContentLineIndex === -1) {
    return `${headingLine}\n\n`;
  }

  lines[firstContentLineIndex] = headingLine;
  return lines.join('\n');
}

function stripMarkdownSyntax(value) {
  return String(value || '')
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
    .replace(/^>\s+/, '')
    .replace(/^- \[(?: |x|X)\]\s+/, '')
    .trim();
}

function getTitleFromContent(content, fallbackId) {
  const lines = String(content || '').split('\n');
  const firstMeaningfulLine = lines.find((line) => line.trim().length > 0);
  const candidate = stripMarkdownSyntax(firstMeaningfulLine || '');

  if (candidate) return candidate.slice(0, 80);
  return fallbackId.replace(/\.md$/i, '');
}

function getExcerptFromContent(content, fallbackTitle) {
  const lines = String(content || '').split('\n');
  const firstContentLine = lines
    .map((line) => stripMarkdownSyntax(line))
    .find((line) => line.length > 0);

  return (firstContentLine || fallbackTitle).slice(0, 140);
}

function buildNoteResponse(noteId, stats, content, includeContent = false) {
  const title = getTitleFromContent(content, noteId);
  const excerpt = getExcerptFromContent(content, title);

  return {
    id: noteId,
    title,
    excerpt,
    createdAt: new Date(stats.birthtimeMs || stats.mtimeMs).toISOString(),
    updatedAt: new Date(stats.mtimeMs).toISOString(),
    ...(includeContent ? { content } : {}),
  };
}

async function readNoteFile(noteId, includeContent = false) {
  const normalizedId = normalizeNoteId(noteId);
  const notesDirectory = await ensureNotesDirectory();
  const notePath = path.join(notesDirectory, normalizedId);

  try {
    const [rawContent, metadata] = await Promise.all([
      readFile(notePath, 'utf8'),
      stat(notePath),
    ]);

    return buildNoteResponse(normalizedId, metadata, rawContent, includeContent);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw createError('admin_note_not_found', 'Note not found.');
    }

    throw error;
  }
}

function sortNotesDescending(notes) {
  return [...notes].sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

export async function listAdminNotes() {
  const notesDirectory = await ensureNotesDirectory();
  const directoryEntries = await readdir(notesDirectory, { withFileTypes: true });

  const markdownFiles = directoryEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(MARKDOWN_EXTENSION))
    .map((entry) => entry.name)
    .filter((name) => NOTE_ID_PATTERN.test(name));

  const notes = await Promise.all(
    markdownFiles.map(async (fileName) => {
      return readNoteFile(fileName, false);
    })
  );

  return sortNotesDescending(notes);
}

export async function createAdminNote(initialContent = DEFAULT_NOTE_CONTENT) {
  const content = normalizeContent(initialContent);
  const notesDirectory = await ensureNotesDirectory();
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidateId = `note-${timestamp}-${randomUUID().slice(0, 8)}${MARKDOWN_EXTENSION}`;
    const notePath = path.join(notesDirectory, candidateId);

    try {
      await writeFile(notePath, content, { encoding: 'utf8', flag: 'wx' });
      return readNoteFile(candidateId, true);
    } catch (error) {
      if (error?.code === 'EEXIST') continue;
      throw error;
    }
  }

  throw createError('admin_note_create_failed', 'Unable to create a note right now.');
}

export async function getAdminNote(noteId) {
  return readNoteFile(noteId, true);
}

export async function updateAdminNote(noteId, content) {
  const normalizedId = normalizeNoteId(noteId);
  const normalizedContent = normalizeContent(content);
  const notesDirectory = await ensureNotesDirectory();
  const notePath = path.join(notesDirectory, normalizedId);

  try {
    await stat(notePath);
    await writeFile(notePath, normalizedContent, { encoding: 'utf8' });
    return readNoteFile(normalizedId, true);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw createError('admin_note_not_found', 'Note not found.');
    }

    throw error;
  }
}

export async function renameAdminNote(noteId, title) {
  const normalizedId = normalizeNoteId(noteId);
  const notesDirectory = await ensureNotesDirectory();
  const notePath = path.join(notesDirectory, normalizedId);

  try {
    const existingContent = await readFile(notePath, 'utf8');
    const updatedContent = applyTitleToContent(existingContent, title);
    await writeFile(notePath, updatedContent, { encoding: 'utf8' });
    return readNoteFile(normalizedId, true);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw createError('admin_note_not_found', 'Note not found.');
    }

    throw error;
  }
}

export async function deleteAdminNote(noteId) {
  const normalizedId = normalizeNoteId(noteId);
  const notesDirectory = await ensureNotesDirectory();
  const notePath = path.join(notesDirectory, normalizedId);

  try {
    await unlink(notePath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw createError('admin_note_not_found', 'Note not found.');
    }

    throw error;
  }
}
