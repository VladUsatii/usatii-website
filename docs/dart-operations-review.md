# DART incident, staffing, and order audit — third chunk

Reviewed October 28, 2026 against the neighboring FEMA application. Scope: all five sections of `/dart/incidents`, seven sections of `/dart/staffing`, and seven sections of `/dart/deployments`. Twelve dedicated SVG workflows replace the three generic scenes previously used here.

This review used the actual services and guide steps, with existing test assertions as supporting evidence. Application tests were not rerun for this documentation-only change. Diagrams use conceptual labels; the leader/member example illustrates quantities rather than publishing operational records or a measured result.

## Section source map

Paths below are relative to FEMA.

| Page / anchor | Sources | Behavior checked |
| --- | --- | --- |
| Incidents / lifecycle | `lib/operations.js` (`create_incident`, `incident_state`, `policy`), `lib/planning.js` template paths, `db/operations.sql` | Direct creation versus separately approved template/setup paths, current author access, Planned state, remote UTC station and virtual initial needs, parent-event and exercise boundaries. |
| Incidents / structure | `lib/operations.js` (`create_unit`, `duty_assignment`, `end_duty`, `supervisor`), `lib/incident-organization-report.js` | Unit parent/station/supervisor, accepted and unit dates, slot authority and eligibility, daily duty/training total, filled shared slots, dated supervision and past organization reports. |
| Incidents / needs | `lib/operations.js` (`staffing`, `template`, `package`, order acceptance), team equipment tests | One slot per quantity, type/station compatibility, specialty versions, personnel request links, pinned team instances, accepted membership revisions, equipment None versus unknown. |
| Incidents / coordination | `lib/resource-requests.js`, `lib/resource-coverage.js`, candidate/duty authority checks | Submitted/Approved/Agency accepted distinctions, different reviewer, mission and acceptance references, parent requests, distinct filled-slot coverage, retained events; no inferred order cancellation. |
| Incidents / closure | `lib/operations.js` (`change_incident_dates`, staffing revisions/withdrawals, `incident_state`) | Date and occupied-position guards, Planned/Active/Winding down/Closed transitions, open deployment/order checks, due-job pause and retained history. |
| Staffing / need | `lib/operations.js` (`candidate`, `findCandidates`), `lib/planning-engine.js` (`planningLimits`) | Scoped people and linked identities, full-period readiness/specialties, slot holds, physical conflicts, concurrent pairs/count, class commitments, time away, policy region/duration/rest limits, three outcomes. |
| Staffing / comparison | `lib/responder-selection.js` | Actual visits and current past-time entries, union of overlapping time, facts-matched history confirmation, Eligible-only ranking, two approved methods, fixed slot tie-break; no zero inferred from unconfirmed history. |
| Staffing / history | `lib/operations.js` (`save_history`, `inspect_history`, `review_history`), `lib/responder-selection.js` | Separate reviewer, valid past dates, linked identities, saved/outside deployment sources, latest correction/void, missing-visit guard, displayed review token and fact fingerprint. |
| Staffing / trainees | `lib/operations.js` (`authorize_trainee`, `authorize_training_time`, `candidate`, order acceptance) | Open matching PTB, separate dated authority and eligible supervisor, only main qualification reason removed, remaining checks, separate class authorization and daily duty limit, no enrollment or award. |
| Staffing / decision | `lib/operations.js` (`draft_order`, `changeOrder`, `saveCheck`), `lib/responder-selection.js` (`comparisonFingerprint`) | Active incident and approved rules, future deadline, below-first/unranked reason, snapshots, separate approver, comparison binding, overlap reason, issue/acceptance rechecks and retained prior proof. |
| Staffing / fairness | Same selection services | Incident rule versions, authority/reason/approver, unconfirmed workload, explicit exceptions, saved selection/approval comparisons. |
| Staffing / planning | `lib/planning.js`, `lib/planning-engine.js`, `lib/planning-help.js` | Saved scenario/snapshot cutoff, planning versus actual order effects, historical replay versus current checking. Deeper planning-page audit remains outstanding. |
| Deployments / orders | `lib/operations.js` (`draft_order`, `changeOrder`, `candidate`) | Draft slot/person holds, separate submission/approval/issue, current comparison and evidence, own timely reply, accepted revision, first deployment/check/end-step creation, cancellation before work. Diagram explicitly covers the initial offer. |
| Deployments / revisions | `lib/operations.js` (`amend_order`, `answer_order`, `sync`, `deployment`) | New proposal versus accepted revision, accepted start/station retained, extension-only amendment, declined/expired proposal preserves earlier acceptance, completed guard and policy limits. |
| Deployments / itinerary | `lib/operations.js` (`save_itinerary`, `decide_itinerary`) | Saved journey fields, latest revision, separate author/approver including linked identity, one decision per version, no implied actual travel. |
| Deployments / travel | `lib/operations.js` (`travel`, `check_in`, `check_out`, `plan_move`, `correct_visit`) | Actual state changes, accepted date/time/station checks, direct arrival, one open visit, physical conflicts, planned move versus arrival, end-plan branch and state-preserving correction. |
| Deployments / demobilization | `lib/operations.js` (`plan_end`, `end_step`, `record_return`, `finish`), `lib/equipment.js` outstanding equipment | Returning and checked-out end plan, Done/Not needed steps, policy-dependent return/evaluation, outstanding equipment, all opened daily windows, no pending order revision, supervision closure and future pending check cancellation. |
| Deployments / rotation | `lib/operations.js` (`rotation`) | Outgoing end plan, different incoming person/open order/same qualification type, link and reason; no transferred acceptance or waived completion. |
| Deployments / history | `lib/operations.js` visit/status correction paths and event records, organization report/accepted revision queries | Retained before/after values, private status scopes, permitted correction after completion, distinction between proposed dates, accepted commitment, and actual visits. |

## Guides cross-checked

- `lib/help-guides.js`: `operations-find-responders`, `operations-select-responder`, `selection-rules`, `selection-history`, `selection-specialties`, `selection-template-specialties`, `selection-saved-checks`, the add/correct/remove past-time tasks, and `selection-approve-current`.
- `lib/planning-help.js`: template version, separate approval, incident draft, submit, setup approval, saved-decision replay, and rule-explanation tasks.
- `lib/hurricane-feature-guides.js`, as included in the help catalog: incident units, duty assignment/ending, training-time approval, and parent partner-request linking. Existing deployment travel, visit correction, incident date, need-edit/withdrawal, and team-withdrawal guide steps were also checked.
- Public guide metadata was checked against `src/lib/dart/guides.json`; service checks take precedence over a brief guide label where the label omits a gate or boundary.

## Existing test evidence

- `tests/operations.test.js`: full incident lifecycle; scope and own replies; competing reservations; linked identity conflicts; safe/stale replies; allowed physical/remote overlap; changed evidence after approval; pinned team versions/membership/equipment; closure blockers; active extensions; visit corrections; replacement links; travel checks; specialty matching; rule versions; missing history, corrections and fact tokens; displayed comparison binding and changed rules; saved comparisons beyond recent-event limits.
- `tests/responder-selection.test.js`: approved ranking methods and missing history remaining unranked.
- `tests/planning.test.js`: template approval/activation and preserved policy basis.
- `tests/isaias-lifecycle.test.js`: supervised trainee authority and retained travel-plan revisions, inspected as implementation evidence rather than newly executed acceptance results.

## Presentation and remaining scope

All figures use the existing Inter text, Framer Motion/reduced-motion wrapper, centered captions, and contained mobile scrolling. Each workflow has its own paths and labels; the team quantity example is not a benchmark chart. An optional label-wrap setting was added to the shared State primitive to prevent outcome text from being clipped, without changing the default used by earlier diagrams.

New textbook terms retain bold dotted underlines and one-sentence italic definitions. Qualification-credential definitions are now scoped to these operational pages too. Other page prose remains unchanged.

Completed deeper audits: Learning (three pages), qualifications/readiness and development (two pages), and this operations chunk (three pages). Suggested next chunk: accountability, locations/rest, and equipment. Personnel and the remaining planning, analytics, integration, platform, and federal pages still need their own deeper review.

## Website validation

- Isolated production build passed; no shared developer build folder was used.
- Inspected all twelve workflows on desktop. Corrected connector/label collisions and a clipped candidate outcome; rendered text-bound checks then found no labels outside any diagram.
- At a 390-pixel viewport, all three article pages stayed within the viewport. Each diagram used its own keyboard-focusable horizontal scroll region.
- Verified a new glossary definition on keyboard focus: bold dotted term, italic sentence, correct viewport placement, and Escape dismissal. No browser client errors were reported.
- Scope check confirms only these three pages’ prose changed, with 19 sections, twelve distinct registered workflows, unique anchors, and all prior anchors preserved. No new sentence exceeds 35 words. `git diff --check` passed.
