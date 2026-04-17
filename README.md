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

New routes:

- Client login: `/portal/login`
- Client dashboard: `/portal/dashboard`
- Owner admin login: `/admin/login`
- Owner admin portal: `/admin`
- Admin overview API: `/api/admin/overview`
- Admin clients APIs: `/api/admin/clients`, `/api/admin/clients/:id`
- Admin PayPal revenue API: `/api/admin/revenue/paypal`
