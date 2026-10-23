The official Usatii.com website.

Super original code - definitely not written by AI.

## Client Portal v1 setup

Add these environment variables for portal auth, Drive, and Stripe:

```bash
POSTGRES_URL=
DATABASE_URL=
PORTAL_AUTH_SECRET=
PORTAL_OWNER_EMAIL=
PORTAL_OWNER_PASSWORD=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_LONG_FORM=
STRIPE_PRICE_ID_SHORT_FORM=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox
LEAD_NOTIFICATION_EMAIL= # optional; defaults to PORTAL_OWNER_EMAIL
RESEND_API_KEY=
RESEND_FROM_EMAIL="USATII <updates@updates.usatii.com>"
# optional override:
# PAYPAL_API_BASE_URL=https://api-m.paypal.com
```

Notes:

- `POSTGRES_URL` (recommended) or `DATABASE_URL` is required for all portal/admin APIs.
- `PORTAL_OWNER_EMAIL` + `PORTAL_OWNER_PASSWORD` are optional but recommended for first-time admin bootstrap.
- Existing Google service account vars are reused for Drive (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`).
- Existing `BASE_URL` is used for Stripe success/cancel redirect URLs.
- PayPal revenue sync uses `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` (with `PAYPAL_ENV=live` for production).
- If PayPal returns access errors, verify the app mode matches credentials (`sandbox` vs `live`) and that your app/account has invoicing + transaction reporting access.
- New quote requests and newly created live chats email the notification recipient above. Resumed chats do not send duplicate alerts. Notification failures are logged without discarding the saved correspondence.
- Password reset emails use `RESEND_API_KEY`; `RESEND_FROM_EMAIL` must use a sender or domain verified in the Resend account.

New routes:

- Client login: `/portal/login`
- Client dashboard: `/portal/dashboard`
- Owner admin login: `/admin/login`
- Owner admin portal: `/admin`
- Admin overview API: `/api/admin/overview`
- Admin clients APIs: `/api/admin/clients`, `/api/admin/clients/:id`
- Admin PayPal revenue API: `/api/admin/revenue/paypal`

## Search indexing

After a production deployment, submit the current sitemap to IndexNow with `npm run indexnow`. To submit only selected changes or removals, pass site-relative or absolute URLs, for example `npm run indexnow -- /news /events`. Run `INDEXNOW_DRY_RUN=1 npm run indexnow` to inspect the payload without sending it.

## Career applications

Every role at `/careers/roles/[slug]` has an application form. Submissions use the existing Postgres connection and appear in the admin Applications inbox. Résumés (PDF, DOC, DOCX; maximum 3 MB) are stored in Postgres and can only be downloaded through the authenticated admin endpoint. Voluntary veteran/disability answers are kept in a separate table and excluded from the hiring inbox and application API.

Bot protection uses the MIT-licensed [ALTCHA widget](https://github.com/altcha-org/altcha) and [server library](https://github.com/altcha-org/altcha-lib), bundled with this site. No CAPTCHA account, external service, public site key, or additional hosting is required. The server derives separate challenge-signing keys from the existing `PORTAL_AUTH_SECRET` (at least 32 characters). Optionally set `ALTCHA_HMAC_SECRET` to a separate random secret of at least 32 characters. Do not expose either value with `NEXT_PUBLIC_`.

A role-bound proof-of-work challenge is created on demand at `/api/careers/challenge`, expires after ten minutes, and is verified server-side on `/api/careers`. Its nonce is consumed atomically with application insertion in Postgres to prevent concurrent replay across server instances. A honeypot, payload/file validation, per-network limit of 20 verified attempts per hour, and per-email/per-role duplicate protection supplement proof of work. This raises the cost of automated submissions; it does not guarantee that all automation is excluded. Form answers and the selected file stay in the browser after a verification or submission failure.

The first application/admin request applies additive schema updates automatically. The migration preserves prior applications, removes the former one-application-per-IP restriction, and adds file storage, structured answers, nonce replay protection, and rate-limit tables. Prior filename-only submissions remain readable and are not presented as downloadable résumés. No application data is written during the build or unit tests.

Run application security/validation tests with `node --experimental-default-type=module --test tests/careers/*.test.mjs`. Use HTTPS in production; localhost is supported for development.

Career application emails use `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (a verified sender), and the existing `PORTAL_OWNER_EMAIL`. Optionally set `CAREER_NOTIFICATION_EMAIL` to override the recipient. Each saved application creates a durable notification row in the same transaction. Delivery is attempted immediately, with a stable Resend idempotency key and one immediate transport retry. Failed alerts remain queued and become eligible for retry after five minutes, on subsequent submissions or authenticated application-inbox refreshes. Email failures never discard applications or ask candidates to resubmit. The email includes the role, candidate contact/background details, and a direct `/dashboard?tab=applications&application=ID` link that survives admin sign-in; optional self-identification responses and résumé attachments are not emailed.
