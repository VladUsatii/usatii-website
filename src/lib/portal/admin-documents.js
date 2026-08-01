import 'server-only';

import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ensurePortalTables } from '@/lib/portal/schema';
import { portalSql } from '@/lib/portal/database';
import {
  ADMIN_DOCUMENT_ASSET_ROLES,
  ADMIN_DOCUMENT_FIELD_TYPES,
  ADMIN_DOCUMENT_MAX_FIELDS,
  ADMIN_DOCUMENT_MAX_ASSET_BYTES,
  ADMIN_DOCUMENT_MAX_SOURCE_BYTES,
  ADMIN_DOCUMENT_STATUS,
  AdminDocumentPublicError,
  createEmptyDocumentDraft,
  isAdminDocumentPublicError,
  normalizeDocumentDraft,
  titleFromFileName,
} from '@/lib/portal/admin-documents-shared';

const ADMIN_DOCUMENT_MAX_ASSET_PIXELS = 12_000_000;
const ADMIN_DOCUMENT_MAX_PAGE_COUNT = 100;
const ADMIN_DOCUMENT_PREVIEW_DPI = 220;
const ADMIN_DOCUMENT_PREVIEW_MIN_WIDTH_PX = 1600;
const ADMIN_DOCUMENT_PREVIEW_MAX_WIDTH_PX = 2800;
const SWIFT_PREVIEW_BINARY = process.env.SWIFT_BINARY || 'swift';
const SWIFT_PREVIEW_SCRIPT_PATH = path.join(
  process.cwd(),
  'scripts',
  'render-pdf-page-preview.swift'
);
const SWIFT_MODULE_CACHE_PATH = path.join(os.tmpdir(), 'admin-document-swift-module-cache');
const SWIFT_CLANG_MODULE_CACHE_PATH = path.join(
  os.tmpdir(),
  'admin-document-swift-clang-module-cache'
);
// Ghostscript is the most stable first-choice rasterizer for flat office-authored PDFs.
// PDFKit remains a useful macOS fallback, while Poppler tools stay behind it because
// they can drift or break glyph rendering on PDFs with missing embedded fonts.
const PDF_PREVIEW_RENDERERS = [
  {
    name: 'ghostscript',
    binary: process.env.GHOSTSCRIPT_PATH || 'gs',
    kind: 'ghostscript',
  },
  ...(process.platform === 'darwin'
    ? [
        {
          name: 'pdfkit-thumbnail',
          binary: SWIFT_PREVIEW_BINARY,
          kind: 'swift-pdfkit',
        },
      ]
    : []),
  {
    name: 'pdftoppm',
    binary: process.env.PDFTOPPM_PATH || 'pdftoppm',
    kind: 'pdftoppm',
  },
  {
    name: 'pdftocairo',
    binary: process.env.PDFTOCAIRO_PATH || 'pdftocairo',
    kind: 'pdftocairo',
  },
];
const execFileAsync = promisify(execFile);

function toPositiveInteger(value) {
  const numeric = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return numeric;
}

function toIso(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function trimValue(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

function maybeDecodeSerializedBinary(buffer) {
  const normalized = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const prefix = normalized.subarray(0, 32).toString('utf8').trimStart();

  if (!prefix.startsWith('{') && !prefix.startsWith('[')) {
    return normalized;
  }

  try {
    const parsed = JSON.parse(normalized.toString('utf8'));

    if (Array.isArray(parsed)) {
      return Buffer.from(parsed);
    }

    if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.data)) {
        return Buffer.from(parsed.data);
      }

      if (Array.isArray(parsed.bytes)) {
        return Buffer.from(parsed.bytes);
      }
    }
  } catch {
    return normalized;
  }

  return normalized;
}

function toBuffer(value) {
  if (!value) return Buffer.alloc(0);
  if (Buffer.isBuffer(value)) return maybeDecodeSerializedBinary(value);
  if (value instanceof Uint8Array) return maybeDecodeSerializedBinary(Buffer.from(value));
  if (value instanceof ArrayBuffer) return maybeDecodeSerializedBinary(Buffer.from(value));
  if (ArrayBuffer.isView(value)) {
    return maybeDecodeSerializedBinary(
      Buffer.from(value.buffer, value.byteOffset, value.byteLength)
    );
  }
  if (Array.isArray(value)) return Buffer.from(value);

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          return Buffer.from(parsed);
        }

        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.data)) {
            return Buffer.from(parsed.data);
          }

          if (Array.isArray(parsed.bytes)) {
            return Buffer.from(parsed.bytes);
          }
        }
      } catch {
        // Fall through to the other string decoders.
      }
    }

    if (/^\\x[0-9a-f]+$/i.test(trimmed)) {
      return Buffer.from(trimmed.slice(2), 'hex');
    }

    if (/^[0-9a-f]+$/i.test(trimmed) && trimmed.length % 2 === 0) {
      return Buffer.from(trimmed, 'hex');
    }

    return Buffer.from(trimmed, 'utf8');
  }

  if (typeof value === 'object') {
    if (Array.isArray(value.data)) {
      return Buffer.from(value.data);
    }

    if (Array.isArray(value.bytes)) {
      return Buffer.from(value.bytes);
    }

    if (value.buffer instanceof ArrayBuffer) {
      const byteOffset = Number(value.byteOffset || 0);
      const byteLength = Number(
        value.byteLength || value.length || value.buffer.byteLength || 0
      );
      return Buffer.from(value.buffer, byteOffset, byteLength);
    }
  }

  throw new TypeError(`Unsupported binary value type: ${typeof value}`);
}

function throwPublicError(message, options) {
  throw new AdminDocumentPublicError(message, options);
}

function toDataUrl(buffer, mimeType = 'image/png') {
  return `data:${mimeType};base64,${toBuffer(buffer).toString('base64')}`;
}

function sanitizeDocumentTitle(title, fileName) {
  const trimmed = trimValue(title, 180);
  return trimmed || titleFromFileName(fileName);
}

function hasPdfSignature(buffer) {
  return toBuffer(buffer).subarray(0, 5).toString('ascii') === '%PDF-';
}

function normalizePreviewWidth(targetWidthPx) {
  const numeric = Number.parseInt(String(targetWidthPx || ''), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return Math.max(
    ADMIN_DOCUMENT_PREVIEW_MIN_WIDTH_PX,
    Math.min(ADMIN_DOCUMENT_PREVIEW_MAX_WIDTH_PX, numeric)
  );
}

function normalizePreviewPageSize(pageSize) {
  const width = Number(pageSize?.width || 0);
  const height = Number(pageSize?.height || 0);

  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    return null;
  }

  return { width, height };
}

function calculatePreviewDpi(targetWidthPx, pageSize) {
  const normalizedWidth = normalizePreviewWidth(targetWidthPx);
  const normalizedPageSize = normalizePreviewPageSize(pageSize);

  if (normalizedWidth && normalizedPageSize?.width) {
    return Math.max(
      72,
      Math.min(400, Math.ceil((normalizedWidth * 72) / normalizedPageSize.width))
    );
  }

  return ADMIN_DOCUMENT_PREVIEW_DPI;
}

async function renderPdfPagePreview(pdfBytes, pageNumber, options = {}) {
  const tempDirectory = await mkdtemp(path.join(os.tmpdir(), 'admin-document-preview-'));
  const sourcePath = path.join(tempDirectory, 'source.pdf');
  const outputPrefix = path.join(tempDirectory, 'page');
  const pngOutputPath = `${outputPrefix}.png`;
  const targetWidthPx = normalizePreviewWidth(options.targetWidthPx);
  const targetDpi = calculatePreviewDpi(targetWidthPx, options.pageSize);
  const fallbackWidthPx = Math.max(
    ADMIN_DOCUMENT_PREVIEW_MIN_WIDTH_PX,
    Math.min(
      ADMIN_DOCUMENT_PREVIEW_MAX_WIDTH_PX,
      Math.ceil(((Number(options.pageSize?.width || 612) || 612) / 72) * targetDpi)
    )
  );
  const previewWidthPx = targetWidthPx || fallbackWidthPx;

  try {
    await writeFile(sourcePath, toBuffer(pdfBytes));
    let lastError = null;

    for (const renderer of PDF_PREVIEW_RENDERERS) {
      try {
        const renderArgs =
          renderer.kind === 'swift-pdfkit'
            ? [
                SWIFT_PREVIEW_SCRIPT_PATH,
                sourcePath,
                pngOutputPath,
                String(pageNumber),
                String(previewWidthPx),
              ]
            : renderer.kind === 'ghostscript'
            ? [
                '-q',
                '-dSAFER',
                '-dBATCH',
                '-dNOPAUSE',
                '-sDEVICE=png16m',
                '-dAlignToPixels=0',
                '-dGridFitTT=2',
                '-dTextAlphaBits=4',
                '-dGraphicsAlphaBits=4',
                '-dFirstPage=' + String(pageNumber),
                '-dLastPage=' + String(pageNumber),
                '-r' + String(targetDpi),
                '-sOutputFile=' + pngOutputPath,
                sourcePath,
              ]
            : renderer.kind === 'pdftoppm'
              ? [
                  '-f',
                  String(pageNumber),
                  '-l',
                  String(pageNumber),
                  '-singlefile',
                  '-freetype',
                  'yes',
                  '-aa',
                  'yes',
                  '-aaVector',
                  'yes',
                  '-thinlinemode',
                  'shape',
                  ...(targetWidthPx
                    ? ['-scale-to-x', String(targetWidthPx), '-scale-to-y', '-1']
                    : ['-r', String(targetDpi)]),
                  '-png',
                  sourcePath,
                  outputPrefix,
                ]
              : [
                  '-q',
                  '-f',
                  String(pageNumber),
                  '-l',
                  String(pageNumber),
                  '-singlefile',
                  '-antialias',
                  'best',
                  ...(targetWidthPx
                    ? ['-scale-to-x', String(targetWidthPx), '-scale-to-y', '-1']
                    : ['-r', String(targetDpi)]),
                  '-png',
                  sourcePath,
                  outputPrefix,
                ];

        await execFileAsync(renderer.binary, renderArgs, {
          maxBuffer: 64 * 1024 * 1024,
          env:
            renderer.kind === 'swift-pdfkit'
              ? {
                  ...process.env,
                  SWIFT_MODULECACHE_PATH: SWIFT_MODULE_CACHE_PATH,
                  CLANG_MODULE_CACHE_PATH: SWIFT_CLANG_MODULE_CACHE_PATH,
                }
              : process.env,
        });

        return {
          previewBytes: await readFile(pngOutputPath),
          mimeType: 'image/png',
          fileExtension: 'png',
        };
      } catch (error) {
        error.renderer = renderer.name;
        lastError = error;
      }
    }

    if (lastError) {
      throw lastError;
    }

  } catch (error) {
    console.error('Admin document PDF preview render failed', {
      renderer: error?.renderer || null,
      code: error?.code || null,
      message: error?.message || null,
      stderr: error?.stderr ? String(error.stderr).slice(0, 800) : null,
    });

    if (error?.code === 'ENOENT') {
      throwPublicError('PDF page preview renderer is unavailable on this server.', {
        code: 'pdf_preview_renderer_unavailable',
        status: 503,
      });
    }

    throwPublicError('Unable to render a preview for this PDF page.', {
      code: 'pdf_preview_render_failed',
      status: 500,
    });
  } finally {
    await rm(tempDirectory, { recursive: true, force: true }).catch(() => {});
  }
}

function mapDocumentSummary(row) {
  return {
    id: Number(row.id),
    title: row.title,
    sourceFilename: row.source_filename,
    sourceMimeType: row.source_mime_type,
    sourceFileSize: Number(row.source_file_size || 0),
    pageCount: Number(row.page_count || 0),
    status: row.status,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    updatedByUserId: row.updated_by_user_id ? Number(row.updated_by_user_id) : null,
    updatedByEmail: row.updated_by_email || null,
    latestExportId: row.latest_export_id ? Number(row.latest_export_id) : null,
    latestExportVersion: row.latest_export_version
      ? Number(row.latest_export_version)
      : null,
    latestExportCreatedAt: toIso(row.latest_export_created_at),
  };
}

function mapAssetRow(row, includePreview = false) {
  const buffer = includePreview ? toBuffer(row.image_bytes) : null;

  return {
    id: Number(row.id),
    documentId: Number(row.document_id),
    assetRole: row.asset_role,
    filename: row.filename,
    mimeType: row.mime_type,
    fileSize: Number(row.file_size || 0),
    widthPx: Number(row.width_px || 0),
    heightPx: Number(row.height_px || 0),
    createdAt: toIso(row.created_at),
    createdByUserId: row.created_by_user_id ? Number(row.created_by_user_id) : null,
    previewDataUrl: includePreview ? toDataUrl(buffer, row.mime_type) : null,
  };
}

function mapExportRow(row) {
  return {
    id: Number(row.id),
    documentId: Number(row.document_id),
    versionNumber: Number(row.version_number || 0),
    exportedFilename: row.exported_filename,
    createdAt: toIso(row.created_at),
    createdByUserId: row.created_by_user_id ? Number(row.created_by_user_id) : null,
    createdByEmail: row.created_by_email || null,
  };
}

function readPngDimensions(imageBytes) {
  const buffer = toBuffer(imageBytes);

  if (buffer.length < 24) {
    throw new Error('PNG asset is too small to contain dimensions.');
  }

  const pngSignature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== pngSignature) {
    throw new Error('Only PNG assets are supported.');
  }

  const chunkType = buffer.subarray(12, 16).toString('ascii');
  if (chunkType !== 'IHDR') {
    throw new Error('PNG asset is missing an IHDR chunk.');
  }

  return {
    widthPx: buffer.readUInt32BE(16),
    heightPx: buffer.readUInt32BE(20),
  };
}

function assetRoleFromFieldType(fieldType) {
  if (fieldType === 'signature') return 'signature';
  if (fieldType === 'initials') return 'initials';
  if (fieldType === 'image_stamp') return 'image_stamp';
  return null;
}

function isFieldValueFilled(field, value) {
  if (field.type === 'checkbox') {
    return value?.kind === 'bool' && value.value === true;
  }

  if (field.type === 'signature' || field.type === 'initials' || field.type === 'image_stamp') {
    return value?.kind === 'asset' && Boolean(String(value.assetId || '').trim());
  }

  if (field.type === 'radio_group' || field.type === 'select') {
    return value?.kind === 'choice' && Boolean(String(value.value || '').trim());
  }

  return value?.kind === 'text' && Boolean(String(value.value || '').trim());
}

function normalizeDraftForPageCount(draft, pageCount) {
  const normalizedDraft = normalizeDocumentDraft(draft);
  const filteredFields = normalizedDraft.fields
    .slice(0, ADMIN_DOCUMENT_MAX_FIELDS)
    .filter((field) => Number(field.pageIndex) >= 0 && Number(field.pageIndex) < pageCount);
  const filteredFieldIds = new Set(filteredFields.map((field) => field.id));
  const filteredValues = {};

  for (const [fieldId, value] of Object.entries(normalizedDraft.values || {})) {
    if (!filteredFieldIds.has(fieldId)) continue;
    filteredValues[fieldId] = value;
  }

  return {
    fields: filteredFields,
    values: filteredValues,
  };
}

function validateDraftForExport(draft) {
  const missingRequiredFields = draft.fields.filter(
    (field) => field.required && !isFieldValueFilled(field, draft.values?.[field.id])
  );

  if (missingRequiredFields.length > 0) {
    throwPublicError('Some required fields are still empty. Fill them before exporting.', {
      code: 'missing_required_fields',
      status: 400,
    });
  }
}

function normalizeTextAlign(align) {
  if (align === 'center') return 'center';
  if (align === 'right') return 'right';
  return 'left';
}

function formatDateFieldTextValue(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return '';

  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${month}/${day}/${year}`;
  }

  return normalized;
}

function measureWidth(font, text, size) {
  return font.widthOfTextAtSize(String(text || ''), size);
}

function fitTextToWidth(font, text, size, maxWidth) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  if (measureWidth(font, normalized, size) <= maxWidth) return normalized;

  let candidate = normalized;
  while (candidate.length > 1 && measureWidth(font, `${candidate}…`, size) > maxWidth) {
    candidate = candidate.slice(0, -1).trimEnd();
  }

  return candidate ? `${candidate}…` : normalized.slice(0, 1);
}

function wrapParagraph(font, text, size, maxWidth) {
  const words = String(text || '')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return [''];

  const lines = [];
  let currentLine = words[0];

  for (const word of words.slice(1)) {
    const nextLine = `${currentLine} ${word}`;
    if (measureWidth(font, nextLine, size) <= maxWidth) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  lines.push(currentLine);
  return lines;
}

function buildWrappedLines(font, text, size, maxWidth, multiline) {
  const normalizedText = String(text || '');

  if (!multiline) {
    return [fitTextToWidth(font, normalizedText, size, maxWidth)];
  }

  const paragraphs = normalizedText.split(/\r?\n/);
  const lines = [];

  for (const paragraph of paragraphs) {
    const wrapped = wrapParagraph(font, paragraph, size, maxWidth);
    lines.push(...wrapped);
  }

  return lines;
}

function drawTextValue(page, field, text, pageSize, font) {
  if (!text) return;

  const width = Number(pageSize?.width || 0);
  const height = Number(pageSize?.height || 0);
  const x = Number(field?.rect?.xPct || 0) * width;
  const yTop = Number(field?.rect?.yPct || 0) * height;
  const boxWidth = Number(field?.rect?.widthPct || 0) * width;
  const boxHeight = Number(field?.rect?.heightPct || 0) * height;
  const y = height - yTop - boxHeight;
  const paddingX = Math.max(2, Math.min(8, boxWidth * 0.05));
  const paddingY = Math.max(1, Math.min(6, boxHeight * 0.12));
  const availableWidth = Math.max(4, boxWidth - paddingX * 2);
  const availableHeight = Math.max(4, boxHeight - paddingY * 2);

  let fontSize = Math.max(8, Number(field?.fontSize || 14));
  let lines = buildWrappedLines(font, text, fontSize, availableWidth, field.type === 'multiline');
  let lineHeight = fontSize * 1.15;

  while (
    fontSize > 8 &&
    (lines.length * lineHeight > availableHeight ||
      lines.some((line) => measureWidth(font, line, fontSize) > availableWidth))
  ) {
    fontSize -= 1;
    lines = buildWrappedLines(font, text, fontSize, availableWidth, field.type === 'multiline');
    lineHeight = fontSize * 1.15;
  }

  const totalHeight = lines.length * lineHeight;
  let cursorY = y + boxHeight - paddingY - fontSize;

  if (totalHeight < availableHeight) {
    cursorY = y + boxHeight - paddingY - fontSize - (availableHeight - totalHeight) / 2;
  }

  for (const line of lines) {
    const lineWidth = measureWidth(font, line, fontSize);
    let lineX = x + paddingX;

    if (normalizeTextAlign(field.align) === 'center') {
      lineX = x + paddingX + (availableWidth - lineWidth) / 2;
    } else if (normalizeTextAlign(field.align) === 'right') {
      lineX = x + boxWidth - paddingX - lineWidth;
    }

    page.drawText(line, {
      x: lineX,
      y: cursorY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    cursorY -= lineHeight;
    if (cursorY < y) break;
  }
}

function drawCheckboxValue(page, field, pageSize) {
  const width = Number(pageSize?.width || 0);
  const height = Number(pageSize?.height || 0);
  const x = Number(field?.rect?.xPct || 0) * width;
  const yTop = Number(field?.rect?.yPct || 0) * height;
  const boxWidth = Number(field?.rect?.widthPct || 0) * width;
  const boxHeight = Number(field?.rect?.heightPct || 0) * height;
  const y = height - yTop - boxHeight;
  const stroke = Math.max(1.2, Math.min(boxWidth, boxHeight) * 0.08);

  page.drawLine({
    start: { x: x + boxWidth * 0.18, y: y + boxHeight * 0.55 },
    end: { x: x + boxWidth * 0.42, y: y + boxHeight * 0.22 },
    thickness: stroke,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: x + boxWidth * 0.42, y: y + boxHeight * 0.22 },
    end: { x: x + boxWidth * 0.82, y: y + boxHeight * 0.82 },
    thickness: stroke,
    color: rgb(0, 0, 0),
  });
}

async function drawAssetValue(page, field, pageSize, asset, embeddedAssetCache, pdfDoc) {
  if (!asset) return;

  const width = Number(pageSize?.width || 0);
  const height = Number(pageSize?.height || 0);
  const x = Number(field?.rect?.xPct || 0) * width;
  const yTop = Number(field?.rect?.yPct || 0) * height;
  const boxWidth = Number(field?.rect?.widthPct || 0) * width;
  const boxHeight = Number(field?.rect?.heightPct || 0) * height;
  const y = height - yTop - boxHeight;

  let embeddedAsset = embeddedAssetCache.get(asset.id);
  if (!embeddedAsset) {
    embeddedAsset = await pdfDoc.embedPng(asset.imageBytes);
    embeddedAssetCache.set(asset.id, embeddedAsset);
  }

  const imageWidth = Number(asset.widthPx || embeddedAsset.width || 1);
  const imageHeight = Number(asset.heightPx || embeddedAsset.height || 1);
  const imageRatio = imageWidth / imageHeight;
  const targetRatio = boxWidth / boxHeight;
  let drawWidth = boxWidth;
  let drawHeight = boxHeight;

  if (imageRatio > targetRatio) {
    drawHeight = drawWidth / imageRatio;
  } else {
    drawWidth = drawHeight * imageRatio;
  }

  page.drawImage(embeddedAsset, {
    x: x + (boxWidth - drawWidth) / 2,
    y: y + (boxHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  });
}

export async function parsePdfMetadata(sourcePdfBytes) {
  const normalizedBytes = toBuffer(sourcePdfBytes);

  try {
    const pdfDoc = await PDFDocument.load(normalizedBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    const pageSizes = pdfDoc.getPages().map((page) => {
      const size = page.getSize();
      return {
        width: Number(size.width || 0),
        height: Number(size.height || 0),
      };
    });

    if (pageSizes.length === 0) {
      throwPublicError('Uploaded file is not a usable PDF.', {
        code: 'empty_pdf',
        status: 400,
      });
    }

    if (pageSizes.length > ADMIN_DOCUMENT_MAX_PAGE_COUNT) {
      throwPublicError(`PDF exceeds the ${ADMIN_DOCUMENT_MAX_PAGE_COUNT}-page limit.`, {
        code: 'pdf_too_many_pages',
        status: 400,
      });
    }

    return {
      pageCount: pageSizes.length,
      pageSizes,
    };
  } catch (error) {
    if (isAdminDocumentPublicError(error)) throw error;

    throwPublicError('Uploaded file is not a readable PDF.', {
      code: 'invalid_pdf',
      status: 400,
    });
  }
}

export async function listAdminDocuments() {
  await ensurePortalTables();

  const result = await portalSql`
    SELECT
      d.id,
      d.title,
      d.source_filename,
      d.source_mime_type,
      d.source_file_size,
      d.page_count,
      d.status,
      d.created_at,
      d.updated_at,
      d.updated_by_user_id,
      u.email AS updated_by_email,
      latest_export.id AS latest_export_id,
      latest_export.version_number AS latest_export_version,
      latest_export.created_at AS latest_export_created_at
    FROM admin_documents d
    LEFT JOIN portal_users u ON u.id = d.updated_by_user_id
    LEFT JOIN LATERAL (
      SELECT
        e.id,
        e.version_number,
        e.created_at
      FROM admin_document_exports e
      WHERE e.document_id = d.id
      ORDER BY e.version_number DESC, e.id DESC
      LIMIT 1
    ) latest_export ON TRUE
    ORDER BY d.updated_at DESC, d.id DESC
  `;

  return result.rows.map(mapDocumentSummary);
}

export async function getAdminDocumentById(documentId) {
  const normalizedId = toPositiveInteger(documentId);
  if (!normalizedId) return null;

  await ensurePortalTables();

  const documentResult = await portalSql`
    SELECT
      d.id,
      d.title,
      d.source_filename,
      d.source_mime_type,
      d.source_file_size,
      d.page_count,
      d.page_sizes_json,
      d.draft_json,
      d.status,
      d.created_at,
      d.updated_at,
      d.created_by_user_id,
      d.updated_by_user_id,
      creator.email AS created_by_email,
      updater.email AS updated_by_email,
      latest_export.id AS latest_export_id,
      latest_export.version_number AS latest_export_version,
      latest_export.created_at AS latest_export_created_at
    FROM admin_documents d
    LEFT JOIN portal_users creator ON creator.id = d.created_by_user_id
    LEFT JOIN portal_users updater ON updater.id = d.updated_by_user_id
    LEFT JOIN LATERAL (
      SELECT
        e.id,
        e.version_number,
        e.created_at
      FROM admin_document_exports e
      WHERE e.document_id = d.id
      ORDER BY e.version_number DESC, e.id DESC
      LIMIT 1
    ) latest_export ON TRUE
    WHERE d.id = ${normalizedId}
    LIMIT 1
  `;

  if (documentResult.rowCount === 0) return null;

  const assetResult = await portalSql`
    SELECT
      a.id,
      a.document_id,
      a.asset_role,
      a.filename,
      a.mime_type,
      OCTET_LENGTH(a.image_bytes) AS file_size,
      a.width_px,
      a.height_px,
      a.created_at,
      a.created_by_user_id,
      a.image_bytes
    FROM admin_document_assets a
    WHERE a.document_id = ${normalizedId}
    ORDER BY a.created_at DESC, a.id DESC
  `;

  const exportResult = await portalSql`
    SELECT
      e.id,
      e.document_id,
      e.version_number,
      e.exported_filename,
      e.created_at,
      e.created_by_user_id,
      u.email AS created_by_email
    FROM admin_document_exports e
    LEFT JOIN portal_users u ON u.id = e.created_by_user_id
    WHERE e.document_id = ${normalizedId}
    ORDER BY e.version_number DESC, e.id DESC
  `;

  const documentRow = documentResult.rows[0];

  return {
    ...mapDocumentSummary(documentRow),
    pageSizes: Array.isArray(documentRow.page_sizes_json) ? documentRow.page_sizes_json : [],
    draft: normalizeDocumentDraft(documentRow.draft_json || createEmptyDocumentDraft()),
    createdByUserId: documentRow.created_by_user_id
      ? Number(documentRow.created_by_user_id)
      : null,
    updatedByUserId: documentRow.updated_by_user_id
      ? Number(documentRow.updated_by_user_id)
      : null,
    createdByEmail: documentRow.created_by_email || null,
    updatedByEmail: documentRow.updated_by_email || null,
    assets: assetResult.rows.map((row) => mapAssetRow(row, true)),
    exports: exportResult.rows.map(mapExportRow),
  };
}

export async function createAdminDocument({
  title,
  sourceFilename,
  sourceMimeType,
  sourcePdfBytes,
  createdByUserId,
}) {
  const fileName = trimValue(sourceFilename, 240);
  const mimeType = trimValue(sourceMimeType, 120) || 'application/pdf';
  const pdfBytes = toBuffer(sourcePdfBytes);
  const pdfBase64 = pdfBytes.toString('base64');
  const createdById = toPositiveInteger(createdByUserId);

  if (!createdById) {
    throwPublicError('A valid admin user id is required to create a document.');
  }

  if (!fileName.toLowerCase().endsWith('.pdf')) {
    throwPublicError('Uploaded file must be a PDF.', {
      code: 'invalid_pdf_extension',
      status: 400,
    });
  }

  if (mimeType && !['application/pdf', 'application/x-pdf'].includes(mimeType)) {
    throwPublicError('Uploaded file must use the PDF mime type.', {
      code: 'invalid_pdf_mime',
      status: 400,
    });
  }

  if (pdfBytes.length === 0) {
    throwPublicError('Uploaded PDF is empty.', {
      code: 'empty_pdf',
      status: 400,
    });
  }

  if (pdfBytes.length > ADMIN_DOCUMENT_MAX_SOURCE_BYTES) {
    throwPublicError('PDF exceeds the 15 MB upload limit.', {
      code: 'pdf_too_large',
      status: 400,
    });
  }

  if (!hasPdfSignature(pdfBytes)) {
    throwPublicError('Uploaded file is not a readable PDF.', {
      code: 'invalid_pdf',
      status: 400,
    });
  }

  const metadata = await parsePdfMetadata(pdfBytes);
  const initialDraft = createEmptyDocumentDraft();

  await ensurePortalTables();

  const insertResult = await portalSql`
    INSERT INTO admin_documents (
      title,
      source_filename,
      source_mime_type,
      source_file_size,
      source_pdf_bytes,
      page_count,
      page_sizes_json,
      draft_json,
      status,
      created_by_user_id,
      updated_by_user_id
    ) VALUES (
      ${sanitizeDocumentTitle(title, fileName)},
      ${fileName},
      ${mimeType},
      ${pdfBytes.length},
      decode(${pdfBase64}, 'base64'),
      ${metadata.pageCount},
      ${JSON.stringify(metadata.pageSizes)}::jsonb,
      ${JSON.stringify(initialDraft)}::jsonb,
      ${ADMIN_DOCUMENT_STATUS.DRAFT},
      ${createdById},
      ${createdById}
    )
    RETURNING id
  `;

  return getAdminDocumentById(insertResult.rows[0].id);
}

export async function updateAdminDocument({
  documentId,
  title,
  updatedByUserId,
}) {
  const normalizedId = toPositiveInteger(documentId);
  const adminUserId = toPositiveInteger(updatedByUserId);
  const nextTitle = trimValue(title, 180);

  if (!normalizedId) throwPublicError('Document id must be numeric.');
  if (!adminUserId) throwPublicError('A valid admin user id is required.');
  if (!nextTitle) throwPublicError('Document title is required.');

  await ensurePortalTables();

  const updateResult = await portalSql`
    UPDATE admin_documents
    SET
      title = ${nextTitle},
      updated_by_user_id = ${adminUserId},
      updated_at = NOW()
    WHERE id = ${normalizedId}
    RETURNING id
  `;

  if (updateResult.rowCount === 0) return null;
  return getAdminDocumentById(normalizedId);
}

export async function saveAdminDocumentDraft({
  documentId,
  draft,
  updatedByUserId,
}) {
  const normalizedId = toPositiveInteger(documentId);
  const adminUserId = toPositiveInteger(updatedByUserId);

  if (!normalizedId) throwPublicError('Document id must be numeric.');
  if (!adminUserId) throwPublicError('A valid admin user id is required.');

  await ensurePortalTables();

  const documentResult = await portalSql`
    SELECT page_count
    FROM admin_documents
    WHERE id = ${normalizedId}
    LIMIT 1
  `;

  if (documentResult.rowCount === 0) return null;

  const normalizedDraft = normalizeDraftForPageCount(
    draft,
    Number(documentResult.rows[0]?.page_count || 0)
  );

  const updateResult = await portalSql`
    UPDATE admin_documents
    SET
      draft_json = ${JSON.stringify(normalizedDraft)}::jsonb,
      status = ${ADMIN_DOCUMENT_STATUS.DRAFT},
      updated_by_user_id = ${adminUserId},
      updated_at = NOW()
    WHERE id = ${normalizedId}
    RETURNING updated_at
  `;

  if (updateResult.rowCount === 0) return null;

  return {
    draft: normalizedDraft,
    updatedAt: toIso(updateResult.rows[0].updated_at),
  };
}

export async function deleteAdminDocument(documentId) {
  const normalizedId = toPositiveInteger(documentId);
  if (!normalizedId) return false;

  await ensurePortalTables();

  const deleteResult = await portalSql`
    DELETE FROM admin_documents
    WHERE id = ${normalizedId}
    RETURNING id
  `;

  return deleteResult.rowCount > 0;
}

export async function createAdminDocumentAsset({
  documentId,
  assetRole,
  filename,
  mimeType,
  imageBytes,
  createdByUserId,
}) {
  const normalizedDocumentId = toPositiveInteger(documentId);
  const normalizedAdminUserId = toPositiveInteger(createdByUserId);
  const role = trimValue(assetRole, 40);
  const fileName = trimValue(filename, 240) || `${role || 'asset'}.png`;
  const fileMimeType = trimValue(mimeType, 80) || 'image/png';
  const buffer = toBuffer(imageBytes);
  const imageBase64 = buffer.toString('base64');

  if (!normalizedDocumentId) throwPublicError('Document id must be numeric.');
  if (!normalizedAdminUserId) throwPublicError('A valid admin user id is required.');
  if (!ADMIN_DOCUMENT_ASSET_ROLES.includes(role)) {
    throwPublicError('Asset role is not supported.');
  }
  if (fileMimeType !== 'image/png') {
    throwPublicError('Only PNG assets are supported.');
  }
  if (buffer.length === 0) {
    throwPublicError('Asset upload is empty.');
  }
  if (buffer.length > ADMIN_DOCUMENT_MAX_ASSET_BYTES) {
    throwPublicError('Asset exceeds the 5 MB upload limit.');
  }

  let dimensions;
  try {
    dimensions = readPngDimensions(buffer);
  } catch {
    throwPublicError('Only valid PNG assets are supported.', {
      code: 'invalid_png',
      status: 400,
    });
  }

  if (dimensions.widthPx * dimensions.heightPx > ADMIN_DOCUMENT_MAX_ASSET_PIXELS) {
    throwPublicError('Asset dimensions are too large.', {
      code: 'asset_too_large',
      status: 400,
    });
  }

  await ensurePortalTables();

  const documentExists = await portalSql`
    SELECT id
    FROM admin_documents
    WHERE id = ${normalizedDocumentId}
    LIMIT 1
  `;

  if (documentExists.rowCount === 0) {
    return null;
  }

  const insertResult = await portalSql`
    INSERT INTO admin_document_assets (
      document_id,
      asset_role,
      filename,
      mime_type,
      image_bytes,
      width_px,
      height_px,
      created_by_user_id
    ) VALUES (
      ${normalizedDocumentId},
      ${role},
      ${fileName},
      ${fileMimeType},
      decode(${imageBase64}, 'base64'),
      ${dimensions.widthPx},
      ${dimensions.heightPx},
      ${normalizedAdminUserId}
    )
    RETURNING
      id,
      document_id,
      asset_role,
      filename,
      mime_type,
      OCTET_LENGTH(image_bytes) AS file_size,
      width_px,
      height_px,
      created_at,
      created_by_user_id,
      image_bytes
  `;

  await portalSql`
    UPDATE admin_documents
    SET
      updated_by_user_id = ${normalizedAdminUserId},
      updated_at = NOW()
    WHERE id = ${normalizedDocumentId}
  `;

  return mapAssetRow(insertResult.rows[0], true);
}

export async function getAdminDocumentSource(documentId) {
  const normalizedId = toPositiveInteger(documentId);
  if (!normalizedId) return null;

  await ensurePortalTables();

  const result = await portalSql`
    SELECT
      id,
      title,
      source_filename,
      source_mime_type,
      source_pdf_bytes
    FROM admin_documents
    WHERE id = ${normalizedId}
    LIMIT 1
  `;

  if (result.rowCount === 0) return null;

  return {
    id: Number(result.rows[0].id),
    title: result.rows[0].title,
    sourceFilename: result.rows[0].source_filename,
    sourceMimeType: result.rows[0].source_mime_type,
    sourcePdfBytes: toBuffer(result.rows[0].source_pdf_bytes),
  };
}

export async function getAdminDocumentPagePreview(documentId, pageNumber, options = {}) {
  const normalizedDocumentId = toPositiveInteger(documentId);
  const normalizedPageNumber = toPositiveInteger(pageNumber);

  if (!normalizedDocumentId || !normalizedPageNumber) return null;

  await ensurePortalTables();

  const result = await portalSql`
    SELECT
      id,
      title,
      source_filename,
      source_pdf_bytes,
      page_count,
      page_sizes_json
    FROM admin_documents
    WHERE id = ${normalizedDocumentId}
    LIMIT 1
  `;

  if (result.rowCount === 0) return null;

  const row = result.rows[0];
  const pageCount = Number(row.page_count || 0);
  const pageSizes = Array.isArray(row.page_sizes_json) ? row.page_sizes_json : [];

  if (normalizedPageNumber > pageCount) {
    return null;
  }

  const preview = await renderPdfPagePreview(row.source_pdf_bytes, normalizedPageNumber, {
    pageSize: pageSizes[normalizedPageNumber - 1] || null,
    targetWidthPx: options.targetWidthPx,
  });
  const sourceName = trimValue(row.source_filename, 200).replace(/\.pdf$/i, '') || 'document';

  return {
    documentId: Number(row.id),
    pageNumber: normalizedPageNumber,
    fileName: `${sourceName}-page-${normalizedPageNumber}.${preview.fileExtension}`,
    mimeType: preview.mimeType,
    previewBytes: preview.previewBytes,
  };
}

export async function getAdminDocumentExport(documentId, exportId) {
  const normalizedDocumentId = toPositiveInteger(documentId);
  const normalizedExportId = toPositiveInteger(exportId);

  if (!normalizedDocumentId || !normalizedExportId) return null;

  await ensurePortalTables();

  const result = await portalSql`
    SELECT
      e.id,
      e.document_id,
      e.version_number,
      e.exported_filename,
      e.pdf_bytes
    FROM admin_document_exports e
    WHERE e.document_id = ${normalizedDocumentId}
      AND e.id = ${normalizedExportId}
    LIMIT 1
  `;

  if (result.rowCount === 0) return null;

  return {
    id: Number(result.rows[0].id),
    documentId: Number(result.rows[0].document_id),
    versionNumber: Number(result.rows[0].version_number || 0),
    exportedFilename: result.rows[0].exported_filename,
    pdfBytes: toBuffer(result.rows[0].pdf_bytes),
  };
}

export async function exportAdminDocument({
  documentId,
  createdByUserId,
}) {
  const normalizedDocumentId = toPositiveInteger(documentId);
  const normalizedAdminUserId = toPositiveInteger(createdByUserId);

  if (!normalizedDocumentId) throwPublicError('Document id must be numeric.');
  if (!normalizedAdminUserId) throwPublicError('A valid admin user id is required.');

  await ensurePortalTables();

  const documentResult = await portalSql`
    SELECT
      id,
      title,
      source_filename,
      source_pdf_bytes,
      page_count,
      page_sizes_json,
      draft_json
    FROM admin_documents
    WHERE id = ${normalizedDocumentId}
    LIMIT 1
  `;

  if (documentResult.rowCount === 0) {
    return null;
  }

  const documentRow = documentResult.rows[0];
  const normalizedDraft = normalizeDraftForPageCount(
    documentRow.draft_json || createEmptyDocumentDraft(),
    Number(documentRow.page_count || 0)
  );
  validateDraftForExport(normalizedDraft);

  const assetIds = Array.from(
    new Set(
      Object.values(normalizedDraft.values || {})
        .filter((value) => value?.kind === 'asset' && value?.assetId)
        .map((value) => String(value.assetId))
    )
  );

  const assetRows = assetIds.length
    ? (
      await portalSql`
        SELECT
          a.id,
          a.asset_role,
          a.mime_type,
          a.width_px,
          a.height_px,
          a.image_bytes
        FROM admin_document_assets a
        WHERE a.document_id = ${normalizedDocumentId}
      `
    ).rows.filter((row) => assetIds.includes(String(row.id)))
    : [];

  const assetMap = new Map(
    assetRows.map((row) => [
      String(row.id),
      {
        id: Number(row.id),
        assetRole: row.asset_role,
        mimeType: row.mime_type,
        widthPx: Number(row.width_px || 0),
        heightPx: Number(row.height_px || 0),
        imageBytes: toBuffer(row.image_bytes),
      },
    ])
  );

  const sourcePdfBytes = toBuffer(documentRow.source_pdf_bytes);
  const pageSizes = Array.isArray(documentRow.page_sizes_json)
    ? documentRow.page_sizes_json
    : [];
  const pdfDoc = await PDFDocument.load(sourcePdfBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  });
  const defaultFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const embeddedAssetCache = new Map();
  const pageList = pdfDoc.getPages();

  for (const field of normalizedDraft.fields) {
    if (!ADMIN_DOCUMENT_FIELD_TYPES.includes(field.type)) continue;

    const pageIndex = Math.max(0, Number(field.pageIndex || 0));
    const page = pageList[pageIndex];
    const pageSize = pageSizes[pageIndex] || page?.getSize?.();
    if (!page || !pageSize) continue;

    const fieldValue = normalizedDraft.values?.[field.id];

    if (field.type === 'checkbox') {
      if (fieldValue?.kind === 'bool' && fieldValue.value) {
        drawCheckboxValue(page, field, pageSize);
      }
      continue;
    }

    if (
      field.type === 'signature' ||
      field.type === 'initials' ||
      field.type === 'image_stamp'
    ) {
      const role = assetRoleFromFieldType(field.type);
      const asset =
        fieldValue?.kind === 'asset' && fieldValue.assetId
          ? assetMap.get(String(fieldValue.assetId))
          : null;

      if (asset && (!role || asset.assetRole === role)) {
        await drawAssetValue(page, field, pageSize, asset, embeddedAssetCache, pdfDoc);
      }
      continue;
    }

    let textValue = '';

    if (fieldValue?.kind === 'text') {
      textValue = fieldValue.value || '';
    } else if (fieldValue?.kind === 'choice') {
      const selectedValue = String(fieldValue.value || '');
      const matchingOption = (field.options || []).find(
        (option) => String(option.value || '') === selectedValue
      );
      textValue = matchingOption?.label || selectedValue;
    }

    if (field.type === 'date') {
      textValue = formatDateFieldTextValue(textValue);
    }

    drawTextValue(page, field, textValue, pageSize, defaultFont);
  }

  const exportBytes = Buffer.from(await pdfDoc.save());
  const exportBase64 = exportBytes.toString('base64');
  const versionResult = await portalSql`
    SELECT COALESCE(MAX(version_number), 0) AS latest_version
    FROM admin_document_exports
    WHERE document_id = ${normalizedDocumentId}
  `;
  const nextVersion = Number(versionResult.rows[0]?.latest_version || 0) + 1;
  const safeTitle = trimValue(documentRow.title, 120).replace(/[^a-z0-9_-]+/gi, '-');
  const baseTitle = safeTitle.replace(/^-+|-+$/g, '') || 'document';
  const exportedFilename = `${baseTitle}-v${nextVersion}.pdf`;

  const insertResult = await portalSql`
    INSERT INTO admin_document_exports (
      document_id,
      version_number,
      exported_filename,
      pdf_bytes,
      created_by_user_id
    ) VALUES (
      ${normalizedDocumentId},
      ${nextVersion},
      ${exportedFilename},
      decode(${exportBase64}, 'base64'),
      ${normalizedAdminUserId}
    )
    RETURNING id, document_id, version_number, exported_filename, created_at, created_by_user_id
  `;

  await portalSql`
    UPDATE admin_documents
    SET
      status = ${ADMIN_DOCUMENT_STATUS.EXPORTED},
      updated_by_user_id = ${normalizedAdminUserId},
      updated_at = NOW()
    WHERE id = ${normalizedDocumentId}
  `;

  return {
    export: mapExportRow(insertResult.rows[0]),
    document: await getAdminDocumentById(normalizedDocumentId),
  };
}
