export const sources = [
  { id: 1, title: "HOVER · measurements and estimating", href: "https://hover.to/contractors" },
  { id: 2, title: "HOVER · custom measurements", href: "https://help.hover.to/en/articles/13366896-custom-measure-in-workspace" },
  { id: 3, title: "HOVER · blueprint takeoffs", href: "https://hover.to/blog/easy-estimating-for-remodelers-blueprint-takeoffs" },
  { id: 4, title: "HOVER · offline capture", href: "https://hover.to/blog/how-hover-helps-you-keep-moving-in-the-field" },
  { id: 5, title: "HOVER · exports", href: "https://help.hover.to/en/articles/13170845-how-do-i-export-files-from-hover" },
  { id: 6, title: "HOVER · estimate customization", href: "https://help.hover.to/en/articles/13169568-how-do-i-customize-an-estimate" },
  { id: 7, title: "One Click Contractor · sales toolbox", href: "https://info.oneclickcontractor.com/contractor-software" },
  { id: 8, title: "JobNimbus · customer and job records", href: "https://support.jobnimbus.com/how-do-i-navigate-jobs" },
  { id: 9, title: "JobNimbus · estimate signatures", href: "https://support.jobnimbus.com/how-do-i-send-estimates-for-signing-or-sign-in-person" },
  { id: 10, title: "JobNimbus · HOVER integration", href: "https://www.jobnimbus.com/integrations/hover" },
  { id: 11, title: "monday · construction workflows", href: "https://monday.com/w/use-cases/construction" },
  { id: 12, title: "monday · CRM and AI", href: "https://monday.com/crm/features" },
  { id: 13, title: "HOVER · integrations", href: "https://hover.to/integrations" },
];

// A missing public reference is not evidence that a competing capability is absent.
// USATII checks refer to inspected implementation, not production certification.
export const comparisons = {
  measure: {
    competitor: "HOVER",
    rows: [
      ["Interior capture and 3D geometry", "yes", "yes", "USATII uses native RoomPlan on supported Apple devices. HOVER supports interior scans.", [1]],
      ["Blueprint input", "yes", "yes", "Both accept plan inputs; this row does not claim equivalent automatic reconstruction.", [3]],
      ["Queued capture without a connection", "yes", "yes", "Capture can be queued. USATII editing, export, and estimate handoff require service.", [4]],
      ["Material takeoff and waste adjustments", "yes", "yes", "Both support material quantities and waste settings.", [6]],
      ["Measurement and model exports", "yes", "yes", "Formats differ. USATII supports generated reports and geometry exports; HOVER documents CAD and spreadsheet formats.", [5]],
      ["Saved measurement corrections", "yes", "partial", "USATII records corrections and reasons. HOVER documents editable custom distance lines; underlying geometry correction equivalence is unverified.", [2]],
      ["Versioned geometry with before/after evidence", "yes", "unknown", "USATII saves geometry versions, reviewer identity, correction reasons, and supporting assets. An equivalent HOVER workflow was not verified.", [2]],
      ["Split and join geometry entities", "yes", "unknown", "USATII implements wall/polyline split and constrained geometry joins. Arbitrary polygon splitting is not supported by the inspected split operation.", [2]],
      ["Per-object confidence and scale evidence", "yes", "unknown", "USATII stores confidence tiers, reasons, and scale references on geometry entities. These are system signals, not measured accuracy guarantees.", [1, 2]],
      ["Geometry review before production quantities", "yes", "unknown", "USATII includes review checks, approval, and recapture requests before takeoff release. This is more specific than administrative submission approval.", [1]],
      ["Customer record and AI-assisted sales context", "yes", "integration", "USATII measurement records are available to Customers and Sales Expert. HOVER documents CRM integrations.", [13]],
    ],
  },
  estimating: {
    competitor: "One Click Contractor",
    rows: [
      ["Product catalog and configured pricing", "yes", "yes", "Both provide product-backed estimating.", [7]],
      ["Proposals and electronic signatures", "yes", "yes", "Both implement proposal and signature workflows.", [7]],
      ["Measurements connected to estimates", "yes", "yes", "One Click offers measurement tools as well as HOVER and other integrations.", [7]],
      ["AI-planned Good / Better / Best packages", "yes", "unknown", "USATII's Sales Expert pipeline plans three packages and validates their catalog selections. The equivalent was not verified in One Click's reviewed documentation.", [7]],
      ["Required scope coverage checked per package", "yes", "unknown", "USATII validates required scope groups and requires reasons for explicit exclusions.", [7]],
      ["AI writes presented for approval", "yes", "unknown", "USATII prepares confirmation-required proposals for financial and customer changes.", [7]],
    ],
  },
  customers: {
    competitor: "JobNimbus",
    rows: [
      ["Customer / job records, photos, and activity", "yes", "yes", "Both organize customer and job information.", [8]],
      ["Estimates and signature requests", "yes", "yes", "JobNimbus documents estimate signing in-person and remotely.", [9]],
      ["Property modeling inside the product", "yes", "integration", "USATII implements Measure. JobNimbus documents a HOVER integration.", [10]],
      ["Customer-aware AI sales planning", "yes", "unknown", "USATII loads saved customer context and derives a sales checklist. The same case-planning workflow was not verified for JobNimbus.", [8]],
      ["Measurement-to-package scope validation", "yes", "unknown", "USATII combines measurement context, catalog configuration, and package scope checks.", [8, 10]],
    ],
  },
  workflow: {
    competitor: "monday",
    rows: [
      ["Boards, assignments, and automations", "yes", "yes", "Both implement configurable operational workspaces.", [11]],
      ["AI using operational records", "yes", "yes", "USATII queries Work Flow records. monday documents project-aware AI assistance.", [11]],
      ["CRM and quoting", "yes", "yes", "monday offers CRM and quotes; product and plan availability varies.", [12]],
      ["Native property capture and geometry review", "yes", "unknown", "USATII implements Measure and its review lifecycle. An equivalent built-in monday capture system was not verified.", [11, 12]],
      ["Catalog-backed construction package planning", "yes", "unknown", "USATII implements scope-aware estimate packages. monday's general quoting is not evidence of this specific workflow.", [12]],
    ],
  },
};
