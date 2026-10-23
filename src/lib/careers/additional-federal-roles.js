export const additionalFederalRoles = [
  {
    slug: "forward-deployed-integration-engineer-dart",
    title: "Forward Deployed Integration Engineer, DART",
    team: "Federal Engineering",
    location: "Washington, DC",
    arrangement: "Hybrid",
    employment: "Full-time, contingent upon contract award or approved program funding",
    compensation: "$120,000 annual base salary (proposed)",
    locationDetails: "Hybrid — Washington, DC, with remote engineering work and travel to approved federal customer sites",
    openings: "2 anticipated positions",
    status: "Anticipated Position — Accepting Expressions of Interest",
    description: `## About the team

[USATII](/about) develops and deploys enterprise software for organizations managing complex, mission-critical operations. Our engineers work directly with customers to understand their operational environments, design integrated systems, and maintain responsibility for the software throughout its production lifecycle.

Our Federal Engineering team brings together forward-deployed software engineers, systems integration specialists, platform architects, cybersecurity professionals, and infrastructure engineers to implement enterprise software in demanding government environments.

[DART](/emergency-management) is USATII's deployment and workforce management platform. It integrates personnel qualifications, professional development, training, workforce readiness, incident staffing, deployment operations, and historical reporting within a unified operational system.

We are building an engineering organization capable of deploying DART alongside existing federal technology infrastructure. This includes integration with authoritative government data sources, enterprise identity systems, legacy applications, and operational services that must continue functioning throughout modernization efforts.

## About the role

USATII is seeking Forward Deployed Integration Engineers to design, implement, and maintain the technical connections between DART and federal government information systems.

You will work directly with government system owners, enterprise architects, cybersecurity personnel, and operational stakeholders to understand how information moves across existing systems and establish secure, reliable interoperability with DART.

An initial area of focus is the potential modernization of [FEMA](https://www.fema.gov/)'s legacy Deployment Tracking System, for which USATII has submitted a Sources Sought response. FEMA's requirements include interoperability with existing FEMA and [DHS](https://www.dhs.gov/) systems supporting personnel management, qualifications, training, incident operations, deployment tracking, and operational reporting. No contract award has been made.

DART already includes a modular integration framework supporting configurable data sources, controlled imports and exports, field mappings, authorization checks, asynchronous processing, and data reconciliation. The prospective federal implementation would require adapting these capabilities to government-approved interfaces, authentication mechanisms, network boundaries, and data governance requirements.

You will own technical integration work from initial interface discovery through architecture, implementation, validation, production deployment, and operational support.

This is a hands-on engineering position requiring substantial experience with backend systems, APIs, enterprise authentication, distributed processing, and complex data relationships. You will write production code, troubleshoot difficult cross-system failures, and work directly with external technical stakeholders.

You will collaborate closely with USATII's [Principal Software Architect](/careers/roles/principal-software-architect-dart), [Federal Technical Program Manager](/careers/roles/federal-technical-program-manager-dart), [Forward Deployed Software Engineers](/careers/roles/forward-deployed-software-engineer-dart), [Data Migration Engineers](/careers/roles/data-migration-database-engineer-dart), and federal cybersecurity specialists.

The position is based around federal customer engagement in Washington, DC, with hybrid work arrangements and travel determined by implementation requirements.

## In this role, you will:

- Lead technical discovery with federal system owners to identify available interfaces, authoritative data sources, authentication requirements, network dependencies, data classifications, and integration constraints.
- Design and implement secure integrations between DART and authorized government systems supporting personnel records, organizational structures, training history, qualifications, equipment, incident management, workforce availability, and deployment operations.
- Develop production integration services using [TypeScript](https://www.typescriptlang.org/docs/), [Node.js](https://nodejs.org/en/docs), [PostgreSQL](https://www.postgresql.org/docs/), REST APIs, and other protocols or technologies appropriate to approved external interfaces.
- Configure and extend DART's existing integration framework, including source-system registrations, field mappings, connector credentials, service permissions, network restrictions, validation rules, and data synchronization policies.
- Establish clear source-of-truth rules for personnel identities, qualifications, training completions, deployment statuses, organizational assignments, and other records shared between DART and external systems.
- Implement inbound data-processing pipelines that preserve original source records and identifiers, validate incoming data, detect discrepancies, and support controlled review before authoritative DART records are updated.
- Design reliable outbound synchronization mechanisms incorporating persistent job queues, idempotent operations, delivery receipts, retry policies, failure recovery, and protection against duplicate processing.
- Develop integration adapters for government systems whose interfaces require additional protocols, authentication methods, data transformations, or operational behaviors beyond DART's existing supported configuration.
- Implement enterprise identity integrations using appropriate federation and authentication standards, such as [SAML 2.0](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf), [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html), [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749), and government-approved identity services.
- Work with cybersecurity and infrastructure engineers to establish approved network communication paths, service identities, secrets management, access restrictions, encryption, and audit logging for external information exchanges.
- Coordinate with Data Migration Engineers to ensure legacy DTS records can be ingested, reconciled, validated, and linked to continuing authoritative government data sources without compromising historical integrity.
- Support phased coexistence between legacy systems and DART, implementing safeguards against duplicate updates, conflicting system authority, inconsistent personnel statuses, and unintended changes to active operational records.
- Build integration test harnesses, mock external services, synthetic datasets, automated contract tests, and validation procedures that allow interfaces to be tested before access to production government systems is available.
- Develop monitoring and diagnostic capabilities for external connections, including synchronization latency, error rates, processing backlogs, reconciliation exceptions, service availability, and incomplete transactions.
- Investigate integration failures involving authentication, authorization, incompatible schemas, network restrictions, data inconsistencies, unavailable external services, and unexpected changes to government interfaces.
- Participate in technical reviews and authorization activities by documenting integration architectures, data flows, security boundaries, external dependencies, service permissions, and implemented safeguards.
- Establish interface-control documentation, deployment procedures, configuration baselines, operational runbooks, and troubleshooting guidance for each production integration.
- Collaborate with government technical stakeholders during integration testing, user acceptance, phased rollout, and production transition to verify that connected systems behave as expected under realistic operating conditions.
- Identify recurring integration patterns and contribute reusable connectors, data transformation components, validation mechanisms, and integration tooling to DART's underlying platform.

## You might thrive in this role if you:

- Have 4+ years of professional software engineering or systems integration experience, including substantial responsibility for enterprise APIs, backend services, or production data-exchange systems.
- Have strong proficiency in TypeScript, [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), Node.js, [SQL](https://www.postgresql.org/docs/current/tutorial-sql.html), and relational database systems, with experience developing production services that exchange and process information across organizational boundaries.
- Have designed, implemented, or maintained integrations between complex enterprise applications, particularly where multiple systems maintain overlapping or conflicting records.
- Understand REST APIs, asynchronous processing, message queues, event-driven architectures, webhooks, scheduled synchronization, and reliable background job execution.
- Have practical experience with OAuth 2.0, OpenID Connect, [SAML](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf), service-to-service authentication, and enterprise identity federation.
- Understand distributed systems failure modes, including duplicate message delivery, partial transaction completion, network timeouts, stale records, concurrent updates, and differences between eventually consistent systems.
- Have experience implementing idempotency, retry mechanisms, dead-letter queues, reconciliation processes, and recovery procedures for production integrations.
- Can design data mappings and transformation logic involving complex entity relationships, inconsistent identifiers, schema changes, historical records, and multiple authoritative sources.
- Understand secure information exchange, including least-privilege service accounts, secrets management, transport encryption, network access restrictions, auditability, and data minimization.
- Have worked with PostgreSQL or comparable relational databases, including experience with transactions, indexing, referential integrity, query performance, and maintaining consistency during large data operations.
- Have experience integrating applications deployed across cloud environments, private networks, or hybrid infrastructure, including troubleshooting connectivity, routing, DNS, certificates, and network security restrictions.
- Can independently investigate unfamiliar APIs, incomplete technical documentation, legacy interfaces, or poorly specified external systems and develop reliable integration approaches.
- Have built automated integration tests, contract tests, mock services, and technical validation procedures that catch data exchange failures before production deployment.
- Are comfortable working directly with customer engineering teams, external vendors, information security personnel, and operational users to resolve technical requirements and implementation constraints.
- Can communicate complicated technical dependencies, integration risks, and system behavior clearly to software engineers, technical program managers, and government stakeholders.
- Take responsibility for the production behavior of the integrations you build, including monitoring, incident investigation, maintenance, and continuous improvement.
- Hold a degree in computer science, computer engineering, software engineering, information systems, or a related discipline, or possess equivalent substantial professional experience.

Experience integrating federal enterprise applications, government personnel systems, learning management platforms, identity services, or emergency management technology is particularly valuable.

Familiarity with [AWS GovCloud](https://aws.amazon.com/govcloud-us/), federal cybersecurity authorization processes, [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) controls, and interconnection security documentation is beneficial. [NIST SP 800-47 Rev. 1](https://csrc.nist.gov/pubs/sp/800/47/r1/final) provides relevant guidance for managing and securing information exchanges between organizations and systems.

Experience with federal identity and authentication requirements is also advantageous. [NIST SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) addresses federal identity proofing, authentication, and federation, including technical requirements relevant to enterprise integration design.

Prior federal contracting experience is not required for every candidate. We value demonstrated technical ability, independent problem-solving, sound engineering judgment, and experience supporting complex production systems.

## About USATII

USATII is a U.S.-based enterprise software engineering company focused on designing, building, and deploying operational software and private AI systems.

We work directly with organizations to understand complex business processes, develop integrated technology solutions, and support those systems throughout their operational lifecycle.

Our approach emphasizes technical ownership, direct collaboration between engineers and customers, configurable enterprise architectures, and software that organizations can control and sustain over the long term.

USATII is privately held and operates from Rochester, New York, serving commercial and prospective public-sector customers.

USATII is an equal opportunity employer and considers qualified applicants without regard to legally protected characteristics. Reasonable accommodations are available during the application process.

## Compensation

The proposed base salary for this position is $120,000 annually.

Additional compensation, employee benefits, and employment terms will be determined through an approved employment offer and communicated during recruitment.

This position is associated with prospective federal software integration and implementation activities. Full-time employment is contingent upon contract award, approved program funding, and final staffing requirements.

Candidates may be considered for subsequent federal deployments or other USATII engineering opportunities based on qualifications and organizational needs.

Any customer-specific citizenship, suitability, security clearance, or work-location requirements will be communicated once established for the applicable engagement.`,
  },
  {
    slug: "data-migration-database-engineer-dart",
    title: "Data Migration & Database Engineer, DART",
    team: "Federal Engineering",
    location: "U.S. Remote / Washington, DC",
    arrangement: "Remote",
    employment: "Full-time, contingent upon contract award or approved program funding",
    compensation: "$120,000 annual base salary (proposed)",
    locationDetails: "U.S. Remote, with periodic travel to Washington, DC and Rochester, NY",
    openings: "2 anticipated positions",
    status: "Anticipated Position — Accepting Expressions of Interest",
    description: `## About the team

[USATII](/about) develops and deploys enterprise software for organizations managing complex, mission-critical operations. Our engineering teams work directly with customers to understand operational requirements, build integrated systems, and maintain responsibility for the software throughout its production lifecycle.

Our Federal Engineering team brings together forward-deployed engineers, software architects, database specialists, cybersecurity professionals, and infrastructure engineers to modernize complex government information systems.

[DART](/emergency-management) is USATII's deployment and workforce management platform. It integrates personnel qualifications, professional development, training, workforce readiness, incident staffing, deployment operations, and historical reporting within a unified operational system.

We are building a federal engineering organization capable of transitioning government organizations from legacy technology to modern operational platforms while preserving data integrity, institutional knowledge, and continuity of mission-critical services.

## About the role

USATII is seeking Data Migration & Database Engineers to lead the technical migration, transformation, validation, and ongoing management of complex workforce and operational datasets within DART.

You will work directly with government database administrators, legacy-system owners, information management personnel, and USATII's engineering teams to understand existing data structures, establish migration strategies, and implement reliable processes for transitioning information into DART's [PostgreSQL](https://www.postgresql.org/docs/)-based architecture.

An initial area of focus is the potential modernization of [FEMA](https://www.fema.gov/)'s legacy Deployment Tracking System, for which USATII has submitted a Sources Sought response. The prospective implementation would involve migrating historical personnel, qualifications, training, deployment, incident, and organizational records while establishing reliable data exchange with existing government systems. No contract award has been made.

The challenge extends beyond transferring records between databases. Historical workforce information must remain accurate and explainable across changing personnel assignments, qualification requirements, deployments, organizational structures, and administrative decisions.

In August 2026, the [U.S. Government Accountability Office](https://files.gao.gov/reports/GAO-26-108427/index.html) identified limitations in FEMA's existing Deployment Tracking System, reporting that it could neither calculate workforce averages nor retrieve historical data retroactively. DART includes a workforce history reporting capability intended to address those limitations using retained or imported historical records.

You will help ensure that the data underlying those capabilities is accurate, traceable, secure, and suitable for government operational decision-making.

This is a hands-on engineering role. You will design database schemas, write complex [SQL](https://www.postgresql.org/docs/current/tutorial-sql.html), develop migration pipelines, investigate data inconsistencies, improve performance, and work directly with technical and operational stakeholders to resolve difficult data problems.

You will collaborate closely with USATII's [Principal Software Architect](/careers/roles/principal-software-architect-dart), [Federal Technical Program Manager](/careers/roles/federal-technical-program-manager-dart), [Forward Deployed Software Engineers](/careers/roles/forward-deployed-software-engineer-dart), [Integration Engineers](/careers/roles/forward-deployed-integration-engineer-dart), and cybersecurity personnel.

The position is primarily remote within the United States, with periodic travel for technical discovery, migration rehearsals, integration testing, and federal deployment activities.

## In this role, you will:

- Lead technical discovery of legacy government data environments, working with system owners to identify available records, database schemas, authoritative data sources, historical coverage, retention requirements, and constraints affecting migration.
- Design and implement repeatable migration pipelines for personnel records, organizational assignments, position qualifications, [Position Task Books](https://www.fema.gov/emergency-managers/nims/components/position-task-books), training histories, certifications, incident records, deployment assignments, equipment accountability, and related operational information.
- Develop production-grade data transformation and validation processes using PostgreSQL, SQL, [TypeScript](https://www.typescriptlang.org/docs/), [Python](https://docs.python.org/3/), and appropriate data engineering tools.
- Design canonical data models that consolidate information from multiple legacy systems while preserving original source identifiers, record provenance, relationships, and historical context.
- Establish entity-resolution procedures for matching personnel and organizational records across systems, including duplicate detection, conflicting identifiers, incomplete profiles, and reviewed identity consolidation.
- Implement migration processes that preserve qualification histories, versioned requirements, evidence records, mentorship assignments, independent review decisions, certification renewals, revocations, and relevant administrative actions.
- Develop mechanisms for preserving the temporal integrity of workforce information, distinguishing when an operational event took effect from when the corresponding information was entered, corrected, or imported.
- Support DART's historical workforce reporting capabilities, including reconstruction of past workforce counts, qualification coverage, availability, deployment commitments, organizational staffing levels, and period averages.
- Ensure that historical reports distinguish incomplete or unavailable source information from confirmed zero values, preserving accurate representations of uncertainty and preventing unsupported reconstruction of missing records.
- Build data-quality assessment tools that identify missing required fields, inconsistent dates, invalid relationships, duplicate transactions, incompatible qualification records, and conflicts between authoritative data sources.
- Establish comprehensive reconciliation procedures covering source-to-target record counts, field-level comparisons, referential integrity, transformation results, migration exceptions, and government-approved acceptance criteria.
- Develop controlled bulk-import capabilities using staging tables, validated mappings, transaction boundaries, version checks, preview environments, and approval workflows before changes are committed to authoritative application records.
- Design migration processes that can be safely repeated or resumed after interruptions, including idempotent operations, checkpointing, failure isolation, rollback procedures, and recovery from partially completed transfers.
- Work with Integration Engineers to implement ongoing synchronization between DART and authorized government data sources, including the handling of changed records, conflicting updates, stale information, and source-system ownership.
- Maintain and optimize DART's PostgreSQL infrastructure, including indexing, query execution plans, connection management, transaction performance, partitioning where appropriate, and efficient access to large historical datasets.
- Design and execute controlled database schema migrations, ensuring that application releases can introduce new data structures without corrupting existing records or interrupting critical operational workflows.
- Collaborate with cybersecurity engineers to implement appropriate database access restrictions, encryption, audit logging, protected-data handling, retention controls, and safeguards for personally identifiable information.
- Participate in security and privacy reviews by documenting data classifications, database permissions, external data flows, migration tooling, audit records, and the technical controls used to protect sensitive information.
- Build automated migration tests using representative datasets, including incomplete records, conflicting identifiers, historical corrections, expired qualifications, concurrent deployments, and complex organizational relationships.
- Execute migration rehearsals in controlled environments, produce documented reconciliation results, investigate discrepancies, and establish criteria for approving or rejecting proposed migration batches.
- Develop and support phased migration strategies that account for legacy-system coexistence, incremental data updates, operational cutover, and recovery procedures if a transition encounters problems.
- Work with government data owners and technical stakeholders to establish verifiable migration completion criteria, resolve exceptions, and document records that cannot be transferred or reconstructed reliably.
- Investigate difficult production database issues involving performance degradation, inconsistent historical results, failed transactions, incomplete synchronization, or unexpected application behavior.
- Create database architecture documentation, data dictionaries, transformation specifications, migration runbooks, reconciliation reports, and maintenance procedures that support future federal deployments.
- Identify opportunities to improve DART's reusable data ingestion, migration, validation, historical reporting, and database administration capabilities across government and enterprise customers.

## You might thrive in this role if you:

- Have 4+ years of professional experience in data engineering, database engineering, enterprise data migration, or backend software engineering involving complex relational data systems.
- Have substantial production experience with PostgreSQL, including relational schema design, SQL optimization, indexing, transactions, constraints, database migrations, and query performance analysis.
- Are proficient in SQL and at least one general-purpose programming language used for data engineering, such as Python, TypeScript, [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), or [Java](https://dev.java/learn/).
- Have designed or implemented migration pipelines transferring substantial datasets between enterprise applications, database platforms, or legacy information systems.
- Understand data extraction, transformation, loading, validation, reconciliation, and exception handling, including techniques for creating repeatable and independently verifiable migration results.
- Have experience working with complex relational datasets containing interconnected entities, historical records, changing business rules, and multiple authoritative data sources.
- Understand temporal data modeling, including effective dates, transaction dates, historical corrections, slowly changing dimensions, and reconstruction of business conditions at a previous point in time.
- Can design migration processes that remain reliable when confronted with incomplete records, inconsistent identifiers, unexpected schema variations, duplicate transactions, and conflicting source information.
- Have implemented data-quality controls, including schema validation, referential integrity checks, reconciliation reports, anomaly detection, and automated verification procedures.
- Understand database concurrency, isolation levels, transactional consistency, locking behavior, and techniques for safely processing large batches of records.
- Have experience optimizing database performance through query analysis, indexing strategies, partitioning, caching where appropriate, and efficient data access patterns.
- Are familiar with asynchronous data processing, scheduled pipelines, event-driven ingestion, and integration with external enterprise systems.
- Have experience with database backup, restoration, replication, disaster recovery, and the operational considerations involved in maintaining production relational databases.
- Understand the security implications of handling sensitive personnel information, including database permissions, access logging, encryption, data minimization, and controlled exports.
- Can independently investigate unfamiliar database structures, reverse-engineer existing data relationships, and develop migration specifications from incomplete technical documentation.
- Have experience working with application engineers to evolve database schemas while maintaining compatibility with existing application functionality and production data.
- Are comfortable conducting technical discovery directly with customer database administrators, enterprise architects, operational users, and information security personnel.
- Can document complex data transformations and communicate migration risks, reconciliation findings, and technical dependencies clearly to engineering teams and government stakeholders.
- Exercise sound engineering judgment when deciding whether data should be migrated, flagged for review, excluded, or preserved in its original form.
- Take responsibility for the correctness of production data and understand that inaccurate records can directly affect operational decisions.
- Hold a degree in computer science, software engineering, information systems, data engineering, or a related discipline, or possess equivalent substantial professional experience.

Experience migrating federal personnel systems, workforce management platforms, learning management systems, qualification databases, or emergency management applications is particularly valuable.

Familiarity with [AWS GovCloud](https://aws.amazon.com/govcloud-us/), managed PostgreSQL infrastructure, federal data retention requirements, and [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) security controls is beneficial. The federal control framework addresses access management, auditability, information integrity, and privacy protections relevant to databases containing sensitive personnel information.

Prior federal contracting experience is not required for every candidate. We value demonstrated technical ability, rigorous engineering practices, attention to data integrity, and experience maintaining complex production systems.

## About USATII

USATII is a U.S.-based enterprise software engineering company focused on designing, building, and deploying operational software and private AI systems.

We work directly with organizations to understand complex business processes, develop integrated technology solutions, and support those systems throughout their operational lifecycle.

Our approach emphasizes technical ownership, direct collaboration between engineers and customers, configurable enterprise architectures, and software that organizations can control and sustain over the long term.

USATII is privately held and operates from Rochester, New York, serving commercial and prospective public-sector customers.

USATII is an equal opportunity employer and considers qualified applicants without regard to legally protected characteristics. Reasonable accommodations are available during the application process.

## Compensation

The proposed base salary for this position is $120,000 annually.

Additional compensation, employee benefits, and employment terms will be determined through an approved employment offer and communicated during recruitment.

This position is associated with prospective federal software engineering, data migration, and implementation activities. Full-time employment is contingent upon contract award, approved program funding, and final staffing requirements.

Candidates may be considered for subsequent federal deployments or other USATII engineering opportunities based on qualifications and organizational needs.

Any customer-specific citizenship, suitability, security clearance, or work-location requirements will be communicated once established for the applicable engagement.`,
    displayLocation: "U.S. Remote / Washington, DC",
  },
  {
    slug: "govcloud-platform-devsecops-engineer-dart",
    title: "GovCloud Platform / DevSecOps Engineer, DART",
    team: "Federal Engineering",
    location: "U.S. Remote / Washington, DC",
    arrangement: "Remote",
    employment: "Full-time, contingent upon contract award or approved program funding",
    compensation: "$120,000 annual base salary (proposed)",
    locationDetails: "U.S. Remote, with periodic travel to Washington, DC and Rochester, NY",
    openings: "2 anticipated positions",
    status: "Anticipated Position — Accepting Expressions of Interest",
    description: `## About the team

[USATII](/about) develops and deploys enterprise software for organizations managing complex, mission-critical operations. Our engineering teams work directly with customers to design, build, deploy, and maintain integrated software systems throughout their operational lifecycle.

Our Federal Engineering team combines software architects, forward-deployed engineers, cybersecurity specialists, infrastructure engineers, and technical delivery personnel to implement enterprise platforms in secure government environments.

[DART](/emergency-management) is USATII's deployment and workforce management platform, integrating personnel qualifications, professional development, training, incident staffing, deployment operations, and historical workforce reporting.

We are building an engineering organization capable of deploying DART into government-controlled infrastructure while maintaining the security, availability, performance, and operational control required by mission-critical federal systems.

## About the role

USATII is seeking GovCloud Platform / DevSecOps Engineers to design, implement, automate, and operate the infrastructure supporting DART's prospective federal deployments.

An initial area of focus is the potential modernization of [FEMA](https://www.fema.gov/)'s legacy Deployment Tracking System, for which USATII has submitted a Sources Sought response. The proposed implementation would involve transitioning DART from its existing demonstration infrastructure into an appropriately authorized federal hosting environment.

DART is built using [Next.js](https://nextjs.org/docs), [React](https://react.dev/), [Node.js](https://nodejs.org/en/docs), and [PostgreSQL](https://www.postgresql.org/docs/). Its proposed federal architecture targets [AWS GovCloud](https://aws.amazon.com/govcloud-us/) (US-West), with containerized application services, dedicated background workers, managed PostgreSQL infrastructure, private networking, centralized monitoring, encrypted storage, and approved identity integration.

You will own substantial portions of this infrastructure from initial technical design through automated provisioning, security validation, deployment, performance testing, and production operations.

This is a hands-on engineering role requiring expertise in cloud infrastructure, infrastructure as code, software delivery automation, security engineering, and production reliability.

You will work closely with USATII's [Principal Software Architect](/careers/roles/principal-software-architect-dart), [Federal Technical Program Manager](/careers/roles/federal-technical-program-manager-dart), [Forward Deployed Software Engineers](/careers/roles/forward-deployed-software-engineer-dart), [Federal Security & ATO Engineers](/careers/roles/federal-security-ato-engineer-dart), and [Site Reliability Engineers](/careers/roles/site-reliability-engineer-dart).

## In this role, you will:

- Design and implement DART's production infrastructure within approved AWS GovCloud environments, including virtual networking, container orchestration, compute services, databases, object storage, encryption, and operational monitoring.

- Deploy and maintain containerized Next.js and Node.js application services, background workers, scheduled processing jobs, and related components using [AWS ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html), [Fargate](https://aws.amazon.com/fargate/), or other government-approved infrastructure.

- Provision and administer managed PostgreSQL environments, including connectivity restrictions, database encryption, backup configuration, availability planning, and controlled database maintenance.

- Develop reusable infrastructure-as-code modules using [Terraform](https://developer.hashicorp.com/terraform/docs), [OpenTofu](https://opentofu.org/docs/), [AWS CloudFormation](https://aws.amazon.com/cloudformation/), or approved equivalents, ensuring that environments can be provisioned consistently and reviewed before activation.

- Establish secure and repeatable deployment pipelines incorporating source control, automated builds, dependency scanning, software artifact verification, infrastructure validation, approval gates, and controlled production releases.

- Implement strong separation between development, testing, staging, and production environments, including independent credentials, network policies, application configurations, and protected-data handling.

- Configure enterprise identity integration, service identities, least-privilege IAM policies, secrets management, and secure authentication between application services and supporting infrastructure.

- Establish network isolation and controlled communication paths involving private subnets, security groups, permitted service endpoints, restricted administrative access, and approved government-system connections.

- Integrate infrastructure logging, application telemetry, audit records, and security events with centralized monitoring services and government-designated security systems.

- Implement vulnerability management, infrastructure configuration scanning, container image assessment, patch automation, and secure configuration baselines.

- Build deployment mechanisms supporting progressive releases, health verification, automated rollback, configuration validation, and prevention of unintended cross-environment operations.

- Design and validate infrastructure supporting DART's proposed availability and recovery objectives, including database backup, service recovery, restoration procedures, and disaster recovery rehearsals.

- Conduct capacity planning and performance testing for major incident scenarios involving concurrent users, personnel processing, deployment changes, bulk imports, reporting, and notification workloads.

- Design infrastructure scaling and workload-isolation mechanisms so computationally expensive background processing does not interfere with time-sensitive operational functions.

- Collaborate with Federal Security & ATO Engineers to document inherited controls, cloud-service responsibilities, infrastructure diagrams, system boundaries, configuration baselines, and technical evidence required for authorization assessment.

- Support technical discovery with government infrastructure and security teams to understand approved connectivity, identity services, monitoring requirements, administrative procedures, and deployment constraints.

- Investigate complex infrastructure incidents involving degraded performance, service failures, network restrictions, database connectivity, resource exhaustion, or unsuccessful software deployments.

- Establish operational runbooks, environment documentation, maintenance procedures, recovery instructions, and infrastructure change records that support long-term federal sustainment.

- Identify reusable infrastructure and automation patterns that improve the security, reliability, and repeatability of USATII's future government deployments.

## You might thrive in this role if you:

- Have 4+ years of professional experience in cloud infrastructure, DevOps, platform engineering, or site reliability engineering.

- Have substantial hands-on experience with [AWS](https://aws.amazon.com/) networking, IAM, compute services, managed databases, logging, and infrastructure automation.

- Are proficient with Terraform, [CloudFormation](https://aws.amazon.com/cloudformation/), or comparable infrastructure-as-code technologies.

- Have deployed and operated containerized applications using [Docker](https://docs.docker.com/) and [ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html), [Kubernetes](https://kubernetes.io/docs/), or equivalent orchestration platforms.

- Understand secure networking, private connectivity, DNS, certificates, TLS, endpoint policies, and cloud security boundaries.

- Have implemented CI/CD pipelines incorporating automated testing, security scanning, release approvals, deployment verification, and rollback.

- Have experience operating PostgreSQL or comparable production relational databases, including backup, recovery, monitoring, and maintenance.

- Understand least-privilege IAM design, secrets management, encryption, service authentication, and infrastructure configuration security.

- Can investigate difficult production failures involving networking, application services, databases, background workers, and cloud infrastructure.

- Have experience implementing observability, alerting, capacity management, and disaster recovery procedures.

- Are comfortable writing infrastructure automation and operational tooling in [Python](https://docs.python.org/3/), [TypeScript](https://www.typescriptlang.org/docs/), [Bash](https://www.gnu.org/software/bash/manual/), or another suitable language.

- Can work directly with federal technical stakeholders and translate infrastructure constraints into practical engineering decisions.

- Have experience supporting compliance-sensitive or mission-critical software with strict change management and operational accountability.

Experience with AWS GovCloud, [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final), [FedRAMP](https://www.fedramp.gov/)-authorized services, [FISMA](https://csrc.nist.gov/topics/laws-and-regulations/laws/fisma), or federal information-system authorization is particularly valuable.

A degree in computer science, software engineering, information technology, or a related discipline is preferred. Equivalent substantial professional experience will also be considered.

## About USATII

USATII is a U.S.-based enterprise software engineering company focused on designing, building, and deploying operational software and private AI systems.

We work directly with organizations to understand complex business processes, develop integrated technology solutions, and support those systems throughout their operational lifecycle.

Our approach emphasizes technical ownership, direct collaboration between engineers and customers, configurable enterprise architectures, and software that organizations can control and sustain over the long term.

USATII is privately held and operates from Rochester, New York, serving commercial and prospective public-sector customers.

USATII is an equal opportunity employer and considers qualified applicants without regard to legally protected characteristics. Reasonable accommodations are available during the application process.

## Compensation

The proposed base salary for this position is $120,000 annually.

Additional compensation, employee benefits, and employment terms will be determined through an approved employment offer.

This is an anticipated position associated with prospective federal software implementation activities. Full-time employment is contingent upon contract award, approved funding, and confirmed staffing requirements.

Any customer-specific citizenship, suitability, security-clearance, or work-location requirements will be communicated once established.`,
    displayLocation: "U.S. Remote / Washington, DC",
  },
  {
    slug: "federal-security-ato-engineer-dart",
    title: "Federal Security & ATO Engineer, DART",
    team: "Federal Security Engineering",
    location: "Washington, DC",
    arrangement: "Hybrid",
    employment: "Full-time, contingent upon contract award or approved program funding",
    compensation: "$120,000 annual base salary (proposed)",
    locationDetails: "Hybrid — Washington, DC, with U.S.-remote engineering work",
    openings: "2 anticipated positions",
    status: "Anticipated Position — Accepting Expressions of Interest",
    description: `## About the team

[USATII](/about)'s Federal Security Engineering team is responsible for implementing and validating the security controls required to deploy enterprise software in regulated government environments.

Our work spans application security, cloud infrastructure, identity and access management, secure software development, system monitoring, privacy engineering, and federal authorization support.

[DART](/emergency-management) is USATII's deployment and workforce management platform. It maintains sensitive operational information involving personnel records, qualifications, training, workforce readiness, incidents, deployment assignments, and administrative decisions.

We are developing the technical capabilities, documentation, and operational procedures needed to prepare DART for prospective high-impact federal production environments.

## About the role

USATII is seeking Federal Security & ATO Engineers to lead cybersecurity engineering and support the security authorization process for DART.

You will work directly with government cybersecurity personnel, system owners, information-system security officers, technical assessors, and USATII's engineering teams to ensure that DART's security controls are appropriate for its intended federal operating environment.

An initial area of focus is the potential modernization of [FEMA](https://www.fema.gov/)'s legacy Deployment Tracking System. DART's proposed federal architecture targets [AWS GovCloud](https://aws.amazon.com/govcloud-us/), with security controls informed by the [NIST Risk Management Framework](https://csrc.nist.gov/projects/risk-management) and applicable [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) requirements.

DART currently implements application-level authentication, role-based access controls, organizational permissions, protected operations, and audit histories. Federal production deployment requires further security engineering, control validation, documentation, independent assessment, and government authorization.

You will be directly responsible for translating these requirements into implemented safeguards and defensible technical evidence.

This is a hands-on security engineering position. You will review architecture, inspect source code, assess infrastructure configurations, develop security controls, coordinate remediation, and work with government stakeholders throughout authorization and production operations.

The role does not independently grant an [Authority to Operate](https://csrc.nist.gov/projects/risk-management/about-rmf/authorize-step). Authorization decisions remain with the designated government authorizing official.

## In this role, you will:

- Lead technical preparation for DART's federal authorization process, including system boundary definition, security categorization support, control implementation, assessment readiness, remediation, and continuous monitoring.

- Translate applicable NIST SP 800-53 controls and agency-specific security requirements into concrete engineering tasks, technical configurations, verification procedures, and documented evidence.

- Develop and maintain security documentation, including System Security Plan contributions, network and data-flow diagrams, control implementation statements, configuration baselines, and Plans of Action and Milestones.

- Evaluate DART's architecture across application services, APIs, databases, authentication systems, background workers, external integrations, cloud infrastructure, administrative interfaces, and security-relevant deployment tooling.

- Review and strengthen application authorization mechanisms involving personnel records, qualifications, incidents, deployment decisions, organizational permissions, and privileged administrative functions.

- Implement and validate least-privilege access, separation of duties, account lifecycle controls, session management, service authentication, and protection of sensitive application operations.

- Support integration with FEMA-approved enterprise identity infrastructure, including applicable MFA, identity federation, privileged access requirements, and PIV/CAC authentication policies.

- Work with [GovCloud Platform Engineers](/careers/roles/govcloud-platform-devsecops-engineer-dart) to establish secure network boundaries, encryption, key management, service identities, secrets protection, hardened configurations, and approved external connectivity.

- Develop technical controls for protecting sensitive personnel information, including access restrictions, auditability, data minimization, controlled exports, retention requirements, and approved transmission mechanisms.

- Establish application and infrastructure audit requirements covering authentication events, denied access, privileged actions, record changes, integration activity, security configuration changes, and operational investigations.

- Coordinate vulnerability scanning, software dependency assessments, container security reviews, code analysis, penetration testing, and technical remediation.

- Maintain security findings, remediation priorities, assigned owners, verification evidence, and risk documentation through a controlled assessment and remediation process.

- Evaluate third-party dependencies, software components, cloud services, and external integrations for security implications and authorization-boundary effects.

- Coordinate security control inheritance and shared-responsibility documentation between USATII, cloud providers, specialized subcontractors, and government system owners.

- Prepare technical evidence for independent security assessors, including implemented configuration details, access-control test results, audit demonstrations, vulnerability findings, and remediation records.

- Participate in security architecture reviews, government assessment meetings, authorization preparation, and technical discussions with designated security authorities.

- Develop incident-response procedures covering security alert triage, investigation, evidence preservation, containment, technical recovery, and required escalation.

- Establish continuous monitoring procedures for vulnerabilities, configuration changes, privileged activity, access-control effectiveness, security events, and recurring control assessments.

- Work alongside software engineers to resolve vulnerabilities and implement secure engineering patterns that become reusable components of DART's underlying platform.

- Contribute to security training, operational documentation, and long-term federal security engineering practices.

## You might thrive in this role if you:

- Have 5+ years of professional experience in cybersecurity engineering, security architecture, application security, cloud security, or federal information-system authorization.

- Have directly implemented or assessed NIST SP 800-53 security controls within enterprise or federal production systems.

- Understand [FISMA](https://csrc.nist.gov/topics/laws-and-regulations/laws/fisma), the NIST Risk Management Framework, system authorization boundaries, inherited controls, control assessments, and continuous monitoring.

- Have participated in a federal ATO effort and contributed technical documentation, assessment evidence, control implementation, or remediation work.

- Possess substantial hands-on experience assessing software applications, APIs, authentication systems, databases, cloud infrastructure, and network security configurations.

- Understand identity federation, least-privilege authorization, privileged access controls, multifactor authentication, audit logging, and protection of sensitive government data.

- Have experience using vulnerability management, source-code analysis, infrastructure scanning, software supply-chain security, or penetration-testing tools.

- Can independently review software or cloud infrastructure and identify meaningful security weaknesses.

- Are proficient in [Python](https://docs.python.org/3/), [TypeScript](https://www.typescriptlang.org/docs/), [Go](https://go.dev/doc/), or another programming language suitable for security automation and technical investigation.

- Have experience with [AWS](https://aws.amazon.com/) security architecture, including IAM, VPC controls, KMS, CloudTrail, security monitoring, and infrastructure configuration management.

- Can communicate security findings clearly to software engineers, technical program managers, government stakeholders, and security assessors.

- Are comfortable investigating ambiguous security problems, prioritizing remediation, and maintaining accurate evidence of what has actually been implemented.

- Can distinguish a documented security policy from an operating technical control and design effective methods of verifying both.

Experience with AWS GovCloud, [DHS](https://www.dhs.gov/) security requirements, federal high-impact information systems, or previous government authorization efforts is especially valuable.

Relevant certifications such as [CISSP](https://www.isc2.org/certifications/cissp), [CISM](https://www.isaca.org/credentialing/cism), [CCSP](https://www.isc2.org/certifications/ccsp), or comparable credentials are beneficial but are not substitutes for demonstrated engineering and authorization experience.

## About USATII

USATII is a U.S.-based enterprise software engineering company focused on designing, building, and deploying operational software and private AI systems.

We work directly with organizations to understand complex business processes, develop integrated technology solutions, and support those systems throughout their operational lifecycle.

Our approach emphasizes technical ownership, direct collaboration between engineers and customers, configurable enterprise architectures, and software that organizations can control and sustain over the long term.

USATII is privately held and operates from Rochester, New York, serving commercial and prospective public-sector customers.

USATII is an equal opportunity employer and considers qualified applicants without regard to legally protected characteristics. Reasonable accommodations are available during the application process.

## Compensation

The proposed base salary for this position is $120,000 annually.

Additional compensation, employee benefits, and employment terms will be determined through an approved employment offer.

Full-time employment is contingent upon contract award, approved funding, and final program staffing requirements.

Any citizenship, suitability, public-trust, security-clearance, or work-location requirements will be specified when established for the applicable customer engagement.`,
  },
  {
    slug: "software-quality-accessibility-engineer-dart",
    title: "Software Quality & Accessibility Engineer, DART",
    team: "Federal Engineering",
    location: "U.S. Remote",
    arrangement: "Remote",
    employment: "Full-time, contingent upon contract award or approved program funding",
    compensation: "$120,000 annual base salary (proposed)",
    locationDetails: "U.S. Remote, with periodic travel to Washington, DC",
    openings: "2 anticipated positions",
    status: "Anticipated Position — Accepting Expressions of Interest",
    description: `## About the team

[USATII](/about) develops enterprise software for organizations managing complex, mission-critical operations. Our engineers work directly with customers to design, implement, and maintain integrated software systems that support consequential operational decisions.

Our Federal Engineering team combines forward-deployed software engineers, systems architects, cybersecurity specialists, infrastructure engineers, and quality engineering professionals to deliver secure and reliable government technology.

[DART](/emergency-management) is USATII's deployment and workforce management platform. It integrates personnel qualification, professional development, training, workforce readiness, incident staffing, deployment tracking, and historical reporting into a unified operational environment.

We are building a quality engineering function capable of independently evaluating the correctness, accessibility, performance, and operational readiness of DART as it is adapted to federal customer requirements.

## About the role

USATII is seeking Software Quality & Accessibility Engineers to establish and execute the verification processes supporting DART's prospective federal deployment.

You will be responsible for ensuring that DART's application workflows behave correctly under real operational conditions and satisfy applicable quality, accessibility, performance, integration, and security requirements.

An initial area of focus is the potential modernization of [FEMA](https://www.fema.gov/)'s legacy Deployment Tracking System. DART's existing functionality addresses the 17 functional subtasks identified in the Sources Sought response, spanning personnel readiness, incident management, deployment operations, reporting, system administration, and communications.

You will design comprehensive test strategies for these capabilities, develop automated verification systems, evaluate application accessibility, and work directly with government stakeholders during user acceptance testing and production transition.

The role requires substantial technical independence. You will be expected to challenge incomplete requirements, identify defects in complex business rules, construct adversarial test scenarios, and produce credible evidence of system performance.

You will collaborate with [Forward Deployed Software Engineers](/careers/roles/forward-deployed-software-engineer-dart), the [Principal Software Architect](/careers/roles/principal-software-architect-dart), [Integration Engineers](/careers/roles/forward-deployed-integration-engineer-dart), [Federal Security & ATO Engineers](/careers/roles/federal-security-ato-engineer-dart), and government test representatives.

## In this role, you will:

- Develop and maintain a comprehensive quality engineering strategy covering functional correctness, integration behavior, performance, accessibility, security-related application behavior, reliability, and production release readiness.

- Establish requirements traceability between DART's documented functional capabilities, government-approved acceptance criteria, automated tests, manual validation procedures, defects, and release evidence.

- Build and maintain automated end-to-end testing systems using [Playwright](https://playwright.dev/), [Cypress](https://docs.cypress.io/), or equivalent technologies for DART's browser-based workflows.

- Develop functional tests for personnel qualification management, including [Position Task Book](https://www.fema.gov/emergency-managers/nims/components/position-task-books) assignments, prerequisite checks, evidence submission, mentor review, independent approval, qualification decisions, renewals, and revocations.

- Verify training and professional development workflows involving course enrollment, required prerequisites, completed training, certification histories, and related personnel readiness determinations.

- Test complex incident staffing and deployment scenarios involving overlapping assignments, availability conflicts, missing qualifications, deployment eligibility, approval hierarchies, travel status, extensions, and demobilization.

- Validate historical workforce reporting against controlled reference datasets, ensuring that daily staffing counts, period averages, qualification histories, and deployment records remain correct after historical changes or data migration.

- Design negative and adversarial tests that verify users cannot access records, execute actions, modify qualifications, export information, or approve operations beyond their authorized permissions.

- Build automated API and integration tests covering request validation, authentication, authorization, transaction handling, external data synchronization, asynchronous processing, and failure recovery.

- Test data migration workflows using deliberately incomplete, duplicated, inconsistent, and historically corrected records to verify reconciliation behavior and preservation of data integrity.

- Conduct application performance and load testing against agreed workload models, including sustained user activity, incident-related surges, bulk operations, report generation, and notification processing.

- Establish repeatable performance measurements covering latency, throughput, error rates, database behavior, concurrent sessions, and recovery after infrastructure or external-system failures.

- Evaluate DART's interfaces against applicable [Section 508](https://www.section508.gov/) accessibility requirements, including keyboard navigation, focus management, screen-reader compatibility, form controls, tables, dialogs, status messages, and error handling.

- Conduct manual assistive technology testing using tools such as [NVDA](https://www.nvaccess.org/), [JAWS](https://www.freedomscientific.com/products/software/jaws/), [VoiceOver](https://www.apple.com/accessibility/vision/), and appropriate browser accessibility inspection utilities.

- Evaluate the accessibility of exported reports, supporting documents, training materials, administrative interfaces, and other applicable electronic content.

- Develop and maintain accessibility findings, remediation recommendations, conformance evidence, and supporting material for an [Accessibility Conformance Report](https://www.section508.gov/sell/acr/).

- Participate in formal integration testing, customer acceptance testing, operational exercises, and production readiness reviews with government stakeholders.

- Document discovered defects with reproducible steps, affected business rules, expected behavior, observed results, severity, and supporting evidence.

- Establish regression-testing requirements for releases affecting deployment operations, qualification logic, permissions, database schemas, security controls, or external system integrations.

- Work directly with engineering teams to identify root causes, verify corrections, and ensure that recurring failures result in improved automated coverage.

- Produce release-readiness reports documenting tested capabilities, results, unresolved defects, performance constraints, accessibility findings, and remaining acceptance risks.

## You might thrive in this role if you:

- Have 4+ years of professional experience in software quality engineering, test automation, software development in test, or comparable production software verification work.

- Have developed automated test suites for enterprise web applications using Playwright, Cypress, [Selenium](https://www.selenium.dev/documentation/), or equivalent tools.

- Are proficient in [TypeScript](https://www.typescriptlang.org/docs/), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [Python](https://docs.python.org/3/), or another language appropriate for test automation and technical investigation.

- Understand modern web application architecture, REST APIs, [SQL](https://www.postgresql.org/docs/current/tutorial-sql.html), relational databases, authentication, asynchronous processing, and CI/CD.

- Have experience validating applications with complex workflows, role-based permissions, historical records, approval processes, or operational business rules.

- Can design comprehensive test scenarios beyond ordinary successful user workflows, including concurrency problems, authorization failures, incomplete transactions, and inconsistent data.

- Have used performance-testing tools such as [k6](https://grafana.com/docs/k6/latest/), [JMeter](https://jmeter.apache.org/), or [Locust](https://docs.locust.io/) and understand how to interpret latency, throughput, saturation, and failure metrics.

- Understand Section 508 accessibility requirements and relevant [WCAG](https://www.w3.org/TR/WCAG22/) success criteria.

- Have performed manual accessibility testing with assistive technologies and understand the limitations of automated accessibility scanners.

- Have experience documenting accessibility findings, maintaining conformance evidence, or participating in formal accessibility evaluations.

- Can create representative test datasets that expose problems in application logic, reporting, database relationships, and migration behavior.

- Have participated in enterprise user acceptance testing, production release validation, or customer-facing technical acceptance activities.

- Can explain complex defects to engineers, program managers, and nontechnical operational stakeholders.

- Are comfortable taking independent ownership of quality concerns and escalating material risks before production deployment.

- Hold a degree in computer science, software engineering, information systems, or a related field, or have equivalent substantial professional experience.

Experience testing federal applications, regulated enterprise platforms, workforce management systems, or mission-critical operational software is particularly valuable.

[DHS Trusted Tester](https://www.section508.gov/test/trusted-tester/) certification or demonstrated familiarity with federal ICT accessibility testing procedures is beneficial.

## About USATII

USATII is a U.S.-based enterprise software engineering company focused on designing, building, and deploying operational software and private AI systems.

We work directly with organizations to understand complex business processes, develop integrated technology solutions, and support those systems throughout their operational lifecycle.

Our approach emphasizes technical ownership, direct collaboration between engineers and customers, configurable enterprise architectures, and software that organizations can control and sustain over the long term.

USATII is privately held and operates from Rochester, New York, serving commercial and prospective public-sector customers.

USATII is an equal opportunity employer and considers qualified applicants without regard to legally protected characteristics. Reasonable accommodations are available during the application process.

## Compensation

The proposed base salary for this position is $120,000 annually.

Additional compensation, employee benefits, and employment terms will be determined through an approved employment offer.

This position is associated with prospective federal software testing, accessibility validation, and implementation activities. Full-time employment is contingent upon contract award, approved funding, and confirmed staffing requirements.

Any customer-specific suitability, security-clearance, or work-location requirements will be communicated once established.`,
    displayLocation: "U.S. Remote",
  },
  {
    slug: "deployment-strategist-training-lead-dart",
    title: "Deployment Strategist / Training Lead, DART",
    team: "Federal Delivery",
    location: "Washington, DC",
    arrangement: "Hybrid",
    employment: "Full-time, contingent upon contract award or approved program funding",
    compensation: "$120,000 annual base salary (proposed)",
    locationDetails: "Hybrid — Washington, DC, with travel to approved federal deployment and training locations",
    openings: "1 anticipated position",
    status: "Anticipated Position — Accepting Expressions of Interest",
    description: `## About the team

[USATII](/about) develops enterprise software for organizations managing complex operational environments. Our engineering and delivery teams work directly with customers to understand their existing processes, implement integrated software, and support organizational adoption.

Our Federal Delivery organization combines forward-deployed engineering, program management, operational strategy, training, and technical support to ensure that software implementations achieve measurable mission outcomes.

[DART](/emergency-management) is USATII's deployment and workforce management platform. It supports personnel qualifications, training, workforce readiness, incident staffing, deployment operations, resource accountability, and historical reporting.

We are developing a federal delivery team capable of supporting organizational change across large, distributed workforces with different technical backgrounds, operating responsibilities, and levels of system access.

## About the role

USATII is seeking a Deployment Strategist / Training Lead to manage the operational adoption, workflow validation, and user enablement activities associated with DART's prospective federal deployments.

You will work directly with government program personnel, operational leadership, incident workforce coordinators, training administrators, qualification reviewers, and field responders to understand how their work is performed and ensure that DART supports their approved operating procedures.

An initial area of focus is the potential modernization of [FEMA](https://www.fema.gov/)'s legacy Deployment Tracking System. The proposed implementation would require preparing distinct user populations to transition from existing tools and procedures into DART while preserving continuity of active emergency management operations.

You will own the strategy for user adoption, role-specific instruction, operational readiness assessment, training materials, and phased organizational rollout.

This is a customer-facing role requiring analytical judgment, an understanding of complex operational processes, and the ability to work directly with engineering teams.

You will collaborate with USATII's [Federal Technical Program Manager](/careers/roles/federal-technical-program-manager-dart), [Forward Deployed Software Engineers](/careers/roles/forward-deployed-software-engineer-dart), training and workforce-management stakeholders, [Quality Engineers](/careers/roles/software-quality-accessibility-engineer-dart), and technical support personnel.

## In this role, you will:

- Lead operational discovery sessions with government workforce managers, qualification reviewers, training administrators, incident staffing personnel, deployment coordinators, supervisors, and responders.

- Document existing operating procedures, approval pathways, organizational responsibilities, training dependencies, and recurring administrative processes affected by DART's implementation.

- Translate operational findings into validated workflows, role-specific procedures, training requirements, and actionable recommendations for USATII's engineering teams.

- Develop a phased organizational adoption strategy covering initial implementation, pilot groups, early operational use, expanded deployment, and transition from legacy systems.

- Identify distinct user populations and establish training programs aligned with their actual responsibilities, technical experience, system privileges, and operational requirements.

- Develop role-specific training curricula for responders, supervisors, qualification reviewers, training coordinators, incident managers, deployment administrators, and system administrators.

- Design practical training exercises using representative DART workflows, including responding to deployment orders, documenting availability, submitting qualification evidence, reviewing [Position Task Books](https://www.fema.gov/emergency-managers/nims/components/position-task-books), approving assignments, and generating operational reports.

- Work with government subject-matter experts to validate qualification workflows, training prerequisites, readiness criteria, incident staffing procedures, and deployment rules against approved agency policy.

- Coordinate the creation and maintenance of user guides, searchable help content, administrative procedures, training presentations, interactive walkthroughs, and operational reference materials.

- Extend DART's existing in-application training resources, including searchable documentation, guided walkthroughs, exercise environments, and contextual support functionality.

- Establish measurable user proficiency criteria based on successful task completion, workflow accuracy, appropriate system use, and the ability to complete assigned responsibilities without instructor intervention.

- Conduct instructor-led training, practical workshops, administrator enablement sessions, and train-the-trainer programs for designated government personnel.

- Develop training scenarios representing routine personnel management, qualification reviews, active incident staffing, deployment modifications, equipment accountability, and demobilization.

- Support government user acceptance testing by organizing role-based exercises, collecting operational feedback, identifying workflow gaps, and communicating required changes to engineering leadership.

- Develop organizational communications and onboarding plans that explain implementation milestones, affected user groups, training requirements, approved procedural changes, and support resources.

- Coordinate phased rollout activities with the Federal Technical Program Manager, including user readiness verification, training completion, organizational approvals, and cutover preparation.

- Establish mechanisms for collecting and evaluating user feedback, including support requests, operational observations, training assessments, and documented workflow difficulties.

- Work with engineers and technical support personnel to distinguish software defects from training gaps, misunderstood business rules, incomplete documentation, or unapproved operational changes.

- Evaluate adoption through measurable indicators such as training completion, proficiency assessments, task success rates, workflow processing time, support demand, and unresolved user issues.

- Document lessons learned from rollout activities and translate recurring operational problems into reusable training materials, improved application guidance, or approved product enhancements.

- Support the transition to steady-state operations by establishing training ownership, administrator handoff procedures, continuing education resources, and processes for introducing new users or organizational groups.

## You might thrive in this role if you:

- Have 5+ years of experience in enterprise software implementation, technical program delivery, organizational change management, operations consulting, customer enablement, or training leadership.

- Have directly supported the adoption of complex software platforms involving multiple departments, organizational roles, approval processes, or distributed workforces.

- Can independently analyze an unfamiliar operational process and translate it into clear workflows, training requirements, and practical system improvements.

- Have developed role-based training programs for enterprise software, including instructor-led sessions, interactive exercises, documentation, and proficiency assessments.

- Understand adult learning principles, practical instructional design, and techniques for evaluating whether training has improved real job performance.

- Have experience facilitating workshops with operational leaders, technical personnel, administrators, and frontline users.

- Can develop documentation that makes complicated software functionality understandable without omitting important operational requirements.

- Are comfortable working directly with engineers to identify usability problems, incomplete workflows, and implementation issues affecting adoption.

- Have managed phased software rollouts or organizational transitions where operational continuity was important.

- Can establish quantitative measures of training effectiveness and user adoption, then use those results to improve rollout plans.

- Are comfortable traveling to customer locations and working directly with government personnel during training and implementation periods.

- Communicate clearly with senior stakeholders, technical teams, operational supervisors, and users with different levels of technical experience.

- Exercise sound judgment when navigating conflicting stakeholder expectations or identifying operational practices that require explicit government approval.

Experience with FEMA, emergency management operations, the [National Incident Management System](https://www.fema.gov/emergency-managers/nims), [Incident Command System](https://training.fema.gov/emiweb/is/icsresource/), Position Task Books, or federal workforce management is particularly valuable.

Experience with learning management systems, [SCORM](https://github.com/adlnet/xAPI-SCORM-Profile)-based learning content, training records, or enterprise instructional technology is beneficial.

A degree in business, public administration, emergency management, information systems, education, or a related discipline is preferred. Equivalent professional experience will also be considered.

## About USATII

USATII is a U.S.-based enterprise software engineering company focused on designing, building, and deploying operational software and private AI systems.

We work directly with organizations to understand complex business processes, develop integrated technology solutions, and support those systems throughout their operational lifecycle.

Our approach emphasizes technical ownership, direct collaboration between engineers and customers, configurable enterprise architectures, and software that organizations can control and sustain over the long term.

USATII is privately held and operates from Rochester, New York, serving commercial and prospective public-sector customers.

USATII is an equal opportunity employer and considers qualified applicants without regard to legally protected characteristics. Reasonable accommodations are available during the application process.

## Compensation

The proposed base salary for this position is $120,000 annually.

Additional compensation, employee benefits, and employment terms will be determined through an approved employment offer.

This position is associated with prospective federal software implementation, training, and organizational transition activities. Full-time employment is contingent upon contract award, approved funding, and final staffing requirements.

Any customer-specific suitability, security-clearance, or work-location requirements will be communicated once established.`,
  },
  {
    slug: "site-reliability-engineer-dart",
    title: "Site Reliability Engineer, DART",
    team: "Federal Infrastructure & Reliability",
    location: "U.S. Remote",
    arrangement: "Remote",
    employment: "Full-time, contingent upon contract award or approved program funding",
    compensation: "$120,000 annual base salary (proposed)",
    locationDetails: "U.S. Remote, with periodic travel to Washington, DC",
    openings: "2 anticipated positions",
    status: "Anticipated Position — Accepting Expressions of Interest",
    description: `## About the team

[USATII](/about) develops and deploys enterprise software for organizations managing complex, mission-critical operations. Our engineering teams retain technical responsibility for the systems they design, including their performance, availability, reliability, and continued operation in production.

Our Federal Infrastructure & Reliability team combines site reliability engineering, cloud infrastructure, software development, cybersecurity, and technical operations to maintain enterprise software in government environments.

[DART](/emergency-management) is USATII's deployment and workforce management platform. It integrates personnel qualifications, training, incident staffing, workforce readiness, deployment management, and operational reporting within a unified application.

We are building a reliability engineering function capable of supporting DART during routine government operations and periods of elevated mission activity, including major incidents requiring rapid workforce mobilization and coordination.

## About the role

USATII is seeking Site Reliability Engineers to operate, monitor, maintain, and continuously improve the reliability of DART's prospective federal production environment.

An initial area of focus is the potential modernization of [FEMA](https://www.fema.gov/)'s legacy Deployment Tracking System. DART's proposed federal deployment would support personnel readiness, incident staffing, deployment operations, and workforce accountability in a government-controlled cloud environment.

You will be responsible for maintaining the health of the application's production infrastructure, investigating operational incidents, improving observability, automating recovery procedures, and ensuring that the platform can continue supporting critical workflows during elevated demand or infrastructure failures.

DART's preliminary federal operating model proposes 99.9% monthly availability for agreed critical functions, a four-hour recovery time objective, and a recovery point objective of no more than 60 minutes. These targets require validation and customer approval before becoming production commitments.

You will help establish the engineering practices, operational safeguards, and recovery procedures needed to support those objectives.

This is a hands-on engineering role. You will investigate failures across application services, databases, cloud infrastructure, networking, external integrations, and background processing systems.

You will collaborate closely with [GovCloud Platform Engineers](/careers/roles/govcloud-platform-devsecops-engineer-dart), the [Principal Software Architect](/careers/roles/principal-software-architect-dart), [Forward Deployed Software Engineers](/careers/roles/forward-deployed-software-engineer-dart), [Federal Security & ATO Engineers](/careers/roles/federal-security-ato-engineer-dart), and application support personnel.

## In this role, you will:

- Own the operational reliability of DART's production application services, APIs, database infrastructure, background workers, integration services, and supporting cloud components.

- Establish and maintain service-level indicators and objectives covering application availability, response latency, transaction success, error rates, processing delays, and critical operational workflows.

- Develop centralized monitoring, alerting, operational dashboards, and health checks that provide actionable visibility into application and infrastructure behavior.

- Implement monitoring for critical DART workflows, including personnel authentication, qualification decisions, incident staffing, deployment changes, notification processing, and external data synchronization.

- Design alerting mechanisms that distinguish genuine operational incidents from routine changes in workload, avoiding excessive alert noise while maintaining visibility into critical failures.

- Coordinate production incident response, including event detection, severity classification, technical investigation, mitigation, restoration, documentation, and follow-up engineering work.

- Participate in a structured on-call rotation for critical incidents, working with additional trained engineers and approved support personnel to maintain primary and backup escalation coverage.

- Establish incident response procedures aligned with the proposed DART support model, including priority-based acknowledgment, triage, escalation, and restoration targets.

- Develop and maintain operational runbooks for common failures involving application services, database availability, authentication, integrations, job queues, notification delivery, and infrastructure resources.

- Implement automation for recurring operational tasks, including service health verification, infrastructure recovery, deployment validation, log collection, and controlled maintenance procedures.

- Design and test backup restoration, database recovery, service failover, and disaster recovery procedures against approved recovery objectives.

- Conduct failure-injection and recovery exercises involving unavailable application instances, database disruptions, interrupted background workers, integration failures, and temporary network outages.

- Monitor and optimize [PostgreSQL](https://www.postgresql.org/docs/) performance, including query latency, connection utilization, locking behavior, storage growth, replication health, and resource exhaustion.

- Investigate application performance degradation involving high concurrency, inefficient database operations, resource saturation, background processing delays, or external service dependencies.

- Implement capacity planning and scaling procedures for large-scale workforce activity, incident staffing surges, bulk imports, reporting jobs, and high notification volumes.

- Work with GovCloud Platform Engineers to establish reliable production deployment processes, including health-based rollout decisions, automated validation, safe rollback, and post-deployment monitoring.

- Collaborate with cybersecurity personnel to integrate security monitoring, privileged-access controls, audit retention, vulnerability remediation, and incident evidence preservation into operating procedures.

- Maintain operational change records, incident histories, root-cause analyses, recovery evidence, and service-performance reports.

- Lead technical post-incident reviews, identify contributing system weaknesses, and implement corrective engineering work that reduces the likelihood or impact of recurring failures.

- Work directly with application support personnel to investigate escalated user issues, identify systemic problems, and communicate expected restoration or mitigation steps.

- Develop reusable observability, recovery, and production operations tooling that strengthens DART and USATII's broader enterprise software infrastructure.

## You might thrive in this role if you:

- Have 4+ years of professional experience in site reliability engineering, production infrastructure, DevOps, platform engineering, or backend operations.

- Have operated production applications requiring high availability, controlled deployments, dependable monitoring, and effective incident response.

- Have strong experience with [AWS](https://aws.amazon.com/) infrastructure, Linux systems, networking, containers, databases, and cloud-based application environments.

- Understand observability systems, including metrics, logs, tracing, alerting, service-level indicators, and service-level objectives.

- Have investigated and resolved serious production incidents involving unavailable services, database failures, network connectivity, degraded performance, or distributed system behavior.

- Understand PostgreSQL operations, including performance monitoring, transactions, backups, replication, database connections, and recovery.

- Have experience implementing automated deployment checks, infrastructure recovery tools, controlled rollouts, and rollback procedures.

- Can develop operational automation using [Python](https://docs.python.org/3/), [TypeScript](https://www.typescriptlang.org/docs/), [Go](https://go.dev/doc/), [Bash](https://www.gnu.org/software/bash/manual/), or comparable programming languages.

- Understand distributed systems reliability, including timeouts, retries, idempotency, message processing, partial failures, and asynchronous workloads.

- Have designed or participated in disaster recovery exercises and understand recovery time and recovery point objectives.

- Can perform systematic root-cause analysis and translate incident findings into technical improvements.

- Are comfortable participating in scheduled on-call duties and responding methodically to production incidents.

- Can communicate operational incidents clearly to software engineers, government technical stakeholders, program managers, and customer support personnel.

- Exercise sound engineering judgment under pressure and understand the importance of change control in sensitive production environments.

- Hold a degree in computer science, software engineering, information technology, or a related discipline, or possess equivalent professional experience.

Experience with [AWS GovCloud](https://aws.amazon.com/govcloud-us/), federal production systems, [FedRAMP](https://www.fedramp.gov/)-related infrastructure requirements, or mission-critical government software is particularly valuable.

Familiarity with [NIST security controls](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final), controlled production environments, and formal incident reporting procedures is beneficial.

## About USATII

USATII is a U.S.-based enterprise software engineering company focused on designing, building, and deploying operational software and private AI systems.

We work directly with organizations to understand complex business processes, develop integrated technology solutions, and support those systems throughout their operational lifecycle.

Our approach emphasizes technical ownership, direct collaboration between engineers and customers, configurable enterprise architectures, and software that organizations can control and sustain over the long term.

USATII is privately held and operates from Rochester, New York, serving commercial and prospective public-sector customers.

USATII is an equal opportunity employer and considers qualified applicants without regard to legally protected characteristics. Reasonable accommodations are available during the application process.

## Compensation

The proposed base salary for this position is $120,000 annually.

Additional compensation, employee benefits, and employment terms will be determined through an approved employment offer.

The position is expected to involve scheduled on-call responsibilities following production deployment. The applicable rotation, working arrangements, and compensation policies will be established before employment.

Full-time employment is contingent upon contract award, approved funding, and final staffing requirements.

Any customer-specific suitability, security-clearance, or work-location requirements will be communicated once established.`,
    displayLocation: "U.S. Remote",
  },
  {
    slug: "federal-service-desk-application-support-specialist-dart",
    title: "Federal Service Desk / Application Support Specialist, DART",
    team: "Federal Customer Operations",
    location: "U.S. Remote / Washington, DC",
    arrangement: "Remote",
    employment: "Full-time, contingent upon contract award or approved program funding",
    compensation: "$120,000 annual base salary (proposed)",
    locationDetails: "U.S. Remote, with periodic on-site engagement in Washington, DC",
    openings: "2 anticipated positions",
    status: "Anticipated Position — Accepting Expressions of Interest",
    description: `## About the team

[USATII](/about) develops and deploys enterprise software for organizations managing complex, mission-critical operations. Our teams work directly with customers to implement integrated systems and remain responsible for the customer experience throughout production operations.

Our Federal Customer Operations team provides technical support, user enablement, application administration, incident coordination, and operational feedback management for government software deployments.

[DART](/emergency-management) is USATII's deployment and workforce management platform. It supports personnel qualifications, professional development, training, incident staffing, deployment operations, resource accountability, communications, and reporting.

We are developing a federal application support function that connects users directly with the engineers and technical specialists responsible for the systems they use.

## About the role

USATII is seeking Federal Service Desk / Application Support Specialists to provide technical application support, incident intake, user administration assistance, and operational troubleshooting for DART.

An initial area of focus is the potential modernization of [FEMA](https://www.fema.gov/)'s legacy Deployment Tracking System. The proposed implementation would introduce DART to government personnel with different operational responsibilities, technical backgrounds, and levels of system access.

You will serve as a primary contact for authorized government users experiencing technical difficulties, requesting application assistance, reporting defects, or seeking clarification about DART's functionality.

You will be expected to understand the platform's operational workflows in sufficient detail to distinguish user errors, incomplete records, incorrect permissions, application defects, integration failures, and incidents requiring engineering intervention.

DART's proposed production support model includes routine administration and user support Monday through Friday, 8:00 a.m.–6:00 p.m. Eastern Time, together with separately staffed 24/7 technical escalation for Priority 1 and Priority 2 incidents.

You will help operate this support model, maintain accurate service records, route critical incidents to the appropriate engineering personnel, and communicate clearly with affected government users.

This is a technically engaged customer operations role. You will have access to approved diagnostic and administrative tools, collaborate directly with software engineers, and contribute to improvements that reduce recurring support needs.

You will work closely with the [Federal Technical Program Manager](/careers/roles/federal-technical-program-manager-dart), [Site Reliability Engineers](/careers/roles/site-reliability-engineer-dart), [Forward Deployed Software Engineers](/careers/roles/forward-deployed-software-engineer-dart), cybersecurity personnel, and [Deployment Strategist / Training Lead](/careers/roles/deployment-strategist-training-lead-dart).

## In this role, you will:

- Provide authorized government users with technical assistance for DART's personnel management, qualifications, training, workforce readiness, incident staffing, deployment tracking, equipment management, and reporting workflows.

- Receive, document, classify, prioritize, and track service requests, application defects, user access issues, operational questions, and production incidents through an approved service management system.

- Investigate support requests by examining reported application behavior, permitted diagnostic information, workflow status, error messages, audit records, and relevant system documentation.

- Help users resolve common problems involving authentication, account activation, navigation, data entry, application permissions, workflow completion, and approved administrative procedures.

- Support account onboarding and access administration by coordinating with designated government authorities, verifying required approvals, and following established identity and privilege management procedures.

- Assist personnel with qualification and [Position Task Book](https://www.fema.gov/emergency-managers/nims/components/position-task-books) workflows, including understanding required evidence, review status, missing prerequisites, assignment visibility, and applicable system procedures.

- Support incident staffing and deployment users with approved application operations involving personnel availability, staffing requests, assignment status, notifications, deployment updates, and operational reporting.

- Help training administrators and end users navigate course enrollment, training records, certification visibility, prerequisite requirements, and related learning workflows.

- Support application users working with equipment records, organizational assignments, data imports, search tools, and configurable administrative interfaces.

- Troubleshoot reporting and data-display issues by validating user permissions, report filters, record dates, available data, and known source-system synchronization conditions.

- Distinguish problems that can be resolved through approved user guidance or administration from defects, data-quality incidents, access-control problems, and system failures requiring specialist investigation.

- Escalate application defects and technical incidents to Forward Deployed Software Engineers, [Integration Engineers](/careers/roles/forward-deployed-integration-engineer-dart), Site Reliability Engineers, or cybersecurity specialists according to documented procedures.

- Participate in priority-based incident management by ensuring accurate issue classification, timely escalation, affected-user communication, and consistent status updates.

- Maintain awareness of the proposed DART incident service levels and help the support organization track acknowledgment, triage, escalation, and resolution performance.

- Work with Site Reliability Engineers during serious production incidents by consolidating user reports, communicating approved workarounds, tracking affected workflows, and documenting service restoration.

- Maintain accurate service records including ticket history, incident severity, affected users or organizations, troubleshooting actions, technical escalation, resolution, and user confirmation.

- Identify recurring issues involving permissions, incomplete user guidance, training deficiencies, workflow design, application defects, or integration reliability.

- Collaborate with the Deployment Strategist / Training Lead to maintain role-specific documentation, frequently asked questions, troubleshooting guides, and self-service learning resources.

- Improve DART's existing in-application support capabilities, including searchable help documentation, support request workflows, contextual guidance, and user-facing resolution records.

- Contribute to application testing and release validation by reporting recurring defects, verifying corrections, and confirming that documented workarounds remain accurate after software updates.

- Support new organizational rollout waves by assisting with user onboarding, application orientation, operational exercises, and heightened support demand during transition periods.

- Produce periodic service reports describing request volumes, incident classifications, response performance, unresolved issues, recurring problems, and opportunities for product improvement.

- Follow approved privacy, information security, and access-control procedures when handling personnel records, government information, technical diagnostics, and customer communications.

- Maintain clear responsibility boundaries so that support personnel do not independently change authoritative qualification, deployment, personnel, or security decisions without required authorization.

- Help establish reusable federal customer support processes that can scale as USATII expands its government software operations.

## You might thrive in this role if you:

- Have 3+ years of experience providing enterprise application support, technical customer support, service desk operations, or software implementation assistance.

- Have supported complex business applications involving multiple user roles, permissions, approval workflows, records management, or operational processes.

- Are comfortable investigating software issues using application logs, diagnostic tools, API responses, database queries where authorized, and structured troubleshooting procedures.

- Understand basic web application concepts, including authentication, sessions, APIs, databases, browser behavior, and common connectivity problems.

- Have experience with service management platforms such as [ServiceNow](https://www.servicenow.com/), [Jira Service Management](https://www.atlassian.com/software/jira/service-management), [Zendesk](https://www.zendesk.com/), or comparable tools.

- Understand incident classification, ticket prioritization, service-level objectives, escalation procedures, and customer communication during technical disruptions.

- Can distinguish a product defect from incorrect application configuration, missing information, an access restriction, or a misunderstood workflow.

- Have experience supporting account administration, access requests, multifactor authentication, and permission-related user issues.

- Can explain complicated software procedures clearly to users without extensive technical backgrounds.

- Are comfortable interacting with customers under time-sensitive conditions and can communicate professionally when a system is unavailable or affecting operational work.

- Have demonstrated the ability to maintain detailed incident documentation and accurate records of troubleshooting activity.

- Can collaborate effectively with software engineers, infrastructure teams, cybersecurity personnel, and customer program managers.

- Understand the importance of safeguarding sensitive information and following formal access and operational approval processes.

- Can identify recurring customer problems and contribute to documentation, training, automation, or product improvements that reduce support demand.

- Are willing to develop detailed knowledge of DART's qualification, training, staffing, deployment, and reporting workflows.

- Hold a degree in information technology, computer science, information systems, or a related discipline, or have equivalent professional experience.

Experience providing technical support to federal agencies, emergency management organizations, regulated enterprises, or large distributed workforces is particularly valuable.

Familiarity with ITIL incident management practices, government information security requirements, enterprise identity management, or [Section 508](https://www.section508.gov/) accessibility is beneficial.

Prior federal contracting experience is not required for every candidate. We value technical curiosity, disciplined problem-solving, customer accountability, and demonstrated ability to support complex production software.

## About USATII

USATII is a U.S.-based enterprise software engineering company focused on designing, building, and deploying operational software and private AI systems.

We work directly with organizations to understand complex business processes, develop integrated technology solutions, and support those systems throughout their operational lifecycle.

Our approach emphasizes technical ownership, direct collaboration between engineers and customers, configurable enterprise architectures, and software that organizations can control and sustain over the long term.

USATII is privately held and operates from Rochester, New York, serving commercial and prospective public-sector customers.

USATII is an equal opportunity employer and considers qualified applicants without regard to legally protected characteristics. Reasonable accommodations are available during the application process.

## Compensation

The proposed base salary for this position is $120,000 annually.

Additional compensation, employee benefits, and employment terms will be determined through an approved employment offer.

The anticipated support organization will provide routine user assistance during designated weekday coverage hours and coordinate critical incident escalation with the separately scheduled technical on-call team.

Full-time employment is contingent upon contract award, approved funding, and final staffing requirements.

Any customer-specific suitability, security-clearance, or work-location requirements will be communicated once established.`,
    displayLocation: "U.S. Remote / Washington, DC",
  },
];
