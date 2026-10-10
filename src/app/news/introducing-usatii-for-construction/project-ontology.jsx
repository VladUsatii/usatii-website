import styles from "./article.module.css";

const nodes = [
  { label: "Dashboard", x: 12, y: 24, color: "#d7b06b", row: "top" },
  { label: "AI", x: 168, y: 24, color: "#bca5d8", row: "top" },
  { label: "Leads", x: 480, y: 24, color: "#e5aa97", row: "top" },
  { label: "Calls", x: 636, y: 24, color: "#a5c8e2", row: "top" },
  { label: "BidOps", x: 12, y: 120, color: "#b4b8dc", row: "upper" },
  { label: "Library", x: 168, y: 120, color: "#cad1dc", row: "upper" },
  { label: "Sales", x: 480, y: 120, color: "#e5aa97", row: "upper" },
  { label: "Measure", x: 636, y: 120, color: "#b6c6a2", row: "upper" },
  { label: "Work Flow", x: 12, y: 332, color: "#a5c8e2", row: "lower" },
  { label: "Calendar", x: 168, y: 332, color: "#b4b8dc", row: "lower" },
  { label: "Catalog", x: 480, y: 332, color: "#e5c187", row: "lower" },
  { label: "Installers", x: 636, y: 332, color: "#b4b8dc", row: "lower" },
  { label: "Inventory", x: 12, y: 424, color: "#e5c187", row: "lower2" },
  { label: "Accounting", x: 168, y: 424, color: "#9ac6b0", row: "lower2" },
  { label: "Timecard", x: 480, y: 424, color: "#a5c8e2", row: "lower2" },
  { label: "People", x: 636, y: 424, color: "#a5c8e2", row: "lower2" },
  { label: "Academy", x: 12, y: 516, color: "#bca5d8", row: "bottom" },
  { label: "Course Builder", x: 168, y: 516, color: "#bca5d8", row: "bottom" },
  { label: "Changelog", x: 480, y: 516, color: "#cad1dc", row: "bottom" },
  { label: "Job heat map", x: 636, y: 516, color: "#b6c6a2", row: "bottom" },
];

export function ProjectOntology() {
  return <figure className={styles.projectOntology}>
    <svg viewBox="0 0 786 572" role="img" aria-labelledby="project-ontology-title project-ontology-desc">
      <title id="project-ontology-title">A connected construction project record</title>
      <desc id="project-ontology-desc">The dashboard, AI, leads, calls, bid intelligence, shared library, sales, customers, Work Flow, measurement, calendar, accounting, inventory, catalog, installers, timecard, Academy, people, course building, changelog, and job heat map connect across a shared construction operation.</desc>
      <g fill="none" stroke="#a8a8a8" strokeWidth="1.25">
        {nodes.map(({ x, y, label, row }) => {
          const width = row === "top" ? 115 : 138;
          const cx = x + width / 2;
          const rail = { top: 92, upper: 194, lower: 316, lower2: 408, bottom: 500 }[row];
          const isAboveCore = row === "top" || row === "upper";
          const start = isAboveCore ? y + 48 : y;
          const end = isAboveCore ? 224 : 282;
          return <path key={label} d={`M${cx} ${start} V${rail} H393 V${end}`} />;
        })}
        <path d="M393 194V224 M393 282V316 M393 316V408 M393 408V500" />
      </g>
      <rect x="315" y="224" width="156" height="58" rx="7" fill="#f6f6f4" stroke="#262626" strokeWidth="1.5" />
      <text x="393" y="259" textAnchor="middle" className={styles.ontologyCoreTitle}>Customers / jobs</text>
      {nodes.map(({ label, x, y, color, row }) => {
        const width = row === "top" ? 115 : 138;
        return <g key={label}>
        <rect x={x} y={y} width={width} height="48" rx="5" fill={color} fillOpacity=".34" stroke={color} strokeWidth="1.5" />
        <text x={x + width / 2} y={y + 29} textAnchor="middle" className={styles.ontologyNodeLabel}>{label}</text>
      </g>;
      })}
    </svg>
  </figure>;
}

const competitors = [
  { name: "Procore", url: "https://www.procore.com/project-lifecycle-management", items: ["Customer / job record", "Project work", "Financial management"] },
  { name: "monday.com", url: "https://monday.com/w/use-cases/construction", items: ["Customer / job record", "Project work", "AI assistance"] },
  { name: "Asana", url: "https://asana.com/features/project-management", items: ["Project work", "AI assistance"] },
  { name: "HOVER", url: "https://hover.to/contractors", items: ["Measurement to estimate", "Customer / job record"] },
  { name: "One Click Contractor", url: "https://oneclickcontractor.com/partners", items: ["Customer / job record", "Measurement to estimate"] },
];

const capabilities = ["Customer / job record", "Project work", "Measurement to estimate", "Field dispatch", "Financial management", "AI assistance"];

export function ProjectOntologyComparison() {
  return <div className={styles.ontologyComparison}>
    <div className={styles.ontologyTableScroll} role="region" aria-label="Construction platform capability comparison" tabIndex={0}>
      <table className={styles.ontologyTable}>
        <thead><tr><th scope="col">Capability</th><th scope="col">USATII</th>{competitors.map(({ name, url }) => <th scope="col" key={name}><a href={url}>{name}</a></th>)}</tr></thead>
        <tbody>{capabilities.map(label => <tr key={label}><th scope="row">{label}</th><td aria-label="USATII supports this capability">✓</td>{competitors.map(({ name, items }) => <td key={name} aria-label={items.includes(label) ? `${name} supports this capability` : `${name} does not show this as a native workflow`}>{items.includes(label) ? "✓" : "—"}</td>)}</tr>)}</tbody>
      </table>
    </div>
  </div>;
}
