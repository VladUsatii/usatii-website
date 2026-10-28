// DART product documentation. Source review: docs/dart-source-review.md.
export const dartPages = [
  {
    "slug": "",
    "group": "Start here",
    "title": "DART",
    "description": "Usatii for Emergency Management. Prepare your workforce, staff incidents, and follow each deployment from the first order to the return home.",
    "sections": [
      {
        "id": "platform",
        "title": "How DART works",
        "paragraphs": [
          "A response team needs to prepare its people before an incident and keep track of them in the field. DART brings both stages into one workspace. A coordinator can follow a responder from training to assignment, then through travel and the return home.",
          "Before sending someone to an incident, staff need to know whether that person is ready. Do they hold the right qualifications? Are they available for the requested dates? Have they had enough rest? DART brings the evidence together and shows the reason for each result.",
          "Each person works within their assigned role. Responders manage their own work. Supervisors review their teams. Coordinators manage incidents and deployment orders. Other staff manage training, equipment, or the records they are allowed to change.",
          "DART was built around FEMA’s survey for a new Deployment Tracking System. The survey is published with FEMA’s public notice on SAM.gov. DART also supports other emergency management teams that need to prepare people and coordinate their response.",
          "A staffing example follows several distinct records. Task evidence and training support a qualification decision. The staffing check then considers availability and conflicts before an order is reviewed and accepted."
        ],
        "diagram": "review-overview"
      },
      {
        "id": "prepare",
        "title": "Prepare the workforce",
        "paragraphs": [
          "Preparation begins with knowing who is on the team and what each person can do. Personnel records give each person a stable ID. The record connects to their employment and position history. Source identifiers show which outside systems supplied the data.",
          "Readiness shows whether a person meets the rules for a position. A Position Task Book records the tasks they must complete. Training and certification records show what they have already earned.",
          "People can work with a mentor and follow a development plan. They can take online lessons or attend a scheduled class. Their transcript keeps the results together. Earlier records stay available when a result changes.",
          "A task-book approval, course award, and outside certificate remain different kinds of evidence. Their versions, dates, and current review states determine how they can support the next decision."
        ]
      },
      {
        "id": "respond",
        "title": "Staff the incident and carry the decision into the field",
        "paragraphs": [
          "When an incident needs help, coordinators turn that need into assignments. An incident starts with a need for people. The coordinator defines the positions and dates, then compares responders. The selection view shows who meets the requirements and what might block an assignment.",
          "A deployment order goes to a separate reviewer before it reaches the responder. The responder accepts or declines it. An accepted order starts the deployment record.",
          "During the deployment, DART tracks station visits and daily checks. Supervisors can follow up on missing replies. Equipment stays linked to the person who holds it. Required end steps must be complete before the deployment can finish.",
          "The accepted order revision supplies the deployment dates. Actual arrival opens a station visit; checkout closes it. Return and equipment checks must pass before final completion."
        ],
        "diagram": "review-overview-order"
      },
      {
        "id": "understand",
        "title": "Plan, report, and reconstruct",
        "paragraphs": [
          "A response plan also needs to account for what might happen next. Surge planning tests whether the workforce can meet several incident needs at once. A coordinator can compare rest policies and see where staffing falls short. Readiness forecasts show gaps that may appear in the coming months.",
          "Decision replay shows the facts used for an earlier staffing choice. Saved reports keep a fixed copy of results. Later changes to the source records do not rewrite that copy.",
          "Evaluation results show how DART has been checked with saved tests and live public data. The evidence includes receipt handling and repeat-safe publication.",
          "A saved result states the source cutoff and rules used. Reviewing that result explains the earlier decision; refreshing current records answers a different question."
        ]
      },
      {
        "id": "connect",
        "title": "Connect data without losing its source",
        "paragraphs": [
          "Useful information often starts in systems the organization already uses. Integrations bring outside data into DART. Staff map the fields and check the proposed changes before applying them. The original input stays saved so they can trace a problem to its source.",
          "Integration Studio lets staff build pages and rules around connected data. For example, a water-level reading can appear beside an incident. A rule can create a task when that reading crosses a set limit.",
          "Permissions control who can see or change each record. Record protection adds handling rules for sensitive data. These checks also apply to reports and background jobs.",
          "Capture retains source input. Preview explains the proposed changes, a different reviewer approves the import, and application checks the source versions again. Publishing makes the checked data available for its configured use."
        ]
      },
      {
        "id": "evaluate",
        "title": "Evaluate DART for your organization",
        "paragraphs": [
          "The clearest way to understand DART is to follow a piece of work from start to finish. Start with a real workflow. Follow a qualification request or a training class. Walk through a staffing decision and an accepted order. Inspect the result and the history behind it.",
          "The federal deployment pages explain hosting and security review. The requirements index maps the 61 capabilities in FEMA’s survey to the work DART supports. It also links to the details needed for an agency evaluation.",
          "The evaluation page separates saved service and browser checks from live-source examples. Their dated results are evidence of the cases tested, not a claim about production concurrency or agency authorization."
        ]
      }
    ]
  },
  {
    "slug": "core-concepts",
    "group": "Start here",
    "title": "Core concepts",
    "description": "Learn how DART connects people to their work. Understand the records and rules behind each decision.",
    "sections": [
      {
        "id": "records",
        "title": "Records and relationships",
        "paragraphs": [
          "To follow someone’s work over time, the system needs to recognize the same person across different records. DART gives each person a stable ID. An outside system may use a different ID for that same person. Source identifiers keep those records connected without relying on a matching name or email address.",
          "A person can have several positions over time. Each assignment has its own dates. Their training and qualifications also keep separate records. A change to one fact does not erase the others.",
          "An incident connects people to work. A staffing need says which position must be filled. An order names the person asked to fill it. Once they accept, the deployment tracks their work in the field.",
          "A person’s internal ID, an outside system’s source ID, and a sign-in identity serve different purposes. A reviewed identity link can connect records without moving the sign-in account or deleting the originals."
        ],
        "diagram": "review-relationships"
      },
      {
        "id": "time",
        "title": "Effective time and recorded time",
        "paragraphs": [
          "Staff sometimes learn about a change after it has already happened. A record can have two important times. Effective time says when something happened. Recorded time says when DART learned about it. A late correction keeps that difference clear.",
          "For example, a visit may have ended on Monday but been corrected on Wednesday. The history preserves both dates. A reviewer can see what the system knew before the correction.",
          "Time zones give dates and times their local meaning. Location reports keep remote work separate from physical visits. Overlapping visits are counted once.",
          "A correction can describe an earlier effective date while being recorded today. Historical reporting uses a saved-by cutoff as well as the dates being reported, so later knowledge is not silently inserted into an earlier view."
        ]
      },
      {
        "id": "rules",
        "title": "Published rules and versions",
        "paragraphs": [
          "Requirements can change while people are still working toward them. A published definition states the rules for a type of work. For example, a task book defines what a responder must complete to earn a qualification. That definition has a version.",
          "When staff publish a new version, earlier work keeps its original rules. This lets a reviewer understand a decision made before the change.",
          "DART also keeps versions of course content and team templates. Deployment policies can be compared before approval and activation.",
          "The version used by an assigned task book or scheduled class remains attached to that work. Publishing a newer definition does not replace those references. A required training revision has its own request and approval."
        ]
      },
      {
        "id": "decisions",
        "title": "Saved decisions and reviews",
        "paragraphs": [
          "When a decision is questioned later, staff need to see how it was reached. A decision is saved with the work it affects. A reviewer can see who made it and why. Earlier decisions remain visible when someone records a correction.",
          "Some decisions need a second person. An order author cannot approve the same deployment order. A connection designer needs separate approval for data rights and security.",
          "DART checks for changes before saving. If another person has already updated the record, the old form cannot overwrite it. Retried commands use the same request ID so an uncertain response does not create a second action.",
          "Reviews are tied to the saved version or fingerprint of the facts displayed. Changed records can require another review. The author, reviewer, reason, and earlier input remain available when the next decision is made."
        ]
      },
      {
        "id": "workspaces",
        "title": "Practice and operational work",
        "paragraphs": [
          "Practice should let people try the workflow without changing live operations. An exercise workspace separates practice from operational work. Staff can rehearse an incident without issuing a real deployment order. Exercise equipment cannot be assigned to an operational incident.",
          "Different records also have different effects. A planning simulation estimates staffing. An accepted order starts a deployment. A delivered message shows delivery. It does not show that the person has answered.",
          "Exercise access is assigned from the main workspace. The database’s environment must match the application environment. Source receipts and live provider behavior also respect the exercise boundary."
        ]
      }
    ]
  },
  {
    "slug": "personnel",
    "group": "Workforce",
    "title": "Personnel and organization",
    "description": "Keep a clear record of each person and their work history. Review changes without losing earlier facts.",
    "sections": [
      {
        "id": "profile",
        "title": "A stable record for each person",
        "paragraphs": [
          "Before assigning work, a team needs a reliable record of the people who may take part. Personnel records show who a person is and where they work. Staff can search the directory or filter by organization. Opening a record shows its source links and history.",
          "A new person can be entered with a source ID or added through a checked CSV file. If an email address is already shared, staff review the possible conflict. Matching names alone do not merge people.",
          "Creation uses a stable source identity and checks potential conflicts. A shared email can require an explicit identity review; the source key cannot be quietly reassigned to a different person."
        ],
        "diagram": "review-personnel"
      },
      {
        "id": "organization",
        "title": "Organizations and positions",
        "paragraphs": [
          "A person’s regular job and their role during an incident may be different. A home organization identifies the person’s regular team. Employment records show when their work started or ended. Position assignments show which roles they hold and for which dates.",
          "An incident duty is separate from the person’s regular position. Someone can serve in different roles at different incidents. Each assignment keeps its own scope and history.",
          "Employment, position assignments, unit membership, and reporting relationships have separate dated records. Corrections link to earlier versions. Unit and reporting changes check for cycles rather than allowing a person or unit to become its own ancestor."
        ]
      },
      {
        "id": "corrections",
        "title": "Corrections and identity review",
        "paragraphs": [
          "People change jobs, and records sometimes contain mistakes. A correction saves the earlier value and the reason for the change. It also records who made it. An old form cannot overwrite a newer record.",
          "Staff can review links between duplicate person records. The original records remain available. Linked transcripts and development records can be inspected without losing their source history.",
          "A merge needs a current Possible same person finding from a different steward. The saved pair versions must still match, and link chains are restricted. Undo names the exact latest link being reversed.",
          "A reviewed link does not grant access to the other person’s protected records. Downstream readiness and scheduling checks can still stop when linked evidence conflicts."
        ]
      },
      {
        "id": "batches",
        "title": "Check a batch before saving",
        "paragraphs": [
          "When many records need the same review, editing them one at a time can be slow. Personnel batches let an editor check many changes before saving them. The preview shows old and new values. It also shows which rows have errors.",
          "DART checks the rows again when the editor applies the batch. If a row is invalid or has changed, the correction batch stops. It does not leave half of the changes saved.",
          "Undo creates a new correction from the earlier values. Staff must review it before applying it. Undo cannot overwrite work saved after the original batch.",
          "The manual correction path accepts up to 200 people in a CSV file under 200 KB. Larger source imports use the integration workflow.",
          "A preview can expose an identity conflict that needs its own row review. Applying locks the records and checks their versions again. Undo prepares a new batch rather than deleting the original correction."
        ]
      },
      {
        "id": "access",
        "title": "Separate profile, employment, and document permissions",
        "paragraphs": [
          "Different staff look after different parts of a person’s record. Permissions separate profile edits from other personnel work. A person allowed to change contact details may not be allowed to change employment or assign a position.",
          "Documents have their own access and file checks. Being able to read a profile does not give someone access to every file attached to it.",
          "The server checks the organization for each protected action. Effective dates determine when a grant applies. A reader’s access to a directory row is separate from editing employment, reviewing identity, or downloading a document."
        ]
      }
    ]
  },
  {
    "slug": "readiness",
    "group": "Workforce",
    "title": "Qualifications and readiness",
    "description": "Check whether a person meets the requirements for a position and is available for the requested dates.",
    "sections": [
      {
        "id": "requirements",
        "title": "Request a position and open its task book",
        "paragraphs": [
          "A qualification is a recorded decision that a person meets the rules for a position. Before earning it, the person works through a Position Task Book. The task book names the tasks and training they must complete.",
          "FEMA’s Position Task Book templates describe tasks for defined positions. They are part of the National Qualification System. The organization chooses the approved rules used in DART; a template alone does not grant anyone a qualification.",
          "A responder can request up to twenty different qualifications together. Each request names a current, published version and starts as Pending. A different qualification administrator reviews it. Approval opens the task book; it does not award a credential.",
          "A reviewer can return a request for changes or deny it. The responder can resubmit a returned request or withdraw an open one. Each decision stays in history. Staff with the right authority can also assign task books directly.",
          "Each task book keeps its assigned version. A later template cannot change its tasks. A person can work on books for different positions at the same time, but cannot open competing books for the same position. Linked person records are checked for duplicates too."
        ],
        "diagram": "workforce-request"
      },
      {
        "id": "evidence",
        "title": "From task evidence to a certification decision",
        "paragraphs": [
          "Task evidence describes what the responder did and when it was observed. The responder or an authorized qualification administrator adds it to an open or returned task book. The task must belong to that book’s saved version.",
          "An observation cannot be dated in the future. An optional attachment must belong to the person and be released for use. Quarantine holds a file until its required checks pass, so it cannot support the task yet.",
          "An evaluator checks each piece of evidence and marks it Verified or Returned, with a reason. The evaluator needs authority for that person and qualification. They cannot be the responder or the person who wrote the evidence.",
          "A reviewed item is not overwritten. A correction needs new evidence, so the earlier account and review remain visible. A returned task book can receive the work needed to address its review.",
          "Every task needs verified evidence before the packet can be submitted. Required training must also be verified and current. Submission saves the requirements and evidence used for that check, then changes the book to Submitted.",
          "A certifier makes the separate Approved, Returned, or Denied decision. The certifier cannot be the responder. Approval checks the tasks and training again: a source that became stale after submission can still stop the award.",
          "Approval creates an Active credential: the saved award and its dates. Its expiry must follow the saved qualification rules. Evaluator and certifier are separate permissions; one does not grant the other. Verified tasks alone do not create the credential."
        ],
        "diagram": "workforce-evidence"
      },
      {
        "id": "availability",
        "title": "Availability must cover the whole assignment",
        "paragraphs": [
          "Availability states when a person can take an assignment. A request records a start date, end date, and time zone. The person chooses Available, Unavailable, or Nondeployable and a reason category.",
          "New requests begin as Pending. A different supervisor must approve or deny them. The person can withdraw a pending request. A pending request does not confirm that they can deploy.",
          "Approved intervals cannot overlap. To change part of an approved interval, the new request must stay inside its dates and use the same time zone. Approval replaces that part and keeps the unchanged dates on either side.",
          "The readiness check compares actual times, using each interval’s time zone. Approved Available intervals must cover the entire requested period without a gap. Any overlapping approved Unavailable or Nondeployable interval blocks availability.",
          "Availability also has a freshness limit set by the qualification rules. Old availability becomes Stale. A period with no full approved coverage is Unknown, or Pending when a request awaits review. None of those states is treated as Available."
        ],
        "diagram": "workforce-availability"
      },
      {
        "id": "explanation",
        "title": "Read the reasons behind a readiness result",
        "paragraphs": [
          "Readiness answers a question for particular dates: does this person meet the rules for this position over this whole period? The check names a qualification version, start and end dates, and time zone.",
          "The credential must be Active and cover the full period. A credential that starts later is Not yet effective. One that expires before the assignment ends is Expired during interval. The requirement version must also be effective by the requested start.",
          "Each required course is checked separately. DART uses the latest source revision for a provider record. Training must be Verified, completed by the start, and valid through the end. Applicable minimum course-version rules also matter.",
          "Outside training needs a sufficiently recent successful source update. An old feed can make training Stale even when the recorded completion is recent. Missing, rejected, or earlier-version training appears as a reason rather than being counted as a pass.",
          "The result includes the credential, task evidence, training checks, and availability used. Meets readiness requirements requires all the readiness checks to pass. Inaccessible linked records or conflicting linked credentials can also leave readiness Not confirmed.",
          "Readiness does not issue an order or reserve a staffing slot. Responder selection also checks deployment conflicts and other staffing rules. Its saved decision keeps the facts used at that time."
        ],
        "diagram": "workforce-readiness"
      },
      {
        "id": "history",
        "title": "Corrections, repeat attempts, and renewal",
        "paragraphs": [
          "A credential’s history shows the award and later decisions. A different authorized certifier can suspend or revoke it with a reason. These actions keep the earlier award instead of deleting it.",
          "A Suspended credential can return to Active only while it is unexpired and its required training is current. A Revoked or Superseded credential has no direct restore path. An Active label alone does not bypass the date checks used for readiness.",
          "A denied task book has a separate repeat-attempt path. A different qualification administrator starts the next attempt under the same saved rules. The earlier book stays linked, and the new attempt starts without copying its task evidence.",
          "Renewal is different from repeating a denial. A qualification administrator starts a new task-book cycle from an eligible prior credential. DART selects the latest current, published, non-retired qualification version. Another open book for that position blocks a competing renewal.",
          "The old credential stays in history while the renewal work is completed. Approval of the renewal creates a new linked credential and marks the old one Superseded, meaning the new award replaces it for current use. A prior credential that was revoked or superseded before the award stops that renewal.",
          "A later training correction can change a new readiness result without rewriting an earlier certification snapshot. Staff can follow both the original decision and the evidence that now prevents deployment."
        ],
        "diagram": "workforce-renewal"
      }
    ]
  },
  {
    "slug": "development",
    "group": "Workforce",
    "title": "Professional development",
    "description": "Help people work toward their next role. Connect plans and mentoring to training and deployment reviews.",
    "sections": [
      {
        "id": "mentors",
        "title": "Mentoring has its own people, dates, and reviews",
        "paragraphs": [
          "A mentor helps a person develop their skills. A mentor administrator records the relationship’s goals and dates. The mentor must be a different person in the same organization. The same pair cannot have overlapping assignments.",
          "The person or their assigned mentor can record a meeting. Its time must be in the past and inside that relationship’s dates. A new mentor does not inherit the earlier mentor’s private meeting notes.",
          "Only the assigned mentor can write that relationship’s mentor review. It records an observation time, strengths, and next steps. The observation must also fall within the saved assignment dates.",
          "A correction creates a new review linked to the previous one, with a reason. It must correct the latest review rather than branching from an older version. Earlier observations remain available to authorized readers.",
          "Ending the relationship cannot cut off a meeting or review already recorded after the proposed end. Extending an ended relationship needs a new assignment. Mentor access does not by itself grant plan-review or qualification-certification rights."
        ],
        "diagram": "workforce-mentoring"
      },
      {
        "id": "plans",
        "title": "Agree on a plan before recording progress",
        "paragraphs": [
          "A development plan sets a goal for a person’s growth and a target date. The person or an authorized reviewer can create a draft. Each goal has its own date within the plan’s target.",
          "A goal can name a course or a particular qualification version. It can also be a general goal with neither link. One goal cannot use both kinds of link, because each needs different evidence.",
          "The person submits a plan with at least one goal. A different reviewer approves it or returns it for changes. Progress is recorded only after the plan is Approved.",
          "Goals can be added or changed while the plan is Draft or Returned. A goal with reported work cannot be rewritten. Saved changes keep their earlier values and reasons, and a stale plan version cannot overwrite newer work.",
          "Approval agrees on the planned work. It does not finish the goals, award course credit, or grant a qualification. Those outcomes need their own evidence and decisions."
        ],
        "diagram": "workforce-plan"
      },
      {
        "id": "milestones",
        "title": "Use milestones to report smaller steps",
        "paragraphs": [
          "A milestone is a smaller dated step inside a goal. Its target cannot be later than the goal’s target. Staff can change planned milestones while the plan is Draft or Returned and the goal has not started.",
          "Once the plan is Approved, only the person reports their milestone progress. A step can be In progress or Reported done. The history records each update and its reason.",
          "Every milestone must be Reported done before the person can report the whole goal done. The reviewer checks that condition again before verifying the goal.",
          "A set of completed milestones is still a progress report. It does not replace the independent evidence check for the goal."
        ]
      },
      {
        "id": "evidence",
        "title": "Match the evidence to the goal",
        "paragraphs": [
          "Verifying a goal means checking that the result matches what was planned. The person first reports the goal done. A different authorized reviewer then selects the evidence and records the verification.",
          "A course goal needs a training record for that course and person. It must be the latest provider revision, be Verified, and be valid on the review date. An outside source must also meet its freshness limit.",
          "A qualification goal needs the person’s Active credential for the exact qualification ID and version named in the goal. The credential must cover the review date. A course completion cannot stand in for that credential.",
          "A general goal can use a released document belonging to the person. A file cannot replace the matching training or credential needed by a linked goal. The verification keeps the selected evidence in the development history.",
          "Only an Approved plan with every goal Verified can be Closed by a different reviewer. A closed plan cannot take more work; further development needs a new plan."
        ]
      },
      {
        "id": "evaluations",
        "title": "Review work performed during a deployment",
        "paragraphs": [
          "A deployment performance review records how someone worked under an assigned supervisor. It is separate from a mentor review or a course evaluation. Each uses a different relationship and evidence.",
          "Incident rules set the required supervision time for a review obligation. The operations workflow creates an obligation for a qualifying supervisor assignment. Its due date is seven days after that supervision threshold. The assigned supervisor needs current incident supervision rights to write and submit it.",
          "The supervisor chooses a published review form. Its rubric lists the review items and allowed ratings. Every item needs an answer. The review period must stay within their supervision dates and cannot extend into the future.",
          "Saving creates a Draft. Draft ratings and comments stay private to the assigned author. The responder and development reviewers see Submitted revisions, not unfinished edits.",
          "Submitting preserves that version and marks the obligation Submitted. A later correction creates a new draft revision under the original form version. The earlier submitted review stays visible until the corrected version is submitted.",
          "A reviewer cannot replace a newer revision using an old form. Each saved or submitted revision retains its period, ratings, narrative, reason, and author. Writing a review does not itself certify a qualification."
        ],
        "diagram": "workforce-evaluation"
      },
      {
        "id": "connection",
        "title": "Keep development progress separate from readiness",
        "paragraphs": [
          "A plan points toward future work. Readiness checks the evidence a person holds for an assignment now. Keeping those questions separate prevents a reported goal from being mistaken for an earned credential.",
          "A course link can connect a goal to the training the person needs. The learning workflow awards course credit. A qualification link points to a saved requirement version; the task-book and certification workflow awards its credential.",
          "Training-needs reports help staff find missing learning and plan classes. A report or plan approval does not enroll the person automatically or waive a class’s admission rules.",
          "Authorized staff can inspect development records linked through reviewed person identities. Each linked record still needs its own access check. A link does not grant access to every plan, meeting, or private draft review."
        ]
      }
    ]
  },
  {
    "slug": "learning-administration",
    "group": "Learning",
    "title": "Courses, classes, and instructors",
    "description": "Plan training and manage classes. Review who may attend and who may teach.",
    "sections": [
      {
        "id": "catalog",
        "title": "Courses, lessons, and scheduled classes",
        "paragraphs": [
          "A course defines what someone needs to learn. A class is a particular delivery of that course, with its own dates and enrollment. Keeping these separate lets the same course run more than once without mixing the learners’ records.",
          "An administrator builds a course from named lesson versions. Lessons can be reading, quizzes, assignments, live instruction, or SCORM 1.2 content. The course also names its prerequisites and required teaching credentials.",
          "Publishing releases a particular course version. A scheduled class refers to that published version. Later edits do not replace the lessons used by people already enrolled.",
          "A course can be made inactive without deleting its history. Retiring a lesson prevents new use while preserving work in existing classes. Shared-update settings can create new course drafts when a followed lesson changes. Those drafts still need publication.",
          "A newly published course version does not make earlier credit disappear. Requiring people to complete a newer version is a separate request with an effective date. Another authorized person must approve that requirement."
        ],
        "diagram": "learn-course-versions"
      },
      {
        "id": "admissions",
        "title": "Applications, approvals, and seat selection",
        "paragraphs": [
          "Applying for a class is different from holding a seat. A draft saves the applicant’s answers without creating an enrollment. Submission checks the application against the class’s saved admission rules. A denied application needs a new attempt; its earlier decision stays saved.",
          "Those rules set the application window and eligible audience. They also identify the required form versions and approval steps. A document answer must refer to a checked file; an old approval cannot bypass a changed or withdrawn file.",
          "Application approval and funding are separate decisions. A class may require no funding decision, local approval, or a recorded outside authorization. The authorization must cover the class dates and meet any configured deadline.",
          "Once the required decisions are complete, the class uses its configured seat-selection method. Options include first-in order, a qualified draw, ranked priority, manual selection, and a recorded outside decision. The draw waits until applications close and pending reviews are resolved.",
          "Capacity still limits the result. People who are not selected can move to the waitlist. Promotion checks the saved application again. A failed check moves it to Needs review instead of quietly enrolling the person.",
          "Automatic sign-up rules can find people with needed training, sourced new-hire dates, or matching positions. They do not remove the class’s form, approval, funding, or capacity checks. Training alerts notify people about suitable classes; an alert does not reserve a seat."
        ],
        "diagram": "learn-admissions"
      },
      {
        "id": "schedule",
        "title": "Class dates, sessions, and attendance",
        "paragraphs": [
          "The class sets the overall teaching period. Sessions describe the individual meetings for a lesson, including their times and place. DART offers self-paced, classroom, field, virtual, hybrid, and external class modes.",
          "Changing class times keeps the earlier dates in history. Affected active sign-ups can move to Needs review. Confirmation rechecks the class and admission rules; it does not restore a seat without checking capacity.",
          "A live lesson uses its scheduled sessions as attendance evidence. An assigned instructor records attendance after a session ends. The learner cannot record their own attendance decision.",
          "Before an instructor marks that lesson complete, each current, non-cancelled session must have ended and have a present attendance record. Correcting attendance to absent can reopen the lesson and reject previously verified course credit.",
          "A session with saved attendance or finished lesson work cannot simply be rewritten as a new schedule. The recorded workflow preserves those session facts and directs staff to use a new class for a new schedule. External providers use the separate source-result path."
        ]
      },
      {
        "id": "instructors",
        "title": "Who may teach and review the work",
        "paragraphs": [
          "Being listed as an instructor does not grant access to every class. The person needs an active instructor profile and an assignment to the class. Their credentials must meet the course’s teaching requirements for the whole class period.",
          "An instructor from another organization also needs an approved request for that class. The approval keeps its teaching context. If the relevant course or class facts change, the saved approval must still match.",
          "Outside instructor requests can be approved, declined, or withdrawn. Assigning and removing an instructor are separate actions. Removing the assignment ends the teaching access tied to it.",
          "Revoking a teaching credential keeps the earlier credential and the reason. Subsequent grading checks the instructor’s current eligibility. It does not erase grades already recorded.",
          "Assigned instructors review submissions and attendance for their class. They cannot grade their own enrollment. A person who only approves funding does not gain access to student answers."
        ]
      },
      {
        "id": "materials",
        "title": "Shared content and file release",
        "paragraphs": [
          "A course can refer to shared material instead of keeping an untracked copy. Each link names the material version used by that course or lesson. Existing class work retains its saved versions.",
          "The library separates material review from file release. A version may be under review, published, retired, or withdrawn. Its associated file must also satisfy the storage, scanning, and release checks.",
          "A replacement file has its own identity and hash. The update workflow can carry the replacement through linked lessons and following courses. It creates new versions rather than changing an existing class’s saved content. An open following draft can block the update.",
          "Access settings distinguish approved readers, enrolled course learners, and administrators. Being waitlisted does not provide the course-learner file access of an enrolled person. An instructor’s access depends on their current class assignment.",
          "A download checks the linked file and its original identity again. If a file is withdrawn or no longer released, earlier publication does not make it safe to download. The deployment supplies the approved storage and malware-scanning services."
        ]
      }
    ]
  },
  {
    "slug": "learning-delivery",
    "group": "Learning",
    "title": "Online learning and assessments",
    "description": "Deliver online lessons and track progress. Show learners what they have completed and what they need to practice.",
    "sections": [
      {
        "id": "delivery",
        "title": "What a learner can open and complete",
        "paragraphs": [
          "My learning shows the classes a person is enrolled in and the lessons for each class. The class uses a saved course version. Each lesson therefore has a known kind and a known version of its completion rules.",
          "The learner needs an active enrollment in a scheduled class. Ordinary course work must fall within the class dates. Admission checks still apply when the learner opens or submits work; a pending application does not grant lesson access.",
          "DART has two explicit assessment gates. Starting knowledge checks must be completed before other work. Final tests wait until the other course work is complete. This is not a rule that every ordinary lesson must be opened in a single fixed order.",
          "A starting check saves its actual score and pass result. Completing the attempt satisfies that starting gate even when the score is below the passing mark. The result shows the learner’s starting knowledge rather than silently becoming a pass.",
          "Opening a lesson saves progress but does not finish it. A reading lesson is finished when the learner marks the opened reading complete. A quiz, assignment, live lesson, or SCORM lesson follows its own completion path."
        ],
        "diagram": "learn-assessment-gates"
      },
      {
        "id": "scorm",
        "title": "SCORM packages, saved progress, and review",
        "paragraphs": [
          "A course package can bring several lessons and their assets into DART. The ZIP importer requires a SCORM 1.2 manifest at the archive root. It reads the manifest’s lesson order and creates a draft course for review.",
          "The importer accepts one to fifty distinct lesson resources. Each launch file must be a local HTML file in the package. A ZIP can be up to 3 MB; unsafe paths and unsupported manifest versions are rejected. This does not claim support for every SCORM edition or extension.",
          "Each SCORM lesson runs in its own sandboxed player. The player saves supported status and score values, along with a lesson location and suspend data. Those saved values let the learner resume the lesson.",
          "A package can report passed or completed, but this remains a learner-supplied completion report. Saving it keeps the DART lesson Opened and marks it as needing review. It does not immediately award course credit.",
          "A different, currently assigned instructor checks the completion report before completing the lesson. Any required current sessions must also have ended with attendance recorded. External classes use a checked provider result instead of this local instructor action."
        ],
        "diagram": "learn-scorm-review"
      },
      {
        "id": "tests",
        "title": "Quizzes, test-out, and scored assignments",
        "paragraphs": [
          "A quiz grades the learner’s answers against the saved lesson’s questions. Each question has choices and a topic. The result records the score and gives feedback for the missed topics. Answer keys are not supplied in the learner’s lesson view.",
          "The lesson defines its passing score and allowed attempts. A final test follows the post-test gate and needs a passing result to complete. A starting check has the different gate behavior described above.",
          "A test-out quiz can complete only the reading lessons explicitly named in its saved configuration. The learner must pass. The target reading IDs and versions must match the class’s saved course. Passing does not waive every lesson or award a qualification.",
          "A scored assignment saves the submitted answer and any released attachments. The learner waits for grading before sending another attempt. An instructor scores every rubric item within its allowed points.",
          "DART calculates the percentage from the points earned and available. It saves the rubric, pass mark, feedback, and reviewer with the grade. A passing assignment completes that lesson; a failed result remains available for review."
        ]
      },
      {
        "id": "practice",
        "title": "Extra practice and another attempt",
        "paragraphs": [
          "A failed result can lead to focused practice rather than an unexplained extra retry. An assigned instructor chooses a current reading lesson and adds instructions tied to the failed quiz or assignment.",
          "The learner reads the assigned material and reports what they did. An instructor then reviews that report. An approved review adds one extra attempt beyond the lesson’s original allowance.",
          "Reporting the practice alone does not grant that attempt. If the review declines another try, the instructor can assign follow-up practice linked to that decision. The failed result and each practice review remain in history.",
          "Both people need access to the practice material. If access is removed, an earlier assignment does not continue to expose the content. The learner still needs a passing assessment result to complete the original lesson."
        ],
        "diagram": "learn-practice-retry"
      },
      {
        "id": "grading",
        "title": "Correct a grade without losing its basis",
        "paragraphs": [
          "A grade can be wrong even after a course has been completed. A currently assigned, eligible instructor can correct it with a reason. The correction keeps the earlier score and uses that grade’s original rubric and pass mark.",
          "DART checks the latest grade and any attached files again. A stale grade reference cannot overwrite a newer correction. A withdrawn or changed attachment can block grading until the file review is resolved.",
          "The system then checks whether any current passing grade still completes the lesson. If none remains, the lesson becomes Opened. If that leaves the course incomplete, existing verified course credit receives a new Rejected training revision.",
          "A later passing correction can complete the lesson again. It does not silently restore already rejected credit. A different course administrator must review that credit separately.",
          "Work submitted within the class period can be graded after the class ends through the review path. That does not reopen the class for new late submissions. Cancelled classes and withdrawn sign-ups cannot create new course credit through a correction."
        ],
        "diagram": "learn-grade-correction"
      },
      {
        "id": "completion",
        "title": "When course credit is awarded",
        "paragraphs": [
          "DART evaluates the exact lesson versions named in the class’s course. Each must have a Completed progress record. Enrollment, opening lessons, or receiving a package’s completion message is not enough.",
          "The route to Completed depends on the lesson kind. Reading uses the learner’s completion action. Quizzes and scored assignments use their passing result. Live and local SCORM lessons need the assigned instructor’s check.",
          "Once all required work is complete, the native course workflow awards credit once. It creates a Verified training record and saves the evidence used for the award. The learner’s enrollment becomes Completed.",
          "The credit basis includes the saved course and policy versions. It also keeps the class details and completed lesson records. If the course defines a validity period, the resulting training record receives an expiry date.",
          "Training credit can support a qualification requirement. It does not by itself certify the responder for a position. That remains a separate readiness decision."
        ]
      },
      {
        "id": "feedback",
        "title": "Four distinct kinds of training evaluation",
        "paragraphs": [
          "A course evaluation asks what the training achieved. DART supports forms for all four Kirkpatrick levels, but the levels collect different evidence from different people. The saved response keeps the version of the form used.",
          "At Level I, the learner gives feedback without assessment evidence. At Level II, the learner’s response must reference distinct quiz or assignment results from that enrollment. These are not interchangeable survey submissions.",
          "Level III records an instructor’s observation after the learner completes the course. The observation date cannot precede the credit award. The learner cannot submit their own instructor observation.",
          "Level IV records an administrator’s result measure for a past period. It is not attached to an individual enrollment. These distinctions let reports separate personal feedback from learning evidence and wider program results."
        ],
        "table": {
          "headers": [
            "Level",
            "Who supplies the evidence"
          ],
          "rows": [
            [
              "I — Reaction",
              "The enrolled or completed learner provides feedback."
            ],
            [
              "II — Learning",
              "The learner links assessment results from the same enrollment."
            ],
            [
              "III — Behavior",
              "A different instructor records a dated post-completion observation."
            ],
            [
              "IV — Results",
              "An administrator records a past-period measure without an individual learner."
            ]
          ]
        }
      }
    ]
  },
  {
    "slug": "training-records",
    "group": "Learning",
    "title": "Training records and certifications",
    "description": "Keep the evidence for training and certifications. Bring the results together in a person’s transcript.",
    "sections": [
      {
        "id": "credit",
        "title": "The evidence behind native course credit",
        "paragraphs": [
          "A training record states what learning was recognized, not just that someone opened a course. Native course credit is created after every required lesson version is complete. The award keeps the evidence used to reach that result.",
          "DART creates the credit and a Verified training record together. The saved basis names the course version and policy. It also keeps the class details and the lesson progress used for completion.",
          "The same enrollment cannot receive a second native credit award when a completion request is repeated. Later corrections add training revisions instead of replacing the original record.",
          "A course’s validity period determines the award’s expiry date when one is configured. Credit hours and the source of the award remain available for transcript review. A training result still does not grant a position qualification by itself."
        ],
        "diagram": "learn-credit-basis"
      },
      {
        "id": "provider-results",
        "title": "Results received from an outside course",
        "paragraphs": [
          "An External class can use results supplied by an outside learning provider. This path records what the provider reported, rather than asking a local instructor to pretend they observed the session.",
          "An authorized administrator or recorder selects an external training source for the organization. Each result includes the provider record ID and revision. The recorder must be a different person from the learner.",
          "The result must identify a Live or SCORM lesson in the class’s saved course. Its event time must be inside the class dates and cannot be in the future. A completed result cannot bypass an unfinished starting knowledge check.",
          "Source revisions keep earlier results available. A correction that removes required completion can withdraw verified credit through a new training revision. Repeating a saved result does not create a separate award."
        ]
      },
      {
        "id": "outside",
        "title": "Outside certifications and certificate review",
        "paragraphs": [
          "An outside certification is separate from a course result and a DART qualification. It records the credential a person holds from an issuer, with a certificate number and dates.",
          "The person or an authorized training recorder submits the certification with that person’s certificate file. The file is required. DART checks its release state and saved hash, then creates the certification as Pending.",
          "A different person with certification-review authority can verify or reject it. A Pending record does not count as a verified certification. The reviewer must be different from both the certificate holder and the person who submitted it.",
          "A verified certification may be suspended or revoked. A suspended one can return to Verified if its dates and file checks still permit it. Revoked and rejected records have no direct restore transition.",
          "Renewal creates a new record linked to the earlier certification with the same code. The earlier record is not replaced just because a renewal was submitted. Verification of the new record records the replacement as Superseded where applicable.",
          "An expired certification cannot be verified or restored. A new valid certification must be recorded and reviewed. Earlier certificates and decisions remain part of the history."
        ],
        "diagram": "learn-certification-review"
      },
      {
        "id": "transcript",
        "title": "Read the transcript without collapsing its evidence",
        "paragraphs": [
          "The transcript combines course training, outside certifications, and qualification credentials. Each row keeps its kind so a course result is not mistaken for a qualification decision.",
          "A course row identifies its source record and revision. The transcript marks it Current or Earlier version. A Verified status remains separate from whether its dates are current, future, or expired.",
          "Source freshness is separate too. An external source can be Current, Stale, or Unknown according to its last successful update. Local course records are identified as local evidence. A recent completion date does not prove a feed is current.",
          "Certification rows show the issuer and certificate number. Qualification rows identify their local credential basis. The view sorts the combined records by their start or completion date.",
          "Responders can inspect their own permitted evidence. Other readers need the appropriate person and domain scope. CSV export does not bypass that access, and reading a transcript does not grant access to student answers or every certificate file."
        ],
        "diagram": "learn-transcript-evidence"
      },
      {
        "id": "changes",
        "title": "Corrections, required revisions, and readiness",
        "paragraphs": [
          "A change to evidence needs a traceable effect. Grade or attendance corrections can make a previously completed course incomplete. DART preserves the award and adds a Rejected training revision when verified credit is withdrawn.",
          "A different course administrator can later review a credit correction. Restoring Verified status requires every required lesson version to be complete. Expired credit cannot be restored; it needs new training.",
          "Publishing a new course version does not invalidate all earlier training. An administrator can request a minimum required version with an effective date and authority. A different approver must review it. Earlier credit remains saved while the new requirement is communicated.",
          "Readiness checks use the current evidence and the applicable rules for the requested dates. An expired or rejected dependency can change that result. Correcting training does not erase the earlier qualification decision or silently issue a new one."
        ]
      }
    ]
  },
  {
    "slug": "incidents",
    "group": "Response operations",
    "title": "Incidents and command structure",
    "description": "Set up an incident and define its work. Connect duty stations to staffing needs and the people assigned.",
    "sections": [
      {
        "id": "lifecycle",
        "title": "Create an incident with rules and dates",
        "paragraphs": [
          "An incident is the shared record for a response. It names the mission, responsible organization, dates, and time zone. Its saved deployment policy controls the operational checks used for that incident.",
          "A coordinator can create an incident directly under an approved, effective policy. It begins as Planned. Starting it changes it to Active; an Active incident is required before a deployment order can be drafted.",
          "The template path adds two separate reviews. A coordinator saves a template version, and a different approver approves that version. The coordinator then saves a dated incident draft from an approved template and submits the setup for review.",
          "A different incident approver reviews that saved draft. Approval checks that the draft’s author still has coordinator access, then creates the incident, units, and staffing needs together. Saving or submitting the draft creates no orders.",
          "This template path starts with a remote reporting location in UTC and virtual staffing needs. Coordinators can add the physical stations and other needs required by the response. The saved setup retains the template version and approved structure.",
          "A parent event can group related incidents of the same kind in the same organization. Exercise workspaces create exercises, so practice does not become an operational incident."
        ],
        "diagram": "ops-incident-setup"
      },
      {
        "id": "structure",
        "title": "Connect units, duties, and supervision",
        "paragraphs": [
          "A unit describes a part of the incident’s work. It has a mission, operating times, duty station, and supervisor. It can sit under a parent unit in the same incident.",
          "An incident duty assigns work to someone who already has a deployment. Its dates must fit inside both the accepted order and the unit’s dates. It can also identify the staffing slot and authorized resource request it fills.",
          "A linked slot triggers another candidate check. The system also adds the person’s other duties and approved training time for each day. A new duty cannot push that total above the incident’s daily work limit.",
          "Ending a duty saves an end record within its original dates. It does not erase the assignment. A filled shared-duty slot cannot be offered to another person for overlapping dates.",
          "Deployment supervision is a dated relationship of its own. Changing the supervisor ends the earlier relationship and starts the next one. The supervisor needs incident authority and cannot be the deployed person.",
          "Incident organization reports reconstruct filled and vacant positions at a chosen past time. They use accepted order revisions and the supervision dates in effect then. Deployment evaluations use those supervision periods, rather than the current supervisor’s name alone."
        ]
      },
      {
        "id": "needs",
        "title": "Turn a staffing need into positions to fill",
        "paragraphs": [
          "A staffing need states what help is required, before anyone is chosen. It names a qualification version, number of people, dates, duty station, and deployment type. Each person needed gets a separate staffing slot.",
          "The dates must stay within the incident. A standard deployment needs a physical duty station; a virtual deployment needs a remote one. Added specialties name their own qualification versions and must pass their own checks.",
          "A personnel resource request can be linked to the need. That request must belong to the incident. Candidate selection later checks its approval and any required supporting-agency acceptance.",
          "A team template groups position requirements and identifies which positions lead the team. It can represent a Team, Force package, or Module. Each requirement can include specialties, while equipment categories have their own counts.",
          "Creating a team request saves an incident team instance that names the chosen template version and creates its staffing needs. This does not select people or issue equipment. Accepted orders add members with their accepted dates, revision, and leader flag.",
          "Equipment requirements keep the distinction between an explicit None and an unknown list. A later template edit does not silently change the team request already created from an earlier version."
        ],
        "diagram": "ops-team-needs"
      },
      {
        "id": "coordination",
        "title": "Approve resource requests before committing people",
        "paragraphs": [
          "A resource request asks for personnel, equipment, or supplies. It records the quantity and unit, needed time, priority, and justification. It can name a supporting agency and an outside reference.",
          "A new request is Submitted. Another authorized person reviews it. If it names a supporting agency, approval needs a mission authorization reference; the supporting agency then records its separate acceptance reference.",
          "Approval and Agency accepted are different states. A staffing need linked to a request cannot proceed through candidate checks until the required state is reached. A request without a supporting agency needs Approved; one with an agency needs Agency accepted.",
          "A follow-on request can link to an earlier approved request in the same incident. The link preserves the relationship between the requests. It does not copy an approval onto unrelated work.",
          "Personnel coverage counts distinct filled slots from accepted orders and dated shared duties active at the chosen time. A draft order or a person’s name on a request does not count as filled coverage.",
          "Status updates and decisions retain their author, reason, reference, and earlier state. Declining or cancelling a request does not itself cancel a deployment order. Operational records still need their own changes.",
          "A shared conversation lets people discuss the incident in context. Access to a thread does not grant access to every linked person, order, or protected file."
        ],
        "diagram": "ops-resource-authority"
      },
      {
        "id": "closure",
        "title": "Change or close the incident without losing open work",
        "paragraphs": [
          "Incident state moves from Planned to Active, then to Winding down. Winding down can return to Active if the response grows again. Closed is the final state in this workflow.",
          "A date change checks active staffing needs and open orders first. The new incident dates cannot leave their saved work outside the response period. Earlier dates and the reason for the change remain in history.",
          "Changing a staffing need also checks its open orders and occupied slots. Removing positions, changing location or type, or withdrawing a need can require those orders to be changed or cancelled first. Withdrawal keeps the earlier need and turns off its slots.",
          "Closing requires every deployment to be Completed. Draft, Submitted, Approved, and Issued orders also block closure. Staff must finish or cancel that work before closing the incident.",
          "Closure pauses the incident’s automatic due-item jobs. It does not delete orders, accepted team memberships, visits, or review history. Equipment and return checks are handled through each deployment’s completion workflow."
        ],
        "diagram": "ops-incident-close"
      }
    ]
  },
  {
    "slug": "staffing",
    "group": "Response operations",
    "title": "Responder selection and staffing",
    "description": "Compare responders against a staffing need. Save the evidence and the reason for the choice.",
    "sections": [
      {
        "id": "need",
        "title": "Check a responder against the saved staffing slot",
        "paragraphs": [
          "A candidate check asks whether one person can fill one staffing slot for its requested dates. The slot supplies the qualification version, station, and deployment type. The comparison uses only people and protected records the coordinator may inspect.",
          "The main qualification and every added specialty must meet readiness requirements over the whole period. Required training and approved availability matter too. A matching job title by itself does not pass the check.",
          "Scheduling adds checks beyond readiness. Another order or shared duty can already hold the slot. Other deployments can overlap the person’s dates, and a linked person record can reveal a conflict that needs review.",
          "Overlaps have two outcomes. A prohibited combination or two different physical places is a hard block. A combination allowed by incident policy still needs a separate overlap approval. The maximum number of concurrent deployments also applies.",
          "Overlapping classes need a matching approved training-time authorization. Other recorded time away can block the dates. Planning policy adds limits for allowed regions, assignment length, and time between assignments.",
          "The result is Eligible, Needs overlap approval, or Not eligible. A reason for selecting someone cannot override a hard block. Checks are saved with their dates, source evidence, policy versions, and station."
        ],
        "diagram": "ops-candidate-check"
      },
      {
        "id": "comparison",
        "title": "Rank only eligible people with confirmed history",
        "paragraphs": [
          "Eligibility and ranking answer different questions. Eligibility checks whether a person can do the work. Ranking orders eligible people using the incident’s approved selection rules.",
          "An approver chooses Less deployment time or Longer since deployment and sets the history period. Less deployment time compares recorded days. Longer since deployment compares the latest recorded deployment time. A fixed draw for the staffing slot breaks ties.",
          "Only Eligible people with confirmed history receive a rank. People needing overlap approval form a separate group. Unconfirmed history remains unranked; it is never counted as zero deployment time.",
          "The workload calculation uses actual station visits and saved past-time entries within the comparison period. Overlapping time is counted once. A station visit inside that period still counts when its accepted order dates began earlier.",
          "A confirmation must cover the displayed history period and match the current facts. Missing visit records prevent confirmation. A later correction or changed evidence can invalidate an earlier history review."
        ],
        "diagram": "ops-history-ranking"
      },
      {
        "id": "history",
        "title": "Review and correct missing deployment history",
        "paragraphs": [
          "A missing record can make workload comparisons misleading. A supervisor or approver can inspect someone else’s history, add past deployment time, and name the source used to support it.",
          "Past-time entries need a start before the end and cannot extend into the future. An entry can point to a saved deployment for that person or record work outside DART. Linked person identities are included in the history check.",
          "A correction creates a new entry linked to the latest saved one. Removing a wrong entry also adds a revision marked void. Neither action deletes the earlier account or its reason.",
          "After missing work is resolved, a different reviewer confirms the displayed history. The confirmation saves the source, reason, date range, and a fingerprint of the facts checked. Changed facts or rules require another inspection before confirmation."
        ]
      },
      {
        "id": "trainees",
        "title": "Supervised trainees and training during duty",
        "paragraphs": [
          "A Training deployment can support someone still working on a qualification. It needs an open task book for the same qualification version and a dated trainee authorization for the incident.",
          "A different approver records the permitted duties and supervisor. The supervisor must have current incident supervision authority, and the trainee cannot supervise themselves. The authorization must cover the proposed dates.",
          "The candidate check can then set aside only the main qualification reason. Required training, approved availability, added specialties, and schedule checks still apply. Acceptance records the assigned trainee supervisor; it does not award the qualification.",
          "Permission to attend a class during duty is a different authorization. A supervisor approves a scheduled class for the person, incident, and station, with the class version and teaching times saved.",
          "That class must fit within one incident-local day. Class hours, other approved training, and assigned duties must fit the daily work limit. The authorization does not enroll the person, finish the class, or waive admission rules."
        ],
        "diagram": "ops-trainee-gate"
      },
      {
        "id": "decision",
        "title": "Save the choice and review the current comparison",
        "paragraphs": [
          "Choosing a responder creates a Draft order and saves the comparison that supported the choice. The incident must be Active, selection rules must exist, and the responder cannot be Not eligible. The reply deadline must be in the future.",
          "The saved comparison includes candidate checks, confirmed history, ranks, and policy versions. It records the chosen person and selection note. Choosing anyone below first rank, or with no rank, needs an explanation.",
          "Submission runs the candidate checks and comparison again. An approver different from both the order’s creator and its named responder reviews the current comparison. The approval must match the exact comparison displayed.",
          "If an allowed deployment overlap remains, the approver must explain it separately. A selection note does not remove the overlap rule or permit a prohibited schedule.",
          "Issue and acceptance compare the current evidence with that approval again. Changed readiness, selection rules, history, or comparison facts can require a new order revision and review. The earlier saved comparison stays available for inspection.",
          "An approved choice is not a deployment. The order must be issued, and only the named responder can accept it before its reply deadline."
        ],
        "diagram": "ops-selection-review"
      },
      {
        "id": "fairness",
        "title": "Make the selection policy and exceptions visible",
        "paragraphs": [
          "Selection rules are saved for the incident, with a version, approval authority, reason, and approver. New rules add a version instead of replacing the basis of an earlier choice.",
          "The configured ranking method helps reviewers compare workload. It does not claim that missing records prove a person has had less work. That is why history review and ranking remain separate.",
          "A coordinator may choose an eligible person below first rank, but must explain the choice. The approver sees the current comparison and records their own selection explanation. Unranked choices need the same explicit review.",
          "Saved order history keeps the comparison used at selection and approval. Reviewers can follow the evidence behind an exception after the workforce or rules have changed. The system records the decision; the program owner supplies the approved policy."
        ]
      },
      {
        "id": "planning",
        "title": "Compare possible staffing before sending orders",
        "paragraphs": [
          "Surge planning explores competing staffing needs before people are committed. It uses a saved workforce snapshot and policy version, so scenarios can be compared on a stated basis.",
          "A planning result does not hold a slot, issue an order, or promise that someone will still be available. The operational candidate and order checks must run when the coordinator acts.",
          "Decision replay reconstructs the basis of an earlier staffing choice from saved records. A new candidate check uses current facts. A later record can explain a difference without rewriting the original selection.",
          "The saved evidence includes its data cutoff. That date matters when comparing a past explanation with a current result. Surge planning and decision replay describe those separate workflows in more detail."
        ]
      }
    ]
  },
  {
    "slug": "deployments",
    "group": "Response operations",
    "title": "Deployment orders and travel",
    "description": "Review an order before it reaches a responder. Follow the accepted assignment through travel and return.",
    "sections": [
      {
        "id": "orders",
        "title": "Draft, review, issue, and answer an order",
        "paragraphs": [
          "A deployment order offers a named responder a position for stated dates and a duty station. The coordinator drafts it from a staffing slot after checking the person and saving the selection comparison. Even a draft can hold the person or slot against competing orders for those dates.",
          "The order moves from Draft to Submitted, then Approved and Issued. Submission rechecks eligibility. Approval needs a different person from both the creator and the responder, plus the current comparison and any allowed overlap reason.",
          "Issuing sends the responder a notice that the order is ready for reply. It also rechecks the evidence and comparison against the approval. If the facts have changed, the order needs revision and review instead.",
          "Only the named responder can accept or decline the Issued order. The reply deadline must not have passed. A delivered notification is not a reply, and an expired offer cannot start a deployment.",
          "Acceptance saves the accepted revision and creates the deployment on the first acceptance. It also creates the required daily checks and end steps. A team order adds the member against that accepted revision.",
          "A coordinator can cancel before travel or work starts. Once the deployment has started, cancellation is blocked and the end-deployment workflow must be used. Cancellation keeps the decision and its notice in history."
        ],
        "diagram": "ops-order-lifecycle"
      },
      {
        "id": "revisions",
        "title": "An extension is a proposal until it is accepted",
        "paragraphs": [
          "An accepted order and a proposed revision are separate facts. An extension creates a new Draft revision, which must pass submission, separate approval, issue, and the responder’s reply again.",
          "Until the responder accepts that revision, the earlier accepted dates remain the deployment’s dates. The proposal itself does not change the accepted period used by the deployment or its scheduled checks.",
          "An accepted order can be extended without changing its original start or station. It cannot be shortened through the amendment form. A station change uses a planned move; an early end uses an end plan.",
          "If the responder declines an extension, the earlier accepted revision stays in force. The declined proposal and reply remain in history. A Completed deployment cannot be extended. When due-item processing expires an unanswered extension, it also returns the order to its earlier accepted revision.",
          "Standard, Virtual, and Training deployments still follow their type and scheduling checks. Successive work also checks assignment-length and rest limits. A new revision cannot bypass those limits."
        ],
        "diagram": "ops-extension"
      },
      {
        "id": "itinerary",
        "title": "Review travel plans separately from actual travel",
        "paragraphs": [
          "An itinerary records the planned journey, including places, travel mode, departure and arrival, lodging, booking status, and reporting details. A coordinator, supervisor, or travel planner can save it for a deployment.",
          "Each change adds an itinerary revision with a reason. Arrival cannot precede departure. An old revision number cannot overwrite a newer plan.",
          "A different approver reviews the latest itinerary. The author cannot approve their own plan, including through a linked person identity. Each plan version can receive only one review decision.",
          "Itinerary approval does not start travel, record an arrival, or accept a deployment order. Those are separate actions. The earlier journey plans and decisions remain available after a replacement is saved."
        ]
      },
      {
        "id": "travel",
        "title": "Record travel and visits in their actual order",
        "paragraphs": [
          "Actual travel starts from an Accepted deployment and changes it to Traveling. Starting travel creates the relevant daily checks. A responder can also check in directly when no separate travel start is needed.",
          "Check-in uses the planned duty station and a time within the accepted order dates. It cannot be in the future or before the last checkout. There can be only one open visit for the deployment.",
          "A physical visit cannot overlap the person’s visit at a different physical place. An open visit must be checked out before another begins. These checks remain separate from an approved order overlap.",
          "Checking in makes the deployment Active. Checking out closes that visit. Without an end plan, checkout returns the deployment to Traveling; with an end plan, it changes to Returning.",
          "A coordinator or supervisor can plan a station move of the permitted type. Planning does not close the current visit or claim that the responder has arrived. The responder still checks out and then checks in at the new station.",
          "A time correction preserves the earlier visit and reason in history. It cannot open a closed visit, close an open one, or create overlapping visits. Check-in and checkout remain the actions that change visit state."
        ],
        "diagram": "ops-visit-path"
      },
      {
        "id": "demobilization",
        "title": "Complete the end plan, not just the end date",
        "paragraphs": [
          "Demobilization is the checked process for ending a deployment. A coordinator or supervisor sets a planned end while the person is Active or Ending. The end time must fit inside the accepted period and cannot be in the past.",
          "The end plan changes the state to Ending. Required end steps must be completed or marked Not needed with a reason. An evaluation-assigned step checks that a review obligation exists unless its exception is recorded.",
          "Checkout after an end plan changes the state to Returning. When the policy requires return confirmation, staff record the actual return after checkout and no later than now. The planned return is not proof of the actual return.",
          "Final completion checks outstanding equipment, every open end step, and all daily checks whose reply windows have opened. Required deployment evaluations must also be submitted when the incident policy calls for them.",
          "An unfinished order revision blocks completion too. The order must be Accepted on its accepted revision. The person must be checked out, have an end plan, and be Returning.",
          "Passing those checks changes the deployment to Completed and closes its open supervision period. Future pending daily checks are cancelled. Reaching an order’s last date does not perform these actions by itself."
        ],
        "diagram": "ops-demobilize"
      },
      {
        "id": "rotation",
        "title": "Link a replacement without transferring the old order",
        "paragraphs": [
          "A replacement connects the outgoing deployment to another person’s order. The outgoing person needs an end plan first. The incoming order must be open and for the same qualification type.",
          "The incoming person must be different. Their own order still follows selection, review, issue, and acceptance. Linking the replacement does not transfer the old responder’s acceptance or credentials.",
          "The link records who made it and why. It lets staff follow the handover while preserving the separate orders and deployment histories. The outgoing person’s completion checks still apply."
        ]
      },
      {
        "id": "history",
        "title": "Keep accepted dates and corrected facts traceable",
        "paragraphs": [
          "The deployment record connects its accepted order to actual travel, station visits, supervision, duties, and end steps. Each event records who acted and the facts changed. Saved selection comparisons remain attached to their decisions.",
          "Time away has its own dated status records. A correction or void keeps the earlier entry and affects current scheduling checks. Sensitive status details remain limited to the permitted readers.",
          "Authorized staff can correct visit times after completion without reopening the deployment. Corrections must still preserve visit state, accepted arrival dates, and non-overlapping visits.",
          "Reports distinguish accepted commitments from proposed changes and actual visits. Earlier order revisions stay saved after a later acceptance. A draft extension is not evidence that someone accepted more time."
        ]
      }
    ]
  },
  {
    "slug": "accountability",
    "group": "Response operations",
    "title": "Responder accountability",
    "description": "Follow daily safety checks. See who has replied and which responses need follow-up.",
    "sections": [
      {
        "id": "checks",
        "title": "A daily check is a dated request for a reply",
        "paragraphs": [
          "A daily check asks a deployed person to confirm their status for a particular local day. It has an opening time, reply due time, and escalation time. These come from the incident’s saved policy and time zone.",
          "First acceptance creates checks for the accepted deployment period. Starting travel also creates the relevant checks. Due-item processing keeps checks current for people still Traveling, Active, Ending, or Returning, including work that continues past the planned end.",
          "A check cannot be answered before its opening time. Once open, the responder can reply even after the due time, provided the check and deployment are still open. A stale version cannot overwrite a later reply.",
          "A notice or delivery receipt is not a response. Responded is a saved action on the check. A closed check cannot be answered again, and a Completed deployment cannot receive a new reply."
        ],
        "diagram": "field-daily-check"
      },
      {
        "id": "exceptions",
        "title": "Report a problem and keep review separate",
        "paragraphs": [
          "An exception request records why the usual check-in could not be completed. It is not an approved exception. The responder chooses the problem category; Other also needs a short explanation.",
          "A supervisor can reply for the person, but must explain the proxy reply. The record identifies both the subject and the person who acted. Private reply details remain limited to the authorized readers.",
          "A different supervisor reviews an exception or resolves the open check with a reason. The responder cannot approve their own exception. Exception approved and Resolved are closing decisions, separate from Exception requested.",
          "The history retains the reported problem and follow-up action. Sending another notice does not replace that review or close the check."
        ],
        "diagram": "field-exception"
      },
      {
        "id": "followup",
        "title": "Find due work without inventing a response",
        "paragraphs": [
          "Due-item processing expires unanswered order offers, updates checks for ongoing deployments, and identifies missing replies for escalation. It also creates deployment review obligations when the supervision rule calls for them.",
          "A coordinator or supervisor can run the check. An automatic job has an enabled state and interval, with a saved history of its runs. Closing the incident pauses those jobs.",
          "Escalation records that a reply needs follow-up. It does not state that the person is safe, approve an exception, or supply their answer. A later authorized reply or supervisor decision still closes the check.",
          "Deployment completion checks all reply windows that have opened, not just those already overdue. Each needs a response, approved exception, resolution, or cancellation before final closure."
        ]
      },
      {
        "id": "reports",
        "title": "Read the due time, state, and evidence together",
        "paragraphs": [
          "Accountability reports show each check’s local day and due time alongside its saved state. An unanswered check, requested exception, and approved exception describe different work and must not be collapsed into a single completed count.",
          "A live view uses current facts. A saved report queues a build and keeps the resulting file, definition, and build time. Later replies do not rewrite that saved result.",
          "Incident scope and record protection still apply when the worker builds the report and when a reader downloads it. A saved report cannot grant access to another incident’s checks."
        ]
      }
    ]
  },
  {
    "slug": "locations-rest",
    "group": "Response operations",
    "title": "Locations, time, and rest",
    "description": "Track where people have worked and for how long. Use that history to review time at a location and rest needs.",
    "sections": [
      {
        "id": "places",
        "title": "Separate a person’s location record from an actual visit",
        "paragraphs": [
          "A residence of record, permanent duty station, and temporary duty assignment describe where a person is based. They have dates and a saved place identity. A deployment visit instead records actual arrival and departure.",
          "Authorized editors record or correct a person’s location assignments. A correction links to the earlier version rather than erasing it. Shared place definitions also have versions, so an address correction can be traced.",
          "A canonical location gives a place a stable identity across records. Its kind, time zone, and policy area support later calculations. Matching display names alone is not enough to combine places.",
          "Private address lines are shown only to the person and permitted editors. Other readers may receive a reduced location view. Medical leave details are also reduced for readers without the required access."
        ]
      },
      {
        "id": "duration",
        "title": "Count occupied time and explain the source",
        "paragraphs": [
          "Time at a place comes from intervals with a known start and end. An open visit ends at the review’s cutoff for calculation purposes. Future time and invalid intervals do not add to the total.",
          "The cumulative view groups visits by location identity and physical or remote kind. Overlapping intervals in the same group count once. The output retains visit and deployment IDs behind the total.",
          "A location-policy review can use actual visits or dated temporary assignments as its source. That choice is part of the approved rule, not a guess made by the report.",
          "The rule can group places by location or policy area. It sets whether remote time counts, how nearby periods join, and whether duration means occupied time or elapsed time. Those choices can produce different findings."
        ],
        "diagram": "field-location-time"
      },
      {
        "id": "rest",
        "title": "A gap between orders is not proof of rest",
        "paragraphs": [
          "Rest review distinguishes recorded time away from time that has no supporting record. Between deployments, the calculation clips the permitted status intervals to the gap and counts overlaps once. The remaining hours stay unverified.",
          "The approved rest rule chooses which statuses count. It sets minimum recorded hours and the largest permitted unverified gap. A finding marks a gap for review when either limit is missed.",
          "A within-deployment rule can also check periods without enough recorded rest. This uses the current versions of status records tied to the deployment. Unknown time does not silently become rest.",
          "These evidence checks differ from the planning policy’s minimum days between assignments. Planning limits affect a proposed assignment; the location review explains the recorded time and its sources."
        ],
        "diagram": "field-rest-evidence"
      },
      {
        "id": "zones",
        "title": "Use the place and date context saved with the work",
        "paragraphs": [
          "An incident-local day, a dated location assignment, and an actual timestamp serve different purposes. Operational visits keep actual times. Availability and incident checks interpret dates in their saved time zones.",
          "Changing a place definition keeps a new version and a reason. It does not rewrite the recorded arrival time. Daylight-saving changes must be handled through the relevant zone rather than a fixed clock offset.",
          "A source record must provide the place identity or policy area required by the rule. Missing facts are a reason to check the source, not permission to assume a location."
        ]
      },
      {
        "id": "policy",
        "title": "Approve examples before applying a location rule",
        "paragraphs": [
          "A personnel steward drafts the organization’s location and rest rules with a source reference and expected examples. A different policy approver checks the latest draft. The examples are checked both when drafted and when approved.",
          "A review needs the approved rule and the source records at its cutoff. Each work period needs one unambiguous residence or permanent-duty origin, as the rule requires. An actual-visit rule stops if required deployments have no visit record.",
          "The saved result keeps its policy version, input snapshot, source fingerprint, and review cutoff. Later source changes are flagged instead of rewriting the earlier result.",
          "A finding is a policy review to inspect against its sources. It does not automatically change a responder’s qualification, approve a benefit, or certify compliance with an agency rule."
        ],
        "diagram": "field-location-review"
      }
    ]
  },
  {
    "slug": "equipment",
    "group": "Response operations",
    "title": "Equipment accountability",
    "description": "Track issued equipment and its holder. Review an item before it returns to service.",
    "sections": [
      {
        "id": "custody",
        "title": "Record the handover and the assignment it supports",
        "paragraphs": [
          "An equipment item has a stable identity, current state, condition, and event history. Issue and transfer record the holder and handover time. The next event cannot be dated before the last saved change.",
          "Only an Available item in Good condition can be issued. Transfer needs an Issued item in Good condition and a different holder. The holder must belong to the equipment’s organization.",
          "A linked deployment must belong to that holder, remain open, and match the selected incident. The incident must be open and within the manager’s access. A team link must identify a team in that incident.",
          "A held item can be linked to the holder’s open deployment without inventing another handover. Exercise and operational equipment remain separate. The return due date cannot precede the handover."
        ],
        "diagram": "field-equipment-custody"
      },
      {
        "id": "readiness",
        "title": "Return or recover the item, then inspect it",
        "paragraphs": [
          "Returning an Issued item clears its holder and assignment links and moves it to Inspection. Recovering a Missing item follows the same inspection path. Neither action makes the item immediately ready to issue.",
          "Inspection records the condition and permitted next state. Available requires Good condition. An item still Issued, Missing, or Retired cannot be inspected back into service through this action.",
          "A defect report marks the condition Damaged. A held item keeps its custody; an unissued item moves to Repair. Reporting the defect does not erase who still has it.",
          "Marking an item Missing keeps its holder and deployment links. Outstanding Issued or Missing items still linked to a deployment block final completion. Recovery, an appropriate transfer or return, or an approved loss must resolve the remaining custody."
        ],
        "diagram": "field-equipment-inspect"
      },
      {
        "id": "loss",
        "title": "Review a loss against the exact missing-item record",
        "paragraphs": [
          "A loss request applies only to a Missing item. It needs a published, effective loss-review rule for the organization and a case reference. Operational property cannot use the exercise-only rule.",
          "The reviewer must have loss-review authority and be different from both the request’s author and the holder. The decision must name the current request event; a changed item requires a new review.",
          "Before approval, supporting files are checked again for release, access, and the saved hash. A changed or withdrawn file prevents approval against the earlier evidence.",
          "Approval retires the item and clears its holder, deployment, incident, and team links. Returning the request leaves the item Missing. Every request and decision stays in the item’s history."
        ],
        "diagram": "field-equipment-loss"
      },
      {
        "id": "replacement",
        "title": "Approve a replacement, then issue a matching reserve item",
        "paragraphs": [
          "A replacement starts with a held item whose condition is not Good. A missing item can qualify because its condition is Unknown. There cannot already be an unresolved replacement request.",
          "Another person reviews the request. Approval does not itself hand over a new item. Fulfillment selects a different item in the same organization and category, then uses the normal issue checks.",
          "The issued replacement uses the current holder and assignment links of the original item. A replacement that is unavailable or not in Good condition cannot bypass issue rules.",
          "Fulfillment is recorded once. The original item still needs its own return, repair, recovery, or loss decision. A broader incident resource request can ask for equipment, but it does not replace this item-level custody record."
        ],
        "diagram": "field-equipment-replacement"
      },
      {
        "id": "reports",
        "title": "Reconstruct custody from saved events",
        "paragraphs": [
          "The equipment view shows current custody and its supporting events. A historical report can reconstruct the item at an earlier cutoff, while a change report shows events within the selected period.",
          "Report scope and protection still apply to the item and supporting files. A private file is not exposed just because the item is visible. Downloads check the reader’s access and the file evidence again.",
          "Exercise equipment retains its separate use kind in reports. A saved report keeps its result at build time; later handovers appear in new reports instead of changing the earlier file."
        ]
      }
    ]
  },
  {
    "slug": "planning",
    "group": "Analysis and planning",
    "title": "Surge planning and decision replay",
    "description": "Test whether the workforce can meet competing needs. Compare policies and inspect earlier staffing choices.",
    "sections": [
      {
        "id": "surge",
        "title": "Competing incidents share one workforce",
        "paragraphs": [
          "Several incidents can draw on the same people at the same time. A surge simulation tests whether people can cover competing incident needs. The planner defines the positions and number of people required. Each need has dates and an arrival deadline.",
          "The planner chooses which regions may supply staff. The simulation checks qualifications and availability against the selected policy. It does not count a person twice for incompatible work.",
          "The saved run checks arrival choices between each need’s first day and arrival deadline. It records candidate evaluations, tentative assignments, competing incidents, and remaining shortages.",
          "People are reserved within the simulation so incompatible needs do not reuse the same time. This is a scenario result, not a dispatch optimization guarantee or a reservation in the live order workflow."
        ],
        "diagram": "review-surge"
      },
      {
        "id": "policy",
        "title": "Compare deployment policies",
        "paragraphs": [
          "Rules about rest and assignment length can change how much work the team can cover. A policy draft sets rest days and maximum deployment duration. It also identifies the regions in scope. Staff can compare drafts against the same workforce snapshot.",
          "Approval and activation are separate actions. Both keep their history. Changing a planning policy does not rewrite accepted deployment orders.",
          "A different approver reviews a saved policy version. Activation requires that approval and an effective date that has arrived. Rollback selects an eligible approved version and keeps a separate event.",
          "A policy comparison runs both rule sets against the same saved snapshot and requests. This isolates the rule change from later changes in the workforce."
        ],
        "diagram": "review-policy"
      },
      {
        "id": "forecast",
        "title": "Look ahead at readiness",
        "paragraphs": [
          "A team that is ready today may have gaps in the weeks ahead. Readiness forecasts look ahead 30, 60, or 90 days. They show where future needs may exceed the ready workforce. Owners can receive a notice about the result.",
          "A saved forecast keeps its inputs and rules. Later workforce changes do not rewrite the earlier result.",
          "The forecast evaluates the snapshot at today and at 30, 60, and 90 days. It groups results by region, dated unit membership, and qualification version, with reasons for people who do not meet the checks.",
          "Alerts are created from a saved forecast for authorized readiness owners. They point to the saved result; they do not renew a credential or make an unavailable person deployable."
        ]
      },
      {
        "id": "templates",
        "title": "Turn a reviewed template into an incident draft",
        "paragraphs": [
          "An incident template is a saved starting structure with its own version and approval. A coordinator chooses an approved version, supplies dates, and saves an incident setup draft.",
          "A different approver reviews the submitted setup. The author must still have coordinator access. Approval creates the incident, a remote UTC reporting station, named units, and virtual staffing needs.",
          "The result begins as Planned. Physical stations and other operational needs can be added through their own controls. No responder is selected and no deployment order is issued by saving the template or draft."
        ]
      },
      {
        "id": "replay",
        "title": "Reconstruct a staffing decision",
        "paragraphs": [
          "An earlier staffing result can be hard to explain once the underlying records have changed. Decision replay reconstructs a staffing choice from its saved facts. A reviewer can inspect the eligibility explanation.",
          "Saved scenarios can also be compared. Replay shows the earlier decision basis. A new assessment uses current facts.",
          "Replay reads saved candidate checks, operation events, and delivery history. It checks access to the incident and referenced people, qualifications, deployments, courses, and files before exposing the result.",
          "The reconstructed record preserves occurred time and recorded time. It does not rerun the earlier choice as though today’s facts were available to the original decision-maker."
        ],
        "diagram": "review-replay"
      }
    ]
  },
  {
    "slug": "analytics",
    "group": "Analysis and planning",
    "title": "Analytics, reports, and workforce history",
    "description": "Build reports from the records you may read. Keep saved results that can be checked later.",
    "sections": [
      {
        "id": "report-builder",
        "title": "Choose fields, filters, groups, and totals",
        "paragraphs": [
          "Different roles ask different questions about the same operational records. The report builder lets a user choose fields and filters. Results can be grouped and sorted. Totals help answer questions about the selected records.",
          "Report definitions cover operational work and workforce history. A user can inspect current staffing or look at earlier results. Each definition applies the access rules for its records.",
          "The preview applies the selected layout to authorized source records and returns up to 200 displayed rows with the full row count. Saving the setup keeps the definition, filters, and layout; it does not freeze the underlying data."
        ],
        "diagram": "review-report"
      },
      {
        "id": "dashboards",
        "title": "Personal dashboards with operational context",
        "paragraphs": [
          "A person needs a quick way to return to the information they use most often. My work lets users choose report cards and arrange their dashboard. Filters can limit a view to a region or incident. Available choices depend on the person’s permissions.",
          "DART checks those choices when the dashboard is saved or refreshed. A saved layout cannot grant broader access.",
          "A dashboard card retains its report filters and chosen fields. Save, refresh, and download each recheck the relevant organizations and incident scope. A layout is a personal view, not a permission assignment."
        ]
      },
      {
        "id": "snapshots",
        "title": "Save a fixed report result",
        "paragraphs": [
          "Staff may need to keep the exact result they used for a decision. Saving a report creates a background job. The request keeps its filters and scope. The worker checks the owner’s current rights before building and saving the result.",
          "The saved file keeps the same contents after source records change. Its hash helps verify that the file has not changed. Downloading the file checks access again.",
          "A user can compare two saved reports. The report history explains when each result was built and which rules it used.",
          "The report worker claims a leased job, renews that claim while building, and rechecks rights before saving. It stores the CSV, content hash, build time, and report definition together.",
          "A comparison reads the two saved files under current access. It can explain changed rows and totals without silently rebuilding either source report from today’s records."
        ],
        "diagram": "review-report-job"
      },
      {
        "id": "history",
        "title": "Historical workforce reporting",
        "paragraphs": [
          "Looking only at today’s workforce can hide changes that matter over time. Workforce history reports show counts at a past time and averages over a period. Staff can compare cadres and disasters. Incident organization reports show the structure for a chosen time.",
          "The DHS history score has its own report workflow. Agency formulas must be checked against the selected definition. A current name label may differ from a fact saved in the historical record.",
          "Historical workforce reporting names the dates examined and the time by which facts had been saved. Later hires, transfers, identity links, and training corrections must not be treated as earlier knowledge.",
          "A confirmed zero differs from missing history. The selected score version supplies the formula, and the saved report retains that basis instead of applying a newer formula to the old file."
        ]
      },
      {
        "id": "forecasting",
        "title": "Staffing and training needs",
        "paragraphs": [
          "Reporting can help teams prepare for gaps as well as describe current work. Staffing forecasts compare demand with workforce evidence. Training-needs reports identify learning gaps. Outcomes reports help staff review what training achieved.",
          "A live report can refresh current status. A saved report preserves a fixed result. Users can choose the form that fits the question.",
          "A staffing forecast evaluates recorded needs against dated workforce evidence. Its potential coverage is an estimate from those records, not a commitment of people. Training demand links missing learning to the relevant requirement versions."
        ]
      }
    ]
  },
  {
    "slug": "evaluation",
    "group": "Analysis and planning",
    "title": "Evaluation and results",
    "description": "Review recorded tests and live-data examples from the DART application. See what was checked and what the results show.",
    "sections": [
      {
        "id": "evidence",
        "title": "What these evaluations cover",
        "paragraphs": [
          "A capable system needs to show that its workflows work under review, retries, and changing records. DART has saved evaluations for those cases. This page explains selected results recorded in October 2026.",
          "The saved evaluation records include automated tests and live public-data examples. Each result belongs to a dated run and a defined setup. The downloadable evaluation summary retains the counts and the limits of those runs.",
          "These are application evaluations. They do not establish an agency production authorization or a measured capacity for a disaster-scale deployment.",
          "The downloadable evaluation summary states when each run was recorded and whether follow-up was focused or broad. Rechecking this guide does not turn those saved results into a newly executed application test."
        ]
      },
      {
        "id": "integration-checks",
        "title": "Imports, exports, and delivery receipts",
        "paragraphs": [
          "A connection needs to behave correctly when a reply is lost or the same message arrives again. The October 16 evaluation checked automatic data exchanges and provider receipt handling.",
          "The final focused runs passed 56 service checks and 21 HTTP checks. Four native PostgreSQL checks and seven browser checks also passed. Each layer tested a different part of the workflow.",
          "The earlier broad run had three failures and one skipped check across 594 tests. The three failures were fixed and passed in focused follow-up runs. The entire broad suite was not rerun. The evidence summary preserves this distinction.",
          "Receipt matching, replay behavior, and review gates answer different questions from throughput. The displayed test counts should be read with their scope and the preserved initial failures."
        ],
        "evaluation": "checks"
      },
      {
        "id": "live-data",
        "title": "Live source data through the operational workflow",
        "paragraphs": [
          "A source is useful when operators can trace its data through mapping and into the work screen. An October 18 example read a live NOAA water-level record. The source value of 1.31 meters was mapped to 4.298 feet.",
          "The record was applied and published to a page in a separate test workspace. Repeating application retained the Applied result. The same evaluation also captured 91 Wikimedia stream events and published 91 records while retaining the last event ID.",
          "A separate USGS example combined eight records from two public requests. Table, map, chart, and card views each exposed the eight records. Repeated publication added no duplicate records. An exact record match could be undone without discarding the source.",
          "These examples used real public sources with separate local test accounts. They demonstrate data capture and use. They do not claim a live FEMA interface.",
          "A mapped public record remains traceable to its capture and import. Publication exposes the configured view; it does not make an outside reading an approved operational decision."
        ]
      },
      {
        "id": "guided-work",
        "title": "Guided work and recovery",
        "paragraphs": [
          "Guidance needs to help someone continue when they return to an unfinished task. The October 18 NOAA walkthrough record contains 509 steps across 21 parts. It records recovery checks for a wrong account and a wrong work view.",
          "The workflow reopened a saved API and selected its saved full capture. It also linked records and completed a task. An outbound test reached an HTTP echo service in one attempt.",
          "The source values were real NOAA readings. Limit-crossing tests used clearly marked controlled values in a separate review. The echo result proves HTTP delivery to the test service, not completion of an agency case.",
          "A guide records progress through controls, while the user performs each real action. A successful walkthrough demonstrates that path and its recovery cases, not every possible provider or account setup."
        ]
      },
      {
        "id": "incident-exercise",
        "title": "An incident through deployment and return",
        "paragraphs": [
          "An incident workflow needs to reach the end without losing the people or equipment it tracks. A saved October 14 Hurricane Isaias exercise finished with the incident Closed. It recorded 35 completed deployments and 35 returned deployments.",
          "The same run checked access boundaries. An ordinary person could not run the bulk exercise action. Cross-origin writes were rejected. The exercise case was hidden from the main workspace.",
          "The exercise used synthetic records and bulk controls to advance the scenario. This result demonstrates the saved workflow outcome. It does not measure 35 people using the system at once.",
          "The stored completion result should be read alongside the synthetic scenario and bulk-control scope. It does not establish response times, concurrent-user limits, or live incident performance."
        ],
        "table": {
          "headers": [
            "Recorded check",
            "Result"
          ],
          "rows": [
            [
              "Completed deployments",
              "35"
            ],
            [
              "Returned deployments",
              "35"
            ],
            [
              "Incident state",
              "Closed"
            ],
            [
              "Bulk action without the required role",
              "403 — denied"
            ],
            [
              "Cross-origin write",
              "403 — denied"
            ],
            [
              "Exercise case in the main workspace",
              "404 — hidden"
            ]
          ]
        }
      },
      {
        "id": "browser-checks",
        "title": "Browser and accessibility checks",
        "paragraphs": [
          "People need the same work controls to remain usable across their supported browsers. The October 14 record reports ten accessibility/browser checks passing in each of Chromium, Firefox, and WebKit.",
          "The saved work also includes course and notice regression checks. An order-to-return workflow passed in the recorded regression run. These checks used fresh local test databases.",
          "Automated checks do not replace complete screen-reader testing or Section 508 acceptance. The agency evaluation needs to test its actual devices and assisted workflows.",
          "Workflow acceptance should include the rejected path as well as the successful one. Losing permission, using a stale form, and retrying a saved action are distinct cases that can change the expected result."
        ]
      },
      {
        "id": "deployment-evaluation",
        "title": "Evaluate the intended deployment",
        "paragraphs": [
          "The next evaluation should use the organization’s work and its selected services. Follow the accepted order through field activity and return. Inspect the saved history and the reports used to make decisions.",
          "Load and recovery tests must use the intended environment. Set the expected surge and measure the response. Test lost connections, delayed jobs, and backup restoration against agreed outcomes.",
          "Record the application version, environment, provider configuration, test roles, source cutoff, expected outcome, and observed result. That makes a failed or accepted case reproducible for the delivery team."
        ]
      }
    ]
  },
  {
    "slug": "integrations",
    "group": "Data and development",
    "title": "Data integration and exchange",
    "description": "Bring outside records into DART. Check proposed changes and keep the source behind each result.",
    "sections": [
      {
        "id": "capture",
        "title": "Keep the original input",
        "paragraphs": [
          "Personnel and training information may already be held in other systems. An integration brings records from another system into DART. Source adapters read the data. Automatic exchanges can import or export defined operational records.",
          "DART keeps the original input and its source ID. If the same change ID arrives with different data, the conflict is held for review. The later copy does not replace the first without a record.",
          "API captures retain the response and the connection revision used to read it. A complete capture can support a preview; a sample or incomplete capture is not enough to apply a full import."
        ],
        "diagram": "review-import"
      },
      {
        "id": "mapping",
        "title": "Map and check before applying",
        "paragraphs": [
          "Two systems can describe the same fact with different field names or formats. A designer reads a sample and maps its fields. Cleanup steps can convert a value or split a list into records. Extra source fields can be kept under their own names.",
          "The preview shows what would change. Staff check record matching and source ownership before applying the batch. The original data and review history stay available.",
          "Preview saves a change plan and its fingerprint. A different reviewer approves the import. Apply rechecks the plan, current source-row versions, code basis, and reviewer access before committing the changes.",
          "Reusing the same applied import returns its saved Applied result. Changed mapping or source facts need a new capture or preview, rather than overwriting the earlier plan."
        ]
      },
      {
        "id": "authority",
        "title": "Review data rights and security",
        "paragraphs": [
          "A working connection needs clear limits on what its source is allowed to change. Connection setup states which source may supply which facts. It names the service account and its scope. Secrets are stored on the server.",
          "A data-authority reviewer and a security reviewer approve the saved setup. Connections start paused. Approval alone does not start them.",
          "Revoked access stops later work. A code change can also require another review before an exchange continues.",
          "The connection’s creator or editor cannot supply its own authority or security approval. The two reviewers must also be different people. Their decisions name the current connection revision.",
          "Scheduled capture additionally needs an active capture-service principal for that revision. Starting and publication remain separate from obtaining reviews."
        ]
      },
      {
        "id": "operations",
        "title": "Run jobs and check receipts",
        "paragraphs": [
          "A connection can fail after a request is sent, leaving staff unsure what happened. Workers process saved jobs. Staff can inspect held records and failed attempts through integration health.",
          "A retry uses the same saved input. Wrong source fields need a corrected source record. They are not repaired by repeatedly sending the old one.",
          "Outbound exchanges keep the sent payload and receiver receipt. An uncertain send has a receipt-check path. A receipt is separate from proof that the receiving system applied the data.",
          "A code-review request can pause an exchange and invalidate its previous approved basis. The replacement review binds the current application artifact and settings before processing can continue.",
          "An unclear outbound result needs receipt reconciliation or a retry-safe path. Repeated sends must not invent a receiver acknowledgment or silently produce another outside action."
        ],
        "diagram": "review-exchange"
      },
      {
        "id": "interfaces",
        "title": "Connect agency interfaces during deployment",
        "paragraphs": [
          "A named agency system has its own data rules and connection requirements. An agency connection is mapped to its real interface. The agreement identifies authoritative fields and stable IDs. It also defines authentication and failure handling.",
          "The agency supplies the interface details and access. The delivery team tests the mapping and checks the result. The application tools do not imply that a named government system is already connected.",
          "A source agreement should identify the exact records and revisions supplied, the fields it owns, and the local changes it must not overwrite. Import checks are useful only when those ownership rules match the real interface."
        ]
      }
    ]
  },
  {
    "slug": "integration-studio",
    "group": "Data and development",
    "title": "Integration Studio and connected applications",
    "description": "Build pages and rules around connected data. Link outside records to the work they affect.",
    "sections": [
      {
        "id": "types",
        "title": "Describe the connected record",
        "paragraphs": [
          "An outside data source becomes more useful when its records have a clear meaning in DART. Integration Studio defines the kinds of records supplied by an API. An API is a way for systems to exchange data. A custom record type gives the incoming fields a useful structure.",
          "Typed links connect that data to DART records. For example, a weather alert can link to a duty station. The source record stays available behind the link.",
          "A type gives fields their required values and formats. Objects retain their source and version. A link can relate two records while preserving each record’s identity and protection.",
          "One custom type can combine records from approved APIs. Field ownership remains explicit, so a local action cannot rewrite an API-owned field. Source changes reach those fields through a checked import."
        ],
        "diagram": "review-studio"
      },
      {
        "id": "pages",
        "title": "Place data in the operational view",
        "paragraphs": [
          "Operators need to see outside information beside the work it affects. A custom page chooses which fields to show and how to sort them. Connected data can appear beside an incident or person. It can also appear on an equipment or station page.",
          "Staff publish an import after checking and applying it. Settings define how old data may be before it is treated as stale. Updates can be paused when needed.",
          "A page must belong to the published connection revision and be enabled for use. Editing settings does not make the new revision live. Readers still need access to each selected object and linked native record.",
          "Configured views can present records as tables, maps, charts, or cards. The chosen fields and geometry must exist in the typed data. A published view does not supply a missing source value."
        ]
      },
      {
        "id": "rules",
        "title": "Rules that create operational work",
        "paragraphs": [
          "Some source changes need attention without waiting for someone to notice them on a page. A rule checks a mapped value against a condition. For example, it can test whether a water level is above a set limit.",
          "The result can create a task or inbox notice for named people. A trigger decides whether it runs once or when a value changes. A limit-crossing trigger acts when the reading passes the boundary.",
          "Rules can combine conditions, require a condition to hold, or wait through a cooldown. A held condition needs another committed observation; a timer alone does not create fresh source evidence.",
          "A crossing trigger must be armed again by the reset condition before firing another crossing. Recipients need access to both the connection and the linked work before a notice or task is created."
        ],
        "diagram": "review-rule"
      },
      {
        "id": "actions",
        "title": "Controlled custom actions and outbound sends",
        "paragraphs": [
          "A connected workflow may need to send a request back to another system. Designers can create custom actions and API send actions. Sends are queued with their payload and result. Staff can inspect the history.",
          "Connections support OAuth sign-in. They can also receive signed webhooks or event streams. The selected provider supplies the required credentials and access rights.",
          "An action must be listed on a published page for the correct object type. The selected object version is checked, and a repeated request returns its saved action result only when the input matches.",
          "Record matches can be linked, rejected, or undone against their current fingerprint. Retrying an outbound delivery requires current settings and a destination marked safe to retry; Failed and Unclear do not automatically mean no outside effect occurred.",
          "A page action can create a manual record without an existing selection. Typed steps can create, update, link, tag, archive, or restore records. A later step failure rolls back the action’s local changes."
        ],
        "diagram": "review-action"
      },
      {
        "id": "examples",
        "title": "Weather and water-level workflows",
        "paragraphs": [
          "A worked example helps show how capture, mapping, and rules fit together. The help tasks include a National Weather Service alert connection. Training guides also include a worked NOAA integration. These examples follow the data from capture to use.",
          "A water-level field can be converted from meters to feet. A link places it beside the relevant record. A rule can create a task when the reading crosses a chosen level.",
          "The worked source remains visible behind the mapped value and task. A unit conversion, record link, rule observation, and completed task each leave separate evidence, so the operator can inspect where the result came from."
        ]
      }
    ]
  },
  {
    "slug": "developer-tools",
    "group": "Data and development",
    "title": "APIs, terminal, and read-only MCP",
    "description": "Use DART through its APIs and command tools. The same access rules apply to the work screens and these tools.",
    "sections": [
      {
        "id": "api",
        "title": "Application APIs",
        "paragraphs": [
          "Developers may need to work with the same records through code instead of a screen. DART provides APIs for its main areas of work. They use the same user identity and access rules as the screens.",
          "Write commands validate fields before saving. Operations, readiness, and other supported command paths use request IDs to keep retries from creating duplicate actions.",
          "Version checks stop old data from overwriting newer work. A command must satisfy the rules for the record it changes.",
          "The operations and readiness write routes require a same-origin request. Each body is limited to 64 KB. Errors include a code and a reference ID for support.",
          "A request ID is part of the command’s retry contract. Sending different fields with an already-used ID is rejected in the supported command paths; it is not a way to amend the saved action."
        ],
        "table": {
          "headers": [
            "Interface",
            "Purpose"
          ],
          "rows": [
            [
              "GET /api/operations",
              "List incidents the signed-in user may read."
            ],
            [
              "GET /api/operations?incident_id=…",
              "Open the selected incident and its permitted records."
            ],
            [
              "GET /api/readiness?view=people",
              "List people within the user’s readiness scope."
            ],
            [
              "GET /api/readiness?person_id=…",
              "Read a person’s readiness evidence and allowed actions."
            ],
            [
              "GET /api/readiness?view=assessment&…",
              "Check a qualification for the requested dates and time zone."
            ],
            [
              "/api/equipment",
              "Read or change equipment within the user’s role."
            ],
            [
              "/api/reports",
              "Build and download reports within current access."
            ],
            [
              "/api/planning",
              "Run planning and inspect saved results."
            ],
            [
              "/api/mcp",
              "Read authorized records through the read-only tool interface."
            ]
          ]
        }
      },
      {
        "id": "terminal",
        "title": "DART commands and shell work",
        "paragraphs": [
          "Some users prefer commands for repeated or file-based work. The terminal lets a user run DART commands. It also supports shell files and file transfers. Command history shows what was requested and returned.",
          "Commands use the same application interfaces as the work screens. Opening the terminal does not grant extra permissions.",
          "DART command parsing treats quoted fields as data. The separate shell path has its own user/workspace session and restricted file area. A shell file is not permission to write any application record."
        ]
      },
      {
        "id": "mcp",
        "title": "Read-only MCP access",
        "paragraphs": [
          "A compatible assistant or tool can help inspect records without being allowed to change them. MCP lets a compatible tool read DART through a defined set of actions. This interface is read-only. It can search and inspect records the user is allowed to read.",
          "A signed-in user can create a short-lived MCP key. The key is tied to their person and session. It stops working when it expires or is revoked.",
          "The server checks current access for each read. An expired session or inactive sign-in identity blocks the key.",
          "The MCP key lasts 30 minutes. Its defined tools are search, read_record, and list_incidents. It does not expose a write tool or treat assistant instructions as a role grant."
        ],
        "diagram": "review-mcp"
      },
      {
        "id": "extension",
        "title": "Define the connection before building it",
        "paragraphs": [
          "A person using a screen and a service running on a schedule have different access needs. A service exchange uses a reviewed connection and service account. It has different needs from a person using a work-screen API.",
          "Before connecting a system, define its IDs and field ownership. Agree on retry behavior and errors. Keep enough evidence to compare the source with the result.",
          "A human session and a reviewed service principal have different lifetimes and responsibilities. Define the caller, scope, source identity, and replay contract before choosing the endpoint or scheduling its worker."
        ]
      }
    ]
  },
  {
    "slug": "communications",
    "group": "Platform operations",
    "title": "Messages, calls, and notifications",
    "description": "Discuss work with the right people. Track messages and replies without confusing delivery with a response.",
    "sections": [
      {
        "id": "inbox",
        "title": "An inbox for operational notices",
        "paragraphs": [
          "An operational message is most useful when it leads to the work that needs attention. The inbox collects operational notices. A user can open the related work or save the notice for later. Preferences control the notices they receive.",
          "A notice may ask for an acknowledgment or written reply. The sender can inspect those responses. Reading it does not accept an order or finish a daily check.",
          "The sender’s requested acknowledgment and written reply are saved separately from read state. Following the related-work link still checks access to that record; replying to a notice does not substitute for the record’s required action."
        ],
        "diagram": "review-notice"
      },
      {
        "id": "groups",
        "title": "Direct, team, and cross-organization conversations",
        "paragraphs": [
          "The people who need to discuss a task may span several teams. Chats can be direct or group conversations. A group can include several teams or organizations. Owners can change membership and close or reopen the group.",
          "Messages can include files and pictures. Users can also send links or reply in a thread. File downloads still require the right access.",
          "Membership determines who can participate in the conversation. Changes to ownership, closure, or membership are checked on the server. A picture or file also keeps its file-release and download rules."
        ]
      },
      {
        "id": "records",
        "title": "Share the work with its context",
        "paragraphs": [
          "A conversation is easier to follow when the people in it can open the work being discussed. A shared conversation connects discussion to a record. Staff can share work such as an incident or class. The reader must still have access to the underlying record.",
          "Sharing a link does not make personnel data public. Record protection continues to apply.",
          "The shared record and its conversation keep separate permissions. A participant may be able to read the discussion while still being unable to open a protected attachment or personnel record referenced there."
        ]
      },
      {
        "id": "calls",
        "title": "Audio and video",
        "paragraphs": [
          "Some work is easier to resolve in a live conversation. Users can start or join audio and video calls. Call controls let them mute the microphone or turn off the camera. The GovCloud call path includes caption controls.",
          "Calls depend on the configured provider and network route. Deployment tests confirm that the intended users can connect and use the required media features.",
          "A call uses the conversation’s current membership. The operational provider path requires enabled GovCloud call configuration; a local exercise call is not proof that the live media route is connected.",
          "The host or group owner controls caption changes. Joining a call, changing media, leaving it, and ending it are separate recorded actions."
        ]
      },
      {
        "id": "delivery",
        "title": "Queued email and text with receipts",
        "paragraphs": [
          "When a notice matters, staff need to know whether delivery failed or a person has yet to answer. Email and text jobs keep each send attempt. Provider receipts show the delivery result. Duplicate or late receipts remain tied to the right attempt.",
          "A failed send has a retry path. Delivery evidence stays separate from the person’s reply. A delivered safety message is not a completed safety check.",
          "A provider callback is matched to a saved send attempt. A duplicate event with the same data returns its saved receipt; changed data under that event ID is rejected.",
          "A late receipt for an older retry stays in history without changing the newer attempt. Live receipts cannot confirm a test send, and provider delivery never supplies a user’s reply."
        ],
        "diagram": "review-receipt"
      }
    ]
  },
  {
    "slug": "security-access",
    "group": "Platform operations",
    "title": "Identity, permissions, and access",
    "description": "Control who can read or change records. Give each person access for the work and dates they need.",
    "sections": [
      {
        "id": "identity",
        "title": "Sign in through an approved provider",
        "paragraphs": [
          "Before DART can allow an action, it needs to know who is asking. Federated sign-in lets a person use an approved identity provider. DART supports OpenID Connect for this exchange. The provider proves the identity, then DART checks the mapped person.",
          "The sign-in flow checks state and uses PKCE to protect the exchange. Sessions are held on the server and expire. Logout and identity suspension end access.",
          "The agency chooses its authentication rules. These may include a PIV or CAC card and multi-factor authentication. Changing a contact email does not transfer the sign-in identity.",
          "The identity mapping uses the provider’s issuer and subject, not the contact email as a login key. The callback validates the saved sign-in flow before creating a server session for an active mapped identity."
        ],
        "diagram": "review-signin"
      },
      {
        "id": "permissions",
        "title": "Permissions with dates and scope",
        "paragraphs": [
          "Knowing who someone is does not tell the system everything they may do. A permission set states what a person may do. An administrator can assign it with dates and scope. Assignments can be changed or revoked.",
          "Scope limits where the permission applies. It may cover an organization or a single incident. Some readiness roles can be limited to a person or qualification.",
          "Roles remain separate. A task evaluator is not automatically a certifier. An equipment manager is not automatically a loss reviewer.",
          "Permission editing has a preview showing the before and after state and affected assignments. Save must match that preview token. Invalid scope combinations need separate permission sets.",
          "Changing a set rechecks the active assignments affected by added capabilities. The system also protects against removing the last active permission administrator."
        ]
      },
      {
        "id": "requests",
        "title": "Access requests and assignment review",
        "paragraphs": [
          "A person’s responsibilities can change while they are using the system. Staff can request access for review. An authorized person decides the request. The decision and later changes remain in history.",
          "A job title alone does not grant access. DART checks the current permission and the record’s protection rules.",
          "A request expresses a need for access; it does not activate a grant. The assignment must name supported capabilities, dates, and scope within the administrator’s authority. Its later revocation remains visible."
        ]
      },
      {
        "id": "review",
        "title": "Independent approval where the decision requires it",
        "paragraphs": [
          "Some decisions need a second person to check the work before it takes effect. Some actions need a different reviewer. An order author cannot approve that order. A person holding missing equipment cannot approve their own loss.",
          "Reviews apply to the exact saved request. If the request changes, it may need another review. Approval does not start a paused connection or accept an order for someone else.",
          "Independent review is enforced by the specific workflow. A qualification evaluator, order approver, connection reviewer, and records manager check different facts; a broad job title cannot replace those permissions."
        ]
      },
      {
        "id": "workers",
        "title": "Access is checked again later",
        "paragraphs": [
          "Access can change between a request being made and the work actually running. DART checks access again when delayed work runs. That includes report builds and source imports. File downloads also check current rights.",
          "Revoking a permission can stop a job that was requested earlier. Database setup uses a separate account from the running application.",
          "A short-lived MCP key still needs its active sign-in session, and a report owner still needs access when a queued build runs. A saved request is evidence of intent, not permanent authority."
        ]
      }
    ]
  },
  {
    "slug": "records-privacy",
    "group": "Platform operations",
    "title": "Record protection, privacy, and retention",
    "description": "Set handling rules for sensitive information. Keep records for the required period and review removal.",
    "sections": [
      {
        "id": "protection",
        "title": "Labels, access, and export limits",
        "paragraphs": [
          "Some information needs tighter handling than the rest of a shared work record. Record protection sets handling rules for a record or file. DART can apply CUI labels. CUI means government information that needs special handling.",
          "Protection rules limit who can read or export the data. Those rules also apply to reports and connected data. Dashboard access does not override them.",
          "Handling rules can name readers, exporters, markings, and tags. The database-backed check distinguishes a denied record from a prohibited combination. Linked records and saved copies carry the relevant protection into later use."
        ],
        "diagram": "review-protection"
      },
      {
        "id": "aggregation",
        "title": "Control combinations of sensitive data",
        "paragraphs": [
          "Separate pieces of information can reveal something sensitive when they are brought together. Combining records can reveal information that each record alone does not show. DART can block configured combinations and restrict exports.",
          "The agency defines which combinations are prohibited. It also supplies its handling categories and sharing rules. The application checks the configured policy.",
          "A permitted row can still be blocked when combined with another protected type under a configured rule. Export is checked as its own mode; permission to read a screen is not permission to download its combined contents."
        ]
      },
      {
        "id": "retention",
        "title": "Schedules and holds",
        "paragraphs": [
          "Records may need to stay available for a set period or an ongoing review. A retention schedule states how long a record should be kept. Authorized staff can set its retention date.",
          "A hold stops disposal through the removal workflow. Staff can place or release a hold with a reason. The decision remains in history.",
          "The retention assignment names a schedule version and authority. A record must meet its inactivity and retention conditions before disposal. Holds on parent or linked records can stop removal too."
        ]
      },
      {
        "id": "disposition",
        "title": "Review removal before applying it",
        "paragraphs": [
          "Once a record reaches its disposal date, staff still need to check whether removal is allowed. Record removal starts with a request. A reviewer checks it before removal can be applied.",
          "DART checks the retention conditions and any holds. Removal is not an unrestricted delete action.",
          "The removal request saves the exact record plan and known copies. A different records manager reviews it. Apply rechecks both managers’ current authority, dates, holds, copies, and plan fingerprint.",
          "New copies, changed rows, or a changed rule require a fresh request. Removal is transactional: a mismatch stops the planned removal rather than leaving only part of it applied."
        ],
        "diagram": "review-disposal"
      },
      {
        "id": "files",
        "title": "Private files and release checks",
        "paragraphs": [
          "A file needs both a known owner and a clear record of the checks it has passed. A file keeps its owner and access rules. Its hash helps verify that the contents have not changed. Scan and release results stay attached to the file.",
          "Download checks the file again. The deployment supplies private storage and malware scanning. It also defines backups and key handling.",
          "File release and record access are separate checks. A released file can still be protected, and a visible record can still refer to a file that has been withdrawn. An earlier successful download does not make the next one automatic."
        ]
      }
    ]
  },
  {
    "slug": "exercises",
    "group": "Platform operations",
    "title": "Exercises and contingency planning",
    "description": "Rehearse incident work in a separate workspace. Review the results and assign follow-up actions.",
    "sections": [
      {
        "id": "plans",
        "title": "Plan the exercise",
        "paragraphs": [
          "An exercise gives a team a way to rehearse an incident before it happens. An exercise plan defines the practice event. Managers assign participants and scenarios. The plan is marked ready before the exercise starts.",
          "A controller releases each scenario. The exercise keeps its own history and data protection rules.",
          "Ready requires at least one scenario and participants with Controller and Evaluator roles. Changing the plan resets it to Draft, and the plan cannot be edited after the exercise starts."
        ],
        "diagram": "review-exercise"
      },
      {
        "id": "results",
        "title": "Capture results and follow-up",
        "paragraphs": [
          "Practice is useful when its lessons turn into work someone will follow up. Staff record results for review. Follow-up work can be assigned to named people. Completion stays visible before the exercise closes.",
          "The help includes a synthetic Hurricane Isaias exercise. It is a training example. It does not describe a live agency response.",
          "A controller releases a Pending scenario while the exercise is Running. An evaluator records its result only after release. Every scenario needs a result before the exercise can enter Review.",
          "Follow-up actions in Review have named participant owners and evidence of completion. All must be Done before the planner can close the exercise."
        ]
      },
      {
        "id": "isolation",
        "title": "Keep exercise and operational work apart",
        "paragraphs": [
          "An exercise must not be mistaken for an operational assignment. Exercise workspace access must be assigned. Exercise equipment cannot be linked to operational incidents. The environment and database settings maintain the boundary.",
          "A simulation estimates an outcome. An exercise rehearses a workflow. Neither action issues a real deployment order.",
          "Database environment binding and assigned exercise entry protect the boundary. Exercise equipment cannot support an operational incident, and outside delivery receipts are disabled for the exercise environment."
        ]
      },
      {
        "id": "continuity",
        "title": "Use exercises to test the operating plan",
        "paragraphs": [
          "A rehearsal can test how the team responds when the normal workflow is interrupted. An exercise can follow staffing through deployment and return. Staff can test missing replies or equipment problems. The results lead to assigned follow-up work.",
          "Infrastructure recovery needs its own tests. The selected deployment must test backups and provider failures. The exercise workflow records operational practice and its results.",
          "A complete rehearsal should include an unresolved check, a rejected review, and recovery from changed facts. The exercise retains those outcomes and follow-up evidence; infrastructure restore tests remain separate evidence."
        ]
      }
    ]
  },
  {
    "slug": "user-experience",
    "group": "Platform operations",
    "title": "Access, devices, and languages",
    "description": "Use DART across supported devices. Work with local times and configured language options.",
    "sections": [
      {
        "id": "workspace",
        "title": "One workspace, scoped to the user",
        "paragraphs": [
          "People should be able to move between work areas without learning a new set of controls. DART uses the same navigation and record controls across its work areas. Search finds records the user may read. Opening a result takes the user to the related work.",
          "The available views depend on permissions. A responder sees different actions from a coordinator or instructor.",
          "Search results are scoped before display. Opening a result runs the record’s own access checks again, so an older result cannot keep access after it has been revoked."
        ]
      },
      {
        "id": "devices",
        "title": "Responsive access",
        "paragraphs": [
          "A responder in the field may use a different device from a coordinator at a desk. The web screens adapt to desktop and smaller displays. Tables and record dialogs keep the work together. The agency’s supported devices and browsers are tested during acceptance.",
          "Access from outside the agency network needs an approved route. Identity and provider connections must work across that route.",
          "On smaller screens, large tables and diagrams need their own contained scrolling. Keyboard focus, labels, dialogs, and the full task path still need device-level verification; a responsive layout alone is not an accessibility result."
        ]
      },
      {
        "id": "offline",
        "title": "Scoped offline responder access",
        "paragraphs": [
          "Optional offline access prepares the responder’s own permitted open deployments. The saved copy includes relevant station, supervision, reporting, and limited check information. It is not an offline administrator account.",
          "The feature must be enabled for the site. A session defaults to 15 minutes and cannot exceed 30. A new download revokes the prior active session; the responder can also revoke their active session.",
          "The device stores an encrypted vault rather than a plaintext account cache. The unlock key stays in memory. This local protection does not extend the server session or make a queued action accepted.",
          "Arrival, Availability, and Acknowledgment are the supported queued kinds. Sync checks the person, session expiry, permissions, action time, and matching input again. A changed deployment version returns Needs review instead of overwriting it.",
          "Arrival uses the assigned station and the normal check-in rules. Offline availability becomes a new UTC request that still needs review. An acknowledgment does not accept an order or complete a daily check."
        ],
        "diagram": "review-offline"
      },
      {
        "id": "language",
        "title": "Language choices and time zones",
        "paragraphs": [
          "Teams may need help reading the interface in a language they use more comfortably. English is always available. The language selector can use AWS GovCloud Translate for saved interface text. Names and notes remain as written.",
          "The agency reviews translated text for its chosen languages. Time zones remain part of scheduling and availability records.",
          "The translation service accepts only allowlisted interface text and checks that field placeholders are preserved. It does not accept arbitrary record notes for translation. If the configured service is unavailable, the interface can retain English."
        ]
      },
      {
        "id": "accessibility",
        "title": "Accessibility in the delivery workflow",
        "paragraphs": [
          "Users need to complete their work with the input methods and assistive tools they rely on. The interface supports keyboard use and labeled controls. Guided help points to the real work screen.",
          "Section 508 review tests complete workflows with the required tools. Its report must state which version was tested. Automated checks alone do not establish agency acceptance.",
          "Acceptance should name the actual browser, assistive tool, role, and application version. Test completing and rejecting a task, not just reaching its first button. Record any remaining barriers with the tested scope."
        ]
      }
    ]
  },
  {
    "slug": "help-support",
    "group": "Platform operations",
    "title": "Help, training, and support",
    "description": "Find a task and follow it on the real work screen. Report a problem or request an improvement.",
    "sections": [
      {
        "id": "guides",
        "title": "Guidance on the real controls",
        "paragraphs": [
          "A person learning a task needs help at the point where they are doing the work. Help & support lets a user search for a task. The guide points to the control they need. They can go back or exit at any time.",
          "The user performs the real action. A guide does not submit it for them.",
          "The task library below comes from the application’s help catalog. These steps run inside DART. The controls available to each user depend on their permissions.",
          "A guide follows real selectors and waits for the user’s action. Progress can be resumed, but the current control and permission must still exist. A walkthrough cannot approve or submit work by itself."
        ],
        "guideLibrary": true
      },
      {
        "id": "documentation",
        "title": "Video and task-based learning",
        "paragraphs": [
          "A walkthrough can provide context before a user starts the task themselves. The documentation library includes a platform video with chapters. Related help tasks lead from the explanation to the work screen.",
          "Worked examples cover integrations and exercises. Role-based training can follow the same tasks people will use in their jobs.",
          "The chaptered video provides context, while the task guide points to the live control. A worked example should identify its source, workspace, and expected result so a learner can distinguish practice from operational evidence."
        ]
      },
      {
        "id": "requests",
        "title": "Support requests, bugs, and improvements",
        "paragraphs": [
          "A user needs a clear route to ask for help when a guide does not solve the problem. Users can create a support request and follow its progress. They can report a bug or suggest an improvement.",
          "Support agents handle requests within their assigned scope. Leads have separate permissions. The support agreement defines coverage and escalation.",
          "Optional diagnostic attachment records consent and includes a limited application version, page path, and request reference. An error reference is checked against that requester’s audit context rather than copying unrelated logs.",
          "Agents can reply, route, assign, escalate, and update status within their scope. A support ticket does not itself grant access or approve a software release.",
          "Resolution requires a public answer from someone other than the requester. Private staff notes support the case without being presented as the user’s answer. Help articles have their own versioned publication path."
        ],
        "diagram": "review-support"
      },
      {
        "id": "changes",
        "title": "From feedback to a controlled release",
        "paragraphs": [
          "Feedback should lead to a change that can be tested and reviewed. A system change can be an improvement, upgrade, or patch. Staff record tests before approval and release. A rollback has its own history.",
          "User feedback and performance reports help identify the work. The change record connects the issue to its tests and release.",
          "The change moves through Planned, Testing, Ready, Approved, and Released. Ready requires passing latest results for the tests saved against that change version.",
          "Approval needs a manager different from the owner and the person who marked it Ready. A released change can be marked Rolled back with a reason; the record tracks that decision rather than deploying code by itself."
        ],
        "diagram": "review-release"
      }
    ]
  },
  {
    "slug": "architecture",
    "group": "Federal and delivery",
    "title": "Architecture and operations",
    "description": "Understand how DART runs. See where the application connects to the database and outside services.",
    "sections": [
      {
        "id": "application",
        "title": "The application and database",
        "paragraphs": [
          "The screens people use are one part of the system that keeps their work consistent. DART uses Next.js and React for its web application. Server-side JavaScript applies the rules. PostgreSQL stores the operational records and their history.",
          "The main work areas have separate services. Each service checks its own commands and permissions. The database also protects saved versions and events from being overwritten.",
          "Application startup checks the database environment binding. Versioned migrations keep checksums; changing a migration already recorded as applied is rejected. Schema setup is separate from ordinary record commands."
        ],
        "diagram": "review-architecture"
      },
      {
        "id": "work",
        "title": "Saved background jobs",
        "paragraphs": [
          "Some tasks take longer than the user should need to wait on a page. Background jobs handle work that can finish after a request returns. A report build is one example. Notification delivery and source capture also use saved jobs.",
          "A worker checks the saved request before running it. It checks current access where the workflow requires it. Held jobs remain available for review and retry.",
          "Report jobs use a claim and lease so a worker must still own the job when it saves the result. Source and delivery jobs keep their own states and retry evidence. A running process is not proof that its queued work succeeded."
        ]
      },
      {
        "id": "services",
        "title": "Connected services",
        "paragraphs": [
          "The application relies on other services for work such as sign-in and message delivery. The deployment connects the application to approved services. These include identity and file storage. Communications and translation use their configured providers.",
          "GovCloud adapters are available for the relevant service paths. Each connection needs the right account and network access. Deployment tests verify the chosen setup.",
          "Operational call and translation paths name configured GovCloud providers. File storage, scanning, identity, and delivery need their own accounts and network routes. Test or local adapters are not substituted silently for a missing live provider."
        ],
        "table": {
          "headers": [
            "Boundary",
            "Deployment responsibility"
          ],
          "rows": [
            [
              "Identity",
              "Connect the approved sign-in provider and map each user."
            ],
            [
              "Database",
              "Set the environment and database permissions. Configure backups."
            ],
            [
              "Files",
              "Set up private storage and scanning. Test file recovery."
            ],
            [
              "Workers",
              "Schedule jobs and monitor failures."
            ],
            [
              "Communications",
              "Connect the providers and test delivery and calls."
            ],
            [
              "Monitoring",
              "Send system events to the operations team."
            ]
          ]
        }
      },
      {
        "id": "resilience",
        "title": "Test performance and recovery",
        "paragraphs": [
          "An incident can place more demand on the system than an ordinary working day. Performance records show request times and failures. Staff can review them when planning a change. Test results remain attached to the change record.",
          "Load tests measure the chosen deployment. They should cover incident surges and report workloads. Recovery tests confirm that backups can be restored.",
          "The test results establish operating limits. The presence of retry code alone does not prove surge capacity.",
          "A recovery test should restore a selected backup and verify the record history, files, and worker state needed to resume work. Retrying a command tests duplicate handling; it does not establish a recovery-time commitment."
        ]
      },
      {
        "id": "ownership",
        "title": "Define the production system",
        "paragraphs": [
          "A production system needs clear responsibility for both the software and the services around it. The production plan names who operates each service. It states who controls identities and keys. It also defines how software changes are approved.",
          "An agency authorizes a specific system in a specific environment. The application code is one part of that system. The assessment must also cover its hosting and operations.",
          "The operating plan should name who renews credentials, reviews failed jobs, approves changes, and verifies restore evidence. Those duties belong to the delivered environment and cannot be inferred from a code repository alone."
        ]
      }
    ]
  },
  {
    "slug": "federal",
    "group": "Federal and delivery",
    "title": "Federal capabilities and deployment",
    "description": "Review DART’s federal capabilities. Understand what is configured and assessed for an agency deployment.",
    "sections": [
      {
        "id": "mission",
        "title": "Built for workforce and deployment work",
        "paragraphs": [
          "Federal workforce management needs to connect preparation with the response itself. DART was built around FEMA’s workforce and deployment survey. Its requirements index maps all 61 numbered capabilities across the 17 subtask groups.",
          "An agency evaluation can follow those entries into the working application. Staff can inspect the records and decisions for each workflow.",
          "FEMA’s public notice provides the original request. Its survey workbook describes the capabilities used in this guide. The RFI overview gives the program context.",
          "Implemented checks include version-pinned task books, separate certification, dated availability, bound staffing comparisons, and accepted order revisions. The field workflow continues through visits, safety checks, equipment, and return."
        ]
      },
      {
        "id": "hosting",
        "title": "Government-controlled hosting",
        "paragraphs": [
          "Government buyers need to know where the system and its information will run. FEMA’s survey asks for a FedRAMP High cloud and a government-owned cloud environment. The delivery team must define the selected hosting boundary.",
          "That boundary states which services are approved and where data flows. It also names the people responsible for operating them.",
          "DART includes GovCloud service adapters. Those adapters do not grant a FedRAMP authorization or Authority to Operate. Authorization applies to the assessed agency system.",
          "The architecture separates the web application, PostgreSQL, saved workers, private files, identity, and provider routes. The deployment review must identify the owner and approved location of each boundary."
        ],
        "diagram": "review-boundary"
      },
      {
        "id": "security",
        "title": "Access controls and security review",
        "paragraphs": [
          "The agency needs to see how an application control works within the wider security plan. DART checks identity and access in its application services. Dated permissions limit where a person may act. Private file checks and independent review protect the related workflows.",
          "The delivery team maps these controls to the agency’s security baseline. The assessment also covers network policy and key handling. Logs and security monitoring must be configured for the environment.",
          "A useful assessment traces one actual command from identity through scoped permission and record protection to its saved event. It also tries stale versions, changed reviews, revoked rights, and repeated request IDs."
        ]
      },
      {
        "id": "data",
        "title": "CUI, privacy, and records",
        "paragraphs": [
          "An agency’s information rules continue to apply when records are brought into a new system. DART supports protected records and CUI labels. It can restrict exports and block configured data combinations. Retention schedules and holds govern record disposal.",
          "The agency supplies its handling policy. It identifies which sources own each type of fact. Data migration and integrations are tested against those decisions.",
          "A protected record, an exported report, and an outside copy can have different handling obligations. The records workflow saves copy evidence and checks it again before applying an approved removal."
        ]
      },
      {
        "id": "acceptance",
        "title": "Test the agency deployment",
        "paragraphs": [
          "The agency must be able to check the delivered system against its agreed requirements. Agency acceptance tests the selected version and environment. The tests cover real role boundaries and operational workflows.",
          "Section 508 review checks accessibility. Load tests examine incident surges and slow connections. Recovery and cutover rehearsals check continuity.",
          "Each result needs a clear expected outcome. The saved evidence shows what was tested and what happened.",
          "Application test evidence and agency acceptance are separate records. The acceptance package needs the deployed version and configuration, expected outcomes, actual results, and owners for any unresolved findings."
        ]
      },
      {
        "id": "engagement",
        "title": "Federal delivery and technical engagement",
        "paragraphs": [
          "A delivery needs named people who can build the system and support it in use. USATII’s federal delivery plan assigns responsibility for engineering and program management. It also covers security review and ongoing support.",
          "The published DART jobs are anticipated roles. Hiring depends on an award or approved funding. Those postings do not establish an awarded FEMA contract or a fully staffed team.",
          "The engagement defines the named staff and their responsibilities.",
          "Source owners and agency reviewers are needed alongside software staff. They decide authoritative identifiers, approved policy examples, interface credentials, and the evidence required before operational use expands."
        ]
      }
    ]
  },
  {
    "slug": "implementation",
    "group": "Federal and delivery",
    "title": "Implementation, migration, and cutover",
    "description": "Move from the old system in stages. Check the data and workflows before expanding use.",
    "sections": [
      {
        "id": "discovery",
        "title": "Agree on the work and its rules",
        "paragraphs": [
          "A successful transition starts with understanding how the agency works today. Start with the agency’s real work. Identify who performs each task and who approves it. Agree on the records and reports needed to support it.",
          "The agency supplies approved rules and source-system details. A data dictionary explains each field. Sample exports let the team inspect the records before migration.",
          "Separate the business record, source identifier, authentication identity, and report label in the data dictionary. A shared name or email must not become an automatic identity merge rule."
        ]
      },
      {
        "id": "migration",
        "title": "Move and check legacy data",
        "paragraphs": [
          "Moving records also means preserving the relationships that make them useful. Legacy migration moves records from the old system. The mapping must preserve IDs and relationships. Historical dates and status codes need an agreed meaning.",
          "Pilot batches expose missing data and duplicate identities. The team checks the result against the source. Original inputs stay available for review.",
          "The intake path stages a packet, checks its proposed effects, and requires a different reviewer before applying it. Apply rechecks current scope, source ownership, and record versions in a transaction.",
          "A batch with disputed identities or changed evidence needs a corrected packet or fresh preview. Reconciliation compares the saved source with the applied records; a successful upload alone is not a completed migration."
        ],
        "diagram": "review-migration"
      },
      {
        "id": "pilot",
        "title": "Pilot complete workflows",
        "paragraphs": [
          "A small group can check a complete workflow before the agency expands its use. A pilot follows a complete workflow. It might start with a staffing need and end with a completed deployment. Users test the actions for their actual roles.",
          "Tests also try rejected and interrupted work. An old form should not overwrite a newer record. A revoked permission should stop the next protected action.",
          "Reviewers inspect reports and history alongside the visible result.",
          "Include the end of the workflow in the pilot. An accepted order should lead to dated visits and settled return obligations; a published connection should lead to traceable applied records and checked use."
        ]
      },
      {
        "id": "coexistence",
        "title": "Run both systems during the transition",
        "paragraphs": [
          "An agency may need to keep the old system running while teams move to DART. During coexistence, the old and new systems both remain in use. Each type of record needs one agreed writer. The plan defines how changes reach the other system.",
          "A phased rollout starts with a limited group or workflow. Expansion follows accepted results. The rollback plan states when to stop and how to recover.",
          "The legacy system is retired after reconciliation and retention decisions. Unresolved conflicts need an owner before cutover.",
          "Keep source ownership explicit during parallel operation. Use stable external IDs and revision handling to detect retries and conflicts. Pause or reconcile a disputed source instead of letting two writers silently win in turn."
        ]
      },
      {
        "id": "enablement",
        "title": "Train users and prepare support",
        "paragraphs": [
          "People need to practice the parts of the new system they will actually use. Training follows the tasks people will perform. Responders practice replies and check-in. Coordinators practice staffing and orders. Specialists practice their review workflows.",
          "The support handoff names who handles failures. It also explains how to monitor jobs and restore service. In-app help remains available during daily work.",
          "Use the actual help guides for the chosen roles, including returned requests and changed-data cases. Handoff should include the saved-job history, provider receipts, support routing, and recovery steps the operators will use."
        ]
      },
      {
        "id": "schedule",
        "title": "Set milestones against actual dependencies",
        "paragraphs": [
          "A useful schedule shows what must be ready before the next stage can begin. Delivery milestones follow accepted results. These include working interfaces and checked migration data. Security review and a cutover rehearsal also need clear completion points.",
          "The schedule depends on source quality and agency review. Interface access and approved rules affect it too. Dates are set for the actual program.",
          "A migration milestone needs reconciled records and accepted exceptions. An interface milestone needs a checked round trip and failure path. Each completion point should identify its evidence and approving owner."
        ]
      }
    ]
  },
  {
    "slug": "procurement",
    "group": "Federal and delivery",
    "title": "Procurement and evaluation",
    "description": "Define the evaluation and delivery scope. Agree on costs and ongoing support for the program.",
    "sections": [
      {
        "id": "evaluation",
        "title": "Evaluate the working capability",
        "paragraphs": [
          "A buyer needs evidence that the system can support the work they plan to move into it. Use the requirements index to choose the workflows to evaluate. Agree on the users and input data. State the expected result before running the test.",
          "DART is a custom platform. Agency delivery includes configuration and integration work. A feature in the application is separate from a live agency connection or accepted deployment.",
          "Select complete cases from the capability index and follow their records into reports and history. Include independent reviewers, a retry, changed evidence, and the final completion check in the agreed test scope."
        ]
      },
      {
        "id": "commercial",
        "title": "Define delivery and ongoing costs",
        "paragraphs": [
          "The cost of a delivered system includes both getting it ready and keeping it running. The agreement defines what USATII will deliver and operate. It separates the initial work from ongoing costs.",
          "A one-time cost may cover data migration or a new connection. Recurring costs may cover hosting and support. One-, five-, and ten-year estimates show how those costs change over time.",
          "Pricing is set for the program. This documentation does not publish a per-user federal price or claim a contract vehicle.",
          "The estimate should state data volumes, history depth, provider charges, environments, required interfaces, and operating responsibilities. Those assumptions distinguish a reusable application capability from new program-specific work."
        ],
        "table": {
          "headers": [
            "Cost area",
            "What changes the estimate"
          ],
          "rows": [
            [
              "Implementation",
              "The workflows to configure and the custom work to test."
            ],
            [
              "Migration",
              "The amount of history to move and the data problems to resolve."
            ],
            [
              "Integrations",
              "The source interfaces and the work needed to connect them."
            ],
            [
              "Hosting and security",
              "The approved environment and the controls it needs."
            ],
            [
              "Training and support",
              "The user groups to train and the hours of support."
            ],
            [
              "Sustainment",
              "The ongoing updates and changes to maintain."
            ]
          ]
        }
      },
      {
        "id": "support",
        "title": "Agree on the service model",
        "paragraphs": [
          "Once the system is in use, users need to know who will help and when. The support agreement defines coverage hours and escalation. It states how incidents are reported and how updates reach the customer.",
          "Response and recovery targets need an agreed environment. Tests must show that the setup can support them. Provider and agency responsibilities belong in the same plan.",
          "The agreement should name support hours, severity definitions, escalation owners, and the evidence used to close a case. The built-in ticket workflow tracks the case; it does not set a contractual response time."
        ]
      },
      {
        "id": "risk",
        "title": "Resolve delivery risks early",
        "paragraphs": [
          "A delivery plan should address problems while there is still time to respond to them. Resolve the largest risks early. Poor source data can delay migration. Missing interface access can block integration. Security review can affect activation.",
          "Each risk needs an owner and a test or decision. The plan states what happens if the risk becomes a problem.",
          "Track unavailable source access, unresolved identity conflicts, unapproved rules, and provider setup as named dependencies. Each needs an owner and an accepted resolution rather than an implied feature promise."
        ]
      },
      {
        "id": "contact",
        "title": "Discuss a DART evaluation",
        "paragraphs": [
          "A useful demonstration follows a buyer’s own work rather than a general tour. A DART evaluation starts with the mission workflow and expected users. Bring the relevant source systems and intended hosting environment. USATII can then define a demonstration around the work.",
          "An evaluation scope can identify the required workflows, test data, intended environment, and the people who will review the outcome. Pricing and delivery commitments follow that defined scope."
        ]
      }
    ]
  },
  {
    "slug": "requirements",
    "group": "Federal and delivery",
    "title": "FEMA capability index",
    "description": "Find the DART workflow for each of the 61 capabilities in FEMA’s survey.",
    "sections": [
      {
        "id": "reading",
        "title": "How to use the capability index",
        "paragraphs": [
          "A long requirements list is easier to review when each entry leads to an explanation. This index maps the 61 capabilities in FEMA’s survey to DART. Each entry links to the page that explains the related work.",
          "The short labels summarize the survey. They do not replace its full text. The index describes application behavior, not an agency acceptance decision.",
          "The survey workbook is available directly from SAM.gov. FEMA’s public notice includes the attachments and amendments. The RFI overview explains the request and how vendors were asked to respond.",
          "Each entry names the workflow that supplies the capability. Follow the linked topic for its evidence, review gates, and completion rules. A numbered entry is not itself an authorization to use the system."
        ]
      },
      {
        "id": "capabilities",
        "title": "Capability-by-capability coverage",
        "paragraphs": [
          "The entries are grouped in the same order as the survey, so readers can move between the two. Open an entry to learn how the workflow works. The federal deployment pages explain the agency services and reviews it needs.",
          "The index covers the survey’s 61 numbered entries. Cross-cutting controls such as identity, scope, source traceability, and review still apply when several entries use the same record."
        ],
        "requirements": true
      },
      {
        "id": "beyond-features",
        "title": "Evaluation questions beyond the capability list",
        "paragraphs": [
          "A working feature is only one part of choosing and delivering a government system. The survey also asks about architecture and delivery. It asks how costs and risks will be managed. Those answers depend on the actual program.",
          "An engagement-specific response supplies verified company facts. It names the staff and partners. It also sets prices and delivery dates. Contract terms and security commitments must be agreed for that engagement.",
          "Hosting, provider accounts, approved agency rules, migration reconciliation, performance limits, accessibility findings, and support terms need their own evidence. They cannot be answered solely by showing that a button or endpoint exists."
        ]
      }
    ]
  }
];
export const dartGroups = ["Start here","Workforce","Learning","Response operations","Analysis and planning","Data and development","Platform operations","Federal and delivery"];
export const dartHref = (slug = '') => slug ? `/dart/${slug}` : '/dart';
export const getDartPage = (slug = '') => dartPages.find(page => page.slug === slug);
