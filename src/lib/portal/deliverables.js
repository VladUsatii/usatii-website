import { ensurePortalTables } from '@/lib/portal/schema';
import { portalSql } from '@/lib/portal/database';
import {
  getPayPalClientInvoicesDetailed,
  getPayPalClientInvoicesSnapshot,
  PayPalApiError,
  PayPalConfigError,
} from '@/lib/portal/paypal';

export const DELIVERABLE_PACK_TYPES = {
  VIDEO: 'video_pack',
  WEBSITE: 'website_pack',
};

export const DELIVERABLE_PACK_TYPE_LABELS = {
  [DELIVERABLE_PACK_TYPES.VIDEO]: 'Video Pack',
  [DELIVERABLE_PACK_TYPES.WEBSITE]: 'Website Pack',
};

export const DELIVERABLE_STEP_STATUSES = {
  NOT_STARTED: 'not_started',
  QUEUED: 'queued',
  IN_PROGRESS: 'in_progress',
  QUALITY_ASSURANCE: 'quality_assurance',
  COMPLETED: 'completed',
};

export const DELIVERABLE_STEP_ORDER = [
  DELIVERABLE_STEP_STATUSES.NOT_STARTED,
  DELIVERABLE_STEP_STATUSES.QUEUED,
  DELIVERABLE_STEP_STATUSES.IN_PROGRESS,
  DELIVERABLE_STEP_STATUSES.QUALITY_ASSURANCE,
  DELIVERABLE_STEP_STATUSES.COMPLETED,
];

export const DELIVERABLE_STEP_LABELS = {
  [DELIVERABLE_STEP_STATUSES.NOT_STARTED]: 'Not Started',
  [DELIVERABLE_STEP_STATUSES.QUEUED]: 'Queued',
  [DELIVERABLE_STEP_STATUSES.IN_PROGRESS]: 'In Progress',
  [DELIVERABLE_STEP_STATUSES.QUALITY_ASSURANCE]: 'Quality Assurance',
  [DELIVERABLE_STEP_STATUSES.COMPLETED]: 'Completed',
};

const PACK_ORIGINS = {
  MANUAL: 'manual',
  AUTO_INFERRED: 'auto_inferred',
};

const VIDEO_KEYWORD_REGEX = /\b(video|videos|edit|edits|reel|reels|short|shorts|clip|clips)\b/i;
const WEBSITE_KEYWORD_REGEX = /\b(website|web\s*site|feature|features|page|pages|section|sections)\b/i;

const VIDEO_COUNT_REGEX = /(\d+)\s*(?:x\s*)?(?:videos?|video\s*edits?|edits?|reels?|shorts?|clips?)/gi;
const WEBSITE_COUNT_REGEX = /(\d+)\s*(?:x\s*)?(?:website\s*)?(?:features?|pages?|sections?)/gi;

function toIso(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toPositiveInt(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeInvoiceId(value) {
  return String(value || '').trim().slice(0, 255);
}

function normalizeLineKey(value, fallback = null) {
  const normalized = String(value || '').trim().slice(0, 255);
  if (normalized) return normalized;
  if (!fallback) return '';
  return String(fallback).trim().slice(0, 255);
}

function normalizeLineLabel(value) {
  return String(value || '').trim().slice(0, 4000) || null;
}

export function normalizePackType(value) {
  if (value === DELIVERABLE_PACK_TYPES.VIDEO) return DELIVERABLE_PACK_TYPES.VIDEO;
  if (value === DELIVERABLE_PACK_TYPES.WEBSITE) return DELIVERABLE_PACK_TYPES.WEBSITE;
  return null;
}

export function normalizeStepStatus(value) {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase();
  if (DELIVERABLE_STEP_ORDER.includes(normalized)) return normalized;
  return null;
}

function stepLabel(stepStatus) {
  return DELIVERABLE_STEP_LABELS[stepStatus] || DELIVERABLE_STEP_LABELS[DELIVERABLE_STEP_STATUSES.NOT_STARTED];
}

function packTypeLabel(packType) {
  return DELIVERABLE_PACK_TYPE_LABELS[packType] || 'Deliverable Pack';
}

function countRegexMatches(text, regex) {
  if (!text) return 0;
  const runRegex = new RegExp(regex.source, regex.flags);
  let total = 0;
  for (const match of String(text).matchAll(runRegex)) {
    const qty = toPositiveInt(match?.[1]);
    if (qty) total += qty;
  }
  return total;
}

function inferQuantitiesFromText(text) {
  return {
    video: countRegexMatches(text, VIDEO_COUNT_REGEX),
    website: countRegexMatches(text, WEBSITE_COUNT_REGEX),
  };
}

function inferDeliverablesFromInvoice(invoice) {
  const inferred = [];

  for (const line of invoice.lineItems || []) {
    const lineText = [
      line?.label,
      line?.description,
      line?.text,
    ]
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .join(' ')
      .trim();

    const counts = inferQuantitiesFromText(lineText);

    let videoQty = counts.video;
    let websiteQty = counts.website;

    if (!videoQty && line.quantity && VIDEO_KEYWORD_REGEX.test(lineText)) {
      videoQty = toPositiveInt(line.quantity) || 0;
    }

    if (!websiteQty && line.quantity && WEBSITE_KEYWORD_REGEX.test(lineText)) {
      websiteQty = toPositiveInt(line.quantity) || 0;
    }

    if (videoQty > 0) {
      inferred.push({
        source: 'line',
        lineKey: normalizeLineKey(line.lineKey, 'line_auto'),
        lineLabel: normalizeLineLabel(line.label),
        packType: DELIVERABLE_PACK_TYPES.VIDEO,
        quantity: videoQty,
      });
    }

    if (websiteQty > 0) {
      inferred.push({
        source: 'line',
        lineKey: normalizeLineKey(line.lineKey, 'line_auto'),
        lineLabel: normalizeLineLabel(line.label),
        packType: DELIVERABLE_PACK_TYPES.WEBSITE,
        quantity: websiteQty,
      });
    }
  }

  const invoiceCounts = inferQuantitiesFromText(invoice.searchText || '');

  if (invoiceCounts.video > 0) {
    inferred.push({
      source: 'invoice_text',
      lineKey: 'invoice_text',
      lineLabel: 'Invoice details',
      packType: DELIVERABLE_PACK_TYPES.VIDEO,
      quantity: invoiceCounts.video,
    });
  }

  if (invoiceCounts.website > 0) {
    inferred.push({
      source: 'invoice_text',
      lineKey: 'invoice_text',
      lineLabel: 'Invoice details',
      packType: DELIVERABLE_PACK_TYPES.WEBSITE,
      quantity: invoiceCounts.website,
    });
  }

  const deduped = new Map();

  for (const item of inferred) {
    const key = `${item.lineKey}::${item.packType}`;
    const existing = deduped.get(key);

    if (!existing || item.quantity > existing.quantity) {
      deduped.set(key, item);
    }
  }

  return Array.from(deduped.values());
}

function mapPackRecord(row, items = []) {
  const quantity = toPositiveInt(row.quantity) || 0;
  const completedCount = items.filter((item) => item.stepStatus === DELIVERABLE_STEP_STATUSES.COMPLETED).length;
  const progressPercent = quantity > 0
    ? Math.min(100, Math.round((completedCount / quantity) * 100))
    : 0;

  return {
    id: toNumber(row.id),
    clientUserId: toNumber(row.client_user_id),
    sourceInvoiceId: row.source_invoice_id,
    sourceInvoiceNumber: row.source_invoice_number || '',
    sourceLineKey: row.source_line_key,
    sourceLineLabel: row.source_line_label || '',
    packType: row.pack_type,
    packTypeLabel: packTypeLabel(row.pack_type),
    quantity,
    origin: row.origin,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    completedCount,
    progressPercent,
    items,
  };
}

function mapItemRecord(row) {
  const normalizedStep = normalizeStepStatus(row.step_status) || DELIVERABLE_STEP_STATUSES.NOT_STARTED;

  return {
    id: toNumber(row.id),
    packId: toNumber(row.pack_id),
    itemIndex: toNumber(row.item_index),
    stepStatus: normalizedStep,
    stepLabel: stepLabel(normalizedStep),
    completedAt: toIso(row.completed_at),
    updatedAt: toIso(row.updated_at),
  };
}

async function fetchClientDeliverablePacks(clientUserId) {
  const packsResult = await portalSql`
    SELECT
      p.id,
      p.client_user_id,
      p.source_invoice_id,
      p.source_line_key,
      p.source_invoice_number,
      p.source_line_label,
      p.pack_type,
      p.quantity,
      p.origin,
      p.created_at,
      p.updated_at
    FROM deliverable_packs p
    WHERE p.client_user_id = ${clientUserId}
    ORDER BY p.updated_at DESC, p.id DESC
  `;

  const itemsResult = await portalSql`
    SELECT
      i.id,
      i.pack_id,
      i.item_index,
      i.step_status,
      i.completed_at,
      i.updated_at
    FROM deliverable_items i
    INNER JOIN deliverable_packs p ON p.id = i.pack_id
    WHERE p.client_user_id = ${clientUserId}
    ORDER BY i.pack_id ASC, i.item_index ASC
  `;

  const itemsByPackId = new Map();

  for (const row of itemsResult.rows) {
    const item = mapItemRecord(row);
    const key = item.packId;
    const current = itemsByPackId.get(key) || [];
    current.push(item);
    itemsByPackId.set(key, current);
  }

  return packsResult.rows.map((row) => {
    const packId = toNumber(row.id);
    const items = itemsByPackId.get(packId) || [];
    return mapPackRecord(row, items);
  });
}

async function insertPackItems(packId, quantity, startIndex = 1) {
  const parsedQuantity = toPositiveInt(quantity);
  if (!parsedQuantity) return;

  const endIndex = startIndex + parsedQuantity - 1;

  await portalSql`
    INSERT INTO deliverable_items (
      pack_id,
      item_index,
      step_status
    )
    SELECT
      ${packId},
      gs,
      ${DELIVERABLE_STEP_STATUSES.NOT_STARTED}
    FROM generate_series(
      CAST(${startIndex} AS INTEGER),
      CAST(${endIndex} AS INTEGER)
    ) AS gs
  `;
}

async function insertDeliverablePack({
  clientUserId,
  sourceInvoiceId,
  sourceInvoiceNumber,
  sourceLineKey,
  sourceLineLabel,
  packType,
  quantity,
  origin,
  ignoreConflict = false,
}) {
  const normalizedInvoiceId = normalizeInvoiceId(sourceInvoiceId);
  const normalizedLineKey = normalizeLineKey(sourceLineKey);
  const normalizedLineLabel = normalizeLineLabel(sourceLineLabel);
  const normalizedType = normalizePackType(packType);
  const normalizedQuantity = toPositiveInt(quantity);

  if (!normalizedInvoiceId) {
    const error = new Error('sourceInvoiceId is required.');
    error.code = 'invalid_source_invoice';
    throw error;
  }

  if (!normalizedLineKey) {
    const error = new Error('sourceLineKey is required.');
    error.code = 'invalid_source_line';
    throw error;
  }

  if (!normalizedType) {
    const error = new Error('packType is invalid.');
    error.code = 'invalid_pack_type';
    throw error;
  }

  if (!normalizedQuantity) {
    const error = new Error('quantity must be a positive integer.');
    error.code = 'invalid_quantity';
    throw error;
  }

  const insertResult = ignoreConflict
    ? await portalSql`
        INSERT INTO deliverable_packs (
          client_user_id,
          source_invoice_id,
          source_line_key,
          source_invoice_number,
          source_line_label,
          pack_type,
          quantity,
          origin
        ) VALUES (
          ${clientUserId},
          ${normalizedInvoiceId},
          ${normalizedLineKey},
          ${String(sourceInvoiceNumber || '').trim().slice(0, 255) || null},
          ${normalizedLineLabel},
          ${normalizedType},
          ${normalizedQuantity},
          ${origin}
        )
        ON CONFLICT (client_user_id, source_invoice_id, source_line_key, pack_type)
        DO NOTHING
        RETURNING id
      `
    : await portalSql`
        INSERT INTO deliverable_packs (
          client_user_id,
          source_invoice_id,
          source_line_key,
          source_invoice_number,
          source_line_label,
          pack_type,
          quantity,
          origin
        ) VALUES (
          ${clientUserId},
          ${normalizedInvoiceId},
          ${normalizedLineKey},
          ${String(sourceInvoiceNumber || '').trim().slice(0, 255) || null},
          ${normalizedLineLabel},
          ${normalizedType},
          ${normalizedQuantity},
          ${origin}
        )
        RETURNING id
      `;

  if (insertResult.rowCount === 0) {
    return {
      created: false,
      packId: null,
    };
  }

  const packId = toNumber(insertResult.rows[0].id);
  await insertPackItems(packId, normalizedQuantity, 1);

  return {
    created: true,
    packId,
  };
}

function groupPacksByInvoice(packs) {
  const grouped = new Map();

  for (const pack of packs) {
    const key = pack.sourceInvoiceId;
    const current = grouped.get(key) || [];
    current.push(pack);
    grouped.set(key, current);
  }

  return grouped;
}

export async function syncDeliverablesForClient({
  clientUserId,
  clientEmail,
  recentDays = 120,
} = {}) {
  await ensurePortalTables();

  const warnings = [];
  let invoices = [];
  const normalizedClientEmail = String(clientEmail || '').trim().toLowerCase();

  if (!normalizedClientEmail) {
    warnings.push('Client email is missing, so invoice inference was skipped.');
    return {
      syncedAt: new Date().toISOString(),
      warnings,
      insertedCount: 0,
      inferredCount: 0,
      invoices: [],
    };
  }

  try {
    invoices = await getPayPalClientInvoicesDetailed({
      clientEmail: normalizedClientEmail,
      recentDays,
      includeCancelled: false,
    });
  } catch (error) {
    if (error instanceof PayPalConfigError) {
      warnings.push(error.message);
    } else if (error instanceof PayPalApiError) {
      warnings.push(error.message || 'PayPal invoices could not be loaded.');
    } else {
      throw error;
    }
  }

  let insertedCount = 0;
  let inferredCount = 0;

  const invoiceCandidates = [];

  for (const invoice of invoices) {
    const inferred = inferDeliverablesFromInvoice(invoice);
    inferredCount += inferred.length;

    for (const candidate of inferred) {
      const insertResult = await insertDeliverablePack({
        clientUserId,
        sourceInvoiceId: invoice.id,
        sourceInvoiceNumber: invoice.invoiceNumber,
        sourceLineKey: candidate.lineKey,
        sourceLineLabel: candidate.lineLabel,
        packType: candidate.packType,
        quantity: candidate.quantity,
        origin: PACK_ORIGINS.AUTO_INFERRED,
        ignoreConflict: true,
      });

      if (insertResult.created) insertedCount += 1;
    }

    invoiceCandidates.push({
      ...invoice,
      inferred,
    });
  }

  return {
    syncedAt: new Date().toISOString(),
    warnings,
    insertedCount,
    inferredCount,
    invoices: invoiceCandidates,
  };
}

function buildInvoiceLineOptions(invoice, invoicePacks = []) {
  const options = [];
  const seen = new Set();

  for (const line of invoice?.lineItems || []) {
    const key = normalizeLineKey(line?.lineKey, 'invoice_text');
    if (!key || seen.has(key)) continue;
    seen.add(key);

    options.push({
      lineKey: key,
      label: normalizeLineLabel(line?.label) || key,
    });
  }

  for (const inferred of invoice?.inferred || []) {
    const key = normalizeLineKey(inferred?.lineKey, 'invoice_text');
    if (!key || seen.has(key)) continue;
    seen.add(key);

    options.push({
      lineKey: key,
      label: normalizeLineLabel(inferred?.lineLabel) || key,
    });
  }

  for (const pack of invoicePacks || []) {
    const key = normalizeLineKey(pack?.sourceLineKey, 'invoice_text');
    if (!key || seen.has(key)) continue;
    seen.add(key);

    options.push({
      lineKey: key,
      label: normalizeLineLabel(pack?.sourceLineLabel) || key,
    });
  }

  if (!seen.has('invoice_text')) {
    options.push({ lineKey: 'invoice_text', label: 'Invoice details' });
  }

  return options;
}

function summarizePacks(packs) {
  return packs.reduce(
    (summary, pack) => {
      summary.packCount += 1;
      summary.totalItems += pack.quantity;
      summary.completedItems += pack.completedCount;
      return summary;
    },
    {
      packCount: 0,
      totalItems: 0,
      completedItems: 0,
    }
  );
}

function toInvoiceCard({ invoice = null, packs = [] }) {
  const summary = summarizePacks(packs);

  return {
    invoiceId: invoice?.id || invoice?.invoiceNumber || packs[0]?.sourceInvoiceId || '',
    invoiceNumber: invoice?.invoiceNumber || packs[0]?.sourceInvoiceNumber || '',
    status: invoice?.status || 'UNKNOWN',
    purchaseState: invoice?.purchaseState || 'other',
    purchaseStateLabel: invoice?.purchaseStateLabel || 'Other',
    totalCents: toNumber(invoice?.totalCents),
    currency: invoice?.currency || 'USD',
    createdAt: invoice?.createdAt || null,
    dueDate: invoice?.dueDate || null,
    lineItems: Array.isArray(invoice?.lineItems) ? invoice.lineItems : [],
    inferred: Array.isArray(invoice?.inferred) ? invoice.inferred : [],
    lineOptions: buildInvoiceLineOptions(invoice, packs),
    packs,
    packCount: summary.packCount,
    totalItems: summary.totalItems,
    completedItems: summary.completedItems,
    progressPercent: summary.totalItems > 0
      ? Math.min(100, Math.round((summary.completedItems / summary.totalItems) * 100))
      : 0,
  };
}

export async function getAdminDeliverablesBoard({ clientUserId, clientEmail }) {
  const sync = await syncDeliverablesForClient({
    clientUserId,
    clientEmail,
    recentDays: 120,
  });

  const packs = await fetchClientDeliverablePacks(clientUserId);
  const packsByInvoice = groupPacksByInvoice(packs);
  const invoiceCards = [];
  const includedInvoices = new Set();

  for (const invoice of sync.invoices) {
    const invoicePacks = packsByInvoice.get(invoice.id) || [];

    invoiceCards.push(
      toInvoiceCard({
        invoice,
        packs: invoicePacks,
      })
    );

    includedInvoices.add(invoice.id);
  }

  for (const [invoiceId, invoicePacks] of packsByInvoice.entries()) {
    if (includedInvoices.has(invoiceId)) continue;

    invoiceCards.push(
      toInvoiceCard({
        invoice: {
          id: invoiceId,
          invoiceNumber: invoicePacks[0]?.sourceInvoiceNumber || invoiceId,
          status: 'UNKNOWN',
          purchaseState: 'other',
          purchaseStateLabel: 'Other',
          lineItems: [],
          inferred: [],
          totalCents: 0,
          currency: 'USD',
          createdAt: invoicePacks[0]?.createdAt || null,
          dueDate: null,
        },
        packs: invoicePacks,
      })
    );
  }

  invoiceCards.sort((left, right) => {
    const leftDate = new Date(left.createdAt || left.packs?.[0]?.updatedAt || 0).getTime();
    const rightDate = new Date(right.createdAt || right.packs?.[0]?.updatedAt || 0).getTime();
    return rightDate - leftDate;
  });

  const summary = invoiceCards.reduce(
    (acc, invoice) => {
      acc.invoiceCount += 1;
      acc.packCount += invoice.packCount;
      acc.totalItems += invoice.totalItems;
      acc.completedItems += invoice.completedItems;
      return acc;
    },
    {
      invoiceCount: 0,
      packCount: 0,
      totalItems: 0,
      completedItems: 0,
    }
  );

  return {
    syncedAt: sync.syncedAt,
    warnings: sync.warnings,
    insertedCount: sync.insertedCount,
    inferredCount: sync.inferredCount,
    summary,
    invoices: invoiceCards,
  };
}

async function getPackOwnership(clientUserId, packId) {
  const result = await portalSql`
    SELECT
      p.id,
      p.client_user_id,
      p.source_invoice_id,
      p.source_line_key,
      p.source_invoice_number,
      p.source_line_label,
      p.pack_type,
      p.quantity,
      p.origin,
      p.created_at,
      p.updated_at
    FROM deliverable_packs p
    WHERE p.client_user_id = ${clientUserId}
      AND p.id = ${packId}
    LIMIT 1
  `;

  if (result.rowCount === 0) return null;
  return result.rows[0];
}

export async function createManualDeliverablePack({
  clientUserId,
  sourceInvoiceId,
  sourceInvoiceNumber,
  sourceLineKey,
  sourceLineLabel,
  packType,
  quantity,
}) {
  await ensurePortalTables();

  const normalizedSourceInvoiceId =
    normalizeInvoiceId(sourceInvoiceId) || normalizeInvoiceId(sourceInvoiceNumber);

  const normalizedLineKey = normalizeLineKey(
    sourceLineKey,
    `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );

  await insertDeliverablePack({
    clientUserId,
    sourceInvoiceId: normalizedSourceInvoiceId,
    sourceInvoiceNumber,
    sourceLineKey: normalizedLineKey,
    sourceLineLabel,
    packType,
    quantity,
    origin: PACK_ORIGINS.MANUAL,
    ignoreConflict: false,
  });
}

export async function updateDeliverablePack({ clientUserId, packId, packType, quantity }) {
  await ensurePortalTables();

  const existingPack = await getPackOwnership(clientUserId, packId);
  if (!existingPack) return null;

  const normalizedType = normalizePackType(packType);
  if (!normalizedType) {
    const error = new Error('Invalid pack type.');
    error.code = 'invalid_pack_type';
    throw error;
  }

  const normalizedQuantity = toPositiveInt(quantity);
  if (!normalizedQuantity) {
    const error = new Error('Quantity must be a positive integer.');
    error.code = 'invalid_quantity';
    throw error;
  }

  const currentQuantity = toPositiveInt(existingPack.quantity) || 0;

  if (normalizedQuantity < currentQuantity) {
    const removableItemsResult = await portalSql`
      SELECT id, step_status
      FROM deliverable_items
      WHERE pack_id = ${packId}
        AND item_index > ${normalizedQuantity}
      ORDER BY item_index ASC
    `;

    const hasProgress = removableItemsResult.rows.some(
      (row) => normalizeStepStatus(row.step_status) !== DELIVERABLE_STEP_STATUSES.NOT_STARTED
    );

    if (hasProgress) {
      const error = new Error(
        'Cannot reduce quantity because some removable items already have progress. Move those items back to Not Started first.'
      );
      error.code = 'quantity_reduce_blocked';
      throw error;
    }

    await portalSql`
      DELETE FROM deliverable_items
      WHERE pack_id = ${packId}
        AND item_index > ${normalizedQuantity}
    `;
  }

  if (normalizedQuantity > currentQuantity) {
    await insertPackItems(packId, normalizedQuantity - currentQuantity, currentQuantity + 1);
  }

  const updateResult = await portalSql`
    UPDATE deliverable_packs
    SET
      pack_type = ${normalizedType},
      quantity = ${normalizedQuantity},
      updated_at = NOW()
    WHERE id = ${packId}
      AND client_user_id = ${clientUserId}
  `;

  return updateResult.rowCount > 0;
}

export async function deleteDeliverablePack({ clientUserId, packId }) {
  await ensurePortalTables();

  const deleteResult = await portalSql`
    DELETE FROM deliverable_packs
    WHERE id = ${packId}
      AND client_user_id = ${clientUserId}
    RETURNING id
  `;

  return deleteResult.rowCount > 0;
}

export async function updateDeliverableItemStep({ clientUserId, itemId, stepStatus }) {
  await ensurePortalTables();

  const normalizedStep = normalizeStepStatus(stepStatus);
  if (!normalizedStep) {
    const error = new Error('Invalid step status.');
    error.code = 'invalid_step_status';
    throw error;
  }

  const result = await portalSql`
    UPDATE deliverable_items i
    SET
      step_status = ${normalizedStep},
      completed_at = CASE
        WHEN ${normalizedStep} = ${DELIVERABLE_STEP_STATUSES.COMPLETED}
          THEN COALESCE(i.completed_at, NOW())
        ELSE NULL
      END,
      updated_at = NOW()
    FROM deliverable_packs p
    WHERE i.pack_id = p.id
      AND p.client_user_id = ${clientUserId}
      AND i.id = ${itemId}
    RETURNING i.pack_id
  `;

  if (result.rowCount === 0) return false;

  const packId = toNumber(result.rows[0].pack_id);

  await portalSql`
    UPDATE deliverable_packs
    SET updated_at = NOW()
    WHERE id = ${packId}
      AND client_user_id = ${clientUserId}
  `;

  return true;
}

export async function fulfillInvoiceDeliverables({ clientUserId, sourceInvoiceId }) {
  await ensurePortalTables();

  const invoiceId = normalizeInvoiceId(sourceInvoiceId);
  if (!invoiceId) {
    const error = new Error('sourceInvoiceId is required.');
    error.code = 'invalid_source_invoice';
    throw error;
  }

  const updatedItems = await portalSql`
    UPDATE deliverable_items i
    SET
      step_status = ${DELIVERABLE_STEP_STATUSES.COMPLETED},
      completed_at = COALESCE(i.completed_at, NOW()),
      updated_at = NOW()
    FROM deliverable_packs p
    WHERE i.pack_id = p.id
      AND p.client_user_id = ${clientUserId}
      AND p.source_invoice_id = ${invoiceId}
      AND i.step_status != ${DELIVERABLE_STEP_STATUSES.COMPLETED}
    RETURNING i.id, i.pack_id
  `;

  await portalSql`
    UPDATE deliverable_packs
    SET updated_at = NOW()
    WHERE client_user_id = ${clientUserId}
      AND source_invoice_id = ${invoiceId}
  `;

  const touchedPackIds = new Set(
    updatedItems.rows.map((row) => toNumber(row.pack_id)).filter((value) => value > 0)
  );

  return {
    updatedItemCount: updatedItems.rowCount,
    updatedPackCount: touchedPackIds.size,
  };
}

export async function getClientDeliverablesProgress({ clientUserId, clientEmail }) {
  await ensurePortalTables();

  const packs = await fetchClientDeliverablePacks(clientUserId);

  if (packs.length === 0) {
    return {
      summary: {
        invoiceCount: 0,
        packCount: 0,
        totalItems: 0,
        completedItems: 0,
      },
      invoices: [],
    };
  }

  const invoiceSnapshot = await getPayPalClientInvoicesSnapshot({ clientEmail });
  const invoiceById = new Map((invoiceSnapshot.invoices || []).map((invoice) => [invoice.id, invoice]));
  const visibleStates = new Set(['semi_paid', 'fully_paid']);

  const visiblePacks = packs.filter((pack) => {
    const invoice = invoiceById.get(pack.sourceInvoiceId);
    return visibleStates.has(invoice?.purchaseState);
  });

  const packsByInvoice = groupPacksByInvoice(visiblePacks);
  const invoiceCards = [];

  for (const [invoiceId, invoicePacks] of packsByInvoice.entries()) {
    const invoice = invoiceById.get(invoiceId);
    if (!invoice) continue;

    invoiceCards.push(
      toInvoiceCard({
        invoice,
        packs: invoicePacks,
      })
    );
  }

  invoiceCards.sort((left, right) => {
    const leftDate = new Date(left.createdAt || 0).getTime();
    const rightDate = new Date(right.createdAt || 0).getTime();
    return rightDate - leftDate;
  });

  const summary = invoiceCards.reduce(
    (acc, invoice) => {
      acc.invoiceCount += 1;
      acc.packCount += invoice.packCount;
      acc.totalItems += invoice.totalItems;
      acc.completedItems += invoice.completedItems;
      return acc;
    },
    {
      invoiceCount: 0,
      packCount: 0,
      totalItems: 0,
      completedItems: 0,
    }
  );

  return {
    summary,
    invoices: invoiceCards,
  };
}
