'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function formatNoteTimestamp(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

function sortNotes(notes) {
  return [...notes].sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

function upsertNote(notes, nextNote) {
  const nextSummary = {
    id: nextNote.id,
    title: nextNote.title,
    excerpt: nextNote.excerpt,
    createdAt: nextNote.createdAt,
    updatedAt: nextNote.updatedAt,
  };

  const withoutCurrent = notes.filter((note) => note.id !== nextSummary.id);
  return sortNotes([...withoutCurrent, nextSummary]);
}

function getSaveLabel(saveState) {
  if (saveState === 'saving') return 'Saving...';
  if (saveState === 'saved') return 'Saved';
  if (saveState === 'error') return 'Save failed';
  return '';
}

function resolveSpaceShortcutToken(token) {
  if (token === '*') return '- ';
  if (token === '[]') return '- [ ] ';
  if (/^\[(x|X)\]$/.test(token)) return '- [x] ';
  if (/^\d+\)$/.test(token)) return `${token.replace(/\)$/, '.')} `;
  return `${token} `;
}

function applySpaceShortcut(value, cursorPosition) {
  const beforeCursor = value.slice(0, cursorPosition);
  const afterCursor = value.slice(cursorPosition);
  const lineStartIndex = beforeCursor.lastIndexOf('\n') + 1;
  const activeLinePrefix = beforeCursor.slice(lineStartIndex);
  const shortcutMatch = activeLinePrefix.match(/^(\s*)(#{1,6}|>|-|\*|\d+[.)]|\[\]|\[(?:x|X)\])$/);

  if (!shortcutMatch) return null;

  const [, leadingWhitespace, shortcutToken] = shortcutMatch;
  const replacement = `${leadingWhitespace}${resolveSpaceShortcutToken(shortcutToken)}`;
  const nextBeforeCursor = `${beforeCursor.slice(0, lineStartIndex)}${replacement}`;

  return {
    value: `${nextBeforeCursor}${afterCursor}`,
    cursor: nextBeforeCursor.length,
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return payload;
}

const markdownComponents = {
  h1: ({ ...props }) => <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 first:mt-0" {...props} />,
  h2: ({ ...props }) => <h2 className="mt-4 text-xl font-semibold tracking-tight text-neutral-900 first:mt-0" {...props} />,
  h3: ({ ...props }) => <h3 className="mt-3 text-lg font-semibold tracking-tight text-neutral-900 first:mt-0" {...props} />,
  p: ({ ...props }) => <p className="mt-2 text-sm leading-6 text-neutral-800 first:mt-0" {...props} />,
  ul: ({ ...props }) => <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-neutral-800 first:mt-0" {...props} />,
  ol: ({ ...props }) => <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-neutral-800 first:mt-0" {...props} />,
  blockquote: ({ ...props }) => <blockquote className="mt-2 pl-3 text-sm italic text-neutral-700 first:mt-0" {...props} />,
  code({ inline, className, children, ...props }) {
    if (inline) {
      return (
        <code className="font-mono text-[0.95em] text-neutral-900" {...props}>
          {children}
        </code>
      );
    }

    return (
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-neutral-900">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  hr: ({ ...props }) => <hr className="my-4" {...props} />,
};

function hasMarkdownContent(value) {
  return String(value || '').trim().length > 0;
}

export default function AdminNotesPane() {
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState('');
  const [creatingNote, setCreatingNote] = useState(false);

  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [loadedNoteId, setLoadedNoteId] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');

  const [saveState, setSaveState] = useState('idle');
  const [saveError, setSaveError] = useState('');
  const [titleDraft, setTitleDraft] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const saveDebounceRef = useRef(null);
  const saveQueueRef = useRef(null);
  const isSavingRef = useRef(false);

  const selectedNote = useMemo(() => {
    return notes.find((note) => note.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  useEffect(() => {
    setTitleDraft(selectedNote?.title || '');
  }, [selectedNote?.title, selectedNoteId]);

  const loadNotes = useCallback(async () => {
    setNotesLoading(true);
    setNotesError('');

    try {
      const payload = await fetchJson('/api/admin/notes');
      const nextNotes = sortNotes(Array.isArray(payload.notes) ? payload.notes : []);

      setNotes(nextNotes);
      setSelectedNoteId((previousSelectedId) => {
        if (nextNotes.length === 0) return '';
        if (previousSelectedId && nextNotes.some((note) => note.id === previousSelectedId)) {
          return previousSelectedId;
        }
        return nextNotes[0].id;
      });

      if (nextNotes.length === 0) {
        setLoadedNoteId('');
        setEditorValue('');
      }
    } catch (error) {
      setNotesError(error.message || 'Unable to load notes.');
    } finally {
      setNotesLoading(false);
    }
  }, []);

  const flushSaveQueue = useCallback(async () => {
    if (isSavingRef.current) return;

    while (saveQueueRef.current) {
      const { noteId, content } = saveQueueRef.current;
      saveQueueRef.current = null;
      isSavingRef.current = true;
      setSaveState('saving');

      try {
        const payload = await fetchJson(`/api/admin/notes/${encodeURIComponent(noteId)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        setNotes((previous) => upsertNote(previous, payload.note));

        if (selectedNoteId === noteId) {
          setSaveState('saved');
          setSaveError('');
        }
      } catch (error) {
        if (selectedNoteId === noteId) {
          setSaveState('error');
          setSaveError(error.message || 'Unable to save this note.');
        }
      } finally {
        isSavingRef.current = false;
      }
    }
  }, [selectedNoteId]);

  const queueSave = useCallback(
    (noteId, content) => {
      if (!noteId) return;

      saveQueueRef.current = { noteId, content };
      void flushSaveQueue();
    },
    [flushSaveQueue]
  );

  const scheduleSave = useCallback(
    (noteId, content) => {
      if (!noteId) return;

      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
      }

      saveDebounceRef.current = setTimeout(() => {
        queueSave(noteId, content);
      }, 350);
    },
    [queueSave]
  );

  const loadSelectedNote = useCallback(async () => {
    if (!selectedNoteId) {
      setEditorValue('');
      setLoadedNoteId('');
      setContentError('');
      return;
    }

    if (selectedNoteId === loadedNoteId) return;

    setContentLoading(true);
    setContentError('');
    setSaveError('');
    setSaveState('idle');

    try {
      const payload = await fetchJson(`/api/admin/notes/${encodeURIComponent(selectedNoteId)}`);
      const note = payload.note;

      setEditorValue(note.content || '');
      setLoadedNoteId(note.id);
      setNotes((previous) => upsertNote(previous, note));
    } catch (error) {
      setContentError(error.message || 'Unable to load this note.');
      setEditorValue('');
    } finally {
      setContentLoading(false);
    }
  }, [loadedNoteId, selectedNoteId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    loadSelectedNote();
  }, [loadSelectedNote]);

  useEffect(() => {
    return () => {
      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
      }
    };
  }, []);

  async function handleCreateNote() {
    setCreatingNote(true);
    setNotesError('');
    setContentError('');

    try {
      const payload = await fetchJson('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const note = payload.note;
      setNotes((previous) => upsertNote(previous, note));
      setSelectedNoteId(note.id);
      setLoadedNoteId(note.id);
      setEditorValue(note.content || '');
      setSaveState('idle');
      setSaveError('');
    } catch (error) {
      setNotesError(error.message || 'Unable to create a note.');
    } finally {
      setCreatingNote(false);
    }
  }

  function handleEditorChange(event) {
    const nextValue = event.target.value;
    setEditorValue(nextValue);
    setSaveError('');
    scheduleSave(selectedNoteId, nextValue);
  }

  function handleEditorKeyDown(event) {
    if (event.key !== ' ') return;
    if (event.currentTarget.selectionStart !== event.currentTarget.selectionEnd) return;

    const shortcut = applySpaceShortcut(editorValue, event.currentTarget.selectionStart);
    if (!shortcut) return;

    const textarea = event.currentTarget;
    event.preventDefault();
    setEditorValue(shortcut.value);
    setSaveError('');
    scheduleSave(selectedNoteId, shortcut.value);

    requestAnimationFrame(() => {
      textarea.selectionStart = shortcut.cursor;
      textarea.selectionEnd = shortcut.cursor;
    });
  }

  async function handleRenameNote() {
    if (!selectedNoteId) return;

    const nextTitle = titleDraft.trim();
    if (!nextTitle) {
      setSaveError('Note title cannot be empty.');
      return;
    }

    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
      saveDebounceRef.current = null;
    }

    saveQueueRef.current = null;
    setRenameLoading(true);
    setSaveError('');

    try {
      const payload = await fetchJson(`/api/admin/notes/${encodeURIComponent(selectedNoteId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: nextTitle,
          content: editorValue,
        }),
      });

      const note = payload.note;
      setNotes((previous) => upsertNote(previous, note));
      setLoadedNoteId(note.id);
      setEditorValue(note.content || '');
      setTitleDraft(note.title || '');
      setSaveState('saved');
    } catch (error) {
      setSaveError(error.message || 'Unable to rename this note.');
    } finally {
      setRenameLoading(false);
    }
  }

  async function handleDeleteNote() {
    if (!selectedNoteId) return;

    const confirmed = window.confirm(`Delete "${selectedNote?.title || 'this note'}"?`);
    if (!confirmed) return;

    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
      saveDebounceRef.current = null;
    }

    saveQueueRef.current = null;
    setDeleteLoading(true);
    setSaveError('');
    setContentError('');

    try {
      await fetchJson(`/api/admin/notes/${encodeURIComponent(selectedNoteId)}`, {
        method: 'DELETE',
      });

      setLoadedNoteId('');
      setEditorValue('');
      setSaveState('idle');
      await loadNotes();
    } catch (error) {
      setSaveError(error.message || 'Unable to delete this note.');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Notes</p>

          <button
            type="button"
            onClick={handleCreateNote}
            disabled={creatingNote}
            className="cursor-pointer rounded-md p-1 text-neutral-600 transition hover:bg-neutral-200 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Create note"
            title="Create note"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {notesLoading ? <p className="text-sm text-neutral-500">Loading notes...</p> : null}

        {notesError ? <p className="text-sm text-rose-600">{notesError}</p> : null}

        {!notesLoading && notes.length === 0 ? (
          <p className="text-sm text-neutral-500">Press + to create your first note.</p>
        ) : null}

        <div className="space-y-1">
          {notes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => setSelectedNoteId(note.id)}
              className={`cursor-pointer w-full rounded-md px-2 py-1.5 text-left transition ${
                selectedNoteId === note.id ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <p className="truncate text-sm font-medium">{note.title || 'Untitled'}</p>
              <p className={`truncate text-xs ${selectedNoteId === note.id ? 'text-neutral-300' : 'text-neutral-500'}`}>{note.excerpt || 'No content yet'}</p>
              <p className={`mt-1 text-[11px] ${selectedNoteId === note.id ? 'text-neutral-400' : 'text-neutral-400'}`}>
                {formatNoteTimestamp(note.updatedAt)}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {!selectedNoteId ? (
          <p className="text-sm text-neutral-500">Select or create a note to start writing.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
              <div className="flex min-w-[220px] flex-1 items-center gap-2">
                <input
                  value={titleDraft}
                  onChange={(event) => setTitleDraft(event.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs text-neutral-800 outline-none focus:border-black"
                  placeholder="Note title"
                />
                <button
                  type="button"
                  onClick={handleRenameNote}
                  disabled={renameLoading || deleteLoading || saveState === 'saving'}
                  className="cursor-pointer rounded-md border border-neutral-300 px-2 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {renameLoading ? 'Renaming...' : 'Rename'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <p>{getSaveLabel(saveState)}</p>
                <button
                  type="button"
                  onClick={handleDeleteNote}
                  disabled={deleteLoading || renameLoading || saveState === 'saving'}
                  className="cursor-pointer rounded-md border border-rose-200 px-2 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            {contentLoading ? <p className="text-sm text-neutral-500">Loading note...</p> : null}
            {contentError ? <p className="text-sm text-rose-600">{contentError}</p> : null}
            {saveError ? <p className="text-sm text-rose-600">{saveError}</p> : null}

            <div className="relative min-h-[260px]">
              <div className="min-h-[260px] whitespace-pre-wrap break-words text-sm leading-6 text-neutral-900">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {hasMarkdownContent(editorValue) ? editorValue : ''}
                </ReactMarkdown>
              </div>

              {!hasMarkdownContent(editorValue) ? (
                <p className="pointer-events-none absolute left-0 top-0 text-sm leading-6 text-neutral-400">
                  Type markdown...
                </p>
              ) : null}

              <textarea
                value={editorValue}
                onChange={handleEditorChange}
                onKeyDown={handleEditorKeyDown}
                className="absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent text-transparent caret-neutral-900 outline-none selection:bg-neutral-300/40 selection:text-transparent"
                spellCheck={false}
                aria-label="Markdown note editor"
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
