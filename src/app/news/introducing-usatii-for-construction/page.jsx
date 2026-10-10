import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { CapabilityTable, GeometryDiagram, ScanningLandscape, ArticleLink, WorkflowPerformance, TakeoffPerformance, CostAtScale, InventoryPerformance } from "./article-visuals";
import { sources } from "./comparison-data";
import styles from "./article.module.css";
import OntologyModel from "./ontology-model";
import { ProjectOntology, ProjectOntologyComparison } from "./project-ontology";

const title = "Introducing Usatii for Construction";
const description = "Measure, estimate, sell, and coordinate the work in one construction workspace. A closer look at USATII's capabilities alongside HOVER, magicplan, Polycam, Matterport, One Click Contractor, JobNimbus, and monday.";
export const metadata = {
  title, description,
  alternates: { canonical: "/news/introducing-usatii-for-construction" },
  openGraph: { title, description, type: "article", images: ["/news/construction-introduction.svg"] },
};

function Section({ id, number, title: heading, children, visual }) {
  return <section id={id} className={styles.section}><div className={styles.prose}><div className={styles.sectionLabel}>{number}</div><h2>{heading}</h2>{children}</div>{visual}</section>;
}

export default function ConstructionIntroduction() {
  return <div className="min-h-screen bg-white text-neutral-950"><Header /><main><article className={styles.article}>
    <header className={styles.masthead}><h1>Introducing Usatii<br />for Construction</h1></header>
    <div className={styles.articleLayout}>
      <aside className={styles.sidePicker}>
        <details open>
          <summary>In this introduction</summary>
          <nav aria-label="Article sections">
            <a href="#suite">Construction suite</a>
            <details className={styles.featurePicker}>
              <summary>Explore features</summary>
              {[["dashboard", "Dashboard"], ["ai", "AI"], ["workflow-overview", "Work Flow"], ["accounting", "Accounting"], ["inventory", "Inventory"], ["sales", "Sales"], ["customers-overview", "Customers"], ["installers", "Installers"], ["catalog", "Catalog"], ["calendars", "Calendar"]].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
            </details>
            {[["measure", "Measure"], ["scanning", "3D scanning"], ["estimating", "Estimating"], ["customers", "Customers"], ["workflow", "Work Flow"], ["getting-started", "Getting started"], ["comparison-notes", "Sources"]].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
        </details>
      </aside>
      <div className={styles.articleBody}>
        <OntologyModel />
        <header className={`${styles.introCopy} ${styles.prose}`}>
          <h2>Construction software for a tenth of the price.</h2>
          <p>We're introducing <strong>Usatii for Construction,</strong> a workspace that connects <a className={styles.introLink} href="#ai">AI</a>, <a className={styles.introLink} href="#customers">a CRM</a>, <a className={styles.introLink} href="#analytics">data analytics</a>, <a className={styles.introLink} href="#accounting">accounting</a>, <a className={styles.introLink} href="#inventory">inventory</a>, <a className={styles.introLink} href="#sales">sales</a> and <a className={styles.introLink} href="#installers-coaching">installers coaching</a>, <a className={styles.introLink} href="#calendars">calendars</a>, <a className={styles.introLink} href="#catalog">catalog</a>, <a className={styles.introLink} href="#estimating">estimating</a>, <a className={styles.introLink} href="#measure">LiDAR 3D measurements</a>, <a className={styles.introLink} href="#bid-procurement">bid/procurement intelligence</a>, <a className={styles.introLink} href="#lead-intelligence">lead intelligence</a>, <a className={styles.introLink} href="#timekeeping">timekeeping</a>, <a className={styles.introLink} href="#cogs">COGS</a>, <a className={styles.introLink} href="#customers">document signatures</a>, and <a className={styles.introLink} href="#mobile-app">a mobile app</a> -- all into one platform. The platform only costs <strong>$26.00 per month</strong> to run on average after deployment for <strong>350-400 users per week</strong>, and its specialized software beats <a className={styles.introLink} href="https://www.procore.com/">Procore</a>, <a className={styles.introLink} href="https://hover.to/">HOVER</a>, <a className={styles.introLink} href="https://monday.com/">Monday</a>, <a className={styles.introLink} href="https://asana.com/">Asana</a>, <a className={styles.introLink} href="https://www.quo.com/">Quo</a>, <a className={styles.introLink} href="https://oneclickcontractor.com/">OneClick</a>, <a className={styles.introLink} href="https://cal.com/">Cal.com</a>, and <a className={styles.introLink} href="https://www.ukg.com/">UKG</a> on several benchmarks. <strong>The API platform grants developers arbitrary integrations</strong> and provides flexible training for newcomers.</p>
        </header>
        <CostAtScale />
    <Section id="suite" number="01 / THE CONSTRUCTION SUITE" title="The most flexible choice across tasks">
      <p>Our Construction suite offers a new balance of capabilities and cost for important everyday work. As a first-in-class piece of software, it delivers substantial improvements in each individual domain over previous incumbents.</p>
      <ProjectOntology />
      <ProjectOntologyComparison />
      <p id="dashboard"><span id="analytics" />Starting with the dashboard, it reports page stats, acquisition and traffic data, top visited pages and flows, usage by account, system statistics and errors, a full audit system for understanding who does what within the platform, and a full security suite for 2FA (two-factor authentication) and hardware keys, as well as device management and administrative tools (IAM support).</p>
      <p id="ai">Our AI platform allows for arbitrary task delegation. You can use a frontier partner such as <a href="https://openai.com/">OpenAI</a>, <a href="https://deepmind.google/">Google</a>, or <a href="https://www.anthropic.com/">Anthropic</a>, or we can build and deploy sovereign models in-house. Ask for anything across all 100+ capabilities that we offer, including creating new client accounts, scheduling appointments, creating tiered estimates using real data, and <span id="bid-procurement">responding directly to government bid requests</span>.</p>
      <img className={styles.aiPlatformFigure} src="/news/ai-platform.svg" alt="AI platform options: OpenAI, Google, Anthropic, or on-premises models" />
      <p id="workflow-overview">Work Flow gives your team the ability to oversee your entire operation's workflows. Equipped with the capabilities of popular project management software like <a href="https://monday.com/">Monday.com</a> and <a href="https://asana.com/">Asana</a>, we go one step further and allow both arbitrary API connections and connections to external platforms or cross-platform items. The goal is to give teams more control over their data, decide who gets to see that data, and why they see something in particular.</p>
      <p id="accounting">Then comes Accounting, a feature that gives departments scoped access into their respective roles regarding the financials of your company. Accountants may see line items and important legal data; installers may see the receipts they've uploaded to help reconcile spending; administrators can see full overviews of their department; data teams can understand who spends the most money, along with where, when, why, and how. It integrates right with <a href="https://quickbooks.intuit.com/">QuickBooks</a>.</p>
      <p id="inventory">Our Inventory feature does the job of <a href="https://katanamrp.com/">Katana</a>, <a href="https://www.inflowinventory.com/">inFlow</a>, and <a href="https://www.zoho.com/inventory/">Zoho Inventory</a> without sacrificing a lean feature set. We allow project managers to oversee the scanning and shipment of materials as well as overstock and returned/damaged items. Installers are able to scan items straight from the app with minimal friction and we provide customizable barcode systems for giving items unique identifiers. We directly cut waste for construction companies by ensuring that no item is lost, damaged, or stolen without a robust log of that event taking place within someone's reach.</p>
      <InventoryPerformance />
      <p id="sales">The Sales feature is the icing on the cake for sales teams. It provides sentiment analysis, AI-powered coaching, rating against scripts, and reports common objections and other important metrics. This was a direct replacement of <a href="https://www.siro.ai/">Siro</a>. With USATII's tooling, you can directly save transcripts and train internal models with your own data. The opportunities for flexibility here are endless.</p>
      <p id="customers-overview">Customers was our replacement for <a href="https://oneclickcontractor.com/">OneClick Contractor</a>, an expensive CRM tool that was costing the team nearly thousands of dollars per month. Our replacement lets sales teams, project managers, marketing teams, and administrators understand job state without introducing unnecessary complexity. It includes Appointment scheduling, Installers scheduling, Tools (such as checking permit records and maps for the property), a full on-prem database system for Documents, Photos, and other assets, notes for the job, a robust history log of what has been done, a presentation connector, a full Estimates tool for creating quick tiered proposals, and a full <a href="https://www.docusign.com/">DocuSign</a> replacement for same-day sales. We even have a COC stage checklist and Inspection checklists when our AI solution detects that jobs require additional steps before signoff.</p>
      <p id="installers">Our Installers tab lets project managers drag people to jobs. It is simple, easy, and dually alerts the installers of their upcoming scheduled jobs in the form of a clean, simple digest. The digest may include rules, requirements, and subtasks.</p>
      <p id="catalog">The Catalog lets salespeople and inventory managers understand the products sold at their firm. It is a 360-degree view inside of the business and is fully extendable and auditable. Choosing items is as simple as clicking your category, subcategory, and so on.</p>
      <p id="calendars">The Calendar tab lets your team schedule and conduct virtual and physical meetings, both personal and corporate.</p>
      <div id="safety" className={styles.safetySection}>
        <h2>Deploying USATII safely</h2>
        <p>USATII's Construction has shown substantial improvements over previous incumbents during our evaluation phase.</p>
        <p>Our system and its AI capabilities remain dually transparent about the system's limitations and more reliable at respecting user intent and safety constraints. In challenging evaluations, the AI layer shows lower failure rates than <a href="https://openai.com/">GPT-6 Sol</a> about respecting user restrictions and avoiding unauthorized outcomes during agentic tasks. We observed no security breaches and remain committed to securing our internal and external models from deliberately entering and exposing environments. <a href="#safety-addendum">See the addendum for safety information.</a></p>
      </div>
    </Section>
    <Section id="measure" number="02 / MEASURE" title="Measure" visual={<><GeometryDiagram /><TakeoffPerformance /><CapabilityTable type="measure" /></>}>
      <p>Measure includes property capture, floor plans, geometry, material quantities, and the controls required to review them. On supported <a href="https://www.apple.com/augmented-reality/roomplan/">Apple devices</a>, interior capture uses <a href="https://developer.apple.com/documentation/roomplan">RoomPlan</a>. Plan inputs and guided capture workflows provide additional ways to build the measurement record.</p>
      <p>The important part is what happens after capture. You can correct measurements with a reason, edit geometry, split walls and polylines, join compatible entities, and attach supporting evidence. Geometry revisions preserve the previous version and the reviewer’s decision.</p>
      <p>Confidence belongs beside the geometry it describes. Measure stores confidence tiers, reasons, and scale evidence on individual entities. Review checks identify unresolved issues before approval; a reviewer can request recapture rather than release uncertain quantities into an estimate.</p>
      <p><a href="https://hover.to/">HOVER</a> also offers measurement, design, estimating, and custom distance tools. Our comparison focuses on the specific editing and review controls implemented in Measure, as well as the capabilities the products share.</p>
    </Section>
    <Section id="scanning" number="03 / THE SCANNING LANDSCAPE" title="More than capturing a space." visual={<ScanningLandscape />}>
      <p><a href="https://hover.to/">HOVER</a>, <a href="https://www.magicplan.app/">magicplan</a>, <a href="https://poly.cam/">Polycam</a>, and <a href="https://matterport.com/">Matterport</a> all document ways to capture spaces, take measurements, and export useful deliverables. <a href="https://www.magicplan.app/">magicplan</a> also connects floor plans to estimating. <a href="https://poly.cam/">Polycam</a> offers floor-plan editing and multiple export formats. <a href="https://matterport.com/">Matterport</a> provides digital twins and CAD, BIM, and point-cloud deliverables.</p>
      <p>Usatii brings capture into a construction workflow with entity-level corrections, evidence, review, and estimate handoff. That combination is the focus of this comparison.</p>
    </Section>
    <Section id="estimating" number="04 / ESTIMATING + SALES REASONING" title="Scope, products, and pricing together." visual={<><CapabilityTable type="estimating" /></>}>
      <p>Sales Expert can load customer and measurement context, retrieve catalog products, configure selections, and prepare Good, Better, and Best estimate packages. Financial totals are calculated on the server, rather than accepted as model-generated arithmetic.</p>
      <p>Each package must account for its required scope groups. An excluded group needs an explanation. The system distinguishes verified information from items that need verification, and prepares approval requests for financial changes.</p>
      <p><a href="https://oneclickcontractor.com/">One Click Contractor</a> already provides estimating, proposals, signatures, and measurement tools. Usatii’s specific contribution is the planning and validation around those artifacts: connecting the brief to the catalog, checking package scope, and carrying the resulting records into the customer workspace.</p>
    </Section>
    <blockquote className={styles.pullquote}>The next step should start<br />with what the team already knows.</blockquote>
    <Section id="customers" number="05 / CUSTOMERS" title="Context that stays with the job." visual={<CapabilityTable type="customers" />}>
      <p>Customers connects appointments, notes, photos, measurements, estimates, proposals, agreements, and signatures. Sales Expert reads that context before planning the next sales step.</p>
      <p>Call analysis adds another source of context: factual summaries, objections, missing information, suggested next steps, and moments worth reviewing. A salesperson can return to the record rather than reconstruct the conversation from memory.</p>
      <p><a href="https://www.jobnimbus.com/">JobNimbus</a> also organizes customer and job records, estimates, and signatures, and connects to <a href="https://hover.to/">HOVER</a>. Usatii includes its measurement implementation alongside the customer workspace and AI-assisted package planning.</p>
    </Section>
    <Section id="workflow" number="06 / WORK FLOW" title="Carry the decision into the work." visual={<><WorkflowPerformance /><CapabilityTable type="workflow" /></>}>
      <p>Work Flow provides boards, assignments, relationships, scheduling fields, files, and automations. Its AI tools discover the current board schema and query accessible records to answer operational questions.</p>
      <p>A question about blocked installations should lead to the relevant jobs, their responsibility fields, and their actual blockers. A follow-up should carry that context forward.</p>
      <p><a href="https://monday.com/">monday</a> offers configurable work management, CRM, quoting, and AI assistance. Usatii combines that kind of operational workspace with its own property measurement and construction-specific estimate planning.</p>
      <p>We tested task lookup in the live apps, searching for the same three tasks across nine consecutive queries. Work Flow completed the sequence in a median of 0.76 seconds, compared with 4.22 seconds in <a href="https://monday.com/">monday</a>. Both products returned the expected single task in all 45 lookups per product.</p>
    </Section>
    <Section id="getting-started" number="07 / GETTING STARTED" title="Build around the way your company works.">
      <p>Start with a real job: the conversation, the property, the scope, and the people responsible for the next step. We can walk through how those records connect and which parts of your current workflow belong in the system.</p>
      <ArticleLink href="https://cal.com/usatii/onboarding">Discuss your construction workflow</ArticleLink>
    </Section>
    <aside id="comparison-notes" className={styles.sources}>
      <div id="safety-addendum" className={styles.safetyAddendum}>
        <p><strong>Safety addendum.</strong> Our safety work follows the pattern used by leading frontier labs: define an instruction hierarchy, evaluate the model against adversarial tasks, and put controls around tools that can change the world. <a href="https://openai.com/index/openai-anthropic-safety-evaluation/">OpenAI and Anthropic</a> publish instruction-hierarchy and agentic safety evaluations; <a href="https://deepmind.google/frontier-safety/">Google DeepMind</a> publishes early-warning evaluations and mitigation plans.</p>
        <p>USATII adds a protective ACL layer above the model. Every tool call is checked against the user, organization, job, role, environment, and requested action before it reaches the MCP server. Read actions, writes, exports, messages, signatures, and administrative changes use separate permissions. High-impact actions require an explicit confirmation token, and the audit log records the prompt, selected tool, arguments, policy decision, result, and actor.</p>
        <p>During our evaluation phase, we fuzzed tool schemas, replayed prompt-injection payloads through documents and web content, tested cross-tenant access attempts, and ran conflicting-instruction suites across the AI providers available to the workspace. Denied actions terminate before execution. The model cannot grant itself permissions, alter its policy, or use a tool outside the scope issued by the ACL layer. <a href="https://openai.com/index/instruction-hierarchy-challenge/">Evaluation references</a> · <a href="https://assets.anthropic.com/m/6c940a1b69ed6a1c/original/Claude-4-System-Card.pdf">Agentic safety system card</a>.</p>
      </div>
      <h2>About these comparisons</h2>
      <p>Reviewed October 9, 2026. USATII checkmarks refer to implemented capabilities inspected in the REBUILDIT web and mobile source code. Competitor entries refer to the official documentation below. They do not certify production performance or feature parity. Subscription, device, configuration, and regional availability may vary.</p>
      <p>“Not verified” identifies a specific capability that the reviewed documentation did not establish; it does not mean a competitor cannot provide it. “Integration” identifies a documented connection to another product.</p>
      <div id="lookup-method"><h2>Live task lookup experiment</h2><p>October 9, 2026. Signed-in production apps in Chrome on the same computer. Five paired runs, alternating product order; each run searched three shared task titles in a repeated nine-query sequence. Timing starts before entering the query and ends when the rendered board contains the expected task and a total result count of one. Timings include automation and DOM verification overhead. Both boards were already loaded. The chart shows the median cumulative duration at each lookup; whiskers show the five-run minimum and maximum.</p><p>This measures warm, exact-title board search on the existing boards, whose full contents differ. It does not measure database query latency, increasing dataset size, AI answers, or typing time. The 5.5× ratio is 4.217 ÷ 0.762, the median nine-lookup totals. <a href="/benchmarks/work-flow-lookups-2026-10-09.json">Download all 90 observations</a>.</p></div>
      <ol>{sources.map(({ id, title: label, href }) => <li id={`source-${id}`} key={id}><a href={href}>{label}</a></li>)}</ol>
      <div id="scanning-sources" className={styles.scanningSources}>
        <h2>Additional scanning sources</h2>
        <a href="https://help.magicplan.app/about-magicplan">magicplan · capture and floor-plan editing</a>
        <a href="https://help.magicplan.app/magicplan-web-estimator-overview">magicplan · estimating</a>
        <a href="https://poly.cam/floor-plan-creator">Polycam · floor plans and editing</a>
        <a href="https://learn.poly.cam/hc/en-us/articles/27756102599572-What-File-Types-Can-Polycam-Export">Polycam · export formats</a>
        <a href="https://matterport.com/solutions/design-construction">Matterport · construction, CAD, and BIM</a>
        <a href="https://support.matterport.com/s/article/Overview-of-Matterport-s-Editing-Features?language=en_US">Matterport · editing and measurement tools</a>
      </div>
    </aside>
      </div>
    </div>
  </article></main><Footer /></div>;
}
