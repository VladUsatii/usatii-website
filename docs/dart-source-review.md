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
