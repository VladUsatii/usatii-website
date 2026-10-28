# DART learning documentation audit — first chunk

Reviewed October 28, 2026 against the neighboring FEMA application. This chunk covers all 17 sections of `/dart/learning-administration`, `/dart/learning-delivery`, and `/dart/training-records`. Other DART pages have not received this deeper workflow audit yet.

The review used service implementations, the help catalog, and existing test assertions. The application tests were read as evidence; they were not rerun for this documentation change. No learner data, certificate files, credentials, or internal logs were published.

## Section and diagram source map

Source paths below are relative to FEMA. Public diagrams use invented labels, not operational records.

| Page / section | Implementation checked | Explanation and diagram focus |
| --- | --- | --- |
| Administration / catalog | `lib/learning.js`, `lib/curriculum.js`, `lib/learning-revisions.js` | Lesson and course versions, classes pinned to publication, following drafts, separate required-version approval. Diagram contrasts existing classes with a later course draft. |
| Administration / admissions | `lib/admissions.js`, `lib/learning.js` | Draft versus submission, saved forms, endorsements versus funding, five selection modes, capacity and promotion rechecks, automatic rules. Diagram branches at approvals and seat selection. |
| Administration / schedule | `lib/learning.js` | Class period versus sessions, schedule history, ended-session attendance, credit impact, protected completed sessions, external mode. |
| Administration / instructors | `lib/learning.js` | Active profile, actual assignment, whole-period credential, outside request context, self-grading exclusion, revocation and removal. |
| Administration / materials | `lib/curriculum.js`, `lib/library-files.js` | Version links, review versus file release, hashes, replacement cascades, open-draft conflict, enrolled and instructor access. |
| Delivery / delivery | `lib/learning.js` (`moduleFor`, completion and assessment paths) | Active enrollment, class dates, pre-test and post-test gates, kind-specific completion. Diagram shows parallel ordinary work between the two gates. |
| Delivery / scorm | `lib/course-package.js`, `lib/course-player.js`, `lib/scorm-runtime.js`, `lib/learning.js` | SCORM 1.2 root manifest, local HTML resources, package limits, resumable values, Opened and needs-review state, separate eligible instructor attestation. Diagram separates package report from instructor completion. |
| Delivery / tests | `lib/learning.js` | Saved questions, topics, score and attempts, hidden key, explicit test-out reading versions, submitted assignments and complete rubric scoring. |
| Delivery / practice | `lib/learning.js` | Failed result, instructor-assigned Reading, learner report, approval grants one extra attempt, declined review and follow-up link, access checks. Diagram shows the approval and retry loop. |
| Delivery / grading | `lib/learning.js` | Original scoring basis, current grade and attachment checks, remaining passing grades, lesson reopening, rejected credit revision and separate restoration. Diagram shows the correction's downstream effect. |
| Delivery / completion | `lib/learning.js` (`creditIfDone`) | Exact required lesson versions, one native award, saved credit basis, Verified training, completed enrollment, validity period; no automatic position credential. |
| Delivery / feedback | `lib/learning-evaluations.js` | Four levels have distinct submitters and evidence. Level III follows award; Level IV is a past-period measure without an individual enrollment. |
| Records / credit | `lib/learning.js`, `lib/learning-revisions.js` | Required completion, saved course/policy/class/progress basis, one award per enrollment, revisions and expiry. Diagram shows the all-work gate and paired award records. |
| Records / provider-results | `lib/learning-external.js`, `lib/learning.js` | External class and authorized source, separate recorder, Live/SCORM-only results, time checks, pre-test gate, provider revision identity and corrections. |
| Records / outside | `lib/certifications.js` | Required person file/hash, Pending, separate holder/submitter/reviewer, permitted state transitions, expired evidence, linked renewal and supersession. Diagram shows the permitted review transitions. |
| Records / transcript | `lib/transcript.js` | Three row kinds, provenance and current/earlier revision, independent status/date/freshness, scoped CSV. Diagram uses a hypothetical Verified + Expired + Stale row to explain independent properties. |
| Records / changes | `lib/learning-revisions.js`, `lib/learning.js`, `lib/readiness.js` | Credit rejection and separate review, no expired restoration, effective required-version request with different approver, downstream readiness evaluation. |

## Existing assertions cross-checked

- `tests/learning.test.js`: live attendance and corrections; outside provider revisions; native award exactly once; pinned versions; eligible instructors and class dates; named test-out targets; rubric grading and corrections; four evaluation levels; practice/report/review before retry; pre/post gates; automatic sign-up; file rechecks; SCORM report requiring another instructor.
- `tests/admissions.test.js`: FIFO promotion, qualified draws, ordered endorsements and funding, draft/submission distinction, priority/external selections, automatic forms, submitted file identity, pending reviews.
- `tests/curriculum.test.js`: following drafts, pinned classes, replacement cascades and rollback, release and access checks, lost assignment, file hash identity.
- `tests/course-package.test.js`, `tests/scorm-runtime.test.js`: ordered lessons/assets, unsafe and unsupported packages, supported runtime initialization and saved values.
- `tests/transcript.test.js`: combined scoped records/exports and independent revision, date, and source-freshness properties.

## Presentation and remaining work

Nine dedicated SVG workflows replace the generic scenes on these pages. They retain Framer Motion reveal behavior, reduced-motion handling, centered captions, Inter typography, and the existing content width. Narrow screens scroll the diagrams inside their own focusable region rather than widening the page. New section anchors appear automatically in the left navigation.

Next suggested chunk: qualifications/readiness and professional development. Check the evidence-to-decision path and task-book reviews before drawing those workflows. The remaining response operations, analytics/planning, integration, platform, and federal pages still need the same section-level review; the earlier broad source map is not a substitute for that work.

## Website validation

- Final isolated production build passed (225 generated pages); the shared developer build directory was not used.
- Checked all nine rendered diagrams on desktop and all three pages at a 390-pixel mobile viewport. Corrected arrow/label collisions found during review.
- Mobile diagram regions are keyboard-focusable and contain their own horizontal scrolling; page width stays within the viewport.
- Content scope check confirms exactly these three pages changed, with 17 unique section anchors and nine unique workflow identifiers. `git diff --check` passed.
