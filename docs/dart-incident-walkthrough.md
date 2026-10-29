# Incident walkthrough and real application screenshots

Added October 29, 2026 at `/dart/incident-walkthrough`. The page sits under Start here and is linked inline from Overview. It follows one fictional Harbor flood response through twelve steps, using twelve screenshots from one complete execution of the actual FEMA application.

## Records and roles

Alex Morgan (`P-000001`) coordinates the incident, supervises the deployment, manages the radio, and writes the assigned review. Sam Rivera (`P-000003`) sets the sample comparison rule and independently approves the order. Jordan Lee (`P-000002`) accepts, travels, arrives, replies to the daily check, checks out, and reads the submitted review. The station is Harbor field office (`HARBOR-OFFICE`); the equipment tag is `HARBOR-RADIO-01`.

The exact incident, deployment, and radio IDs appear in `public/dart/walkthrough/capture-manifest.json`. Screens show the same order and deployment IDs throughout. This is a short exercise assignment with an early return, using the seeded Exercise deployment rules and UTC incident dates. The app displays timestamps in the browser's local zone. The case is not a real flood response or evidence of an agency deployment.

## Application sources and guides

Paths below are relative to FEMA.

| Walkthrough | Sources and checks |
| --- | --- |
| Preparation | `tests/helpers/browser-ready-responder.js`, `tests/browser/zoperations-flow.spec.js`, `lib/readiness.js`: active logistics credential, verified task evidence and course results, approved availability. Preparation uses actual readiness commands. |
| Incident and need | `app/operations-workspace.jsx`, `lib/operations.js`: create/start incident, physical station, one dated logistics slot. The screenshot waits for the saved staffing row. |
| Selection and order | `lib/operations.js`, `lib/responder-selection.js`, `lib/help-guides.js` tasks `operations-find-responders`, `operations-select-responder`, and current-comparison approval guidance: Ready versus ranking, unconfirmed history reason, saved rule, separate approver, current comparison, issue, own acceptance. |
| Travel and accountability | `lib/operations.js`, operational travel/arrival and daily-check guide controls: actual visit, own opened-check reply, retained accepted dates. Role changes wait for the page load so the previous actor cannot accidentally submit the next action. |
| Equipment | `app/equipment-workspace.jsx`, `lib/equipment.js`, equipment issue/return/inspection tasks: Good Exercise radio, issue to Jordan and this deployment, return clears links into Inspection, separate inspection makes it Available. The capture executes real equipment API commands, then opens the actual record screen. |
| End and return | `lib/operations.js`, deployment end/step/checkout/return/finish guide controls: supervisor obligation, three end steps, closed visit, recorded return, completion guards, cancelled future checks. Assignment of a review is distinct from submission. |
| Closure and review | `lib/operations.js`, `lib/development.js`, `app/development-workspace.jsx`, deployment review guides: wind down/close after completion, assigned supervisor writes/submits review, responder reads it. The sample policy permits submission after completion. |

The capture spec adapts the application's existing full-flow browser test. It adds linked radio issue/return/inspection, an ordinary daily reply, an explicit return, saved-state waits, twelve capture points, and final record assertions. No work screen, control, or screenshot is recreated as a mockup.

## Background capture software

Run from the website repository:

```sh
node scripts/dart/capture-incident.mjs /path/to/FEMA
node scripts/dart/export-incident-captures.mjs /path/to/completed-run/captures /path/to/FEMA
```

The first command uses FEMA's installed Playwright and Chromium. It copies application sources to a unique temporary directory, reuses installed dependencies, initializes an isolated synthetic PGlite database, starts a loopback development server, and runs Chromium with `headless: true`. It never calls desktop mouse/keyboard APIs, opens a headed window, or attaches to the user's browser. No saved user database or environment file is copied. Live call and notification delivery are disabled. The source checkout is left unchanged.

The capture copy resolves migration SQL paths from the copied source tree to avoid a bundler URL shim. The SQL bytes and workflow services are unchanged. A temporary readiness-route error log helps diagnose capture failures. These compatibility changes do not appear in the source checkout or public product interface. The manifest records the source commit, dirty-checkout flag, relevant copied-file SHA-256 values, and capture time.

The export command requires the twelve-screen manifest from a completed run. It encodes the PNGs as WebP without cropping, drawing over, changing labels, or rearranging controls. Asset hashes are saved in the public manifest. Raw screenshots, databases, and compiler output stay outside Git. Screenshot links open the full-size image; the article scales each image within its existing content width and centers its caption.

## Validation

- The final headless application run passed the complete incident sequence. It checked the final Closed incident, Completed deployment, recorded return, and closed visit. It also checked three Done end steps, Responded daily check, and the submitted review visible to Jordan. Existing accessibility assertions in the adapted flow passed.
- This is one executed synthetic workflow, not a complete application regression run or an agency acceptance test.
- The website's twelve images decoded at their original 1440-pixel width. Desktop and 390-pixel mobile checks found no page overflow or browser errors. The current topic's section tree was closed and reopened successfully.
- Captures were visually checked for the saved state and consistent people/records. A premature staffing-table capture was corrected by waiting for the persisted row. The comparison is captured without an unfinished disclosure transition.
- Isolated website production build (`npm run build`), script syntax checks, and `git diff --check` passed. The generated route includes `/dart/incident-walkthrough`.
