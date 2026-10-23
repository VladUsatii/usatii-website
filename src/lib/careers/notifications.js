import { portalSql } from '@/lib/portal/database';
import { ensureCareerApplicationsTable } from './applications.js';
import { sendCareerApplicationNotification } from '@/lib/portal/resend';

// Called after a submission and on authenticated inbox refreshes. A lease and
// atomic row claim prevent parallel requests from delivering the same alert.
export async function deliverPendingCareerNotifications(priorityId = null) {
  await ensureCareerApplicationsTable();
  const result = await portalSql`
    WITH pending AS (
      SELECT application_id FROM career_application_notifications
      WHERE sent_at IS NULL AND next_attempt_at <= NOW()
        AND (locked_until IS NULL OR locked_until < NOW())
      ORDER BY (application_id = ${priorityId}::bigint) DESC NULLS LAST, application_id
      FOR UPDATE SKIP LOCKED LIMIT 5
    ), claimed AS (
      UPDATE career_application_notifications AS n
      SET locked_until = NOW() + INTERVAL '2 minutes', attempts = attempts + 1
      FROM pending WHERE n.application_id = pending.application_id
      RETURNING n.application_id
    )
    SELECT a.id, a.role_title, a.answers, a.resume_name
    FROM claimed JOIN career_applications AS a ON a.id = claimed.application_id
  `;
  await Promise.all(result.rows.map(async row => {
    try {
      await sendCareerApplicationNotification({ id: String(row.id), roleTitle: row.role_title, answers: row.answers, resumeName: row.resume_name });
      await portalSql`UPDATE career_application_notifications SET sent_at = NOW(), locked_until = NULL, last_error = NULL WHERE application_id = ${row.id}`;
    } catch (error) {
      const code = String(error?.code || 'notification_delivery_failed').slice(0, 120);
      await portalSql`UPDATE career_application_notifications SET locked_until = NULL, next_attempt_at = NOW() + INTERVAL '5 minutes', last_error = ${code} WHERE application_id = ${row.id}`;
      console.error('Career notification queued for retry:', code);
    }
  }));
}
