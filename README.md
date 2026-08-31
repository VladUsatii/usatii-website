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
RESEND_API_KEY=
RESEND_FROM_EMAIL="USATII MEDIA <updates@updates.usatii.com>"
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
