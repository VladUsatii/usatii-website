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
          "DART was built around FEMA’s survey for a new Deployment Tracking System. The survey is published with FEMA’s public notice on SAM.gov. DART also supports other emergency management teams that need to prepare people and coordinate their response."
        ],
        "diagram": "platform"
      },
      {
        "id": "prepare",
        "title": "Prepare the workforce",
        "paragraphs": [
          "Preparation begins with knowing who is on the team and what each person can do. Personnel records give each person a stable ID. The record connects to their employment and position history. Source identifiers show which outside systems supplied the data.",
          "Readiness shows whether a person meets the rules for a position. A Position Task Book records the tasks they must complete. Training and certification records show what they have already earned.",
          "People can work with a mentor and follow a development plan. They can take online lessons or attend a scheduled class. Their transcript keeps the results together. Earlier records stay available when a result changes."
        ]
      },
      {
        "id": "respond",
        "title": "Staff the incident and carry the decision into the field",
        "paragraphs": [
          "When an incident needs help, coordinators turn that need into assignments. An incident starts with a need for people. The coordinator defines the positions and dates, then compares responders. The selection view shows who meets the requirements and what might block an assignment.",
          "A deployment order goes to a separate reviewer before it reaches the responder. The responder accepts or declines it. An accepted order starts the deployment record.",
          "During the deployment, DART tracks station visits and daily checks. Supervisors can follow up on missing replies. Equipment stays linked to the person who holds it. Required end steps must be complete before the deployment can finish."
        ],
        "diagram": "deployment"
      },
      {
        "id": "understand",
        "title": "Plan, report, and reconstruct",
        "paragraphs": [
          "A response plan also needs to account for what might happen next. Surge planning tests whether the workforce can meet several incident needs at once. A coordinator can compare rest policies and see where staffing falls short. Readiness forecasts show gaps that may appear in the coming months.",
          "Decision replay shows the facts used for an earlier staffing choice. Saved reports keep a fixed copy of results. Later changes to the source records do not rewrite that copy.",
          "Evaluation results show how DART has been checked with saved tests and live public data. The evidence includes receipt handling and repeat-safe publication."
        ]
      },
      {
        "id": "connect",
        "title": "Connect data without losing its source",
        "paragraphs": [
          "Useful information often starts in systems the organization already uses. Integrations bring outside data into DART. Staff map the fields and check the proposed changes before applying them. The original input stays saved so they can trace a problem to its source.",
          "Integration Studio lets staff build pages and rules around connected data. For example, a water-level reading can appear beside an incident. A rule can create a task when that reading crosses a set limit.",
          "Permissions control who can see or change each record. Record protection adds handling rules for sensitive data. These checks also apply to reports and background jobs."
        ]
      },
      {
        "id": "evaluate",
        "title": "Evaluate DART for your organization",
        "paragraphs": [
          "The clearest way to understand DART is to follow a piece of work from start to finish. Start with a real workflow. Follow a qualification request or a training class. Walk through a staffing decision and an accepted order. Inspect the result and the history behind it.",
          "The federal deployment pages explain hosting and security review. The requirements index maps the 61 capabilities in FEMA’s survey to the work DART supports. It also links to the details needed for an agency evaluation."
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
          "An incident connects people to work. A staffing need says which position must be filled. An order names the person asked to fill it. Once they accept, the deployment tracks their work in the field."
        ],
        "diagram": "relationships"
      },
      {
        "id": "time",
        "title": "Effective time and recorded time",
        "paragraphs": [
          "Staff sometimes learn about a change after it has already happened. A record can have two important times. Effective time says when something happened. Recorded time says when DART learned about it. A late correction keeps that difference clear.",
          "For example, a visit may have ended on Monday but been corrected on Wednesday. The history preserves both dates. A reviewer can see what the system knew before the correction.",
          "Time zones give dates and times their local meaning. Location reports keep remote work separate from physical visits. Overlapping visits are counted once."
        ]
      },
      {
        "id": "rules",
        "title": "Published rules and versions",
        "paragraphs": [
          "Requirements can change while people are still working toward them. A published definition states the rules for a type of work. For example, a task book defines what a responder must complete to earn a qualification. That definition has a version.",
          "When staff publish a new version, earlier work keeps its original rules. This lets a reviewer understand a decision made before the change.",
          "DART also keeps versions of course content and team templates. Deployment policies can be compared before approval and activation."
        ]
      },
      {
        "id": "decisions",
        "title": "Saved decisions and reviews",
        "paragraphs": [
          "When a decision is questioned later, staff need to see how it was reached. A decision is saved with the work it affects. A reviewer can see who made it and why. Earlier decisions remain visible when someone records a correction.",
          "Some decisions need a second person. An order author cannot approve the same deployment order. A connection designer needs separate approval for data rights and security.",
          "DART checks for changes before saving. If another person has already updated the record, the old form cannot overwrite it. Retried commands use the same request ID so an uncertain response does not create a second action."
        ]
      },
      {
        "id": "workspaces",
        "title": "Practice and operational work",
        "paragraphs": [
          "Practice should let people try the workflow without changing live operations. An exercise workspace separates practice from operational work. Staff can rehearse an incident without issuing a real deployment order. Exercise equipment cannot be assigned to an operational incident.",
          "Different records also have different effects. A planning simulation estimates staffing. An accepted order starts a deployment. A delivered message shows delivery. It does not show that the person has answered."
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
          "A new person can be entered with a source ID or added through a checked CSV file. If an email address is already shared, staff review the possible conflict. Matching names alone do not merge people."
        ],
        "diagram": "personnel"
      },
      {
        "id": "organization",
        "title": "Organizations and positions",
        "paragraphs": [
          "A person’s regular job and their role during an incident may be different. A home organization identifies the person’s regular team. Employment records show when their work started or ended. Position assignments show which roles they hold and for which dates.",
          "An incident duty is separate from the person’s regular position. Someone can serve in different roles at different incidents. Each assignment keeps its own scope and history."
        ]
      },
      {
        "id": "corrections",
        "title": "Corrections and identity review",
        "paragraphs": [
          "People change jobs, and records sometimes contain mistakes. A correction saves the earlier value and the reason for the change. It also records who made it. An old form cannot overwrite a newer record.",
          "Staff can review links between duplicate person records. The original records remain available. Linked transcripts and development records can be inspected without losing their source history."
        ]
      },
      {
        "id": "batches",
        "title": "Check a batch before saving",
        "paragraphs": [
          "When many records need the same review, editing them one at a time can be slow. Personnel batches let an editor check many changes before saving them. The preview shows old and new values. It also shows which rows have errors.",
          "DART checks the rows again when the editor applies the batch. If a row is invalid or has changed, the correction batch stops. It does not leave half of the changes saved.",
          "Undo creates a new correction from the earlier values. Staff must review it before applying it. Undo cannot overwrite work saved after the original batch.",
          "The manual correction path accepts up to 200 people in a CSV file under 200 KB. Larger source imports use the integration workflow."
        ]
      },
      {
        "id": "access",
        "title": "Separate profile, employment, and document permissions",
        "paragraphs": [
          "Different staff look after different parts of a person’s record. Permissions separate profile edits from other personnel work. A person allowed to change contact details may not be allowed to change employment or assign a position.",
          "Documents have their own access and file checks. Being able to read a profile does not give someone access to every file attached to it."
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
        "title": "Positions and their requirements",
        "paragraphs": [
          "A position may require more than a job title or past experience. A qualification shows that a person meets the rules for a position. Responders can explore those rules and request the qualifications they want to earn.",
          "A Position Task Book lists the tasks and training required. A responder can work on several task books at once. Each one keeps the version of the requirements it uses.",
          "FEMA’s Position Task Book templates are part of its National Qualification System. They show the tasks a person must demonstrate for a defined position. The organization chooses the approved definitions used in DART."
        ],
        "diagram": "readiness"
      },
      {
        "id": "evidence",
        "title": "Evidence, evaluation, and certification",
        "paragraphs": [
          "A responder needs a way to show that the required work has been completed. Responders submit evidence for their tasks. Evaluators review that evidence and record the result. A certifier makes the qualification decision.",
          "These roles are separate. Completing one task does not award the whole qualification. A mentor relationship does not grant the right to certify someone.",
          "A repeated attempt keeps the earlier work. Renewals also keep the past credential and its dates. Staff can follow the full path to the current result."
        ]
      },
      {
        "id": "availability",
        "title": "Availability over the requested interval",
        "paragraphs": [
          "Having the right qualification does not always mean someone can take an assignment. A responder records when they can and cannot deploy. The dates use their selected time zone. A supervisor reviews changes that need approval.",
          "A readiness check covers the dates requested for the job. Someone may be ready next week but unavailable today. A credential may also expire during the requested assignment.",
          "An interval without evidence is unknown. A pending request does not mean the person is available. Approved dates cannot overlap."
        ]
      },
      {
        "id": "explanation",
        "title": "Understand a readiness result",
        "paragraphs": [
          "A coordinator needs to understand a readiness result before acting on it. The readiness result shows which requirements were met and which were not. Staff can open the training evidence or qualification record behind the result.",
          "Responder selection also checks availability and other deployments. A saved selection keeps the facts used at the time. A later change does not rewrite that decision."
        ]
      },
      {
        "id": "history",
        "title": "Keep the history of credential decisions",
        "paragraphs": [
          "Evidence that supported an earlier decision may no longer be valid. A revoked certification or corrected training result can change readiness. DART keeps the earlier evidence and the later decision. A reviewer can see why the current result differs.",
          "The organization supplies its approved qualification rules. It also assigns evaluation and certification rights. DART applies those rules and records the decisions."
        ]
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
        "title": "Mentor relationships with dates and history",
        "paragraphs": [
          "Learning a new role often involves support from someone with experience. A mentor supports a person’s development. Staff can record when the relationship starts and ends. Meetings and reviews stay attached to that relationship.",
          "Earlier mentors remain in history. Assigning a mentor does not give that person the right to award a qualification."
        ]
      },
      {
        "id": "plans",
        "title": "Individual plans and evidence of progress",
        "paragraphs": [
          "A person working toward a new role needs a clear path to follow. A development plan states what a person is working toward. Goals can link to courses and milestones. The person records progress and supporting evidence.",
          "A reviewer checks the work separately. Linked development records let authorized staff inspect related history."
        ],
        "diagram": "development"
      },
      {
        "id": "evaluations",
        "title": "Deployment performance reviews",
        "paragraphs": [
          "Time in the field can show how well a responder puts their training into practice. Deployment reviews record how a responder performed during an assignment. The review uses the deployment and supervision dates. Incident rules determine when a review is due.",
          "A correction keeps the submitted review. It adds the changed version and the reason. Staff can inspect both."
        ]
      },
      {
        "id": "connection",
        "title": "Development connects to readiness",
        "paragraphs": [
          "Development is easier to follow when goals connect to the work needed to reach them. Development plans can point to the training a person needs for a new role. Readiness checks whether they have met the qualification requirements.",
          "Training-needs reports show where learning is still missing. Program owners can use that information to plan classes and follow progress."
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
        "title": "Maintain a versioned course catalog",
        "paragraphs": [
          "People need to find the right training before they can register for it. The course catalog holds the information people need to find training. Administrators can update a course or mark it inactive. Published versions preserve the content used by earlier classes.",
          "Shared materials also have versions. Before changing a material used in several places, staff can review the impact. They can then update its uses or retire it."
        ],
        "diagram": "learning"
      },
      {
        "id": "admissions",
        "title": "Admission, eligibility, and funding review",
        "paragraphs": [
          "A course may have entry requirements, limited seats, or a funding review. Course registration checks whether a person is eligible. Full classes can use a waitlist. Required forms and funding decisions stay with the request.",
          "Approved rules can enroll new hires or people who need a prerequisite. Each automatic job saves its result. Training alerts can tell people when a course they need becomes available."
        ]
      },
      {
        "id": "schedule",
        "title": "Schedule instruction and record attendance",
        "paragraphs": [
          "Learners and instructors need to know when and where a class will take place. Classes have scheduled sessions and attendance records. Staff can plan classroom or field training. They can also schedule online and virtual classes.",
          "When class times change, affected people can confirm the new schedule. Training time can be reviewed against deployment work. Enrollment by itself does not award course credit."
        ]
      },
      {
        "id": "instructors",
        "title": "Instructor qualifications and outside requests",
        "paragraphs": [
          "Before assigning a teacher, staff need to check that the person is eligible to teach. Instructor records show who may teach a class. Teaching credentials have dates. Outside instructor requests can be reviewed before assignment.",
          "If a credential is revoked, DART keeps that decision in history. Later grading checks the instructor’s right to teach. A new credential must cover the class dates."
        ]
      },
      {
        "id": "materials",
        "title": "Shared materials and controlled files",
        "paragraphs": [
          "Courses often share files that need to stay current and accessible to the right people. The library holds course files and their versions. Students and instructors can submit files through the related learning task.",
          "Files wait in quarantine until they pass the required scan and release checks. Downloads check access again. The deployment supplies the approved file storage and scanning service."
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
        "title": "Course content and progress",
        "paragraphs": [
          "A learner should be able to leave a course and return to the work they have already started. My learning shows a learner’s assigned courses. A course contains lessons and required work. DART saves progress so the learner can return later.",
          "The package workflow supports single-page SCORM 1.2 lessons. SCORM is a format for sharing online course content and progress. A course ZIP can be imported as a draft before review and publication."
        ],
        "diagram": "assessment"
      },
      {
        "id": "tests",
        "title": "Tests, test-out opportunities, and assignments",
        "paragraphs": [
          "Different kinds of learning need different ways to show understanding. A course can use quizzes and scored assignments. It can include a starting test and a final test. A test-out option can let a learner prove knowledge they already have.",
          "A rubric explains how an assignment is scored. The gradebook brings the results together. Learners can see which parts they missed and receive extra practice."
        ]
      },
      {
        "id": "grading",
        "title": "Instructor review and controlled corrections",
        "paragraphs": [
          "Student work needs a clear reviewer and a score that can be explained. Assigned instructors can read and grade student work. Course administrators have their own access. Someone who only approves funding cannot read student answers.",
          "A grade correction needs a reason. It keeps the earlier score and comments. The correction uses the original scoring rules.",
          "If the change removes the last passing result, the lesson can reopen. Related course credit can receive a rejected revision. The earlier credit record remains visible."
        ]
      },
      {
        "id": "completion",
        "title": "Completion and credit are connected",
        "paragraphs": [
          "Finishing a lesson and earning credit for a course are related but separate steps. The course rules determine which work must be complete. Once those rules are met, the workflow can award course credit.",
          "A corrected passing grade does not automatically restore rejected credit. An authorized administrator must review it. Withdrawn enrollments and cancelled classes also constrain later changes."
        ]
      },
      {
        "id": "feedback",
        "title": "Feedback and learning outcomes",
        "paragraphs": [
          "Test scores show part of a course’s effect. Feedback and later observations help explain the rest. Course evaluations keep learner feedback and learning results. Training reports help staff review outcomes and unmet needs.",
          "A needed-training notice points people toward follow-up work. The notice does not change their qualification record.",
          "Evaluation forms support all four Kirkpatrick levels. Each level asks a different question about the training. The form version stays with the response."
        ],
        "table": {
          "headers": [
            "Evaluation level",
            "What DART records"
          ],
          "rows": [
            [
              "I — Reaction",
              "The learner’s feedback. Assessment results are kept separate."
            ],
            [
              "II — Learning",
              "The learner’s response with assessment evidence from that enrollment."
            ],
            [
              "III — Behavior",
              "An instructor’s work observation after completion. The learner cannot submit their own observation."
            ],
            [
              "IV — Results",
              "An administrator’s result measure for a past period. It is not attached to an individual learner."
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
        "title": "Course credit with evidence",
        "paragraphs": [
          "Staff need to know what learning a person has earned credit for and why. Training records show the evidence for course credit. They distinguish a completed course from verified credit. A later correction adds a record rather than erasing the first result.",
          "Outside learning can be recorded for review. The source and its evidence stay attached to the result."
        ]
      },
      {
        "id": "outside",
        "title": "External learning and certificate files",
        "paragraphs": [
          "A person may earn a useful credential outside the organization’s own courses. An outside certificate can include a supporting file. A reviewer checks the result. File access still depends on its release and protection rules.",
          "Outside certifications can be verified or renewed. Staff can also suspend or revoke them. Each decision keeps its own date and history."
        ],
        "diagram": "training"
      },
      {
        "id": "transcript",
        "title": "Unified transcript",
        "paragraphs": [
          "Training is easier to review when its results can be read together. The transcript brings a person’s training and credential history together. Responders can inspect their own record. Staff need the right scope to inspect another person’s transcript.",
          "A qualification reviewer can follow the evidence needed for a task book. Transcript access does not grant access to student answers or every personnel file."
        ]
      },
      {
        "id": "changes",
        "title": "Revocation, expiry, and downstream impact",
        "paragraphs": [
          "Training and credentials can change after a qualification has been awarded. A qualification may stop being valid when a required credential expires. Revoked certification or rejected training can also affect readiness.",
          "DART keeps the change and its earlier evidence. Restoring credit has its own review path. Correcting one record does not silently award a new qualification."
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
        "title": "Create and review an incident",
        "paragraphs": [
          "Before people are assigned, an incident needs a shared record of the work to be done. An incident has its own ID and dates. Coordinators add duty stations and define the work. The setup follows a review process before it is used.",
          "A saved incident template can supply a starting structure. Its version stays with the draft. Creating the draft does not deploy people."
        ],
        "diagram": "incident"
      },
      {
        "id": "structure",
        "title": "Units, duties, and supervision",
        "paragraphs": [
          "Responders need to know where they fit and who supervises their work. Units and duty assignments describe who does what at the incident. Assignments have start and end dates. A supervisor can change without losing the earlier relationship.",
          "Incident organization reports show the structure at a chosen time. Deployment reviews use the dates during which a supervisor was responsible."
        ]
      },
      {
        "id": "needs",
        "title": "Staffing needs and team requests",
        "paragraphs": [
          "A coordinator first needs to describe the help the incident requires. A staffing need defines the position to fill. It includes the required dates and number of people. Specialties can narrow the requirement.",
          "Team templates define positions and leaders for a group. They can represent force packages or force modules. Accepted members stay linked to the template version used."
        ]
      },
      {
        "id": "coordination",
        "title": "Resources and shared operational work",
        "paragraphs": [
          "An incident may need people and supplies from several teams. Resource requests ask for personnel, equipment, or supplies. A request can be routine or urgent. Its decisions stay in history.",
          "A shared conversation lets staff discuss the incident in context. Sharing a thread does not grant access to records the reader cannot otherwise open."
        ]
      },
      {
        "id": "closure",
        "title": "Keep the history when work changes",
        "paragraphs": [
          "Incident plans change as the response develops. Staff still need to understand what happened earlier. Changing incident dates or withdrawing a need leaves a record. The history shows who acted and when.",
          "Ending the incident must account for its open work. Deployment orders and equipment holds remain separate records. A closed screen is not proof that those obligations are complete."
        ]
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
        "title": "Start from the requirement",
        "paragraphs": [
          "A useful candidate comparison begins with a clear description of the job. Start with the position that needs to be filled. Set its required dates and qualification version. Add any specialty the work requires.",
          "DART then checks people against that need. It uses their qualification evidence and availability. Other deployments can make a person unavailable for the same work."
        ],
        "diagram": "selection"
      },
      {
        "id": "comparison",
        "title": "Compare candidates and explain eligibility",
        "paragraphs": [
          "Several people may appear suitable for the same assignment. The selection view lets a coordinator compare responders. The eligibility explanation shows why each person meets or fails a condition.",
          "Deployment history helps staff review past workload. Missing history can be added with a reason. Corrections preserve the earlier entry."
        ]
      },
      {
        "id": "decision",
        "title": "Save the selection and its reason",
        "paragraphs": [
          "A staffing choice needs to remain understandable after the assignment is made. Choosing a responder saves the selection and its reason. A reviewer can inspect the decision. The saved checks remain available after the person’s records change.",
          "Selection does not send an order. The deployment order must still be reviewed. The responder must then accept it."
        ]
      },
      {
        "id": "fairness",
        "title": "Review how work is assigned",
        "paragraphs": [
          "The way assignments are shared should be open to review. Staff need clear rules to distribute work fairly. DART makes the evidence and recorded workload visible for review.",
          "The program owner approves the selection policy. Reviewers can inspect whether a decision followed that policy and the available evidence."
        ]
      },
      {
        "id": "planning",
        "title": "Compare demand before issuing orders",
        "paragraphs": [
          "Coordinators may need to check several demands before committing people to any one of them. Surge planning tests competing needs before orders are issued. The planner uses the same workforce snapshot for each need.",
          "Decision replay shows the basis for an earlier choice. A new readiness check uses current facts. Keeping both makes the difference clear."
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
        "title": "Draft, review, and issue an order",
        "paragraphs": [
          "A responder needs a clear, approved assignment before setting out. A coordinator drafts an order for a named responder. A different person must review and approve it. The order then goes to the responder.",
          "The responder can accept or decline. Acceptance sets the dates used by the deployment. A delivered notice does not count as acceptance."
        ],
        "diagram": "deployment"
      },
      {
        "id": "revisions",
        "title": "Extensions and successive deployments",
        "paragraphs": [
          "An assignment may need more time, or a person may be asked to take another deployment. An extension creates a new order revision. It needs review and acceptance again. Until then, the earlier accepted dates stay in force.",
          "DART supports standard, virtual, and training deployments. Incident rules control whether work can overlap. The checks also account for successive assignments."
        ]
      },
      {
        "id": "travel",
        "title": "Travel, arrivals, and duty stations",
        "paragraphs": [
          "Once the order is accepted, the record needs to follow what happens in the field. After acceptance, staff can record travel. A responder checks in at the duty station and checks out when leaving. Corrections keep the earlier visit times.",
          "Supervisors can record time away and changes in status. Daily checks continue through the accepted period, including travel."
        ]
      },
      {
        "id": "demobilization",
        "title": "Demobilization has completion checks",
        "paragraphs": [
          "Returning from an assignment involves more than reaching the planned end date. Demobilization is the process of ending a deployment. The end plan states when the person is expected to finish. Required steps show what remains to be done.",
          "DART checks due replies and equipment holds before completion. It also requires checkout. Setting a planned end date does not finish the deployment."
        ]
      },
      {
        "id": "history",
        "title": "Reconstruct the deployment",
        "paragraphs": [
          "After a deployment, staff may need to reconstruct the assignment and the changes made along the way. The deployment record follows the accepted order into the field. It connects travel to station visits and supervision. Earlier versions stay available after a correction.",
          "Saved reports use accepted dates. A draft extension does not silently change the reported commitment."
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
        "title": "Daily checks follow the deployment",
        "paragraphs": [
          "Supervisors need a dependable way to know that deployed people have checked in. Daily checks let responders confirm their status during a deployment. The incident rules set when a reply is due. Accepted deployment dates determine which days are covered.",
          "A sent notification and a saved reply are different facts. Provider delivery shows that a message reached a delivery service. It does not show that the person answered."
        ],
        "diagram": "accountability"
      },
      {
        "id": "exceptions",
        "title": "Exceptions with reasons",
        "paragraphs": [
          "There are times when a person cannot answer a routine check. A responder may be unable to reply because of travel or another approved reason. The exception workflow records that reason.",
          "A supervisor can reply for someone only with a reason. Private reply details stay limited to the responder and authorized supervisors."
        ]
      },
      {
        "id": "followup",
        "title": "Escalation and due-item work",
        "paragraphs": [
          "A missing reply needs attention, especially when the team is spread across locations. Automatic checks find due work. A missing response can be raised for supervisor follow-up. The history records when that happened.",
          "Staff can report a check-in problem. Reports keep approved exceptions separate from unresolved replies."
        ]
      },
      {
        "id": "reports",
        "title": "Accountability reporting",
        "paragraphs": [
          "A supervisor may need to review the whole set of checks rather than open each one. A daily-check report shows the due time and saved state of each check. It identifies replies and unresolved follow-up. Saved reports preserve the result at the time they were built.",
          "Access is checked during the build and download. Permission for one incident does not grant access to another incident’s report."
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
        "title": "Permanent and temporary locations",
        "paragraphs": [
          "A person may work at several places during one assignment. DART records duty stations and other places used during deployment. Authorized staff can maintain permanent and temporary location information.",
          "Physical visits are separate from virtual assignments. Remote work does not add time to a physical-location total."
        ]
      },
      {
        "id": "duration",
        "title": "Cumulative time at a location",
        "paragraphs": [
          "Some decisions depend on the total time spent at a place across more than one deployment. Location reports add time across a person’s deployments. Overlapping visits are counted once. Corrections retain the earlier times.",
          "Staff can inspect the rule version used for a report. They can also view time spent at each place during a deployment."
        ],
        "diagram": "location"
      },
      {
        "id": "rest",
        "title": "Deployment duration and rest policy",
        "paragraphs": [
          "A person’s next assignment needs to account for the work they have just completed. Past assignments affect when a responder can work again. Leave and time away also matter. DART keeps these dates in the work history.",
          "A planning policy sets rest days and maximum deployment duration. Comparing policies shows how those rules affect available staff."
        ]
      },
      {
        "id": "zones",
        "title": "Interpret dates in the right time zone",
        "paragraphs": [
          "A local date or time can mean something different to a team in another region. A time zone tells DART how to interpret a local date or time. Availability uses the selected zone. Scheduled classes and operational work keep their relevant time context.",
          "The agency defines its location and duration rules. DART provides the history used to check them. Acceptance tests confirm the result against the approved examples."
        ]
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
        "title": "Follow the item and its holder",
        "paragraphs": [
          "Teams need to know who has an item before they can use it or ask for it back. Equipment records track an item and its holder. Managers can issue or transfer an item within their scope. The saved events show how custody changed.",
          "An item can link to a deployment or incident. Responders can see the items they hold. Equipment permissions remain separate from personnel access."
        ],
        "diagram": "equipment"
      },
      {
        "id": "readiness",
        "title": "Return and inspection are separate",
        "paragraphs": [
          "An item arriving back at a store does not mean it is ready for the next responder. A returned item must be inspected before it can be issued again. The inspection records its condition.",
          "A missing item keeps its holder and deployment link. The hold remains until the item is found or a loss review resolves it. DART checks the hold again before the deployment can finish."
        ]
      },
      {
        "id": "loss",
        "title": "Independent loss review",
        "paragraphs": [
          "Missing equipment needs a reviewable decision, not just a change to a status field. A manager can request a loss review under the published rule. A different reviewer can return the request or approve the loss. The holder cannot approve their own case.",
          "Closing the loss retires the item and clears its deployment hold. Supporting files must pass the required checks. The agency supplies its official property rules."
        ]
      },
      {
        "id": "replacement",
        "title": "Replacement and resource requests",
        "paragraphs": [
          "A responder may need another item while the original one is being repaired or reviewed. A replacement request states what equipment is needed. Review and issue are separate steps. The request stays linked to the work.",
          "Incident resource requests can also ask for equipment. Priority and review history stay with the request."
        ]
      },
      {
        "id": "reports",
        "title": "Current and historical equipment reports",
        "paragraphs": [
          "An equipment manager may need today’s position or a view of what was held earlier. Equipment reports can show current custody or the state at a past time. A change report shows the events in a chosen period.",
          "Each result can be traced to saved events. Exercise equipment stays separate from operational equipment."
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
          "The planner chooses which regions may supply staff. The simulation checks qualifications and availability against the selected policy. It does not count a person twice for incompatible work."
        ],
        "diagram": "planning"
      },
      {
        "id": "policy",
        "title": "Compare deployment policies",
        "paragraphs": [
          "Rules about rest and assignment length can change how much work the team can cover. A policy draft sets rest days and maximum deployment duration. It also identifies the regions in scope. Staff can compare drafts against the same workforce snapshot.",
          "Approval and activation are separate actions. Both keep their history. Changing a planning policy does not rewrite accepted deployment orders."
        ]
      },
      {
        "id": "forecast",
        "title": "Look ahead at readiness",
        "paragraphs": [
          "A team that is ready today may have gaps in the weeks ahead. Readiness forecasts look ahead 30, 60, or 90 days. They show where future needs may exceed the ready workforce. Owners can receive a notice about the result.",
          "A saved forecast keeps its inputs and rules. Later workforce changes do not rewrite the earlier result."
        ]
      },
      {
        "id": "templates",
        "title": "Turn a reviewed template into an incident draft",
        "paragraphs": [
          "Similar incidents often need a familiar starting structure. An incident template provides a reviewed starting structure. It defines units and duties. It can also include staffing and equipment requirements.",
          "Creating an incident from the template produces a draft. The setup still needs submission and approval."
        ]
      },
      {
        "id": "replay",
        "title": "Reconstruct a staffing decision",
        "paragraphs": [
          "An earlier staffing result can be hard to explain once the underlying records have changed. Decision replay reconstructs a staffing choice from its saved facts. A reviewer can inspect the eligibility explanation.",
          "Saved scenarios can also be compared. Replay shows the earlier decision basis. A new assessment uses current facts."
        ]
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
          "Report definitions cover operational work and workforce history. A user can inspect current staffing or look at earlier results. Each definition applies the access rules for its records."
        ],
        "diagram": "report"
      },
      {
        "id": "dashboards",
        "title": "Personal dashboards with operational context",
        "paragraphs": [
          "A person needs a quick way to return to the information they use most often. My work lets users choose report cards and arrange their dashboard. Filters can limit a view to a region or incident. Available choices depend on the person’s permissions.",
          "DART checks those choices when the dashboard is saved or refreshed. A saved layout cannot grant broader access."
        ]
      },
      {
        "id": "snapshots",
        "title": "Save a fixed report result",
        "paragraphs": [
          "Staff may need to keep the exact result they used for a decision. Saving a report creates a background job. The request keeps its filters and scope. The worker checks the owner’s current rights before building and saving the result.",
          "The saved file keeps the same contents after source records change. Its hash helps verify that the file has not changed. Downloading the file checks access again.",
          "A user can compare two saved reports. The report history explains when each result was built and which rules it used."
        ]
      },
      {
        "id": "history",
        "title": "Historical workforce reporting",
        "paragraphs": [
          "Looking only at today’s workforce can hide changes that matter over time. Workforce history reports show counts at a past time and averages over a period. Staff can compare cadres and disasters. Incident organization reports show the structure for a chosen time.",
          "The DHS history score has its own report workflow. Agency formulas must be checked against the selected definition. A current name label may differ from a fact saved in the historical record."
        ]
      },
      {
        "id": "forecasting",
        "title": "Staffing and training needs",
        "paragraphs": [
          "Reporting can help teams prepare for gaps as well as describe current work. Staffing forecasts compare demand with workforce evidence. Training-needs reports identify learning gaps. Outcomes reports help staff review what training achieved.",
          "A live report can refresh current status. A saved report preserves a fixed result. Users can choose the form that fits the question."
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
          "These are application evaluations. They do not establish an agency production authorization or a measured capacity for a disaster-scale deployment."
        ]
      },
      {
        "id": "integration-checks",
        "title": "Imports, exports, and delivery receipts",
        "paragraphs": [
          "A connection needs to behave correctly when a reply is lost or the same message arrives again. The October 16 evaluation checked automatic data exchanges and provider receipt handling.",
          "The final focused runs passed 56 service checks and 21 HTTP checks. Four native PostgreSQL checks and seven browser checks also passed. Each layer tested a different part of the workflow.",
          "The earlier broad run had three failures and one skipped check across 594 tests. The three failures were fixed and passed in focused follow-up runs. The entire broad suite was not rerun. The evidence summary preserves this distinction."
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
          "These examples used real public sources with separate local test accounts. They demonstrate data capture and use. They do not claim a live FEMA interface."
        ]
      },
      {
        "id": "guided-work",
        "title": "Guided work and recovery",
        "paragraphs": [
          "Guidance needs to help someone continue when they return to an unfinished task. The October 18 NOAA walkthrough record contains 509 steps across 21 parts. It records recovery checks for a wrong account and a wrong work view.",
          "The workflow reopened a saved API and selected its saved full capture. It also linked records and completed a task. An outbound test reached an HTTP echo service in one attempt.",
          "The source values were real NOAA readings. Limit-crossing tests used clearly marked controlled values in a separate review. The echo result proves HTTP delivery to the test service, not completion of an agency case."
        ]
      },
      {
        "id": "incident-exercise",
        "title": "An incident through deployment and return",
        "paragraphs": [
          "An incident workflow needs to reach the end without losing the people or equipment it tracks. A saved October 14 Hurricane Isaias exercise finished with the incident Closed. It recorded 35 completed deployments and 35 returned deployments.",
          "The same run checked access boundaries. An ordinary person could not run the bulk exercise action. Cross-origin writes were rejected. The exercise case was hidden from the main workspace.",
          "The exercise used synthetic records and bulk controls to advance the scenario. This result demonstrates the saved workflow outcome. It does not measure 35 people using the system at once."
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
          "Automated checks do not replace complete screen-reader testing or Section 508 acceptance. The agency evaluation needs to test its actual devices and assisted workflows."
        ]
      },
      {
        "id": "deployment-evaluation",
        "title": "Evaluate the intended deployment",
        "paragraphs": [
          "The next evaluation should use the organization’s work and its selected services. Follow the accepted order through field activity and return. Inspect the saved history and the reports used to make decisions.",
          "Load and recovery tests must use the intended environment. Set the expected surge and measure the response. Test lost connections, delayed jobs, and backup restoration against agreed outcomes."
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
          "DART keeps the original input and its source ID. If the same change ID arrives with different data, the conflict is held for review. The later copy does not replace the first without a record."
        ],
        "diagram": "integration"
      },
      {
        "id": "mapping",
        "title": "Map and check before applying",
        "paragraphs": [
          "Two systems can describe the same fact with different field names or formats. A designer reads a sample and maps its fields. Cleanup steps can convert a value or split a list into records. Extra source fields can be kept under their own names.",
          "The preview shows what would change. Staff check record matching and source ownership before applying the batch. The original data and review history stay available."
        ]
      },
      {
        "id": "authority",
        "title": "Review data rights and security",
        "paragraphs": [
          "A working connection needs clear limits on what its source is allowed to change. Connection setup states which source may supply which facts. It names the service account and its scope. Secrets are stored on the server.",
          "A data-authority reviewer and a security reviewer approve the saved setup. Connections start paused. Approval alone does not start them.",
          "Revoked access stops later work. A code change can also require another review before an exchange continues."
        ]
      },
      {
        "id": "operations",
        "title": "Run jobs and check receipts",
        "paragraphs": [
          "A connection can fail after a request is sent, leaving staff unsure what happened. Workers process saved jobs. Staff can inspect held records and failed attempts through integration health.",
          "A retry uses the same saved input. Wrong source fields need a corrected source record. They are not repaired by repeatedly sending the old one.",
          "Outbound exchanges keep the sent payload and receiver receipt. An uncertain send has a receipt-check path. A receipt is separate from proof that the receiving system applied the data."
        ]
      },
      {
        "id": "interfaces",
        "title": "Connect agency interfaces during deployment",
        "paragraphs": [
          "A named agency system has its own data rules and connection requirements. An agency connection is mapped to its real interface. The agreement identifies authoritative fields and stable IDs. It also defines authentication and failure handling.",
          "The agency supplies the interface details and access. The delivery team tests the mapping and checks the result. The application tools do not imply that a named government system is already connected."
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
          "Typed links connect that data to DART records. For example, a weather alert can link to a duty station. The source record stays available behind the link."
        ],
        "diagram": "studio"
      },
      {
        "id": "pages",
        "title": "Place data in the operational view",
        "paragraphs": [
          "Operators need to see outside information beside the work it affects. A custom page chooses which fields to show and how to sort them. Connected data can appear beside an incident or person. It can also appear on an equipment or station page.",
          "Staff publish an import after checking and applying it. Settings define how old data may be before it is treated as stale. Updates can be paused when needed."
        ]
      },
      {
        "id": "rules",
        "title": "Rules that create operational work",
        "paragraphs": [
          "Some source changes need attention without waiting for someone to notice them on a page. A rule checks a mapped value against a condition. For example, it can test whether a water level is above a set limit.",
          "The result can create a task or inbox notice for named people. A trigger decides whether it runs once or when a value changes. A limit-crossing trigger acts when the reading passes the boundary."
        ]
      },
      {
        "id": "actions",
        "title": "Controlled custom actions and outbound sends",
        "paragraphs": [
          "A connected workflow may need to send a request back to another system. Designers can create custom actions and API send actions. Sends are queued with their payload and result. Staff can inspect the history.",
          "Connections support OAuth sign-in. They can also receive signed webhooks or event streams. The selected provider supplies the required credentials and access rights."
        ]
      },
      {
        "id": "examples",
        "title": "Weather and water-level workflows",
        "paragraphs": [
          "A worked example helps show how capture, mapping, and rules fit together. The help tasks include a National Weather Service alert connection. Training guides also include a worked NOAA integration. These examples follow the data from capture to use.",
          "A water-level field can be converted from meters to feet. A link places it beside the relevant record. A rule can create a task when the reading crosses a chosen level."
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
          "Write commands check their fields before saving. Each intended action has a request ID. Retrying the same request does not create a second action.",
          "Version checks stop old data from overwriting newer work. A command must satisfy the rules for the record it changes.",
          "The operations and readiness write routes require a same-origin request. Each body is limited to 64 KB. Errors include a code and a reference ID for support."
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
          "Commands use the same application interfaces as the work screens. Opening the terminal does not grant extra permissions."
        ]
      },
      {
        "id": "mcp",
        "title": "Read-only MCP access",
        "paragraphs": [
          "A compatible assistant or tool can help inspect records without being allowed to change them. MCP lets a compatible tool read DART through a defined set of actions. This interface is read-only. It can search and inspect records the user is allowed to read.",
          "A signed-in user can create a short-lived MCP key. The key is tied to their person and session. It stops working when it expires or is revoked.",
          "The server checks current access for each read. An expired session or inactive sign-in identity blocks the key."
        ],
        "diagram": "access"
      },
      {
        "id": "extension",
        "title": "Define the connection before building it",
        "paragraphs": [
          "A person using a screen and a service running on a schedule have different access needs. A service exchange uses a reviewed connection and service account. It has different needs from a person using a work-screen API.",
          "Before connecting a system, define its IDs and field ownership. Agree on retry behavior and errors. Keep enough evidence to compare the source with the result."
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
          "A notice may ask for an acknowledgment or written reply. The sender can inspect those responses. Reading it does not accept an order or finish a daily check."
        ],
        "diagram": "communications"
      },
      {
        "id": "groups",
        "title": "Direct, team, and cross-organization conversations",
        "paragraphs": [
          "The people who need to discuss a task may span several teams. Chats can be direct or group conversations. A group can include several teams or organizations. Owners can change membership and close or reopen the group.",
          "Messages can include files and pictures. Users can also send links or reply in a thread. File downloads still require the right access."
        ]
      },
      {
        "id": "records",
        "title": "Share the work with its context",
        "paragraphs": [
          "A conversation is easier to follow when the people in it can open the work being discussed. A shared conversation connects discussion to a record. Staff can share work such as an incident or class. The reader must still have access to the underlying record.",
          "Sharing a link does not make personnel data public. Record protection continues to apply."
        ]
      },
      {
        "id": "calls",
        "title": "Audio and video",
        "paragraphs": [
          "Some work is easier to resolve in a live conversation. Users can start or join audio and video calls. Call controls let them mute the microphone or turn off the camera. The GovCloud call path includes caption controls.",
          "Calls depend on the configured provider and network route. Deployment tests confirm that the intended users can connect and use the required media features."
        ]
      },
      {
        "id": "delivery",
        "title": "Queued email and text with receipts",
        "paragraphs": [
          "When a notice matters, staff need to know whether delivery failed or a person has yet to answer. Email and text jobs keep each send attempt. Provider receipts show the delivery result. Duplicate or late receipts remain tied to the right attempt.",
          "A failed send has a retry path. Delivery evidence stays separate from the person’s reply. A delivered safety message is not a completed safety check."
        ]
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
          "The agency chooses its authentication rules. These may include a PIV or CAC card and multi-factor authentication. Changing a contact email does not transfer the sign-in identity."
        ],
        "diagram": "access"
      },
      {
        "id": "permissions",
        "title": "Permissions with dates and scope",
        "paragraphs": [
          "Knowing who someone is does not tell the system everything they may do. A permission set states what a person may do. An administrator can assign it with dates and scope. Assignments can be changed or revoked.",
          "Scope limits where the permission applies. It may cover an organization or a single incident. Some readiness roles can be limited to a person or qualification.",
          "Roles remain separate. A task evaluator is not automatically a certifier. An equipment manager is not automatically a loss reviewer."
        ]
      },
      {
        "id": "requests",
        "title": "Access requests and assignment review",
        "paragraphs": [
          "A person’s responsibilities can change while they are using the system. Staff can request access for review. An authorized person decides the request. The decision and later changes remain in history.",
          "A job title alone does not grant access. DART checks the current permission and the record’s protection rules."
        ]
      },
      {
        "id": "review",
        "title": "Independent approval where the decision requires it",
        "paragraphs": [
          "Some decisions need a second person to check the work before it takes effect. Some actions need a different reviewer. An order author cannot approve that order. A person holding missing equipment cannot approve their own loss.",
          "Reviews apply to the exact saved request. If the request changes, it may need another review. Approval does not start a paused connection or accept an order for someone else."
        ]
      },
      {
        "id": "workers",
        "title": "Access is checked again later",
        "paragraphs": [
          "Access can change between a request being made and the work actually running. DART checks access again when delayed work runs. That includes report builds and source imports. File downloads also check current rights.",
          "Revoking a permission can stop a job that was requested earlier. Database setup uses a separate account from the running application."
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
          "Protection rules limit who can read or export the data. Those rules also apply to reports and connected data. Dashboard access does not override them."
        ],
        "diagram": "records"
      },
      {
        "id": "aggregation",
        "title": "Control combinations of sensitive data",
        "paragraphs": [
          "Separate pieces of information can reveal something sensitive when they are brought together. Combining records can reveal information that each record alone does not show. DART can block configured combinations and restrict exports.",
          "The agency defines which combinations are prohibited. It also supplies its handling categories and sharing rules. The application checks the configured policy."
        ]
      },
      {
        "id": "retention",
        "title": "Schedules and holds",
        "paragraphs": [
          "Records may need to stay available for a set period or an ongoing review. A retention schedule states how long a record should be kept. Authorized staff can set its retention date.",
          "A hold stops disposal through the removal workflow. Staff can place or release a hold with a reason. The decision remains in history."
        ]
      },
      {
        "id": "disposition",
        "title": "Review removal before applying it",
        "paragraphs": [
          "Once a record reaches its disposal date, staff still need to check whether removal is allowed. Record removal starts with a request. A reviewer checks it before removal can be applied.",
          "DART checks the retention conditions and any holds. Removal is not an unrestricted delete action."
        ]
      },
      {
        "id": "files",
        "title": "Private files and release checks",
        "paragraphs": [
          "A file needs both a known owner and a clear record of the checks it has passed. A file keeps its owner and access rules. Its hash helps verify that the contents have not changed. Scan and release results stay attached to the file.",
          "Download checks the file again. The deployment supplies private storage and malware scanning. It also defines backups and key handling."
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
          "A controller releases each scenario. The exercise keeps its own history and data protection rules."
        ],
        "diagram": "exercise"
      },
      {
        "id": "results",
        "title": "Capture results and follow-up",
        "paragraphs": [
          "Practice is useful when its lessons turn into work someone will follow up. Staff record results for review. Follow-up work can be assigned to named people. Completion stays visible before the exercise closes.",
          "The help includes a synthetic Hurricane Isaias exercise. It is a training example. It does not describe a live agency response."
        ]
      },
      {
        "id": "isolation",
        "title": "Keep exercise and operational work apart",
        "paragraphs": [
          "An exercise must not be mistaken for an operational assignment. Exercise workspace access must be assigned. Exercise equipment cannot be linked to operational incidents. The environment and database settings maintain the boundary.",
          "A simulation estimates an outcome. An exercise rehearses a workflow. Neither action issues a real deployment order."
        ]
      },
      {
        "id": "continuity",
        "title": "Use exercises to test the operating plan",
        "paragraphs": [
          "A rehearsal can test how the team responds when the normal workflow is interrupted. An exercise can follow staffing through deployment and return. Staff can test missing replies or equipment problems. The results lead to assigned follow-up work.",
          "Infrastructure recovery needs its own tests. The selected deployment must test backups and provider failures. The exercise workflow records operational practice and its results."
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
          "The available views depend on permissions. A responder sees different actions from a coordinator or instructor."
        ]
      },
      {
        "id": "devices",
        "title": "Responsive access",
        "paragraphs": [
          "A responder in the field may use a different device from a coordinator at a desk. The web screens adapt to desktop and smaller displays. Tables and record dialogs keep the work together. The agency’s supported devices and browsers are tested during acceptance.",
          "Access from outside the agency network needs an approved route. Identity and provider connections must work across that route."
        ]
      },
      {
        "id": "offline",
        "title": "Scoped offline responder access",
        "paragraphs": [
          "A responder may lose a connection while traveling or working in the field. Optional offline responder access prepares a short-lived copy of permitted deployment data. It supports arrival, availability, and acknowledgment actions. It does not provide the full administration workspace.",
          "A new download retires the earlier active copy. Staff can revoke access for a lost device.",
          "When the device reconnects, DART checks queued actions again. Current access and record versions still apply. A local action cannot bypass the normal rules."
        ],
        "diagram": "offline"
      },
      {
        "id": "language",
        "title": "Language choices and time zones",
        "paragraphs": [
          "Teams may need help reading the interface in a language they use more comfortably. English is always available. The language selector can use AWS GovCloud Translate for saved interface text. Names and notes remain as written.",
          "The agency reviews translated text for its chosen languages. Time zones remain part of scheduling and availability records."
        ]
      },
      {
        "id": "accessibility",
        "title": "Accessibility in the delivery workflow",
        "paragraphs": [
          "Users need to complete their work with the input methods and assistive tools they rely on. The interface supports keyboard use and labeled controls. Guided help points to the real work screen.",
          "Section 508 review tests complete workflows with the required tools. Its report must state which version was tested. Automated checks alone do not establish agency acceptance."
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
          "The task library below comes from the application’s help catalog. These steps run inside DART. The controls available to each user depend on their permissions."
        ],
        "guideLibrary": true
      },
      {
        "id": "documentation",
        "title": "Video and task-based learning",
        "paragraphs": [
          "A walkthrough can provide context before a user starts the task themselves. The documentation library includes a platform video with chapters. Related help tasks lead from the explanation to the work screen.",
          "Worked examples cover integrations and exercises. Role-based training can follow the same tasks people will use in their jobs."
        ]
      },
      {
        "id": "requests",
        "title": "Support requests, bugs, and improvements",
        "paragraphs": [
          "A user needs a clear route to ask for help when a guide does not solve the problem. Users can create a support request and follow its progress. They can report a bug or suggest an improvement.",
          "Support agents handle requests within their assigned scope. Leads have separate permissions. The support agreement defines coverage and escalation."
        ]
      },
      {
        "id": "changes",
        "title": "From feedback to a controlled release",
        "paragraphs": [
          "Feedback should lead to a change that can be tested and reviewed. A system change can be an improvement, upgrade, or patch. Staff record tests before approval and release. A rollback has its own history.",
          "User feedback and performance reports help identify the work. The change record connects the issue to its tests and release."
        ]
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
          "The main work areas have separate services. Each service checks its own commands and permissions. The database also protects saved versions and events from being overwritten."
        ],
        "diagram": "architecture"
      },
      {
        "id": "work",
        "title": "Saved background jobs",
        "paragraphs": [
          "Some tasks take longer than the user should need to wait on a page. Background jobs handle work that can finish after a request returns. A report build is one example. Notification delivery and source capture also use saved jobs.",
          "A worker checks the saved request before running it. It checks current access where the workflow requires it. Held jobs remain available for review and retry."
        ]
      },
      {
        "id": "services",
        "title": "Connected services",
        "paragraphs": [
          "The application relies on other services for work such as sign-in and message delivery. The deployment connects the application to approved services. These include identity and file storage. Communications and translation use their configured providers.",
          "GovCloud adapters are available for the relevant service paths. Each connection needs the right account and network access. Deployment tests verify the chosen setup."
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
          "The test results establish operating limits. The presence of retry code alone does not prove surge capacity."
        ]
      },
      {
        "id": "ownership",
        "title": "Define the production system",
        "paragraphs": [
          "A production system needs clear responsibility for both the software and the services around it. The production plan names who operates each service. It states who controls identities and keys. It also defines how software changes are approved.",
          "An agency authorizes a specific system in a specific environment. The application code is one part of that system. The assessment must also cover its hosting and operations."
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
          "FEMA’s public notice provides the original request. Its survey workbook describes the capabilities used in this guide. The RFI overview gives the program context."
        ]
      },
      {
        "id": "hosting",
        "title": "Government-controlled hosting",
        "paragraphs": [
          "Government buyers need to know where the system and its information will run. FEMA’s survey asks for a FedRAMP High cloud and a government-owned cloud environment. The delivery team must define the selected hosting boundary.",
          "That boundary states which services are approved and where data flows. It also names the people responsible for operating them.",
          "DART includes GovCloud service adapters. Those adapters do not grant a FedRAMP authorization or Authority to Operate. Authorization applies to the assessed agency system."
        ],
        "diagram": "federal"
      },
      {
        "id": "security",
        "title": "Access controls and security review",
        "paragraphs": [
          "The agency needs to see how an application control works within the wider security plan. DART checks identity and access in its application services. Dated permissions limit where a person may act. Private file checks and independent review protect the related workflows.",
          "The delivery team maps these controls to the agency’s security baseline. The assessment also covers network policy and key handling. Logs and security monitoring must be configured for the environment."
        ]
      },
      {
        "id": "data",
        "title": "CUI, privacy, and records",
        "paragraphs": [
          "An agency’s information rules continue to apply when records are brought into a new system. DART supports protected records and CUI labels. It can restrict exports and block configured data combinations. Retention schedules and holds govern record disposal.",
          "The agency supplies its handling policy. It identifies which sources own each type of fact. Data migration and integrations are tested against those decisions."
        ]
      },
      {
        "id": "acceptance",
        "title": "Test the agency deployment",
        "paragraphs": [
          "The agency must be able to check the delivered system against its agreed requirements. Agency acceptance tests the selected version and environment. The tests cover real role boundaries and operational workflows.",
          "Section 508 review checks accessibility. Load tests examine incident surges and slow connections. Recovery and cutover rehearsals check continuity.",
          "Each result needs a clear expected outcome. The saved evidence shows what was tested and what happened."
        ]
      },
      {
        "id": "engagement",
        "title": "Federal delivery and technical engagement",
        "paragraphs": [
          "A delivery needs named people who can build the system and support it in use. USATII’s federal delivery plan assigns responsibility for engineering and program management. It also covers security review and ongoing support.",
          "The published DART jobs are anticipated roles. Hiring depends on an award or approved funding. Those postings do not establish an awarded FEMA contract or a fully staffed team.",
          "The engagement defines the named staff and their responsibilities."
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
          "The agency supplies approved rules and source-system details. A data dictionary explains each field. Sample exports let the team inspect the records before migration."
        ]
      },
      {
        "id": "migration",
        "title": "Move and check legacy data",
        "paragraphs": [
          "Moving records also means preserving the relationships that make them useful. Legacy migration moves records from the old system. The mapping must preserve IDs and relationships. Historical dates and status codes need an agreed meaning.",
          "Pilot batches expose missing data and duplicate identities. The team checks the result against the source. Original inputs stay available for review."
        ],
        "diagram": "migration"
      },
      {
        "id": "pilot",
        "title": "Pilot complete workflows",
        "paragraphs": [
          "A small group can check a complete workflow before the agency expands its use. A pilot follows a complete workflow. It might start with a staffing need and end with a completed deployment. Users test the actions for their actual roles.",
          "Tests also try rejected and interrupted work. An old form should not overwrite a newer record. A revoked permission should stop the next protected action.",
          "Reviewers inspect reports and history alongside the visible result."
        ]
      },
      {
        "id": "coexistence",
        "title": "Run both systems during the transition",
        "paragraphs": [
          "An agency may need to keep the old system running while teams move to DART. During coexistence, the old and new systems both remain in use. Each type of record needs one agreed writer. The plan defines how changes reach the other system.",
          "A phased rollout starts with a limited group or workflow. Expansion follows accepted results. The rollback plan states when to stop and how to recover.",
          "The legacy system is retired after reconciliation and retention decisions. Unresolved conflicts need an owner before cutover."
        ]
      },
      {
        "id": "enablement",
        "title": "Train users and prepare support",
        "paragraphs": [
          "People need to practice the parts of the new system they will actually use. Training follows the tasks people will perform. Responders practice replies and check-in. Coordinators practice staffing and orders. Specialists practice their review workflows.",
          "The support handoff names who handles failures. It also explains how to monitor jobs and restore service. In-app help remains available during daily work."
        ]
      },
      {
        "id": "schedule",
        "title": "Set milestones against actual dependencies",
        "paragraphs": [
          "A useful schedule shows what must be ready before the next stage can begin. Delivery milestones follow accepted results. These include working interfaces and checked migration data. Security review and a cutover rehearsal also need clear completion points.",
          "The schedule depends on source quality and agency review. Interface access and approved rules affect it too. Dates are set for the actual program."
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
          "DART is a custom platform. Agency delivery includes configuration and integration work. A feature in the application is separate from a live agency connection or accepted deployment."
        ]
      },
      {
        "id": "commercial",
        "title": "Define delivery and ongoing costs",
        "paragraphs": [
          "The cost of a delivered system includes both getting it ready and keeping it running. The agreement defines what USATII will deliver and operate. It separates the initial work from ongoing costs.",
          "A one-time cost may cover data migration or a new connection. Recurring costs may cover hosting and support. One-, five-, and ten-year estimates show how those costs change over time.",
          "Pricing is set for the program. This documentation does not publish a per-user federal price or claim a contract vehicle."
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
          "Response and recovery targets need an agreed environment. Tests must show that the setup can support them. Provider and agency responsibilities belong in the same plan."
        ]
      },
      {
        "id": "risk",
        "title": "Resolve delivery risks early",
        "paragraphs": [
          "A delivery plan should address problems while there is still time to respond to them. Resolve the largest risks early. Poor source data can delay migration. Missing interface access can block integration. Security review can affect activation.",
          "Each risk needs an owner and a test or decision. The plan states what happens if the risk becomes a problem."
        ]
      },
      {
        "id": "contact",
        "title": "Discuss a DART evaluation",
        "paragraphs": [
          "A useful demonstration follows a buyer’s own work rather than a general tour. A DART evaluation starts with the mission workflow and expected users. Bring the relevant source systems and intended hosting environment. USATII can then define a demonstration around the work."
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
          "The survey workbook is available directly from SAM.gov. FEMA’s public notice includes the attachments and amendments. The RFI overview explains the request and how vendors were asked to respond."
        ]
      },
      {
        "id": "capabilities",
        "title": "Capability-by-capability coverage",
        "paragraphs": [
          "The entries are grouped in the same order as the survey, so readers can move between the two. Open an entry to learn how the workflow works. The federal deployment pages explain the agency services and reviews it needs."
        ],
        "requirements": true
      },
      {
        "id": "beyond-features",
        "title": "Evaluation questions beyond the capability list",
        "paragraphs": [
          "A working feature is only one part of choosing and delivering a government system. The survey also asks about architecture and delivery. It asks how costs and risks will be managed. Those answers depend on the actual program.",
          "An engagement-specific response supplies verified company facts. It names the staff and partners. It also sets prices and delivery dates. Contract terms and security commitments must be agreed for that engagement."
        ]
      }
    ]
  }
];
export const dartGroups = ["Start here","Workforce","Learning","Response operations","Analysis and planning","Data and development","Platform operations","Federal and delivery"];
export const dartHref = (slug = '') => slug ? `/dart/${slug}` : '/dart';
export const getDartPage = (slug = '') => dartPages.find(page => page.slug === slug);
