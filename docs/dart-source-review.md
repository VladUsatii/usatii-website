# DART public documentation source review

Reviewed October 28, 2026. Public product explanations are in `src/lib/dart/content.js`, the survey cross-reference is in `src/lib/dart/requirements.js`, and the non-development help catalog snapshot is in `src/lib/dart/guides.json`.

The application source is the neighboring FEMA repository. No application data, environment variables, credentials, production personnel, or private attachments were copied. Wireframes use conceptual records and workflow labels.

## Source map

| Public topics | Application sources (relative to FEMA repository) |
| --- | --- |
| Personnel and organization | `lib/workforce.js`, `lib/workforce-profile.js`, `lib/workforce-evidence.js`, `lib/person-creation.js`, `lib/person-links.js`, `lib/identity-review.js`, `lib/stewardship.js` |
| Qualifications and training records | `lib/readiness.js`, `lib/qualification-requests.js`, `lib/certifications.js`, `lib/transcript.js`, `lib/learning-revisions.js` |
| Development | `lib/development.js`, README development and review workflows |
| Courses and learning delivery | `lib/learning.js`, `lib/admissions.js`, `lib/curriculum.js`, `lib/library-files.js`, `lib/learning-evaluations.js`, `lib/course-package.js`, `lib/scorm-runtime.js`, README learning sections |
| Incident staffing and deployments | `lib/operations.js`, `lib/responder-selection.js`, `lib/resource-requests.js`, `lib/workforce-history.js`, README incident workflows |
| Locations and rest | `lib/location.js`, `lib/location-policy.js`, `lib/location-time.js`, `lib/planning-engine.js` |
| Equipment | `lib/equipment.js`, README equipment workflows |
| Planning and replay | `lib/planning.js`, `lib/planning-engine.js`, `lib/planning-help.js` |
| Analytics | `lib/reports.js`, `lib/workforce-history-roster.js`, `lib/dashboard.js`, `lib/report-comparison.js`, README report definitions |
| Connections and exchanges | `lib/api-connections.js`, `lib/exchange.js`, `lib/integration-*.js`, API/exchange help modules |
| Integration Studio | `lib/integration-studio.js`, `lib/api-use.js`, `lib/api-use-schema.js`, Studio/API-use help |
| Developer tools | `lib/read-only-mcp.js`, `lib/terminal.js`, `lib/terminal-shell.js`, domain API routes |
| Communications | `lib/chats.js`, `lib/chat-calls.js`, `lib/notification-delivery.js`, `lib/notification-receipts.js`, communications help |
| Permissions and protection | `lib/auth.js`, `lib/permission-catalog.js`, `lib/permissions.js`, `lib/record-protection.js`, `lib/records-management.js` |
| Exercises | `lib/exercises.js`, `lib/exercise-database.js`, exercise and Isaias guides |
| Offline, languages, support, changes | `lib/offline-responder.js`, `lib/offline-vault.js`, `app/api/translate/route.js`, `lib/support.js`, `lib/system-changes.js` |
| Federal and delivery | `RFI_REVIEW.md` (including October 16 update), `REFERENCE.md`, README deployment boundary; current USATII federal job postings |
| 61-capability index | `TOS_RFI Survey DTS 2.0_Finalized.xlsx`, Necessary Capabilities C2:C62; other survey sheets for architecture, cost, schedule, and risk |
| Public help index | `lib/help-guides.js` and its imported task modules, excluding `developmentTest` tasks (388 tasks in this snapshot) |

The Palantir documentation overview and navigation pages were reviewed as information-architecture references: https://www.palantir.com/docs and https://www.palantir.com/docs/foundry/platform-overview . Public copy, diagrams, and capability descriptions are authored for DART. No Palantir feature-parity or copied-product claim is made.

## Publication boundaries

The documentation describes implemented workflows directly. Hosting authorization, live agency interfaces, approved operational policies, capacity, accessibility acceptance, contractual service levels, staffing, pricing, and delivery dates remain deployment-specific. No federal contract award, FedRAMP authorization, ATO, official qualification policy, or certification is inferred from application code.

Older application README and status sections can be stale. Current guide and service implementations were used for later features, including API connections, Integration Studio, decision replay, offline responder work, and source exchanges. This is a documentation review, not a new functional acceptance test of the FEMA application.

## Direct public references

The public SAM.gov survey download was checked on October 28, 2026. Its capability text matches the survey used for the build. The original workbook remains the mapping basis; public source links are kept in `src/lib/dart/references.js`. The official opportunity is `70FA3126I00000008` (current notice `a0c2acad204f428585857e6a736d179a`). Durable SAM.gov resource URLs are used instead of expiring S3 download URLs.

Each section now introduces the reason for the workflow before its mechanics. References stay inline in the prose. Direct source references are allowed independently of the limit on related DART-topic links, so a source is not silently omitted when a paragraph has several internal links.

## Evaluation and revised presentation

The evaluation page publishes a selected summary of saved October 14–18 application checks at `/dart/evaluation-results.json`. The summary preserves the initial broad-run failures and the focused follow-up scope. The chart counts service, HTTP, database, and browser tests; it is not a speed or concurrency benchmark. NOAA and USGS examples identify their separate test workspaces and live public sources. No private production records or raw internal logs were published.

The left navigation now nests section anchors under each topic. The document uses one content width and no separate right-side contents list. Wireframes use the construction article’s shared 30-degree projection. The evaluation figure reuses the article’s chart styles.

## Deeper workflow audit

The first section-level audit covers the three Learning pages. See `docs/dart-learning-review.md` for the 17-section source map, corrected distinctions, nine dedicated workflows, and remaining scope. The earlier shared scenes remain on other topics until those topics receive their own audit.
