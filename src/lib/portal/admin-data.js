import { ensurePortalTables } from '@/lib/portal/schema';
import { portalSql } from '@/lib/portal/database';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toIso(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function maxDateIso(...values) {
  const candidates = values
    .map((value) => (value ? new Date(value) : null))
    .filter((value) => value && !Number.isNaN(value.getTime()));

  if (candidates.length === 0) return null;

  const latest = candidates.reduce((max, current) => (current > max ? current : max), candidates[0]);
  return latest.toISOString();
}

function includesQuery(query, ...values) {
  if (!query) return true;
  const needle = query.toLowerCase();
  return values.some((value) => String(value || '').toLowerCase().includes(needle));
}

function deriveHealthScore(client) {
  let score = 100;
  score -= Math.min(45, client.blockedWork * 12);
  score -= Math.min(35, client.lateWork * 10);
  if (client.unpaidInvoicesCount > 0) score -= 20;
  if (client.readyForReview > 4) score -= 6;
  return Math.max(25, Math.round(score));
}

function deriveNextAction(client) {
  if (client.unpaidInvoicesCount > 0) return 'Follow up on unpaid invoice.';
  if (client.blockedWork > 0) return 'Unblock approvals and missing inputs.';
  if (client.lateWork > 0) return 'Reset timeline and reassign deadlines.';
  if (client.readyForReview > 0) return 'Review queued deliverables.';
  if (client.pendingCheckoutCount > 0) return 'Follow up on open checkout request.';
  return 'No urgent action right now.';
}

function toClientLabel(client) {
  return client.displayName || client.company || client.email;
}

function mapBy(rows, key) {
  return Object.fromEntries(rows.map((row) => [String(row[key]), row]));
}

async function fetchClientBases(clientUserId) {
  if (clientUserId) {
    return portalSql`
      SELECT
        u.id AS user_id,
        u.email,
        u.created_at,
        cp.display_name,
        cp.company,
        cp.drive_folder_id,
        cp.drive_folder_url
      FROM portal_users u
      INNER JOIN client_profiles cp ON cp.user_id = u.id
      WHERE u.role = 'client'
        AND u.id = ${clientUserId}
      ORDER BY cp.display_name ASC, u.email ASC
    `;
  }

  return portalSql`
    SELECT
      u.id AS user_id,
      u.email,
      u.created_at,
      cp.display_name,
      cp.company,
      cp.drive_folder_id,
      cp.drive_folder_url
    FROM portal_users u
    INNER JOIN client_profiles cp ON cp.user_id = u.id
    WHERE u.role = 'client'
    ORDER BY cp.display_name ASC, u.email ASC
  `;
}

async function fetchTaskAgg(clientUserId) {
  if (clientUserId) {
    return portalSql`
      SELECT
        client_user_id,
        COUNT(*) FILTER (
          WHERE status IN ('intake', 'planned', 'in_progress', 'internal_review', 'client_review', 'ready', 'scheduled')
        )::int AS active_count,
        COUNT(*) FILTER (
          WHERE status = 'blocked' OR blocker IS NOT NULL
        )::int AS blocked_count,
        COUNT(*) FILTER (
          WHERE due_date IS NOT NULL
            AND due_date < CURRENT_DATE
            AND status NOT IN ('published', 'shipped', 'measured', 'archived')
        )::int AS late_count,
        COUNT(*) FILTER (
          WHERE status IN ('internal_review', 'client_review', 'ready')
        )::int AS review_count,
        MAX(updated_at) AS last_task_at
      FROM tasks
      WHERE client_user_id = ${clientUserId}
      GROUP BY client_user_id
    `;
  }

  return portalSql`
    SELECT
      client_user_id,
      COUNT(*) FILTER (
        WHERE status IN ('intake', 'planned', 'in_progress', 'internal_review', 'client_review', 'ready', 'scheduled')
      )::int AS active_count,
      COUNT(*) FILTER (
        WHERE status = 'blocked' OR blocker IS NOT NULL
      )::int AS blocked_count,
      COUNT(*) FILTER (
        WHERE due_date IS NOT NULL
          AND due_date < CURRENT_DATE
          AND status NOT IN ('published', 'shipped', 'measured', 'archived')
      )::int AS late_count,
      COUNT(*) FILTER (
        WHERE status IN ('internal_review', 'client_review', 'ready')
      )::int AS review_count,
      MAX(updated_at) AS last_task_at
    FROM tasks
    GROUP BY client_user_id
  `;
}

async function fetchInvoiceAgg(clientUserId) {
  if (clientUserId) {
    return portalSql`
      SELECT
        client_user_id,
        COUNT(*) FILTER (
          WHERE status IN ('sent', 'overdue')
        )::int AS unpaid_count,
        COALESCE(SUM(amount_cents) FILTER (
          WHERE status IN ('sent', 'overdue')
        ), 0)::bigint AS unpaid_amount_cents,
        COALESCE(SUM(amount_cents) FILTER (
          WHERE status = 'paid'
            AND date_trunc('month', COALESCE(paid_date::timestamptz, created_at)) = date_trunc('month', NOW())
        ), 0)::bigint AS paid_this_month_cents,
        MAX(COALESCE(paid_date::timestamptz, due_date::timestamptz, updated_at, created_at)) AS last_invoice_at
      FROM invoices
      WHERE client_user_id = ${clientUserId}
      GROUP BY client_user_id
    `;
  }

  return portalSql`
    SELECT
      client_user_id,
      COUNT(*) FILTER (
        WHERE status IN ('sent', 'overdue')
      )::int AS unpaid_count,
      COALESCE(SUM(amount_cents) FILTER (
        WHERE status IN ('sent', 'overdue')
      ), 0)::bigint AS unpaid_amount_cents,
      COALESCE(SUM(amount_cents) FILTER (
        WHERE status = 'paid'
          AND date_trunc('month', COALESCE(paid_date::timestamptz, created_at)) = date_trunc('month', NOW())
      ), 0)::bigint AS paid_this_month_cents,
      MAX(COALESCE(paid_date::timestamptz, due_date::timestamptz, updated_at, created_at)) AS last_invoice_at
    FROM invoices
    GROUP BY client_user_id
  `;
}

async function fetchRequestAgg(clientUserId) {
  if (clientUserId) {
    return portalSql`
      SELECT
        client_user_id,
        COUNT(*) FILTER (WHERE status = 'pending_checkout')::int AS pending_checkout_count,
        COUNT(*) FILTER (WHERE status = 'paid')::int AS paid_request_count,
        MAX(updated_at) AS last_request_at
      FROM video_requests
      WHERE client_user_id = ${clientUserId}
      GROUP BY client_user_id
    `;
  }

  return portalSql`
    SELECT
      client_user_id,
      COUNT(*) FILTER (WHERE status = 'pending_checkout')::int AS pending_checkout_count,
      COUNT(*) FILTER (WHERE status = 'paid')::int AS paid_request_count,
      MAX(updated_at) AS last_request_at
    FROM video_requests
    GROUP BY client_user_id
  `;
}

export async function listAdminClients({ clientUserId = null, query = '' } = {}) {
  await ensurePortalTables();

  const [baseResult, taskAggResult, invoiceAggResult, requestAggResult] = await Promise.all([
    fetchClientBases(clientUserId),
    fetchTaskAgg(clientUserId),
    fetchInvoiceAgg(clientUserId),
    fetchRequestAgg(clientUserId),
  ]);

  const taskAgg = mapBy(taskAggResult.rows, 'client_user_id');
  const invoiceAgg = mapBy(invoiceAggResult.rows, 'client_user_id');
  const requestAgg = mapBy(requestAggResult.rows, 'client_user_id');

  const clients = baseResult.rows
    .map((row) => {
      const key = String(row.user_id);
      const task = taskAgg[key] || {};
      const invoice = invoiceAgg[key] || {};
      const request = requestAgg[key] || {};

      const client = {
        userId: toNumber(row.user_id),
        email: row.email,
        displayName: row.display_name || '',
        company: row.company || '',
        driveFolderId: row.drive_folder_id || '',
        driveFolderUrl: row.drive_folder_url || '',
        activeWork: toNumber(task.active_count),
        blockedWork: toNumber(task.blocked_count),
        lateWork: toNumber(task.late_count),
        readyForReview: toNumber(task.review_count),
        unpaidInvoicesCount: toNumber(invoice.unpaid_count),
        unpaidAmountCents: toNumber(invoice.unpaid_amount_cents),
        paidThisMonthCents: toNumber(invoice.paid_this_month_cents),
        pendingCheckoutCount: toNumber(request.pending_checkout_count),
        paidRequestCount: toNumber(request.paid_request_count),
        createdAt: toIso(row.created_at),
        lastActivityAt: maxDateIso(
          task.last_task_at,
          invoice.last_invoice_at,
          request.last_request_at,
          row.created_at
        ),
      };

      const healthScore = deriveHealthScore(client);

      return {
        ...client,
        healthScore,
        status: healthScore >= 80 ? 'healthy' : healthScore >= 65 ? 'attention' : 'at_risk',
        nextAction: deriveNextAction(client),
      };
    })
    .filter((client) =>
      includesQuery(query, toClientLabel(client), client.email, client.company, client.nextAction)
    )
    .sort((left, right) => {
      const leftName = toClientLabel(left).toLowerCase();
      const rightName = toClientLabel(right).toLowerCase();
      if (leftName < rightName) return -1;
      if (leftName > rightName) return 1;
      return left.userId - right.userId;
    });

  return clients;
}

export async function getAdminOverview({ clientUserId = null } = {}) {
  const clients = await listAdminClients({ clientUserId });

  const totals = clients.reduce(
    (summary, client) => {
      summary.clientCount += 1;
      summary.activeWork += client.activeWork;
      summary.blockedWork += client.blockedWork;
      summary.lateWork += client.lateWork;
      summary.readyForReview += client.readyForReview;
      summary.unpaidInvoices += client.unpaidInvoicesCount;
      summary.unpaidAmountCents += client.unpaidAmountCents;
      summary.paidThisMonthCents += client.paidThisMonthCents;
      return summary;
    },
    {
      clientCount: 0,
      activeWork: 0,
      blockedWork: 0,
      lateWork: 0,
      readyForReview: 0,
      unpaidInvoices: 0,
      unpaidAmountCents: 0,
      paidThisMonthCents: 0,
    }
  );

  const ownerAttention = clients
    .map((client) => {
      let severity = 'low';
      let issue = 'No urgent issue.';
      let action = client.nextAction;

      if (client.unpaidInvoicesCount > 0) {
        severity = 'high';
        issue = `${client.unpaidInvoicesCount} unpaid invoice${client.unpaidInvoicesCount === 1 ? '' : 's'}`;
        action = 'Collect payment and confirm billing timeline.';
      } else if (client.blockedWork > 0) {
        severity = 'high';
        issue = `${client.blockedWork} blocked work item${client.blockedWork === 1 ? '' : 's'}`;
        action = 'Unblock approvals or missing assets.';
      } else if (client.lateWork > 0) {
        severity = 'medium';
        issue = `${client.lateWork} late deliverable${client.lateWork === 1 ? '' : 's'}`;
        action = 'Replan due dates and assignment ownership.';
      } else if (client.readyForReview > 0) {
        severity = 'medium';
        issue = `${client.readyForReview} item${client.readyForReview === 1 ? '' : 's'} ready for review`;
        action = 'Clear the review queue.';
      }

      return {
        clientUserId: client.userId,
        clientName: toClientLabel(client),
        issue,
        severity,
        action,
      };
    })
    .filter((row) => row.severity !== 'low')
    .sort((left, right) => {
      const severityWeight = { high: 0, medium: 1, low: 2 };
      if (severityWeight[left.severity] !== severityWeight[right.severity]) {
        return severityWeight[left.severity] - severityWeight[right.severity];
      }

      return left.clientName.localeCompare(right.clientName);
    })
    .slice(0, 12);

  const unpaidInvoicesResult = clientUserId
    ? await portalSql`
        SELECT
          i.id,
          i.client_user_id,
          i.amount_cents,
          i.status,
          i.due_date,
          cp.display_name,
          cp.company,
          u.email
        FROM invoices i
        INNER JOIN client_profiles cp ON cp.user_id = i.client_user_id
        INNER JOIN portal_users u ON u.id = i.client_user_id
        WHERE i.client_user_id = ${clientUserId}
          AND i.status IN ('sent', 'overdue')
        ORDER BY i.due_date ASC NULLS LAST, i.updated_at DESC
        LIMIT 30
      `
    : await portalSql`
        SELECT
          i.id,
          i.client_user_id,
          i.amount_cents,
          i.status,
          i.due_date,
          cp.display_name,
          cp.company,
          u.email
        FROM invoices i
        INNER JOIN client_profiles cp ON cp.user_id = i.client_user_id
        INNER JOIN portal_users u ON u.id = i.client_user_id
        WHERE i.status IN ('sent', 'overdue')
        ORDER BY i.due_date ASC NULLS LAST, i.updated_at DESC
        LIMIT 30
      `;

  const activityTasksResult = clientUserId
    ? await portalSql`
        SELECT id, client_user_id, title, status, updated_at
        FROM tasks
        WHERE client_user_id = ${clientUserId}
        ORDER BY updated_at DESC
        LIMIT 10
      `
    : await portalSql`
        SELECT id, client_user_id, title, status, updated_at
        FROM tasks
        ORDER BY updated_at DESC
        LIMIT 10
      `;

  const activityRequestsResult = clientUserId
    ? await portalSql`
        SELECT id, client_user_id, request_type, status, updated_at
        FROM video_requests
        WHERE client_user_id = ${clientUserId}
        ORDER BY updated_at DESC
        LIMIT 10
      `
    : await portalSql`
        SELECT id, client_user_id, request_type, status, updated_at
        FROM video_requests
        ORDER BY updated_at DESC
        LIMIT 10
      `;

  const clientNameById = Object.fromEntries(clients.map((client) => [String(client.userId), toClientLabel(client)]));

  const recentActivity = [
    ...activityTasksResult.rows.map((row) => ({
      id: `task-${row.id}`,
      type: 'task',
      clientUserId: toNumber(row.client_user_id),
      clientName: clientNameById[String(row.client_user_id)] || `Client ${row.client_user_id}`,
      summary: `${row.title} (${row.status})`,
      happenedAt: toIso(row.updated_at),
    })),
    ...activityRequestsResult.rows.map((row) => ({
      id: `request-${row.id}`,
      type: 'request',
      clientUserId: toNumber(row.client_user_id),
      clientName: clientNameById[String(row.client_user_id)] || `Client ${row.client_user_id}`,
      summary: `${row.request_type === 'long_form' ? 'Long-form' : 'Short-form'} request is ${row.status}`,
      happenedAt: toIso(row.updated_at),
    })),
  ]
    .filter((row) => row.happenedAt)
    .sort((left, right) => new Date(right.happenedAt).getTime() - new Date(left.happenedAt).getTime())
    .slice(0, 12);

  const unpaidInvoices = unpaidInvoicesResult.rows.map((row) => ({
    id: toNumber(row.id),
    clientUserId: toNumber(row.client_user_id),
    clientName: row.display_name || row.company || row.email,
    status: row.status,
    amountCents: toNumber(row.amount_cents),
    dueDate: row.due_date ? String(row.due_date) : null,
  }));

  return {
    totals,
    ownerAttention,
    unpaidInvoices,
    recentActivity,
  };
}

export async function getAdminClientById(clientUserId) {
  const clients = await listAdminClients({ clientUserId });
  if (clients.length === 0) return null;

  const client = clients[0];

  const [tasksResult, invoicesResult, requestsResult] = await Promise.all([
    portalSql`
      SELECT
        id,
        title,
        service,
        status,
        priority,
        due_date,
        blocker,
        revision_count,
        updated_at
      FROM tasks
      WHERE client_user_id = ${clientUserId}
      ORDER BY updated_at DESC
      LIMIT 15
    `,
    portalSql`
      SELECT
        id,
        amount_cents,
        status,
        due_date,
        paid_date,
        updated_at
      FROM invoices
      WHERE client_user_id = ${clientUserId}
      ORDER BY updated_at DESC
      LIMIT 15
    `,
    portalSql`
      SELECT
        id,
        request_type,
        status,
        stripe_payment_status,
        paid_at,
        updated_at
      FROM video_requests
      WHERE client_user_id = ${clientUserId}
      ORDER BY updated_at DESC
      LIMIT 15
    `,
  ]);

  return {
    client,
    tasks: tasksResult.rows.map((row) => ({
      id: toNumber(row.id),
      title: row.title,
      service: row.service,
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date ? String(row.due_date) : null,
      blocker: row.blocker || '',
      revisionCount: toNumber(row.revision_count),
      updatedAt: toIso(row.updated_at),
    })),
    invoices: invoicesResult.rows.map((row) => ({
      id: toNumber(row.id),
      amountCents: toNumber(row.amount_cents),
      status: row.status,
      dueDate: row.due_date ? String(row.due_date) : null,
      paidDate: row.paid_date ? String(row.paid_date) : null,
      updatedAt: toIso(row.updated_at),
    })),
    requests: requestsResult.rows.map((row) => ({
      id: toNumber(row.id),
      requestType: row.request_type,
      status: row.status,
      paymentStatus: row.stripe_payment_status || null,
      paidAt: toIso(row.paid_at),
      updatedAt: toIso(row.updated_at),
    })),
  };
}
