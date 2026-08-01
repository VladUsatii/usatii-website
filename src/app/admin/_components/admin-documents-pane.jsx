'use client';

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckSquare,
  CircleDot,
  Clock3,
  Download,
  FileOutput,
  FilePenLine,
  FileText,
  Grip,
  ImagePlus,
  List,
  Move,
  MousePointer2,
  PanelLeft,
  PanelRight,
  PenTool,
  RefreshCcw,
  Save,
  Search,
  Shield,
  Signature,
  SquarePen,
  Trash2,
  Type,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  ADMIN_DOCUMENT_FIELD_TYPES,
  ADMIN_DOCUMENT_MAX_SOURCE_BYTES,
  createEmptyDocumentDraft,
  normalizeDocumentDraft,
} from '@/lib/portal/admin-documents-shared';

const FIELD_LABELS = {
  text: 'Text',
  multiline: 'Multiline',
  checkbox: 'Checkbox',
  radio_group: 'Radio Group',
  select: 'Select',
  date: 'Date',
  signature: 'Signature',
  initials: 'Initials',
  image_stamp: 'Image Stamp',
};

const CHOICE_FIELD_TYPES = new Set(['radio_group', 'select']);
const TEXT_FIELD_TYPES = new Set(['text', 'multiline', 'date']);
const ASSET_FIELD_TYPES = new Set(['signature', 'initials', 'image_stamp']);
const FIELD_ICON_MAP = {
  text: Type,
  multiline: SquarePen,
  checkbox: CheckSquare,
  radio_group: CircleDot,
  select: List,
  date: CalendarDays,
  signature: Signature,
  initials: PenTool,
  image_stamp: ImagePlus,
};
const FIELD_TOOL_HELP = {
  text: 'Place a single-line text box.',
  multiline: 'Place a paragraph or notes area.',
  checkbox: 'Place a checkmark target.',
  radio_group: 'Place a grouped choice control.',
  select: 'Place a single select field.',
  date: 'Place a date entry field.',
  signature: 'Place a signature asset area.',
  initials: 'Place an initials asset area.',
  image_stamp: 'Place a PNG stamp or image.',
};
const PREVIEW_RENDER_VERSION = '2026-06-18-pdfkit-drive-e';
const DOCUMENTS_UI_VERSION = '2026-06-18-pdfkit-drive-g';

function statusTone(status) {
  return String(status || '').toLowerCase() === 'exported'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-amber-200 bg-amber-50 text-amber-700';
}

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);
  if (size <= 0) return '0 B';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function toSearchBlob(value) {
  return String(value || '').toLowerCase();
}

function matchesQuery(query, values) {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return values.some((value) => toSearchBlob(value).includes(normalized));
}

function createFieldId(type) {
  return `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createFieldPlacementToken(type) {
  return `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildFieldCreateSignature(type, pageIndex, rect) {
  return JSON.stringify({
    type,
    pageIndex,
    rect: {
      xPct: Number(rect?.xPct || 0).toFixed(4),
      yPct: Number(rect?.yPct || 0).toFixed(4),
      widthPct: Number(rect?.widthPct || 0).toFixed(4),
      heightPct: Number(rect?.heightPct || 0).toFixed(4),
    },
  });
}

function buildDefaultOptions(type) {
  if (!CHOICE_FIELD_TYPES.has(type)) return [];

  return [
    { id: `${type}_1`, label: 'Option 1', value: 'option_1' },
    { id: `${type}_2`, label: 'Option 2', value: 'option_2' },
  ];
}

function buildDefaultValueForField(field) {
  if (field.type === 'checkbox') {
    return { kind: 'bool', value: false };
  }

  if (CHOICE_FIELD_TYPES.has(field.type)) {
    return { kind: 'choice', value: field.options?.[0]?.value || null };
  }

  if (ASSET_FIELD_TYPES.has(field.type)) {
    return { kind: 'asset', assetId: null };
  }

  return { kind: 'text', value: '' };
}

function normalizeRect(rect) {
  const widthPct = Math.min(1, Math.max(0.01, Number(rect?.widthPct) || 0.2));
  const heightPct = Math.min(1, Math.max(0.01, Number(rect?.heightPct) || 0.05));

  return {
    xPct: Math.min(Math.max(Number(rect?.xPct) || 0, 0), Math.max(0, 1 - widthPct)),
    yPct: Math.min(Math.max(Number(rect?.yPct) || 0, 0), Math.max(0, 1 - heightPct)),
    widthPct,
    heightPct,
  };
}

function buildNewField(type, pageIndex, rect) {
  return {
    id: createFieldId(type),
    type,
    pageIndex,
    rect: normalizeRect(rect),
    name: `${type}_${pageIndex + 1}`,
    label: FIELD_LABELS[type] || 'Field',
    required: false,
    fontSize: type === 'multiline' ? 12 : 14,
    align: 'left',
    options: buildDefaultOptions(type),
  };
}

function readFieldDisplayValue(field, value, assetsById) {
  if (field.type === 'checkbox') {
    return value?.kind === 'bool' && value.value ? 'Checked' : 'Unchecked';
  }

  if (CHOICE_FIELD_TYPES.has(field.type)) {
    const selected = field.options?.find((option) => option.value === value?.value);
    return selected?.label || value?.value || '';
  }

  if (ASSET_FIELD_TYPES.has(field.type)) {
    const asset = value?.assetId ? assetsById[value.assetId] : null;
    return asset?.filename || 'No asset';
  }

  if (field.type === 'date') {
    return formatDateFieldValue(value?.value || '');
  }

  return value?.value || '';
}

function fetchJson(url, options = {}) {
  return fetch(url, {
    ...options,
    cache: 'no-store',
    credentials: 'same-origin',
  }).then(async (response) => {
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(payload.error || `Request failed (${response.status}).`);
      error.status = response.status;
      error.code = payload.code || null;
      throw error;
    }

    return payload;
  });
}

function setCanvasToDeviceSize(canvas, width, height) {
  const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return context;
}

function createPngBlobFromText(text, role) {
  const canvas = document.createElement('canvas');
  const width = role === 'initials' ? 260 : 600;
  const height = role === 'initials' ? 120 : 180;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#000000';
  context.font = role === 'initials' ? 'italic 700 68px Georgia' : 'italic 58px Georgia';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillText(String(text || '').trim(), width / 2, height / 2);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to generate a PNG asset.'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load this image.'));
    };

    image.src = objectUrl;
  });
}

async function convertImageFileToPng(file) {
  if (!file) {
    throw new Error('An image file is required.');
  }

  if (file.type === 'image/png') {
    return file;
  }

  const image = await loadImageElement(file);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((nextBlob) => {
      if (!nextBlob) {
        reject(new Error('Unable to convert this image to PNG.'));
        return;
      }

      resolve(nextBlob);
    }, 'image/png');
  });

  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.png', {
    type: 'image/png',
  });
}

function getPreviewRenderWidth(pageWidth) {
  const normalizedWidth = Math.max(1, Number(pageWidth || 0));
  const deviceScale =
    typeof window !== 'undefined' ? Math.max(1, Number(window.devicePixelRatio || 1)) : 1.5;
  const oversample = Math.min(2.2, Math.max(1.65, Number((deviceScale * 1.12).toFixed(2))));
  return Math.max(1600, Math.min(2800, Math.ceil(normalizedWidth * oversample)));
}

function getViewportDimension(value, zoom) {
  return Math.max(1, Math.round(Number(value || 0) * Number(zoom || 1)));
}

function stopEditorKeyPropagation(event) {
  event.stopPropagation();
}

function isInteractiveEditorTarget(target) {
  return target instanceof Element
    ? Boolean(target.closest('input, textarea, select, option, button, label'))
    : false;
}

function coerceDateValueToInput(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const slashMatch = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!slashMatch) return '';

  const [, month, day, year] = slashMatch;
  const safeMonth = month.padStart(2, '0');
  const safeDay = day.padStart(2, '0');
  return `${year}-${safeMonth}-${safeDay}`;
}

function formatDateFieldValue(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return '';

  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${month}/${day}/${year}`;
  }

  return normalized;
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-[18px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,252,0.92))] p-8 text-center">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-[12px] border border-slate-200 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function Tooltip({ text, align = 'center' }) {
  const alignmentClass =
    align === 'left'
      ? 'left-0 translate-x-0'
      : align === 'right'
        ? 'right-0 translate-x-0'
        : 'left-1/2 -translate-x-1/2';

  return (
    <span
      className={`pointer-events-none absolute top-full z-30 mt-2 max-w-[220px] rounded-[10px] border border-white/10 bg-slate-950/96 px-2.5 py-2 text-[10px] font-medium leading-4 tracking-[0.01em] text-white opacity-0 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 ${alignmentClass} translate-y-1 whitespace-normal`}
    >
      {text}
    </span>
  );
}

function ActionIconButton({
  icon: Icon,
  label,
  tooltip,
  onClick,
  disabled = false,
  tone = 'neutral',
  active = false,
  showLabel = false,
  alignTooltip = 'center',
  className = '',
}) {
  const toneClass = {
    neutral:
      'border-transparent bg-[#ebf1f8] text-slate-700 hover:border-slate-200 hover:bg-white',
    primary:
      'border-transparent bg-slate-950 text-white hover:bg-slate-800',
    danger:
      'border-transparent bg-[#fff1f2] text-rose-700 hover:border-rose-200 hover:bg-white',
  }[tone];

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={label}
        title={tooltip || label}
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex h-10 items-center gap-2 rounded-[12px] border px-3 text-[11px] font-semibold tracking-[0.01em] transition disabled:cursor-not-allowed disabled:opacity-50 ${
          active ? 'border-slate-900 bg-slate-950 text-white' : toneClass
        } ${showLabel ? '' : 'w-10 justify-center px-0'} ${className}`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {showLabel ? <span className="truncate">{label}</span> : null}
      </button>
      <Tooltip text={tooltip || label} align={alignTooltip} />
    </div>
  );
}

function ActionIconLink({
  icon: Icon,
  label,
  tooltip,
  href,
  tone = 'neutral',
  showLabel = false,
  alignTooltip = 'center',
  className = '',
}) {
  const toneClass = {
    neutral:
      'border-transparent bg-[#ebf1f8] text-slate-700 hover:border-slate-200 hover:bg-white',
    primary:
      'border-transparent bg-slate-950 text-white hover:bg-slate-800',
    danger:
      'border-transparent bg-[#fff1f2] text-rose-700 hover:border-rose-200 hover:bg-white',
  }[tone];

  return (
    <div className="group relative">
      <a
        href={href}
        aria-label={label}
        title={tooltip || label}
        className={`inline-flex h-10 items-center gap-2 rounded-[12px] border px-3 text-[11px] font-semibold tracking-[0.01em] transition ${toneClass} ${
          showLabel ? '' : 'w-10 justify-center px-0'
        } ${className}`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {showLabel ? <span className="truncate">{label}</span> : null}
      </a>
      <Tooltip text={tooltip || label} align={alignTooltip} />
    </div>
  );
}

function ToolPaletteButton({
  icon: Icon,
  label,
  description,
  active,
  onClick,
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={label}
        title={description}
        onClick={onClick}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-[12px] border px-3 text-center transition ${
          active
            ? 'border-slate-900 bg-slate-950 text-white'
            : 'border-transparent bg-[#ebf1f8] text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900'
        }`}
      >
        <Icon className="h-4.5 w-4.5 shrink-0" />
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] lg:inline">
          {label}
        </span>
      </button>
      <Tooltip text={`${label}. ${description}`} />
    </div>
  );
}

function DocumentStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusTone(status)}`}
    >
      {status}
    </span>
  );
}

function PdfFileGlyph({ selected = false }) {
  return (
    <span
      className={`relative inline-flex h-11 w-9 shrink-0 flex-col items-center justify-center rounded-[10px] border ${
        selected
          ? 'border-slate-900 bg-slate-950 text-white'
          : 'border-rose-200 bg-[linear-gradient(180deg,#fffdfd_0%,#ffe9e9_100%)] text-rose-700'
      }`}
    >
      <span
        className={`absolute right-0 top-0 h-3 w-3 rounded-bl-[7px] border-b border-l ${
          selected ? 'border-white/20 bg-white/10' : 'border-rose-200 bg-white/80'
        }`}
      />
      <FileText className="h-3.5 w-3.5" />
      <span className="mt-0.5 text-[7px] font-black tracking-[0.18em]">PDF</span>
    </span>
  );
}

function ToolbarSection({ label, children }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      {children}
    </div>
  );
}

function DocumentLibraryRow({
  document,
  active = false,
  onOpen,
  onDelete,
}) {
  return (
    <article
      className={`border-b px-6 py-3 transition last:border-b-0 ${
        active
          ? 'border-slate-200 bg-[#eef4fb] shadow-[inset_3px_0_0_#0f172a]'
          : 'border-slate-200 bg-transparent hover:bg-white/90'
      }`}
    >
      <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1.7fr)_84px_96px_136px_auto] xl:items-center">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <PdfFileGlyph selected={active} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-950">{document.title}</p>
                <DocumentStatusBadge status={document.status} />
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">{document.sourceFilename}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>Updated {formatDateTime(document.updatedAt)}</span>
                <span className="text-slate-300">•</span>
                <span>{formatFileSize(document.sourceFileSize)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 xl:hidden">
            Pages
          </p>
          <p className="text-sm font-semibold text-slate-800">{document.pageCount}</p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 xl:hidden">
            Size
          </p>
          <p className="text-sm font-semibold text-slate-800">
            {formatFileSize(document.sourceFileSize)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 xl:hidden">
            Latest export
          </p>
          <p className="text-sm font-semibold text-slate-800">
            {document.latestExportVersion ? `v${document.latestExportVersion}` : '—'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <ActionIconButton
            icon={FilePenLine}
            label="Open editor"
            tooltip="Open this document in the PDF editor workspace."
            onClick={() => onOpen(document.id)}
            tone={active ? 'primary' : 'neutral'}
            showLabel
            className="min-w-[128px]"
          />
          <ActionIconLink
            icon={Download}
            label="Download source"
            tooltip="Download the original uploaded PDF."
            href={`/api/admin/documents/${document.id}/source`}
          />
          {document.latestExportId ? (
            <ActionIconLink
              icon={FileOutput}
              label="Latest export"
              tooltip="Download the most recent flattened export."
              href={`/api/admin/documents/${document.id}/exports/${document.latestExportId}`}
            />
          ) : null}
          <ActionIconButton
            icon={Trash2}
            label="Delete document"
            tooltip="Delete this document, its draft, assets, and exports."
            onClick={() => onDelete(document.id)}
            tone="danger"
          />
        </div>
      </div>
    </article>
  );
}

function PageThumbnailButton({
  documentId,
  pageIndex,
  active = false,
  onClick,
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const previewSrc = `/api/admin/documents/${documentId}/pages/${pageIndex + 1}?width=360&rv=${PREVIEW_RENDER_VERSION}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-[14px] border p-2 text-left transition ${
        active
          ? 'border-slate-900 bg-slate-950 text-white'
          : 'border-transparent bg-transparent text-slate-700 hover:border-slate-200 hover:bg-white/86'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`relative w-[64px] shrink-0 overflow-hidden rounded-[10px] border ${
            active ? 'border-white/10 bg-slate-900' : 'border-slate-200/80 bg-white'
          }`}
        >
          {!loaded && !failed ? (
            <div className="aspect-[8.5/11] w-full animate-pulse bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]" />
          ) : null}
          {failed ? (
            <div className="aspect-[8.5/11] w-full bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-2 py-4 text-[10px] text-slate-500">
              No preview
            </div>
          ) : (
            <img
              src={previewSrc}
              alt={`Page ${pageIndex + 1}`}
              loading="lazy"
              decoding="async"
              onLoad={() => {
                setLoaded(true);
                setFailed(false);
              }}
              onError={() => {
                setLoaded(false);
                setFailed(true);
              }}
              className={`block aspect-[8.5/11] w-full object-contain bg-white transition duration-200 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              Page {pageIndex + 1}
            </span>
            <span
              className={`text-[10px] ${
                active ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-700'
              }`}
            >
              {active ? 'Active' : 'Open'}
            </span>
          </div>
          <p
            className={`mt-1 text-xs ${
              active ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            PDF page preview
          </p>
        </div>
      </div>
    </button>
  );
}

function FieldOptionEditor({ field, onChange }) {
  const options = field.options || [];

  function updateOption(index, key, value) {
    const nextOptions = options.map((option, optionIndex) =>
      optionIndex === index ? { ...option, [key]: value } : option
    );
    onChange(nextOptions);
  }

  function addOption() {
    onChange([
      ...options,
      {
        id: `${field.id}_option_${options.length + 1}`,
        label: `Option ${options.length + 1}`,
        value: `option_${options.length + 1}`,
      },
    ]);
  }

  function removeOption(index) {
    onChange(options.filter((_, optionIndex) => optionIndex !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Options
        </p>
        <button
          type="button"
          onClick={addOption}
          className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-700 transition hover:border-neutral-400"
        >
          Add
        </button>
      </div>

      {options.length === 0 ? (
        <p className="text-xs text-neutral-500">No options yet.</p>
      ) : (
        options.map((option, index) => (
          <div
            key={option.id || `${field.id}-option-${index}`}
            className="grid gap-2 rounded-lg border border-neutral-200 p-2"
          >
            <input
              value={option.label || ''}
              onChange={(event) => updateOption(index, 'label', event.target.value)}
              onKeyDown={stopEditorKeyPropagation}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-black"
              placeholder="Label"
            />
            <div className="flex items-center gap-2">
              <input
                value={option.value || ''}
                onChange={(event) => updateOption(index, 'value', event.target.value)}
                onKeyDown={stopEditorKeyPropagation}
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-black"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="rounded-md border border-rose-200 px-2 py-1.5 text-[11px] font-semibold text-rose-700 transition hover:border-rose-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AssetComposer({
  documentId,
  field,
  assets,
  currentAssetId,
  onAssetCreated,
  onAssignAsset,
}) {
  const canvasRef = useRef(null);
  const drawingStateRef = useRef({
    drawing: false,
    lastX: 0,
    lastY: 0,
  });
  const [typedText, setTypedText] = useState('');
  const [assetError, setAssetError] = useState('');
  const [assetBusy, setAssetBusy] = useState(false);

  const relevantAssets = assets.filter((asset) => asset.assetRole === field.type);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = setCanvasToDeviceSize(canvas, 320, 120);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 320, 120);
    context.strokeStyle = '#e5e5e5';
    context.lineWidth = 1;
    context.strokeRect(0.5, 0.5, 319, 119);
  }, [field.id]);

  async function uploadAssetBlob(blob, filename) {
    setAssetBusy(true);
    setAssetError('');

    try {
      const formData = new FormData();
      formData.append('role', field.type);
      formData.append(
        'file',
        new File([blob], filename, {
          type: 'image/png',
        })
      );

      const payload = await fetchJson(`/api/admin/documents/${documentId}/assets`, {
        method: 'POST',
        body: formData,
      });

      onAssetCreated(payload.asset);
      onAssignAsset(payload.asset.id);
    } catch (error) {
      setAssetError(error.message || 'Unable to save the asset.');
    } finally {
      setAssetBusy(false);
    }
  }

  function drawFromEvent(event, moveOnly = false) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const nextX = event.clientX - rect.left;
    const nextY = event.clientY - rect.top;
    const state = drawingStateRef.current;

    if (!moveOnly) {
      state.drawing = true;
      state.lastX = nextX;
      state.lastY = nextY;
      return;
    }

    if (!state.drawing) return;

    context.strokeStyle = '#111111';
    context.lineWidth = field.type === 'initials' ? 3 : 2.5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(state.lastX, state.lastY);
    context.lineTo(nextX, nextY);
    context.stroke();
    state.lastX = nextX;
    state.lastY = nextY;
  }

  function stopDrawing() {
    drawingStateRef.current.drawing = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#e5e5e5';
    context.lineWidth = 1;
    context.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
  }

  async function handleSaveDrawing() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((nextBlob) => {
          if (!nextBlob) {
            reject(new Error('Unable to capture the drawn signature.'));
            return;
          }

          resolve(nextBlob);
        }, 'image/png');
      });

      await uploadAssetBlob(blob, `${field.type}-${Date.now()}.png`);
      clearCanvas();
    } catch (error) {
      setAssetError(error.message || 'Unable to save the drawing.');
    }
  }

  async function handleTypedAssetCreate() {
    if (!typedText.trim()) {
      setAssetError('Enter text before generating an asset.');
      return;
    }

    try {
      const blob = await createPngBlobFromText(typedText, field.type);
      await uploadAssetBlob(blob, `${field.type}-${Date.now()}.png`);
      setTypedText('');
    } catch (error) {
      setAssetError(error.message || 'Unable to generate the typed asset.');
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const pngFile = await convertImageFileToPng(file);
      await uploadAssetBlob(pngFile, pngFile.name);
    } catch (error) {
      setAssetError(error.message || 'Unable to upload this image.');
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Assets
        </p>
        <span className="text-[11px] text-neutral-500">
          {relevantAssets.length} saved
        </span>
      </div>

      {relevantAssets.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {relevantAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onAssignAsset(asset.id)}
              className={`overflow-hidden rounded-lg border text-left transition ${
                String(currentAssetId || '') === String(asset.id)
                  ? 'border-neutral-900 bg-white shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <img
                src={asset.previewDataUrl}
                alt={asset.filename}
                className="h-20 w-full object-contain bg-white"
              />
              <div className="border-t border-neutral-200 px-2 py-1.5">
                <p className="truncate text-[11px] font-semibold text-neutral-800">
                  {asset.filename}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-500">No saved assets for this field type yet.</p>
      )}

      {(field.type === 'signature' || field.type === 'initials') ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Draw
          </p>
          <canvas
            ref={canvasRef}
            className="w-full touch-none rounded-lg border border-neutral-200 bg-white"
            onPointerDown={(event) => drawFromEvent(event, false)}
            onPointerMove={(event) => drawFromEvent(event, true)}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSaveDrawing}
              disabled={assetBusy}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-neutral-700 transition hover:border-neutral-400 disabled:opacity-60"
            >
              {assetBusy ? 'Saving...' : 'Save Drawing'}
            </button>
            <button
              type="button"
              onClick={clearCanvas}
              disabled={assetBusy}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-neutral-700 transition hover:border-neutral-400 disabled:opacity-60"
            >
              Clear
            </button>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Type
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={typedText}
              onChange={(event) => setTypedText(event.target.value)}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-black"
              placeholder={field.type === 'initials' ? 'VU' : 'Type a signature'}
            />
            <button
              type="button"
              onClick={handleTypedAssetCreate}
              disabled={assetBusy}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-neutral-700 transition hover:border-neutral-400 disabled:opacity-60"
            >
              Create
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Upload PNG
        </p>
        <label className="inline-flex cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-neutral-700 transition hover:border-neutral-400">
          Choose Image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {assetError ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
          {assetError}
        </p>
      ) : null}
    </div>
  );
}

function FieldBox({
  field,
  pageWidth,
  pageHeight,
  selected,
  fieldValue,
  previewValue,
  previewAsset,
  onSelect,
  onUpdateRect,
  onUpdateValue,
  onDelete,
}) {
  const fieldRef = useRef(null);
  const [interaction, setInteraction] = useState(null);
  const controlRef = useRef(null);

  useEffect(() => {
    if (!interaction) return undefined;

    function handlePointerMove(event) {
      const deltaXPct = (event.clientX - interaction.startClientX) / pageWidth;
      const deltaYPct = (event.clientY - interaction.startClientY) / pageHeight;
      const rect = { ...interaction.startRect };

      if (interaction.mode === 'move') {
        rect.xPct = Math.min(
          Math.max(0, interaction.startRect.xPct + deltaXPct),
          Math.max(0, 1 - rect.widthPct)
        );
        rect.yPct = Math.min(
          Math.max(0, interaction.startRect.yPct + deltaYPct),
          Math.max(0, 1 - rect.heightPct)
        );
      } else {
        rect.widthPct = Math.min(
          1 - rect.xPct,
          Math.max(0.01, interaction.startRect.widthPct + deltaXPct)
        );
        rect.heightPct = Math.min(
          1 - rect.yPct,
          Math.max(0.01, interaction.startRect.heightPct + deltaYPct)
        );
      }

      onUpdateRect(field.id, rect);
    }

    function handlePointerUp() {
      setInteraction(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [field.id, interaction, onUpdateRect, pageHeight, pageWidth]);

  const style = {
    left: `${field.rect.xPct * pageWidth}px`,
    top: `${field.rect.yPct * pageHeight}px`,
    width: `${field.rect.widthPct * pageWidth}px`,
    height: `${field.rect.heightPct * pageHeight}px`,
  };

  const isCheckbox = field.type === 'checkbox';
  const isAsset = ASSET_FIELD_TYPES.has(field.type);
  const isDateField = field.type === 'date';
  const isInlineTextField = field.type === 'text' || field.type === 'multiline';
  const isResizableTextField = isInlineTextField || isDateField;
  const fieldOptions = Array.isArray(field.options) ? field.options : [];
  const previewTextClass =
    field.align === 'right'
      ? 'text-right'
      : field.align === 'center'
        ? 'text-center'
        : 'text-left';
  const placeholder =
    previewValue || field.label || field.name || FIELD_LABELS[field.type] || 'Field';
  const textFieldValue =
    fieldValue?.kind === 'text' ? String(fieldValue.value || '') : '';
  const dateFieldValue = isDateField ? coerceDateValueToInput(textFieldValue) : '';
  const checkboxChecked = fieldValue?.kind === 'bool' && Boolean(fieldValue.value);
  const choiceValue = fieldValue?.kind === 'choice' ? String(fieldValue.value || '') : '';
  const showFieldChrome = selected && !isResizableTextField;

  useEffect(() => {
    if (!selected) return;

    const node = controlRef.current;
    if (!node || document.activeElement === node) return;

    if (typeof node.focus === 'function') {
      node.focus({ preventScroll: true });
    }

    if ((isInlineTextField || isDateField) && typeof node.setSelectionRange === 'function') {
      const nextValue = String(node.value || '');
      node.setSelectionRange(nextValue.length, nextValue.length);
    }
  }, [selected, field.id, isDateField, isInlineTextField]);

  useEffect(() => {
    if (!selected || !isResizableTextField || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const node = fieldRef.current;
    if (!node) return undefined;

    let frameId = null;
    const observer = new ResizeObserver(() => {
      const nextWidth = Number(node.offsetWidth || 0);
      const nextHeight = Number(node.offsetHeight || 0);
      const expectedWidth = Number(field.rect.widthPct || 0) * pageWidth;
      const expectedHeight = Number(field.rect.heightPct || 0) * pageHeight;

      if (
        Math.abs(nextWidth - expectedWidth) < 1 &&
        Math.abs(nextHeight - expectedHeight) < 1
      ) {
        return;
      }

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        onUpdateRect(field.id, {
          ...field.rect,
          widthPct: nextWidth / pageWidth,
          heightPct: nextHeight / pageHeight,
        });
      });
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [selected, isResizableTextField, field.id, field.rect, onUpdateRect, pageWidth, pageHeight]);

  function startInteraction(mode, event) {
    event.stopPropagation();
    onSelect(field.id);
    setInteraction({
      mode,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startRect: { ...field.rect },
    });
  }

  return (
    <div
      ref={fieldRef}
      style={style}
      className={`absolute overflow-hidden rounded-[10px] border transition ${
        selected
          ? 'border-slate-950 bg-white/20 shadow-[0_18px_32px_-24px_rgba(15,23,42,0.42)]'
          : 'border-slate-400/75 bg-white/12 hover:border-slate-500/80'
      } ${selected && isResizableTextField ? 'min-h-[36px] min-w-[72px] resize' : ''}`}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect(field.id);

        if (!selected || isInteractiveEditorTarget(event.target)) {
          return;
        }

        startInteraction('move', event);
      }}
    >
      {showFieldChrome ? (
        <div className="absolute inset-x-3 top-2 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          <span className="truncate">{field.label || FIELD_LABELS[field.type] || 'Field'}</span>
          <div className="flex items-center gap-1.5">
            <span className="shrink-0 text-slate-500">{FIELD_LABELS[field.type] || field.type}</span>
            <button
              type="button"
              aria-label="Move field"
              title="Move field"
              onPointerDown={(event) => startInteraction('move', event)}
              className="pointer-events-auto inline-flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white/90 text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-900"
            >
              <Move className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`flex h-full w-full items-center px-3 pb-3 text-[11px] text-slate-700 ${
          showFieldChrome ? 'pt-7' : 'pt-3'
        }`}
      >
        {selected && isCheckbox ? (
          <label className="pointer-events-auto flex w-full items-center justify-center gap-2 text-[11px] text-slate-800">
            <input
              ref={controlRef}
              type="checkbox"
              checked={checkboxChecked}
              onFocus={() => onSelect(field.id)}
              onPointerDown={(event) => event.stopPropagation()}
              onKeyDown={stopEditorKeyPropagation}
              onChange={(event) =>
                onUpdateValue(field.id, {
                  kind: 'bool',
                  value: event.target.checked,
                })
              }
              className="h-4 w-4 accent-slate-950"
            />
            <span>{checkboxChecked ? 'Checked' : 'Unchecked'}</span>
          </label>
        ) : isCheckbox ? (
          <span className="pointer-events-none w-full text-center text-lg">
            {previewValue === 'Checked' ? '✓' : ''}
          </span>
        ) : isAsset && previewAsset ? (
          <img
            src={previewAsset.previewDataUrl}
            alt={previewAsset.filename}
            className="pointer-events-none max-h-full max-w-full object-contain"
          />
        ) : selected && field.type === 'radio_group' ? (
          <div className="pointer-events-auto flex h-full w-full flex-col justify-center gap-1 overflow-y-auto pr-1">
            {fieldOptions.map((option, optionIndex) => {
              const isActiveChoice = choiceValue
                ? choiceValue === String(option.value || '')
                : optionIndex === 0;

              return (
                <label
                  key={option.id || `${field.id}-radio-${optionIndex}`}
                  className="flex items-center gap-2 text-[11px] leading-4 text-slate-800"
                >
                  <input
                    ref={isActiveChoice ? controlRef : null}
                    type="radio"
                    name={`field-choice-${field.id}`}
                    checked={choiceValue === String(option.value || '')}
                    onFocus={() => onSelect(field.id)}
                    onPointerDown={(event) => event.stopPropagation()}
                    onKeyDown={stopEditorKeyPropagation}
                    onChange={() =>
                      onUpdateValue(field.id, {
                        kind: 'choice',
                        value: String(option.value || ''),
                      })
                    }
                    className="h-3.5 w-3.5 accent-slate-950"
                  />
                  <span className="truncate">{option.label || option.value}</span>
                </label>
              );
            })}
          </div>
        ) : selected && field.type === 'select' ? (
          <select
            ref={controlRef}
            value={choiceValue}
            onFocus={() => onSelect(field.id)}
            onPointerDown={(event) => event.stopPropagation()}
            onKeyDown={stopEditorKeyPropagation}
            onChange={(event) =>
              onUpdateValue(field.id, {
                kind: 'choice',
                value: event.target.value || null,
              })
            }
            className="pointer-events-auto w-full rounded-md border border-slate-300 bg-white/92 px-2 py-1 text-[11px] text-slate-800 outline-none"
          >
            {fieldOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : selected && isDateField ? (
          <input
            ref={controlRef}
            type="date"
            value={dateFieldValue}
            onFocus={() => onSelect(field.id)}
            onPointerDown={(event) => event.stopPropagation()}
            onKeyDown={stopEditorKeyPropagation}
            onChange={(event) =>
              onUpdateValue(field.id, {
                kind: 'text',
                value: event.target.value,
              })
            }
            className="pointer-events-auto w-full rounded-md border border-slate-300 bg-white/92 px-2 py-1 text-[11px] text-slate-800 outline-none"
          />
        ) : selected && isInlineTextField ? (
          field.type === 'multiline' ? (
            <textarea
              ref={controlRef}
              value={textFieldValue}
              onFocus={() => onSelect(field.id)}
              onPointerDown={(event) => event.stopPropagation()}
              onKeyDown={stopEditorKeyPropagation}
              onChange={(event) =>
                onUpdateValue(field.id, {
                  kind: 'text',
                  value: event.target.value,
                })
              }
              placeholder={field.label || 'Enter text'}
              className={`pointer-events-auto h-full min-h-0 w-full resize-none border-0 bg-transparent p-0 text-[11px] leading-5 text-slate-800 outline-none placeholder:text-slate-400 ${previewTextClass}`}
            />
          ) : (
            <input
              ref={controlRef}
              value={textFieldValue}
              onFocus={() => onSelect(field.id)}
              onPointerDown={(event) => event.stopPropagation()}
              onKeyDown={stopEditorKeyPropagation}
              onChange={(event) =>
                onUpdateValue(field.id, {
                  kind: 'text',
                  value: event.target.value,
                })
              }
              placeholder={field.label || 'Enter text'}
              className={`pointer-events-auto w-full border-0 bg-transparent p-0 text-[11px] text-slate-800 outline-none placeholder:text-slate-400 ${previewTextClass}`}
            />
          )
        ) : (
          <span
            className={`pointer-events-none line-clamp-3 w-full ${previewTextClass} ${
              previewValue ? 'text-slate-700' : 'text-slate-500'
            }`}
          >
            {placeholder}
          </span>
        )}
      </div>

      {showFieldChrome ? (
        <>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(field.id);
            }}
            className="absolute right-2 top-10 inline-flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-white shadow-sm"
            title="Delete field"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Resize field"
            onPointerDown={(event) => {
              startInteraction('resize', event);
            }}
            className="absolute bottom-2 right-2 inline-flex h-6 w-6 cursor-se-resize items-center justify-center rounded-md border border-white/70 bg-slate-950/88 text-white shadow-sm"
            title="Resize field"
          >
            <Grip className="h-3.5 w-3.5" />
          </button>
        </>
      ) : null}
    </div>
  );
}

function PdfPageEditor({
  documentId,
  pageNumber,
  pageSize,
  pageIndex,
  zoom,
  pageFields,
  draftValues,
  assetsById,
  selectedFieldId,
  activeCreateTool,
  activeCreateToolToken,
  onSelectField,
  onCreateField,
  onUpdateFieldRect,
  onUpdateFieldValue,
  onDeleteField,
}) {
  const creatingRectRef = useRef(null);
  const createSessionCounterRef = useRef(0);
  const lastCompletedCreateRef = useRef('');
  const [viewport, setViewport] = useState(() => ({
    width: getViewportDimension(pageSize?.width, zoom),
    height: getViewportDimension(pageSize?.height, zoom),
  }));
  const [renderError, setRenderError] = useState('');
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [creatingRect, setCreatingRect] = useState(null);

  useEffect(() => {
    setViewport({
      width: getViewportDimension(pageSize?.width, zoom),
      height: getViewportDimension(pageSize?.height, zoom),
    });
    setRenderError('');
    setPreviewLoaded(false);
    setCreatingRect(null);
    creatingRectRef.current = null;
    lastCompletedCreateRef.current = '';
  }, [pageNumber, pageSize?.height, pageSize?.width, zoom]);

  useEffect(() => {
    creatingRectRef.current = creatingRect;
  }, [creatingRect]);

  function updateDraftRectFromPointer(event) {
    const current = creatingRectRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();

    const bounds = event.currentTarget.getBoundingClientRect();
    const currentX = Math.min(Math.max(0, event.clientX - bounds.left), bounds.width);
    const currentY = Math.min(Math.max(0, event.clientY - bounds.top), bounds.height);
    const nextRect = {
      ...current,
      currentX,
      currentY,
    };

    creatingRectRef.current = nextRect;
    setCreatingRect(nextRect);
  }

  function finishDraftRectFromPointer(event) {
    const current = creatingRectRef.current;
    if (!current || current.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const currentX = Math.min(Math.max(0, event.clientX - bounds.left), bounds.width);
    const currentY = Math.min(Math.max(0, event.clientY - bounds.top), bounds.height);
    const finalRect = {
      ...current,
      currentX,
      currentY,
    };

    creatingRectRef.current = null;
    setCreatingRect(null);

    if (event.type === 'pointercancel') return;

    if (lastCompletedCreateRef.current === current.sessionId) {
      return;
    }

    lastCompletedCreateRef.current = current.sessionId;

    const x = Math.min(finalRect.startX, finalRect.currentX);
    const y = Math.min(finalRect.startY, finalRect.currentY);
    const width = Math.abs(finalRect.currentX - finalRect.startX);
    const height = Math.abs(finalRect.currentY - finalRect.startY);

    if (width >= 12 && height >= 12 && viewport.width > 0 && viewport.height > 0) {
      onCreateField(
        finalRect.toolType,
        pageIndex,
        {
          xPct: x / viewport.width,
          yPct: y / viewport.height,
          widthPct: width / viewport.width,
          heightPct: height / viewport.height,
        },
        finalRect.sessionId,
        finalRect.toolActivationToken
      );
    }
  }

  const draftStyle = creatingRect
    ? {
      left: `${Math.min(creatingRect.startX, creatingRect.currentX)}px`,
      top: `${Math.min(creatingRect.startY, creatingRect.currentY)}px`,
      width: `${Math.abs(creatingRect.currentX - creatingRect.startX)}px`,
      height: `${Math.abs(creatingRect.currentY - creatingRect.startY)}px`,
    }
    : null;

  const previewWidth = getPreviewRenderWidth(viewport.width);
  // Flat PDFs with missing embedded fonts can drift badly in browser PDF renderers.
  // The editor uses the protected server raster preview so placement matches exports.
  const previewSrc = `/api/admin/documents/${documentId}/pages/${pageNumber}?width=${previewWidth}&rv=${PREVIEW_RENDER_VERSION}`;
  const isPageLoading = !previewLoaded && !renderError;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Page {pageIndex + 1}
        </p>
        <p className="text-[11px] text-slate-500">Private page preview</p>
      </div>

      <div
        className="relative overflow-hidden rounded-[8px] border border-slate-300 bg-white shadow-[0_28px_60px_-36px_rgba(15,23,42,0.42)]"
        style={{
          width: viewport.width ? `${viewport.width}px` : undefined,
          minHeight: viewport.height ? `${viewport.height}px` : '220px',
        }}
      >
        <img
          src={previewSrc}
          alt={`PDF page ${pageNumber}`}
          draggable="false"
          decoding="async"
          fetchPriority="high"
          onLoad={() => {
            setPreviewLoaded(true);
            setRenderError('');
          }}
          onError={() => {
            setPreviewLoaded(false);
            setRenderError('Unable to render this page preview.');
          }}
          className={`block select-none bg-white transition-opacity duration-150 ${
            previewLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            width: `${viewport.width}px`,
            height: `${viewport.height}px`,
            imageRendering: 'auto',
          }}
        />

        {isPageLoading ? (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(248,250,252,1),rgba(241,245,249,1))]"
            style={{
              width: `${viewport.width}px`,
              height: `${viewport.height}px`,
            }}
          >
            <div className="space-y-4">
              <div className="mx-auto h-5 w-40 animate-pulse rounded-full bg-slate-200" />
              <div className="mx-auto h-3 w-24 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        ) : null}

        {renderError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 px-6 text-center">
            <div className="max-w-sm space-y-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
              <p className="font-semibold">Preview unavailable</p>
              <p className="text-xs leading-5">{renderError}</p>
            </div>
          </div>
        ) : null}

        <div
          className={`absolute inset-0 ${activeCreateTool ? 'cursor-crosshair' : ''}`}
          style={{ touchAction: activeCreateTool ? 'none' : 'auto' }}
          onPointerDown={(event) => {
            if (!previewLoaded || renderError) return;
            if (!activeCreateTool) return;
            if (!activeCreateToolToken) return;
            if (!event.isPrimary || event.button !== 0) return;
            if (event.target !== event.currentTarget) return;
            if (creatingRectRef.current) return;

            const bounds = event.currentTarget.getBoundingClientRect();
            const startX = event.clientX - bounds.left;
            const startY = event.clientY - bounds.top;
            createSessionCounterRef.current += 1;
            const nextRect = {
              pointerId: event.pointerId,
              sessionId: `page-${pageIndex}-create-${createSessionCounterRef.current}`,
              toolActivationToken: activeCreateToolToken,
              toolType: activeCreateTool,
              startX,
              startY,
              currentX: startX,
              currentY: startY,
            };

            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture?.(event.pointerId);
            creatingRectRef.current = nextRect;
            setCreatingRect(nextRect);
          }}
          onPointerMove={updateDraftRectFromPointer}
          onPointerUp={finishDraftRectFromPointer}
          onPointerCancel={finishDraftRectFromPointer}
        >
          {pageFields.map((field) => {
            const fieldValue = draftValues?.[field.id];
            const previewAsset =
              fieldValue?.kind === 'asset' && fieldValue.assetId
                ? assetsById[fieldValue.assetId]
                : null;

            return (
              <FieldBox
                key={field.id}
                field={field}
                pageWidth={viewport.width}
                pageHeight={viewport.height}
                selected={field.id === selectedFieldId}
                fieldValue={fieldValue}
                previewValue={readFieldDisplayValue(field, fieldValue, assetsById)}
                previewAsset={previewAsset}
                onSelect={onSelectField}
                onUpdateRect={onUpdateFieldRect}
                onUpdateValue={onUpdateFieldValue}
                onDelete={onDeleteField}
              />
            );
          })}

          {draftStyle ? (
            <div
              style={draftStyle}
              className="absolute rounded border-2 border-dashed border-blue-500 bg-blue-500/10"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PdfWorkspace({
  documentId,
  pageSizes,
  draft,
  assetsById,
  selectedFieldId,
  activeCreateTool,
  activeCreateToolToken,
  currentPageIndex,
  zoom,
  onCreateField,
  onSelectField,
  onUpdateFieldRect,
  onUpdateFieldValue,
  onDeleteField,
}) {
  if (!documentId) {
    return (
      <EmptyState
        title="No PDF loaded"
        description="Open a document from the library to start editing."
      />
    );
  }

  if (!Array.isArray(pageSizes) || pageSizes.length === 0) {
    return (
      <EmptyState
        title="PDF preview unavailable"
        description="This document is missing page preview metadata."
      />
    );
  }

  const safePageIndex = Math.min(
    Math.max(0, Number(currentPageIndex || 0)),
    Math.max(0, pageSizes.length - 1)
  );
  const activePageSize = pageSizes[safePageIndex];

  if (!activePageSize) {
    return (
      <EmptyState
        title="Page unavailable"
        description="The selected page does not have preview metadata."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PdfPageEditor
        key={`pdf-page-${safePageIndex}`}
        documentId={documentId}
        pageNumber={safePageIndex + 1}
        pageSize={activePageSize}
        pageIndex={safePageIndex}
        pageFields={draft.fields.filter((field) => field.pageIndex === safePageIndex)}
        draftValues={draft.values}
        assetsById={assetsById}
        selectedFieldId={selectedFieldId}
        activeCreateTool={activeCreateTool}
        activeCreateToolToken={activeCreateToolToken}
        zoom={zoom}
        onCreateField={onCreateField}
        onSelectField={onSelectField}
        onUpdateFieldRect={onUpdateFieldRect}
        onUpdateFieldValue={onUpdateFieldValue}
        onDeleteField={onDeleteField}
      />
    </div>
  );
}

export default function AdminDocumentsPane({ globalSearch = '' }) {
  const deferredSearch = useDeferredValue(globalSearch);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState('');
  const [activeView, setActiveView] = useState('library');
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [activeCreateTool, setActiveCreateTool] = useState('');
  const [activeCreateToolToken, setActiveCreateToolToken] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [draft, setDraft] = useState(createEmptyDocumentDraft());
  const [draftStatus, setDraftStatus] = useState('idle');
  const [draftError, setDraftError] = useState('');
  const [titleDraft, setTitleDraft] = useState('');
  const [titleSaving, setTitleSaving] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [zoom, setZoom] = useState(1.15);
  const lastSyncedDraftRef = useRef(JSON.stringify(createEmptyDocumentDraft()));
  const lastFieldCreateRef = useRef({
    sessionId: '',
    signature: '',
    toolToken: '',
    createdAt: 0,
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) =>
      matchesQuery(deferredSearch, [
        document.title,
        document.sourceFilename,
        document.updatedByEmail,
        document.latestExportVersion,
      ])
    );
  }, [deferredSearch, documents]);

  const selectedField = useMemo(() => {
    return draft.fields.find((field) => field.id === selectedFieldId) || null;
  }, [draft.fields, selectedFieldId]);

  const assetsById = useMemo(() => {
    const entries = selectedDocument?.assets || [];
    return Object.fromEntries(entries.map((asset) => [String(asset.id), asset]));
  }, [selectedDocument?.assets]);

  const libraryMetrics = useMemo(() => {
    return documents.reduce(
      (summary, document) => {
        summary.total += 1;
        summary.totalPages += Number(document.pageCount || 0);

        if (document.status === 'exported') {
          summary.exported += 1;
        } else {
          summary.drafts += 1;
        }

        return summary;
      },
      {
        total: 0,
        drafts: 0,
        exported: 0,
        totalPages: 0,
      }
    );
  }, [documents]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storageKey = 'usatii-admin-documents-ui-version';
    const lastVersion = window.sessionStorage.getItem(storageKey);

    if (lastVersion && lastVersion !== DOCUMENTS_UI_VERSION) {
      window.sessionStorage.setItem(storageKey, DOCUMENTS_UI_VERSION);
      window.location.reload();
      return;
    }

    if (lastVersion !== DOCUMENTS_UI_VERSION) {
      window.sessionStorage.setItem(storageKey, DOCUMENTS_UI_VERSION);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    if (!selectedDocumentId) return;
    loadDocumentDetail(selectedDocumentId);
  }, [selectedDocumentId]);

  useEffect(() => {
    if (!selectedDocument?.id) return;

    const normalizedDraft = normalizeDocumentDraft(
      selectedDocument.draft || createEmptyDocumentDraft()
    );
    setDraft(normalizedDraft);
    lastSyncedDraftRef.current = JSON.stringify(normalizedDraft);
    setSelectedFieldId(normalizedDraft.fields[0]?.id || null);
    setCurrentPageIndex(0);
    setTitleDraft(selectedDocument.title || '');
    setDraftStatus('idle');
    setDraftError('');
    setNotice('');
    setActionError('');
    setActiveCreateTool('');
    setActiveCreateToolToken('');
    lastFieldCreateRef.current = {
      sessionId: '',
      signature: '',
      toolToken: '',
      createdAt: 0,
    };
  }, [selectedDocument?.id]);

  useEffect(() => {
    if (!selectedDocument?.id) return undefined;

    const serializedDraft = JSON.stringify(draft);
    if (serializedDraft === lastSyncedDraftRef.current) return undefined;

    setDraftStatus('pending');

    const timer = window.setTimeout(async () => {
      setDraftStatus('saving');
      setDraftError('');

      try {
        const payload = await fetchJson(`/api/admin/documents/${selectedDocument.id}/draft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ draft }),
        });

        lastSyncedDraftRef.current = JSON.stringify(payload.draft);
        setDraftStatus('saved');
        setSelectedDocument((current) =>
          current
            ? {
              ...current,
              draft: payload.draft,
              updatedAt: payload.updatedAt,
              status: 'draft',
            }
            : current
        );
        setDocuments((current) =>
          current.map((document) =>
            document.id === selectedDocument.id
              ? {
                ...document,
                status: 'draft',
                updatedAt: payload.updatedAt,
              }
              : document
          )
        );
      } catch (error) {
        setDraftStatus('error');
        setDraftError(error.message || 'Unable to save the draft.');
      }
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [draft, selectedDocument?.id]);

  async function loadDocuments() {
    setDocumentsLoading(true);
    setDocumentsError('');

    try {
      const payload = await fetchJson('/api/admin/documents');
      setDocuments(payload.documents || []);
    } catch (error) {
      setDocumentsError(error.message || 'Unable to load documents.');
    } finally {
      setDocumentsLoading(false);
    }
  }

  async function loadDocumentDetail(documentId) {
    setDocumentLoading(true);
    setDocumentError('');
    setActionError('');
    setSelectedDocument((current) => (current?.id === documentId ? current : null));

    try {
      const payload = await fetchJson(`/api/admin/documents/${documentId}`);
      setSelectedDocument(payload.document || null);
    } catch (error) {
      setSelectedDocument(null);
      setDocumentError(error.message || 'Unable to load the selected document.');
    } finally {
      setDocumentLoading(false);
    }
  }

  function openDocument(documentId) {
    setUploadError('');
    setDocumentsError('');
    setActionError('');
    setActiveCreateTool('');
    setActiveCreateToolToken('');
    setSelectedDocumentId(documentId);
    setActiveView('editor');
  }

  function returnToLibrary() {
    setActiveView('library');
    setActiveCreateTool('');
    setActiveCreateToolToken('');
    setActionError('');
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadError('');
    setUploadLoading(true);
    setNotice('');
    setActionError('');

    if (file.size > ADMIN_DOCUMENT_MAX_SOURCE_BYTES) {
      setUploadLoading(false);
      setUploadError('This PDF exceeds the 15 MB upload limit.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (uploadTitle.trim()) {
        formData.append('title', uploadTitle.trim());
      }

      const payload = await fetchJson('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });

      const nextDocument = payload.document;
      setDocuments((current) => [
        nextDocument,
        ...current.filter((entry) => entry.id !== nextDocument.id),
      ]);
      setUploadTitle('');
      setNotice('PDF uploaded.');
      openDocument(nextDocument.id);
    } catch (error) {
      setUploadError(error.message || 'Unable to upload this PDF.');
    } finally {
      setUploadLoading(false);
    }
  }

  function updateDraftWith(transform) {
    setDraft((currentDraft) => normalizeDocumentDraft(transform(currentDraft)));
  }

  function clearCreateTool() {
    setActiveCreateTool('');
    setActiveCreateToolToken('');
  }

  function toggleCreateTool(nextTool) {
    if (!nextTool || activeCreateTool === nextTool) {
      clearCreateTool();
      return;
    }

    setSelectedFieldId(null);
    setActiveCreateTool(nextTool);
    setActiveCreateToolToken(createFieldPlacementToken(nextTool));
  }

  function handleCreateField(
    type,
    pageIndex,
    rect,
    createSessionId = '',
    createToolToken = ''
  ) {
    const createSignature = buildFieldCreateSignature(type, pageIndex, rect);
    const now = Date.now();

    if (
      createSessionId &&
      lastFieldCreateRef.current.sessionId === createSessionId
    ) {
      clearCreateTool();
      return;
    }

    if (createToolToken && lastFieldCreateRef.current.toolToken === createToolToken) {
      clearCreateTool();
      return;
    }

    if (
      lastFieldCreateRef.current.signature === createSignature &&
      now - lastFieldCreateRef.current.createdAt < 1000
    ) {
      clearCreateTool();
      return;
    }

    lastFieldCreateRef.current = {
      sessionId: createSessionId,
      signature: createSignature,
      toolToken: createToolToken,
      createdAt: now,
    };

    const nextField = buildNewField(type, pageIndex, rect);

    updateDraftWith((currentDraft) => ({
      fields: [...currentDraft.fields, nextField],
      values: {
        ...currentDraft.values,
        [nextField.id]: buildDefaultValueForField(nextField),
      },
    }));

    setSelectedFieldId(nextField.id);
    setCurrentPageIndex(pageIndex);
    clearCreateTool();
  }

  function updateFieldRect(fieldId, rect) {
    updateDraftWith((currentDraft) => ({
      ...currentDraft,
      fields: currentDraft.fields.map((field) =>
        field.id === fieldId
          ? {
            ...field,
            rect: normalizeRect(rect),
          }
          : field
      ),
    }));
  }

  function deleteField(fieldId) {
    updateDraftWith((currentDraft) => {
      const nextValues = { ...currentDraft.values };
      delete nextValues[fieldId];

      return {
        fields: currentDraft.fields.filter((field) => field.id !== fieldId),
        values: nextValues,
      };
    });

    setSelectedFieldId((currentId) => (currentId === fieldId ? null : currentId));
  }

  function patchSelectedField(patch) {
    if (!selectedField) return;

    updateDraftWith((currentDraft) => ({
      ...currentDraft,
      fields: currentDraft.fields.map((field) =>
        field.id === selectedField.id
          ? {
            ...field,
            ...patch,
          }
          : field
      ),
    }));
  }

  function changeSelectedFieldType(nextType) {
    if (!selectedField) return;

    const nextField = {
      ...selectedField,
      type: nextType,
      options: buildDefaultOptions(nextType),
      fontSize: nextType === 'multiline' ? 12 : selectedField.fontSize,
    };

    updateDraftWith((currentDraft) => ({
      fields: currentDraft.fields.map((field) =>
        field.id === selectedField.id ? nextField : field
      ),
      values: {
        ...currentDraft.values,
        [selectedField.id]: buildDefaultValueForField(nextField),
      },
    }));
  }

  function changeSelectedFieldOptions(nextOptions) {
    if (!selectedField) return;

    updateDraftWith((currentDraft) => {
      const nextFields = currentDraft.fields.map((field) =>
        field.id === selectedField.id
          ? {
            ...field,
            options: nextOptions,
          }
          : field
      );

      const currentValue = currentDraft.values[selectedField.id];
      let nextValue = currentValue;

      if (CHOICE_FIELD_TYPES.has(selectedField.type)) {
        const availableValues = nextOptions.map((option) => option.value);
        const currentChoice = currentValue?.kind === 'choice' ? currentValue.value : null;
        nextValue = {
          kind: 'choice',
          value: availableValues.includes(currentChoice)
            ? currentChoice
            : availableValues[0] || null,
        };
      }

      return {
        fields: nextFields,
        values: {
          ...currentDraft.values,
          [selectedField.id]: nextValue,
        },
      };
    });
  }

  function updateSelectedFieldValue(nextValue) {
    if (!selectedField) return;

    updateDraftWith((currentDraft) => ({
      ...currentDraft,
      values: {
        ...currentDraft.values,
        [selectedField.id]: nextValue,
      },
    }));
  }

  function appendAsset(asset) {
    setSelectedDocument((current) =>
      current
        ? {
          ...current,
          assets: [asset, ...(current.assets || []).filter((entry) => entry.id !== asset.id)],
        }
        : current
    );
  }

  async function saveTitle() {
    if (!selectedDocument?.id) return;

    setTitleSaving(true);
    setNotice('');
    setActionError('');

    try {
      const payload = await fetchJson(`/api/admin/documents/${selectedDocument.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleDraft,
        }),
      });

      setSelectedDocument(payload.document);
      setDocuments((current) =>
        current.map((document) =>
          document.id === payload.document.id ? payload.document : document
        )
      );
      setTitleDraft(payload.document.title || '');
      setNotice('Document title saved.');
    } catch (error) {
      setNotice('');
      setActionError(error.message || 'Unable to save the title.');
    } finally {
      setTitleSaving(false);
    }
  }

  async function deleteDocument(documentId) {
    if (!window.confirm('Delete this document and all saved exports?')) {
      return;
    }

    try {
      await fetchJson(`/api/admin/documents/${documentId}`, {
        method: 'DELETE',
      });

      setDocuments((current) => current.filter((document) => document.id !== documentId));

      if (selectedDocumentId === documentId) {
        setSelectedDocumentId(null);
        setSelectedDocument(null);
        setDraft(createEmptyDocumentDraft());
        setSelectedFieldId(null);
        setCurrentPageIndex(0);
        clearCreateTool();
        setActiveView('library');
      }

      setNotice('Document deleted.');
    } catch (error) {
      setNotice('');
      setActionError(error.message || 'Unable to delete this document.');
    }
  }

  async function exportDocument() {
    if (!selectedDocument?.id) return;

    setExportLoading(true);
    setNotice('');
    setActionError('');

    try {
      const payload = await fetchJson(`/api/admin/documents/${selectedDocument.id}/export`, {
        method: 'POST',
      });

      setSelectedDocument(payload.document);
      setDocuments((current) =>
        current.map((document) =>
          document.id === payload.document.id ? payload.document : document
        )
      );
      setNotice(`Export v${payload.export.versionNumber} created.`);
    } catch (error) {
      setNotice('');
      setActionError(error.message || 'Unable to export this PDF.');
    } finally {
      setExportLoading(false);
    }
  }

  const statusLabel =
    draftStatus === 'saving'
      ? 'Saving draft...'
      : draftStatus === 'saved'
        ? 'Draft saved'
        : draftStatus === 'error'
          ? 'Draft save failed'
          : selectedDocument
            ? 'Draft ready'
            : 'No document selected';
  const activeToolLabel = activeCreateTool ? FIELD_LABELS[activeCreateTool] : 'Cursor';

  const libraryView = (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#f2f5fa] shadow-[0_24px_60px_-42px_rgba(15,23,42,0.24)]">
      <div className="grid min-h-[calc(100vh-220px)] lg:grid-cols-[276px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-[#ebf1f7] text-slate-900 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="px-5 pb-5 pt-5">
              <div className="flex items-center gap-3">
                <PdfFileGlyph />
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-slate-800 shadow-[0_10px_26px_-20px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
                  <Shield className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Private Admin Library
              </p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-slate-950">
                Documents
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Upload private PDFs, keep overlay drafts, and export flattened copies from a
                shared admin-only document store.
              </p>
            </div>

            <div className="border-t border-slate-200/90 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    New paper
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Upload and go straight into editing.
                  </p>
                </div>
                <Upload className="h-4 w-4 text-slate-400" />
              </div>
              <input
                value={uploadTitle}
                onChange={(event) => setUploadTitle(event.target.value)}
                onKeyDown={stopEditorKeyPropagation}
                className="mt-4 w-full rounded-[14px] border border-slate-200 bg-white/86 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-slate-950 focus:bg-white"
                placeholder="Optional document title"
              />
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-transparent bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                <Upload className="h-4 w-4" />
                <span>{uploadLoading ? 'Uploading...' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploadLoading}
                />
              </label>
              <p className="mt-3 text-[11px] leading-5 text-slate-500">
                Max file size: {formatFileSize(ADMIN_DOCUMENT_MAX_SOURCE_BYTES)}.
              </p>
            </div>

            <div className="border-t border-slate-200/90 px-5 py-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[16px] bg-white/74 px-4 py-3 ring-1 ring-slate-200/80">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Documents
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{libraryMetrics.total}</p>
                  <p className="mt-1 text-xs text-slate-500">Shared admin papers.</p>
                </div>
                <div className="rounded-[16px] bg-white/74 px-4 py-3 ring-1 ring-slate-200/80">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Drafts
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{libraryMetrics.drafts}</p>
                  <p className="mt-1 text-xs text-slate-500">Editable overlays.</p>
                </div>
                <div className="rounded-[16px] bg-white/74 px-4 py-3 ring-1 ring-slate-200/80">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Pages
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {libraryMetrics.totalPages}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Tracked for export.</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <PanelLeft className="h-3.5 w-3.5" />
                <span>Workflow</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Pick a paper here, then move into the dedicated editor workspace. Client context
                is ignored while you are inside Documents.
              </p>
            </div>

            {uploadError ? (
              <p className="mx-5 mb-3 rounded-[14px] border border-rose-200 bg-rose-50 px-3 py-3 text-xs text-rose-700">
                {uploadError}
              </p>
            ) : null}
            {notice ? (
              <p className="mx-5 mb-5 rounded-[14px] border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs text-emerald-700">
                {notice}
              </p>
            ) : null}
          </div>
        </aside>

        <section className="min-w-0 bg-[#f7f9fc]">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-white/86 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Shared Papers
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Select a document to open the editor
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Files are shared across admins only. Search from the dashboard filters this list in
                place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {deferredSearch ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                  <Search className="h-3.5 w-3.5" />
                  Filtered by dashboard search
                </span>
              ) : null}
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                {filteredDocuments.length} shown
              </span>
              <ActionIconButton
                icon={RefreshCcw}
                label="Refresh library"
                tooltip="Reload the private document library."
                onClick={loadDocuments}
              />
            </div>
          </div>

          <div className="p-0">
            <div className="overflow-hidden bg-white">
              <div className="hidden grid-cols-[minmax(0,1.5fr)_84px_88px_132px_176px] gap-4 border-b border-slate-200 bg-[#f6f8fb] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 xl:grid">
                <span>Name</span>
                <span>Pages</span>
                <span>Size</span>
                <span>Latest export</span>
                <span className="text-right">Open</span>
              </div>

              {documentsError ? (
                <div className="p-6">
                  <EmptyState
                    title="Documents unavailable"
                    description={documentsError}
                    actionLabel="Retry"
                    onAction={loadDocuments}
                  />
                </div>
              ) : documentsLoading ? (
                <div className="space-y-0 p-0">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className="h-20 animate-pulse border-b border-slate-200 bg-[#f7f9fc] last:border-b-0"
                    />
                  ))}
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No documents found"
                    description={
                      deferredSearch
                        ? 'Try a different search term or clear the current filter.'
                        : 'Upload a PDF to create the first editable paper.'
                    }
                  />
                </div>
              ) : (
                <div>
                  {filteredDocuments.map((document) => (
                    <DocumentLibraryRow
                      key={document.id}
                      document={document}
                      active={selectedDocumentId === document.id && activeView === 'editor'}
                      onOpen={openDocument}
                      onDelete={deleteDocument}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const editorView = (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#f2f5fa] shadow-[0_24px_60px_-42px_rgba(15,23,42,0.24)]">
      <div className="border-b border-slate-200 bg-white/90 px-6 py-5 text-slate-900">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-3">
              <ActionIconButton
                icon={ArrowLeft}
                label="Library"
                tooltip="Return to the document library screen."
                onClick={returnToLibrary}
                showLabel
                alignTooltip="left"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Document Workspace
                </p>
                {selectedDocument ? (
                  <>
                    <div className="mt-2 flex flex-col gap-2 2xl:flex-row">
                      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[16px] border border-slate-200 bg-[#f8fbff] px-3 py-3">
                        <PdfFileGlyph />
                        <input
                          value={titleDraft}
                          onChange={(event) => setTitleDraft(event.target.value)}
                          onKeyDown={stopEditorKeyPropagation}
                          className="w-full bg-transparent text-lg font-semibold tracking-tight text-slate-950 outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <ActionIconButton
                        icon={Save}
                        label={titleSaving ? 'Saving...' : 'Save title'}
                        tooltip="Save the document title."
                        onClick={saveTitle}
                        disabled={titleSaving}
                        showLabel
                        className="shrink-0"
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{selectedDocument.sourceFilename}</span>
                      <span>•</span>
                      <span>{selectedDocument.pageCount} pages</span>
                      <span>•</span>
                      <span>{formatFileSize(selectedDocument.sourceFileSize)}</span>
                      <DocumentStatusBadge status={selectedDocument.status} />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      PDF editor
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Select a paper from the left rail or upload a new private PDF to enter the
                      editing workspace.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {selectedDocument ? (
            <div className="flex flex-wrap items-center gap-2">
              <ActionIconLink
                icon={Download}
                label="Source PDF"
                tooltip="Download the original uploaded PDF."
                href={`/api/admin/documents/${selectedDocument.id}/source`}
                showLabel
              />
              {selectedDocument.latestExportId ? (
                <ActionIconLink
                  icon={FileOutput}
                  label="Latest export"
                  tooltip="Download the most recent flattened export."
                  href={`/api/admin/documents/${selectedDocument.id}/exports/${selectedDocument.latestExportId}`}
                  showLabel
                />
              ) : null}
              <ActionIconButton
                icon={Trash2}
                label="Delete"
                tooltip="Delete this document, its draft, assets, and exports."
                onClick={() => deleteDocument(selectedDocument.id)}
                tone="danger"
                showLabel
              />
            </div>
          ) : null}
        </div>

        {(actionError || notice) ? (
          <div className="mt-4 space-y-2">
            {actionError ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-700">
                {actionError}
              </p>
            ) : null}
            {notice ? (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
                {notice}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid min-h-[calc(100vh-250px)] xl:grid-cols-[236px_minmax(0,1fr)_336px]">
        <aside className="border-b border-slate-200 bg-[#ebf1f7] text-slate-900 xl:border-b-0 xl:border-r">
          <div className="flex h-full flex-col">
            <div className="px-4 pb-4 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Add PDF
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload a new paper without leaving the workspace.
              </p>
              <input
                value={uploadTitle}
                onChange={(event) => setUploadTitle(event.target.value)}
                onKeyDown={stopEditorKeyPropagation}
                className="mt-4 w-full rounded-[14px] border border-slate-200 bg-white/86 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-slate-950 focus:bg-white"
                placeholder="Optional document title"
              />
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-transparent bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                <Upload className="h-4 w-4" />
                <span>{uploadLoading ? 'Uploading...' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploadLoading}
                />
              </label>
            </div>

            {selectedDocument ? (
              <div className="border-t border-slate-200/90 px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Pages
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Jump between PDF pages.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                    {selectedDocument.pageCount}
                  </span>
                </div>
                <div className="mt-4 grid max-h-[420px] grid-cols-1 gap-2 overflow-y-auto pr-1">
                  {(selectedDocument.pageSizes || []).map((_, pageIndex) => (
                    <PageThumbnailButton
                      key={`page-nav-${pageIndex}`}
                      documentId={selectedDocument.id}
                      pageIndex={pageIndex}
                      active={currentPageIndex === pageIndex}
                      onClick={() => setCurrentPageIndex(pageIndex)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="border-t border-slate-200/90 px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Papers
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Switch documents without leaving the editor.
                  </p>
                </div>
                <ActionIconButton
                  icon={RefreshCcw}
                  label="Refresh"
                  tooltip="Reload the paper list."
                  onClick={loadDocuments}
                />
              </div>

              {deferredSearch ? (
                <p className="mt-3 rounded-[14px] border border-slate-200 bg-white/84 px-3 py-2 text-xs text-slate-600">
                  Filtered by the dashboard search.
                </p>
              ) : null}

              {documentsError ? (
                <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-3 text-xs text-rose-700">
                  {documentsError}
                </p>
              ) : null}

              <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {filteredDocuments.map((document) => (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => openDocument(document.id)}
                    className={`w-full rounded-[14px] border px-3 py-3 text-left transition ${
                      selectedDocumentId === document.id
                        ? 'border-slate-900 bg-slate-950 text-white'
                        : 'border-transparent bg-white/72 text-slate-700 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <PdfFileGlyph selected={selectedDocumentId === document.id} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-2 text-sm font-semibold">{document.title}</p>
                          <DocumentStatusBadge status={document.status} />
                        </div>
                        <p
                          className={`mt-1 truncate text-[11px] ${
                            selectedDocumentId === document.id ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {document.sourceFilename}
                        </p>
                        <p
                          className={`mt-2 text-[11px] ${
                            selectedDocumentId === document.id ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {document.pageCount} pages
                        </p>
                      </div>
                    </div>
                  </button>
                ))}

                {!documentsLoading && filteredDocuments.length === 0 ? (
                  <p className="rounded-[14px] border border-slate-200 bg-white/80 px-3 py-4 text-xs text-slate-500">
                    No papers match the current search.
                  </p>
                ) : null}
              </div>
            </div>

            {uploadError ? (
              <p className="mx-4 mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-3 py-3 text-xs text-rose-700">
                {uploadError}
              </p>
            ) : null}
          </div>
        </aside>

        <section className="min-w-0 border-b border-slate-200 bg-[#f7f9fc] xl:border-b-0">
          {documentError ? (
            <div className="p-6">
              <EmptyState
                title="Document unavailable"
                description={documentError}
                actionLabel={selectedDocumentId ? 'Reload' : null}
                onAction={selectedDocumentId ? () => loadDocumentDetail(selectedDocumentId) : null}
              />
            </div>
          ) : documentLoading && !selectedDocument ? (
            <div className="p-6">
              <div className="rounded-[18px] border border-slate-200 bg-white/92 p-6">
                <p className="text-sm text-slate-600">Loading document...</p>
              </div>
            </div>
          ) : !selectedDocument ? (
            <div className="p-6">
              <EmptyState
                title="Select a document"
                description="Choose a paper from the left rail to enter the editing workspace."
              />
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="border-b border-slate-200 bg-white/88 px-6 py-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-300/80 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                      {statusLabel}
                    </span>
                    <span className="rounded-full border border-slate-300/80 bg-[#f7f9fc] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Tool: {activeToolLabel}
                    </span>
                    {draftError ? (
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                        {draftError}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-5">
                    <ToolbarSection label="Navigate">
                      <ActionIconButton
                        icon={ArrowLeft}
                        label="Previous page"
                        tooltip="Jump to the previous page."
                        onClick={() => setCurrentPageIndex((current) => Math.max(0, current - 1))}
                        disabled={currentPageIndex === 0}
                      />
                      <span className="inline-flex h-11 items-center rounded-[14px] border border-slate-300/80 bg-[#f7f9fc] px-3 text-sm font-semibold text-slate-700">
                        Page {currentPageIndex + 1} / {selectedDocument.pageCount}
                      </span>
                      <ActionIconButton
                        icon={ArrowRight}
                        label="Next page"
                        tooltip="Jump to the next page."
                        onClick={() =>
                          setCurrentPageIndex((current) =>
                            Math.min(selectedDocument.pageCount - 1, current + 1)
                          )
                        }
                        disabled={currentPageIndex >= selectedDocument.pageCount - 1}
                      />
                    </ToolbarSection>
                    <ToolbarSection label="View">
                      <ActionIconButton
                        icon={ZoomOut}
                        label="Zoom out"
                        tooltip="Reduce the PDF preview zoom."
                        onClick={() =>
                          setZoom((current) => Math.max(0.6, Number((current - 0.1).toFixed(2))))
                        }
                      />
                      <span className="inline-flex h-11 items-center rounded-[14px] border border-slate-300/80 bg-[#f7f9fc] px-3 text-sm font-semibold text-slate-700">
                        {Math.round(zoom * 100)}%
                      </span>
                      <ActionIconButton
                        icon={ZoomIn}
                        label="Zoom in"
                        tooltip="Increase the PDF preview zoom."
                        onClick={() =>
                          setZoom((current) => Math.min(2.2, Number((current + 0.1).toFixed(2))))
                        }
                      />
                    </ToolbarSection>
                    <ToolbarSection label="Output">
                      <ActionIconButton
                        icon={FileOutput}
                        label={exportLoading ? 'Exporting...' : 'Export PDF'}
                        tooltip="Flatten the current draft into a new exported PDF version."
                        onClick={exportDocument}
                        disabled={exportLoading}
                        tone="primary"
                        showLabel
                      />
                    </ToolbarSection>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                  <ToolbarSection label="Select">
                    <ToolPaletteButton
                      icon={MousePointer2}
                      label="Cursor"
                      description="Cancel field placement mode and inspect existing fields."
                      active={!activeCreateTool}
                      onClick={clearCreateTool}
                    />
                  </ToolbarSection>
                  <ToolbarSection label="Add Fields">
                    {ADMIN_DOCUMENT_FIELD_TYPES.map((fieldType) => {
                      const Icon = FIELD_ICON_MAP[fieldType];

                      return (
                        <ToolPaletteButton
                          key={fieldType}
                          icon={Icon}
                          label={FIELD_LABELS[fieldType]}
                          description={FIELD_TOOL_HELP[fieldType]}
                          active={activeCreateTool === fieldType}
                          onClick={() => toggleCreateTool(fieldType)}
                        />
                      );
                    })}
                  </ToolbarSection>
                  <span className="ml-auto text-xs text-slate-500">
                    Click a tool, then drag on the page to place it.
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="mx-auto w-full max-w-[1420px]">
                  <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <span>Live overlay canvas</span>
                    <span>Preview and export stay aligned</span>
                  </div>
                  <PdfWorkspace
                    documentId={selectedDocument.id}
                    pageSizes={selectedDocument.pageSizes || []}
                    draft={draft}
                    assetsById={assetsById}
                    selectedFieldId={selectedFieldId}
                    activeCreateTool={activeCreateTool}
                    activeCreateToolToken={activeCreateToolToken}
                    currentPageIndex={currentPageIndex}
                    zoom={zoom}
                    onCreateField={handleCreateField}
                    onSelectField={(fieldId) => {
                      setSelectedFieldId(fieldId);
                      const nextField = draft.fields.find((field) => field.id === fieldId);
                      if (nextField) {
                        setCurrentPageIndex(nextField.pageIndex);
                      }
                    }}
                    onUpdateFieldRect={updateFieldRect}
                    onUpdateFieldValue={(fieldId, nextValue) => {
                      updateDraftWith((currentDraft) => ({
                        ...currentDraft,
                        values: {
                          ...currentDraft.values,
                          [fieldId]: nextValue,
                        },
                      }));
                    }}
                    onDeleteField={deleteField}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="bg-[#f4f7fb] p-0 xl:border-l xl:border-slate-200">
          <div className="sticky top-4 space-y-4">
            <div className="border-b border-slate-200 bg-white/82 px-5 py-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Inspector
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Field settings and draft values.
                  </p>
                </div>
                <PanelRight className="h-4 w-4 text-slate-400" />
              </div>

              {!selectedDocument ? (
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>Load a document to view field settings.</p>
                </div>
              ) : !selectedField ? (
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>Select a field on the page to edit its properties.</p>
                  <p className="text-xs text-slate-500">
                    The editor stores normalized coordinates, so layout survives page scaling and
                    export.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Field Type
                    </label>
                    <select
                      value={selectedField.type}
                      onChange={(event) => changeSelectedFieldType(event.target.value)}
                      onKeyDown={stopEditorKeyPropagation}
                      className="w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                    >
                      {ADMIN_DOCUMENT_FIELD_TYPES.map((fieldType) => (
                        <option key={fieldType} value={fieldType}>
                          {FIELD_LABELS[fieldType]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Label
                    </label>
                    <input
                      value={selectedField.label || ''}
                      onChange={(event) => patchSelectedField({ label: event.target.value })}
                      onKeyDown={stopEditorKeyPropagation}
                      className="w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Name
                    </label>
                    <input
                      value={selectedField.name || ''}
                      onChange={(event) => patchSelectedField({ name: event.target.value })}
                      onKeyDown={stopEditorKeyPropagation}
                      className="w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedField.required)}
                      onKeyDown={stopEditorKeyPropagation}
                      onChange={(event) =>
                        patchSelectedField({ required: event.target.checked })
                      }
                    />
                    Required
                  </label>

                  {(TEXT_FIELD_TYPES.has(selectedField.type) ||
                    CHOICE_FIELD_TYPES.has(selectedField.type)) ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Font Size
                        </label>
                        <input
                          type="number"
                          min="8"
                          max="48"
                          value={selectedField.fontSize || 14}
                          onChange={(event) =>
                            patchSelectedField({
                              fontSize: Number(event.target.value) || 14,
                            })
                          }
                          onKeyDown={stopEditorKeyPropagation}
                          className="w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Align
                        </label>
                        <select
                          value={selectedField.align || 'left'}
                          onChange={(event) =>
                            patchSelectedField({ align: event.target.value })
                          }
                          onKeyDown={stopEditorKeyPropagation}
                          className="w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  ) : null}

                  {CHOICE_FIELD_TYPES.has(selectedField.type) ? (
                    <FieldOptionEditor
                      field={selectedField}
                      onChange={changeSelectedFieldOptions}
                    />
                  ) : null}

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Value
                    </p>

                    {selectedField.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={Boolean(draft.values[selectedField.id]?.value)}
                          onKeyDown={stopEditorKeyPropagation}
                          onChange={(event) =>
                            updateSelectedFieldValue({
                              kind: 'bool',
                              value: event.target.checked,
                            })
                          }
                        />
                        Checked
                      </label>
                    ) : null}

                    {selectedField.type === 'date' ? (
                      <input
                        type="date"
                        value={coerceDateValueToInput(draft.values[selectedField.id]?.value || '')}
                        onChange={(event) =>
                          updateSelectedFieldValue({
                            kind: 'text',
                            value: event.target.value,
                          })
                        }
                        onKeyDown={stopEditorKeyPropagation}
                        className="w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                      />
                    ) : TEXT_FIELD_TYPES.has(selectedField.type) ? (
                      selectedField.type === 'multiline' ? (
                        <textarea
                          value={draft.values[selectedField.id]?.value || ''}
                          onChange={(event) =>
                            updateSelectedFieldValue({
                              kind: 'text',
                              value: event.target.value,
                            })
                          }
                          onKeyDown={stopEditorKeyPropagation}
                          className="min-h-[120px] w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                        />
                      ) : (
                        <input
                          value={draft.values[selectedField.id]?.value || ''}
                          onChange={(event) =>
                            updateSelectedFieldValue({
                              kind: 'text',
                              value: event.target.value,
                            })
                          }
                          onKeyDown={stopEditorKeyPropagation}
                          className="w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                        />
                      )
                    ) : null}

                    {CHOICE_FIELD_TYPES.has(selectedField.type) ? (
                      <select
                        value={draft.values[selectedField.id]?.value || ''}
                        onChange={(event) =>
                          updateSelectedFieldValue({
                            kind: 'choice',
                            value: event.target.value || null,
                          })
                        }
                        onKeyDown={stopEditorKeyPropagation}
                        className="w-full rounded-[14px] border border-slate-200 bg-[#f8fbff] px-3 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
                      >
                        {(selectedField.options || []).map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>

                  {ASSET_FIELD_TYPES.has(selectedField.type) ? (
                    <AssetComposer
                      documentId={selectedDocument.id}
                      field={selectedField}
                      assets={selectedDocument.assets || []}
                      currentAssetId={draft.values[selectedField.id]?.assetId}
                      onAssetCreated={appendAsset}
                      onAssignAsset={(assetId) =>
                        updateSelectedFieldValue({
                          kind: 'asset',
                          assetId: String(assetId),
                        })
                      }
                    />
                  ) : null}
                </div>
              )}
            </div>

            <div className="px-5 py-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Export History
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Flattened PDF versions for this document.
                  </p>
                </div>
                <Clock3 className="h-4 w-4 text-slate-400" />
              </div>

              {!selectedDocument ? (
                <p className="mt-3 text-sm text-slate-500">Open a paper to review exports.</p>
              ) : (selectedDocument.exports || []).length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  No exports yet. Create one once the draft is ready.
                </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {selectedDocument.exports.map((exportItem) => (
                      <div
                        key={exportItem.id}
                        className="rounded-[14px] border border-slate-200 bg-white/86 p-3"
                      >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Version {exportItem.versionNumber}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {formatDateTime(exportItem.createdAt)}
                          </p>
                        </div>
                        <ActionIconLink
                          icon={Download}
                          label="Download export"
                          tooltip="Download this exported PDF version."
                          href={`/api/admin/documents/${selectedDocument.id}/exports/${exportItem.id}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  return activeView === 'editor' ? editorView : libraryView;
}
