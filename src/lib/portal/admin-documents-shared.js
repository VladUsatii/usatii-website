export const ADMIN_DOCUMENT_STATUS = {
  DRAFT: 'draft',
  EXPORTED: 'exported',
};

export const ADMIN_DOCUMENT_FIELD_TYPES = [
  'text',
  'multiline',
  'checkbox',
  'radio_group',
  'select',
  'date',
  'signature',
  'initials',
  'image_stamp',
];

export const ADMIN_DOCUMENT_ASSET_ROLES = ['signature', 'initials', 'image_stamp'];
export const ADMIN_DOCUMENT_TEXT_ALIGN = ['left', 'center', 'right'];

export const ADMIN_DOCUMENT_MAX_SOURCE_BYTES = 15 * 1024 * 1024;
export const ADMIN_DOCUMENT_MAX_ASSET_BYTES = 5 * 1024 * 1024;
export const ADMIN_DOCUMENT_MAX_FIELDS = 500;
export const ADMIN_DOCUMENT_MAX_OPTIONS_PER_FIELD = 25;

export class AdminDocumentPublicError extends Error {
  constructor(message, { code = 'admin_document_error', status = 400 } = {}) {
    super(message);
    this.name = 'AdminDocumentPublicError';
    this.code = code;
    this.status = status;
  }
}

export function isAdminDocumentPublicError(error) {
  return error instanceof AdminDocumentPublicError;
}

function toTrimmedString(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

function toPositiveNumber(value, fallback = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return fallback;
  return numeric;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeRect(rect) {
  const xPct = clamp(Number(rect?.xPct) || 0, 0, 1);
  const yPct = clamp(Number(rect?.yPct) || 0, 0, 1);
  const widthPct = clamp(Number(rect?.widthPct) || 0.2, 0.005, 1);
  const heightPct = clamp(Number(rect?.heightPct) || 0.04, 0.005, 1);

  return {
    xPct: clamp(xPct, 0, Math.max(0, 1 - widthPct)),
    yPct: clamp(yPct, 0, Math.max(0, 1 - heightPct)),
    widthPct,
    heightPct,
  };
}

function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];

  return options
    .slice(0, ADMIN_DOCUMENT_MAX_OPTIONS_PER_FIELD)
    .map((option, index) => {
      const label = toTrimmedString(option?.label, 120);
      const value = toTrimmedString(option?.value, 120) || label;
      const id = toTrimmedString(option?.id, 120) || `option_${index + 1}`;

      if (!label && !value) return null;

      return {
        id,
        label: label || value,
        value: value || label,
      };
    })
    .filter(Boolean);
}

function normalizeField(field, index) {
  const fieldType = ADMIN_DOCUMENT_FIELD_TYPES.includes(String(field?.type || ''))
    ? String(field.type)
    : 'text';

  return {
    id: toTrimmedString(field?.id, 120) || `field_${index + 1}`,
    type: fieldType,
    pageIndex: Math.max(0, Number.parseInt(String(field?.pageIndex || 0), 10) || 0),
    rect: normalizeRect(field?.rect),
    name: toTrimmedString(field?.name, 180) || `field_${index + 1}`,
    label: toTrimmedString(field?.label, 180),
    required: Boolean(field?.required),
    fontSize: clamp(toPositiveNumber(field?.fontSize, 14), 8, 48),
    align: ADMIN_DOCUMENT_TEXT_ALIGN.includes(String(field?.align || ''))
      ? String(field.align)
      : 'left',
    options: normalizeOptions(field?.options),
  };
}

function normalizeValue(value) {
  const kind = String(value?.kind || '').trim();

  if (kind === 'bool') {
    return { kind: 'bool', value: Boolean(value?.value) };
  }

  if (kind === 'choice') {
    const nextValue = toTrimmedString(value?.value, 240);
    return { kind: 'choice', value: nextValue || null };
  }

  if (kind === 'asset') {
    const assetId = toTrimmedString(value?.assetId, 120);
    return { kind: 'asset', assetId: assetId || null };
  }

  return { kind: 'text', value: String(value?.value || '').slice(0, 4000) };
}

export function titleFromFileName(fileName) {
  const base = String(fileName || '')
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();

  if (!base) return 'Untitled document';

  return base
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function createEmptyDocumentDraft() {
  return {
    fields: [],
    values: {},
  };
}

export function normalizeDocumentDraft(input) {
  const source = input && typeof input === 'object' ? input : {};
  const fields = Array.isArray(source.fields)
    ? source.fields.slice(0, ADMIN_DOCUMENT_MAX_FIELDS).map(normalizeField)
    : [];
  const values = {};
  const fieldIds = new Set(fields.map((field) => field.id));

  if (source.values && typeof source.values === 'object' && !Array.isArray(source.values)) {
    for (const [fieldId, rawValue] of Object.entries(source.values)) {
      const normalizedFieldId = toTrimmedString(fieldId, 120);
      if (!normalizedFieldId) continue;
      if (!fieldIds.has(normalizedFieldId)) continue;
      values[normalizedFieldId] = normalizeValue(rawValue);
    }
  }

  return {
    fields,
    values,
  };
}
