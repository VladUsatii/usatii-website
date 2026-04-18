import { portalSql } from '@/lib/portal/database';
import { hashPassword, normalizeEmail, validateStrongPassword } from '@/lib/portal/passwords';

let tableInitPromise;

async function maybeBootstrapOwnerAdmin() {
  const ownerEmail = normalizeEmail(process.env.PORTAL_OWNER_EMAIL);
  const ownerPassword = String(process.env.PORTAL_OWNER_PASSWORD || '');

  if (!ownerEmail || !ownerPassword) return;

  const existing = await portalSql`
    SELECT id, role
    FROM portal_users
    WHERE email = ${ownerEmail}
    LIMIT 1
  `;

  if (existing.rowCount > 0) {
    const current = existing.rows[0];

    if (current.role !== 'admin') {
      await portalSql`
        UPDATE portal_users
        SET role = 'admin', is_active = TRUE, updated_at = NOW()
        WHERE id = ${current.id}
      `;
    }

    return;
  }

  const passwordError = validateStrongPassword(ownerPassword);
  if (passwordError && process.env.NODE_ENV === 'production') {
    throw new Error(`PORTAL_OWNER_PASSWORD is invalid: ${passwordError}`);
  }

  const passwordHash = await hashPassword(ownerPassword);

  await portalSql`
    INSERT INTO portal_users (
      email,
      password_hash,
      role,
      is_active
    ) VALUES (
      ${ownerEmail},
      ${passwordHash},
      'admin',
      TRUE
    )
  `;
}

export async function ensurePortalTables() {
  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      try {
        await portalSql`
          CREATE TABLE IF NOT EXISTS portal_users (
            id BIGSERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role VARCHAR(32) NOT NULL CHECK (role IN ('admin', 'client')),
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS client_profiles (
            user_id BIGINT PRIMARY KEY REFERENCES portal_users(id) ON DELETE CASCADE,
            display_name VARCHAR(120) NOT NULL,
            company VARCHAR(160),
            drive_folder_id VARCHAR(255) UNIQUE,
            drive_folder_url TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          ALTER TABLE client_profiles
          ALTER COLUMN drive_folder_id DROP NOT NULL
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS portal_sessions (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            session_token_hash VARCHAR(64) NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            revoked_at TIMESTAMPTZ
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS video_requests (
            id BIGSERIAL PRIMARY KEY,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            request_type VARCHAR(32) NOT NULL CHECK (request_type IN ('long_form', 'short_form')),
            brief_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            status VARCHAR(32) NOT NULL DEFAULT 'pending_checkout' CHECK (status IN ('pending_checkout', 'paid', 'checkout_expired')),
            stripe_checkout_session_id VARCHAR(255) UNIQUE,
            stripe_payment_status VARCHAR(64),
            paid_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS tasks (
            id BIGSERIAL PRIMARY KEY,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            service VARCHAR(64) NOT NULL DEFAULT 'general',
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(64) NOT NULL DEFAULT 'intake',
            priority VARCHAR(32) NOT NULL DEFAULT 'normal',
            assignee VARCHAR(120),
            reviewer VARCHAR(120),
            due_date DATE,
            estimated_minutes INTEGER,
            actual_minutes INTEGER,
            blocker TEXT,
            revision_count INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS assets (
            id BIGSERIAL PRIMARY KEY,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            service VARCHAR(64) NOT NULL DEFAULT 'general',
            type VARCHAR(64) NOT NULL DEFAULT 'asset',
            title VARCHAR(255) NOT NULL,
            status VARCHAR(64) NOT NULL DEFAULT 'working',
            owner VARCHAR(120),
            version VARCHAR(32),
            performance_summary TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS invoices (
            id BIGSERIAL PRIMARY KEY,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
            status VARCHAR(32) NOT NULL DEFAULT 'sent',
            due_date DATE,
            paid_date DATE,
            notes TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS deliverable_packs (
            id BIGSERIAL PRIMARY KEY,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            source_invoice_id VARCHAR(255) NOT NULL,
            source_line_key VARCHAR(255) NOT NULL,
            source_invoice_number VARCHAR(255),
            source_line_label TEXT,
            pack_type VARCHAR(32) NOT NULL CHECK (pack_type IN ('video_pack', 'website_pack')),
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            origin VARCHAR(32) NOT NULL DEFAULT 'manual' CHECK (origin IN ('manual', 'auto_inferred')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (client_user_id, source_invoice_id, source_line_key, pack_type)
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS deliverable_items (
            id BIGSERIAL PRIMARY KEY,
            pack_id BIGINT NOT NULL REFERENCES deliverable_packs(id) ON DELETE CASCADE,
            item_index INTEGER NOT NULL CHECK (item_index > 0),
            step_status VARCHAR(32) NOT NULL DEFAULT 'not_started' CHECK (
              step_status IN ('not_started', 'queued', 'in_progress', 'quality_assurance', 'completed')
            ),
            completed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (pack_id, item_index)
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS employee_work_records (
            id BIGSERIAL PRIMARY KEY,
            employee_name VARCHAR(120) NOT NULL,
            employee_role VARCHAR(80),
            client_user_id BIGINT REFERENCES portal_users(id) ON DELETE SET NULL,
            task_id BIGINT REFERENCES tasks(id) ON DELETE SET NULL,
            asset_id BIGINT REFERENCES assets(id) ON DELETE SET NULL,
            work_type VARCHAR(80),
            review_result VARCHAR(80),
            estimated_minutes INTEGER,
            actual_minutes INTEGER,
            revision_count INTEGER NOT NULL DEFAULT 0,
            started_at TIMESTAMPTZ,
            completed_at TIMESTAMPTZ,
            notes TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS paid_campaigns (
            id BIGSERIAL PRIMARY KEY,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            platform VARCHAR(64) NOT NULL,
            objective VARCHAR(120),
            budget_cents INTEGER NOT NULL DEFAULT 0 CHECK (budget_cents >= 0),
            spent_cents INTEGER NOT NULL DEFAULT 0 CHECK (spent_cents >= 0),
            status VARCHAR(32) NOT NULL DEFAULT 'active',
            recommendation TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS webops_checks (
            id BIGSERIAL PRIMARY KEY,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            site_url TEXT NOT NULL,
            analytics_status VARCHAR(32) NOT NULL DEFAULT 'unknown',
            pixel_status VARCHAR(32) NOT NULL DEFAULT 'unknown',
            forms_status VARCHAR(32) NOT NULL DEFAULT 'unknown',
            booking_status VARCHAR(32) NOT NULL DEFAULT 'unknown',
            open_issues INTEGER NOT NULL DEFAULT 0 CHECK (open_issues >= 0),
            action TEXT,
            checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS referrals (
            id BIGSERIAL PRIMARY KEY,
            referrer_client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            referred_name VARCHAR(160) NOT NULL,
            status VARCHAR(40) NOT NULL DEFAULT 'submitted',
            project_value_cents INTEGER NOT NULL DEFAULT 0 CHECK (project_value_cents >= 0),
            discount_percent NUMERIC(5, 2),
            credit_amount_cents INTEGER NOT NULL DEFAULT 25000 CHECK (credit_amount_cents >= 0),
            credit_issued BOOLEAN NOT NULL DEFAULT FALSE,
            notes TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS education_guides (
            id BIGSERIAL PRIMARY KEY,
            title VARCHAR(180) NOT NULL,
            summary TEXT,
            content_markdown TEXT NOT NULL DEFAULT '',
            passing_percent INTEGER NOT NULL DEFAULT 70 CHECK (passing_percent BETWEEN 1 AND 100),
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_by_user_id BIGINT REFERENCES portal_users(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS education_quiz_questions (
            id BIGSERIAL PRIMARY KEY,
            guide_id BIGINT NOT NULL REFERENCES education_guides(id) ON DELETE CASCADE,
            position INTEGER NOT NULL CHECK (position > 0),
            prompt TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_option VARCHAR(1) NOT NULL CHECK (correct_option IN ('a', 'b', 'c', 'd')),
            explanation TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (guide_id, position)
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS client_education_assignments (
            id BIGSERIAL PRIMARY KEY,
            guide_id BIGINT NOT NULL REFERENCES education_guides(id) ON DELETE CASCADE,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            assigned_by_user_id BIGINT REFERENCES portal_users(id) ON DELETE SET NULL,
            assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            completed_at TIMESTAMPTZ,
            latest_score_percent INTEGER,
            latest_correct_count INTEGER,
            latest_total_count INTEGER,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (guide_id, client_user_id)
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS client_education_attempts (
            id BIGSERIAL PRIMARY KEY,
            assignment_id BIGINT NOT NULL REFERENCES client_education_assignments(id) ON DELETE CASCADE,
            client_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
            submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            score_percent INTEGER NOT NULL CHECK (score_percent BETWEEN 0 AND 100),
            correct_count INTEGER NOT NULL CHECK (correct_count >= 0),
            total_count INTEGER NOT NULL CHECK (total_count >= 0),
            answers_json JSONB NOT NULL DEFAULT '{}'::jsonb
          )
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_portal_users_role
          ON portal_users (role)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_portal_sessions_user_expires
          ON portal_sessions (user_id, expires_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_video_requests_client_created
          ON video_requests (client_user_id, created_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_tasks_client_status_due
          ON tasks (client_user_id, status, due_date)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_assets_client_updated
          ON assets (client_user_id, updated_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_invoices_client_status_due
          ON invoices (client_user_id, status, due_date)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_deliverable_packs_client_invoice
          ON deliverable_packs (client_user_id, source_invoice_id, updated_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_deliverable_items_pack_status
          ON deliverable_items (pack_id, step_status, item_index)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_employee_work_records_client_created
          ON employee_work_records (client_user_id, created_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_paid_campaigns_client_status
          ON paid_campaigns (client_user_id, status)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_webops_checks_client_checked
          ON webops_checks (client_user_id, checked_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_referrals_referrer_status
          ON referrals (referrer_client_user_id, status)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_education_guides_active_updated
          ON education_guides (is_active, updated_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_education_quiz_questions_guide_position
          ON education_quiz_questions (guide_id, position)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_client_education_assignments_client
          ON client_education_assignments (client_user_id, assigned_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_client_education_assignments_guide
          ON client_education_assignments (guide_id, assigned_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_client_education_attempts_assignment_submitted
          ON client_education_attempts (assignment_id, submitted_at DESC)
        `;

        await maybeBootstrapOwnerAdmin();
      } catch (error) {
        tableInitPromise = undefined;
        throw error;
      }
    })();
  }

  await tableInitPromise;
}
