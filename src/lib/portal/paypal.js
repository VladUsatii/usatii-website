const LIVE_BASE_URL = 'https://api-m.paypal.com';
const SANDBOX_BASE_URL = 'https://api-m.sandbox.paypal.com';
const MAX_REPORTING_WINDOW_DAYS = 31;
const MAX_PAGINATION_PAGES = 20;
const DEFAULT_PAGE_SIZE = 100;

let cachedToken = null;

export class PayPalConfigError extends Error {
  constructor(message = 'PayPal is not configured.') {
    super(message);
    this.name = 'PayPalConfigError';
    this.code = 'paypal_not_configured';
  }
}

export class PayPalApiError extends Error {
  constructor(message, status = 500, payload = null) {
    super(message);
    this.name = 'PayPalApiError';
    this.status = status;
    this.payload = payload;
    this.code = 'paypal_api_error';
  }
}

function isPayPalAccessError(error) {
  if (!(error instanceof PayPalApiError)) return false;
  return [401, 403].includes(Number(error.status || 0));
}

function centsFromValue(value) {
  const parsed = Number.parseFloat(String(value || '0'));
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed * 100);
}

function toIsoUtc(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function parseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function toDayStartUtc(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

function toDayEndUtc(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function getPayPalBaseUrl() {
  const explicitBase = String(process.env.PAYPAL_API_BASE_URL || '').trim();
  if (explicitBase) return explicitBase.replace(/\/+$/, '');

  const mode = String(process.env.PAYPAL_ENV || process.env.PAYPAL_MODE || '').trim().toLowerCase();
  return mode === 'live' ? LIVE_BASE_URL : SANDBOX_BASE_URL;
}

function getPayPalConfig() {
  const clientId = String(process.env.PAYPAL_CLIENT_ID || '').trim();
  const clientSecret = String(process.env.PAYPAL_CLIENT_SECRET || '').trim();

  if (!clientId || !clientSecret) {
    throw new PayPalConfigError('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET.');
  }

  return {
    clientId,
    clientSecret,
    baseUrl: getPayPalBaseUrl(),
  };
}

function isCachedTokenValid(baseUrl) {
  if (!cachedToken) return false;
  if (cachedToken.baseUrl !== baseUrl) return false;
  return Date.now() + 60_000 < cachedToken.expiresAtMs;
}

async function getAccessToken(config) {
  if (isCachedTokenValid(config.baseUrl)) return cachedToken.token;

  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.access_token) {
    throw new PayPalApiError(
      payload.error_description || payload.error || `Unable to get PayPal access token (${response.status}).`,
      response.status,
      payload
    );
  }

  const expiresInSeconds = Number(payload.expires_in || 300);
  cachedToken = {
    token: payload.access_token,
    baseUrl: config.baseUrl,
    expiresAtMs: Date.now() + Math.max(120, expiresInSeconds) * 1000,
  };

  return cachedToken.token;
}

async function paypalRequest(path, { method = 'GET', query = null, body = null } = {}) {
  const config = getPayPalConfig();
  const accessToken = await getAccessToken(config);

  const params = new URLSearchParams();
  if (query && typeof query === 'object') {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue;
      params.set(key, String(value));
    }
  }

  const url = params.size > 0
    ? `${config.baseUrl}${path}?${params.toString()}`
    : `${config.baseUrl}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new PayPalApiError(
      payload?.message || payload?.name || `PayPal API request failed (${response.status}).`,
      response.status,
      payload
    );
  }

  return payload;
}

function makeDateWindows(startDate, endDate, windowDays = MAX_REPORTING_WINDOW_DAYS) {
  const windows = [];

  let cursor = new Date(startDate.getTime());
  while (cursor <= endDate) {
    const windowEnd = new Date(
      Math.min(
        endDate.getTime(),
        cursor.getTime() + (windowDays * 24 * 60 * 60 * 1000) - 1
      )
    );

    windows.push({
      start: new Date(cursor.getTime()),
      end: windowEnd,
    });

    cursor = new Date(windowEnd.getTime() + 1);
  }

  return windows;
}

async function fetchAllTransactions(startDate, endDate) {
  const windows = makeDateWindows(startDate, endDate);
  const allRows = [];

  for (const window of windows) {
    let page = 1;
    let totalPages = null;

    while (page <= MAX_PAGINATION_PAGES) {
      const payload = await paypalRequest('/v1/reporting/transactions', {
        query: {
          start_date: toIsoUtc(window.start),
          end_date: toIsoUtc(window.end),
          fields: 'all',
          page_size: DEFAULT_PAGE_SIZE,
          page,
        },
      });

      const rows = Array.isArray(payload.transaction_details)
        ? payload.transaction_details
        : [];

      allRows.push(...rows);

      if (totalPages === null) {
        const parsed = Number(payload.total_pages || payload.totalPages || 0);
        totalPages = Number.isFinite(parsed) && parsed > 0 ? parsed : null;
      }

      if (rows.length < DEFAULT_PAGE_SIZE) break;
      if (totalPages !== null && page >= totalPages) break;

      page += 1;
    }
  }

  return allRows;
}

async function fetchAllInvoices() {
  let page = 1;
  const allRows = [];

  while (page <= MAX_PAGINATION_PAGES) {
    const payload = await paypalRequest('/v2/invoicing/invoices', {
      query: {
        page,
        page_size: DEFAULT_PAGE_SIZE,
        total_required: true,
      },
    });

    const rows = Array.isArray(payload.items) ? payload.items : [];
    allRows.push(...rows);

    if (rows.length < DEFAULT_PAGE_SIZE) break;
    page += 1;
  }

  return allRows;
}

function normalizeInvoiceStatus(status, dueDate, rangeEndDate) {
  const raw = String(status || '').toUpperCase();
  if (!raw) return 'UNKNOWN';

  if (raw === 'MARKED_AS_PAID') return 'PAID';
  if (raw === 'PARTIALLY_PAID') return 'PARTIALLY PAID';
  if (raw === 'PAYMENT_PENDING') return 'PENDING';

  if (raw === 'SENT' || raw === 'UNPAID') {
    if (dueDate && dueDate < rangeEndDate) {
      return 'OVERDUE';
    }
    return 'UNPAID';
  }

  return raw.replace(/_/g, ' ');
}

function invoiceTotalCents(invoice) {
  const amountCandidates = [
    invoice?.amount?.value,
    invoice?.amount?.breakdown?.total?.value,
    invoice?.amount?.summary?.total_amount?.value,
    invoice?.detail?.amount?.value,
  ];

  for (const candidate of amountCandidates) {
    if (candidate !== undefined && candidate !== null && candidate !== '') {
      return centsFromValue(candidate);
    }
  }

  return 0;
}

function invoiceCurrency(invoice) {
  return (
    invoice?.amount?.currency_code ||
    invoice?.amount?.breakdown?.total?.currency_code ||
    invoice?.detail?.currency_code ||
    'USD'
  );
}

function invoiceRecipientEmail(invoice) {
  return (
    invoice?.primary_recipients?.[0]?.billing_info?.email_address ||
    invoice?.primary_recipients?.[0]?.email_address ||
    ''
  );
}

function toLineQuantity(value) {
  const parsed = Number.parseInt(String(value ?? '').trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeInvoiceLineItems(invoice) {
  const candidateLists = [
    invoice?.items,
    invoice?.line_items,
    invoice?.detail?.items,
  ].filter((value) => Array.isArray(value));

  const rows = candidateLists.find((list) => list.length > 0) || candidateLists[0] || [];

  return rows.map((line, index) => {
    const name = String(line?.name || line?.title || '').trim();
    const description = String(line?.description || line?.note || '').trim();
    const quantity = toLineQuantity(
      line?.quantity?.value ??
      line?.quantity ??
      line?.unit_amount?.quantity ??
      line?.unit_amount?.value
    );

    const fragments = [
      name,
      description,
      String(line?.sku || '').trim(),
      String(line?.unit_of_measure || '').trim(),
    ].filter(Boolean);

    return {
      lineKey: String(line?.id || line?.item_id || `line_${index + 1}`),
      label: name || description || `Line ${index + 1}`,
      description,
      text: fragments.join(' • '),
      quantity,
    };
  });
}

function normalizeInvoiceRow(row, rangeEndDate = toDayEndUtc(new Date())) {
  const createdAt = parseDate(
    row?.metadata?.create_time ||
    row?.create_time ||
    row?.detail?.invoice_date
  );

  const dueDate = parseDate(
    row?.detail?.payment_term?.due_date ||
    row?.detail?.due_date
  );

  const normalizedStatus = normalizeInvoiceStatus(row?.status, dueDate, rangeEndDate);
  const purchaseState = mapPurchaseState(normalizedStatus);
  const lineItems = normalizeInvoiceLineItems(row);

  const invoiceTextFragments = [
    row?.detail?.invoice_number,
    row?.detail?.reference,
    row?.detail?.note,
    row?.detail?.terms_and_conditions,
    row?.detail?.memo,
    row?.detail?.currency_code,
    row?.detail?.invoice_date,
    row?.detail?.payment_term?.term_type,
    row?.detail?.payment_term?.due_date,
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  const searchText = invoiceTextFragments.join(' ').trim();

  return {
    id: row?.id || '',
    invoiceNumber: row?.detail?.invoice_number || row?.id || '',
    recipientEmail: invoiceRecipientEmail(row),
    status: normalizedStatus,
    purchaseState,
    purchaseStateLabel: purchaseStateLabel(purchaseState),
    totalCents: invoiceTotalCents(row),
    currency: invoiceCurrency(row),
    createdAt: createdAt ? createdAt.toISOString() : null,
    dueDate: dueDate ? dueDate.toISOString() : null,
    lineItems,
    searchText,
  };
}

function transactionCurrency(row) {
  return (
    row?.transaction_info?.transaction_amount?.currency_code ||
    row?.transaction_info?.fee_amount?.currency_code ||
    row?.transaction_info?.net_amount?.currency_code ||
    'USD'
  );
}

function transactionEmail(row) {
  return (
    row?.payer_info?.email_address ||
    row?.payer_info?.payer_email ||
    ''
  );
}

function mapPurchaseState(status) {
  if (status === 'PAID') return 'fully_paid';
  if (status === 'PARTIALLY PAID') return 'semi_paid';
  if (
    status === 'UNPAID' ||
    status === 'OVERDUE' ||
    status === 'PENDING' ||
    status === 'SENT'
  ) {
    return 'active';
  }

  return 'other';
}

function purchaseStateLabel(state) {
  if (state === 'fully_paid') return 'Fully Paid';
  if (state === 'semi_paid') return 'Semi-Paid';
  if (state === 'active') return 'Active';
  return 'Other';
}

export async function getPayPalClientInvoicesDetailed({
  clientEmail = null,
  recentDays = null,
  includeCancelled = true,
} = {}) {
  const normalizedClientEmail = String(clientEmail || '').trim().toLowerCase();
  const nowUtc = toDayEndUtc(new Date());
  const invoiceRows = await fetchAllInvoices();
  const recentWindowStart = Number.isFinite(Number(recentDays)) && Number(recentDays) > 0
    ? new Date(Date.now() - Number(recentDays) * 24 * 60 * 60 * 1000)
    : null;

  return invoiceRows
    .map((row) => normalizeInvoiceRow(row, nowUtc))
    .filter((row) => {
      const createdAt = parseDate(row.createdAt);
      if (!createdAt) return false;
      if (recentWindowStart && createdAt < recentWindowStart) return false;
      if (!includeCancelled && row.status === 'CANCELLED') return false;
      if (!normalizedClientEmail) return true;
      return row.recipientEmail.toLowerCase() === normalizedClientEmail;
    })
    .sort((left, right) => {
      const leftDate = parseDate(left.createdAt)?.getTime() || 0;
      const rightDate = parseDate(right.createdAt)?.getTime() || 0;
      return rightDate - leftDate;
    });
}

export async function getPayPalClientInvoicesSnapshot({ clientEmail = null } = {}) {
  const invoices = await getPayPalClientInvoicesDetailed({ clientEmail });

  const currency = invoices[0]?.currency || 'USD';

  const summary = invoices.reduce(
    (acc, invoice) => {
      acc.totalCount += 1;
      acc.totalCents += invoice.totalCents;

      if (invoice.purchaseState === 'active') acc.activeCount += 1;
      if (invoice.purchaseState === 'semi_paid') acc.semiPaidCount += 1;
      if (invoice.purchaseState === 'fully_paid') acc.fullyPaidCount += 1;
      if (invoice.purchaseState === 'other') acc.otherCount += 1;

      return acc;
    },
    {
      totalCount: 0,
      activeCount: 0,
      semiPaidCount: 0,
      fullyPaidCount: 0,
      otherCount: 0,
      totalCents: 0,
      currency,
    }
  );

  return {
    summary,
    invoices,
  };
}

export async function getPayPalRevenueSnapshot({
  startDate,
  endDate,
  clientEmail = null,
}) {
  const parsedStart = parseDate(startDate);
  const parsedEnd = parseDate(endDate);

  if (!parsedStart || !parsedEnd || parsedStart > parsedEnd) {
    throw new PayPalApiError('Invalid date range.', 400);
  }

  let invoiceRows = [];
  let transactionRows = [];
  const warnings = [];
  let invoiceAccessBlocked = false;
  let transactionAccessBlocked = false;

  try {
    invoiceRows = await fetchAllInvoices();
  } catch (error) {
    if (isPayPalAccessError(error)) {
      invoiceAccessBlocked = true;
      invoiceRows = [];
      warnings.push('Invoice access is blocked for this PayPal app. Verify Invoicing API permissions and mode.');
    } else {
      throw error;
    }
  }

  try {
    transactionRows = await fetchAllTransactions(parsedStart, parsedEnd);
  } catch (error) {
    if (isPayPalAccessError(error)) {
      transactionAccessBlocked = true;
      transactionRows = [];
      warnings.push('Transaction reporting access is blocked for this PayPal app.');
    } else {
      throw error;
    }
  }

  if (invoiceAccessBlocked && transactionAccessBlocked) {
    throw new PayPalApiError(
      'PayPal access is blocked for invoicing and transaction reporting. Check API permissions and PAYPAL_ENV mode.',
      502
    );
  }

  const startUtc = toDayStartUtc(parsedStart);
  const endUtc = toDayEndUtc(parsedEnd);
  const normalizedClientEmail = String(clientEmail || '').trim().toLowerCase();

  const invoices = invoiceRows
    .map((row) => {
      const createdAt = parseDate(
        row?.metadata?.create_time ||
        row?.create_time ||
        row?.detail?.invoice_date
      );

      const dueDate = parseDate(
        row?.detail?.payment_term?.due_date ||
        row?.detail?.due_date
      );

      return {
        id: row?.id || '',
        invoiceNumber: row?.detail?.invoice_number || row?.id || '',
        status: normalizeInvoiceStatus(row?.status, dueDate, endUtc),
        recipientEmail: invoiceRecipientEmail(row),
        totalCents: invoiceTotalCents(row),
        currency: invoiceCurrency(row),
        createdAt: createdAt ? createdAt.toISOString() : null,
        dueDate: dueDate ? dueDate.toISOString() : null,
      };
    })
    .filter((row) => {
      const createdAt = parseDate(row.createdAt);
      if (!createdAt) return false;
      if (createdAt < startUtc || createdAt > endUtc) return false;
      if (!normalizedClientEmail) return true;
      return row.recipientEmail.toLowerCase() === normalizedClientEmail;
    })
    .sort((left, right) => {
      const leftDate = parseDate(left.createdAt)?.getTime() || 0;
      const rightDate = parseDate(right.createdAt)?.getTime() || 0;
      return rightDate - leftDate;
    });

  const transactions = transactionRows
    .map((row) => {
      const grossCents = centsFromValue(row?.transaction_info?.transaction_amount?.value);
      const feeCents = centsFromValue(
        row?.transaction_info?.fee_amount?.value ||
        row?.paypal_fee?.value
      );
      const netCandidate = row?.transaction_info?.net_amount?.value;
      const netCents = netCandidate !== undefined && netCandidate !== null
        ? centsFromValue(netCandidate)
        : grossCents - feeCents;

      return {
        id: row?.transaction_info?.transaction_id || '',
        status: String(row?.transaction_info?.transaction_status || '').toUpperCase() || 'UNKNOWN',
        grossCents,
        feeCents,
        netCents,
        currency: transactionCurrency(row),
        email: transactionEmail(row),
        occurredAt: parseDate(
          row?.transaction_info?.transaction_initiation_date ||
          row?.transaction_info?.transaction_updated_date
        )?.toISOString() || null,
      };
    })
    .filter((row) => {
      const occurredAt = parseDate(row.occurredAt);
      if (!occurredAt) return false;
      if (occurredAt < startUtc || occurredAt > endUtc) return false;
      if (!normalizedClientEmail) return true;
      return row.email.toLowerCase() === normalizedClientEmail;
    })
    .sort((left, right) => {
      const leftDate = parseDate(left.occurredAt)?.getTime() || 0;
      const rightDate = parseDate(right.occurredAt)?.getTime() || 0;
      return rightDate - leftDate;
    });

  const currency = (
    invoices[0]?.currency ||
    transactions[0]?.currency ||
    'USD'
  );

  const invoiceSummary = invoices.reduce(
    (summary, invoice) => {
      summary.totalCount += 1;
      summary.totalCents += invoice.totalCents;

      if (invoice.status === 'PAID') {
        summary.paidCount += 1;
        summary.paidCents += invoice.totalCents;
      }
      if (invoice.status === 'PARTIALLY PAID') summary.partiallyPaidCount += 1;
      if (invoice.status === 'OVERDUE') summary.overdueCount += 1;
      if (invoice.status === 'UNPAID' || invoice.status === 'PENDING') summary.unpaidCount += 1;
      if (invoice.status === 'CANCELLED') summary.cancelledCount += 1;

      return summary;
    },
    {
      totalCount: 0,
      paidCount: 0,
      partiallyPaidCount: 0,
      overdueCount: 0,
      unpaidCount: 0,
      cancelledCount: 0,
      totalCents: 0,
      paidCents: 0,
      currency,
    }
  );

  const paymentSummary = transactions.length > 0
    ? transactions.reduce(
      (summary, row) => {
        summary.totalCount += 1;
        summary.grossCents += row.grossCents;
        summary.feeCents += row.feeCents;
        summary.netCents += row.netCents;
        if (row.grossCents > 0) summary.receivedCount += 1;
        return summary;
      },
      {
        totalCount: 0,
        receivedCount: 0,
        grossCents: 0,
        feeCents: 0,
        netCents: 0,
        currency,
        source: 'transactions',
      }
    )
    : {
      totalCount: 0,
      receivedCount: invoiceSummary.paidCount,
      grossCents: invoiceSummary.paidCents,
      feeCents: 0,
      netCents: invoiceSummary.paidCents,
      currency,
      source: 'invoices',
    };

  return {
    invoiceSummary,
    paymentSummary,
    invoices,
    transactions,
    warnings,
  };
}
