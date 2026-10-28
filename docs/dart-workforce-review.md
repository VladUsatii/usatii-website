# DART qualifications and development audit — second chunk

Reviewed October 28, 2026. Scope: all five sections of `/dart/readiness` and all six sections of `/dart/development`, including new milestone and evidence sections. Eight dedicated SVG workflows replace the two shared scenes previously used here.

Sources are relative to the neighboring FEMA application. Service code and existing test assertions were reviewed; the application tests were not rerun. All diagram labels and availability dates are conceptual examples. No personnel records or private reviews were copied.

## Section source map

| Public section | Source | Checked behavior |
| --- | --- | --- |
| Readiness / requirements | `lib/qualification-requests.js`, `lib/readiness.js` | Current published requirement choices, multi-request transaction, Pending versus opened task book, different administrator, return/resubmit/deny/withdraw, direct assignment, pinned versions and linked-family duplicate checks. |
| Readiness / evidence | `lib/readiness.js` (`evidence`, `review_evidence`, `submit`, `decide`) | Task/version membership, observed date and released attachments, evaluator scope and author exclusions, immutable reviews, all-task/current-training gate, submission snapshot, certifier recheck, credential date limits. |
| Readiness / availability | `lib/readiness.js` (`availability`, `decide_availability`, `availabilityAssessment`), `lib/operation-time.js` | Pending and separate supervision, non-overlap, approved interval replacement and saved side pieces, time-zone-aware full-period coverage, freshness, blocking states and unknown gaps. |
| Readiness / explanation | `lib/readiness.js` (`explainReadiness`, `trainingRequirements`), `lib/readiness-time.js` | Full-period credential and training dates, latest source revisions, effective course-version requirements, external freshness, availability, linked access/conflicts, Not confirmed versus Meets readiness requirements; no order issuance. |
| Readiness / history | `lib/readiness.js` (`credential`, `repeat_assignment`, `renew_credential`, `decide`) | Suspension/revocation and constrained reinstatement, denied repeat under pinned rules, new renewal cycle under latest available rules, no copied task evidence, linked replacement only at approval, retained historical snapshots. |
| Development / mentors | `lib/development.js` (`assign_mentor`, `interaction`, `mentor_review`, `end_mentor`, record visibility) | Same-organization dated assignment, pair overlap, participant notes, assigned mentor reviews, latest correction, preserved dates and scoped access. |
| Development / plans | `lib/development.js` (`create_plan`, `add_goal`, `edit_goal`, `submit_plan`, `review_plan`) | Dated goals and mutually exclusive links, own submission, different reviewer, approval before progress, Draft/Returned edits, stale version protection and history. |
| Development / milestones | `lib/development.js` (`save_milestone`, `milestone_progress`, goal checks) | Nested target dates, pre-work editing, own progress, Reported done for every step before finishing or verifying the goal; no substitute for evidence. |
| Development / evidence | `lib/development.js` (`evidenceFor`, `verify_goal`, `review_plan`) | Report-before-review, different reviewer, matching latest/current training, exact qualification version and Active dates, general released document evidence, all goals Verified before Closed. |
| Development / evaluations | `lib/operations.js` (`evaluations`), `lib/development.js` (`save_evaluation`, `submit_evaluation`, `developmentRecord`) | Supervision threshold creates obligation, assigned reviewer and current incident grant, published rubric with all ratings, period constraints, private drafts, Submitted visibility, original form on corrections, retained revisions. |
| Development / connection | Same services, `lib/reports.js` | Plans, course awards and qualification awards have separate effects; training need is not enrollment; linked development records retain their own access checks. |

## Assertions checked

- `tests/qualification-requests.test.js`: batched requests without books, separate approval, return/resubmit/denial/withdrawal history, rollback, version pinning, competing reviewers and current access on retries.
- `tests/readiness.test.js`: pinned books; evidence author/evaluator/state restrictions; separate submission and certification; whole-period expiry; atomic availability conflicts and gaps; stale sources; suspension/reinstatement; future/unsafe attachments; denied repeat attempts and current-rule renewal.
- `tests/development.test.js`: assigned mentor visibility, plan approval versus progress versus verification, stale versions, private drafts and preserved submissions, goal edits, milestone dates, goal-evidence gate, mentor-review corrections.

## Requested terminology treatment

`src/lib/dart/glossary.js` supplies one-sentence definitions. Recognized technical terms in DART body paragraphs are bold with a dotted underline. Hover or keyboard focus opens an italic definition. Escape, blur, and resize dismiss the tooltip; scrolling dismisses a hovered definition and repositions a keyboard-focused one. Definitions are placed within viewport bounds, and inline topic/source links keep their destinations. Qualification-specific credential definitions are scoped to the relevant pages so an API credential is not described as a position award.

The prose retains its explanations; tooltips are an additional aid. Existing pages receive the terminology treatment, but their capability content has not been marked audited by this change.

## Remaining review

Completed chunks: three Learning pages; qualifications/readiness and professional development. Next suggested chunk: incidents, responder staffing, and deployment orders. The personnel page and all remaining analysis, integration, platform, and federal topics still need the same deeper review.

## Website validation

All eight diagrams were inspected in the browser; arrow/label collisions found during that review were corrected. Both pages were checked at a 390-pixel mobile viewport: the article stayed inside the viewport and diagrams used their own focusable scroll region. Glossary checks covered computed bold/dotted/italic styles, viewport placement, keyboard focus after automatic scrolling, linked terms, normal link navigation, and Escape dismissal. The content scope check confirms 11 sections, eight unique diagrams, unique anchors, and no prose changes to other pages. The existing Learning diagrams use the same extracted drawing helpers. The isolated production build and `git diff --check` pass.
