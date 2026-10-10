"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, ArrowUpRight, Info } from "lucide-react";
import { comparisons } from "./comparison-data";
import styles from "./article.module.css";
import lookupSeries from "./app-performance.json";
import hoverChart from "./hover-chart-data.json";

export function TakeoffPerformance() {
  const reduced = useReducedMotion();
  const x = n => 72 + (n - 10) / 40 * 550;
  const y = minutes => 350 - minutes / 60 * 270;
  const colors = ["#ae7800", "#2868b2"];
  return <Reveal className={styles.performance}>
    <h3>From measurement to takeoff.</h3>
    <div className={styles.plotLegend}>{hoverChart.series.map((series, i) => <span key={series.name}><i style={{ background: colors[i] }} />{series.name}</span>)}</div>
    <svg viewBox="0 0 680 415" role="img" aria-label="Minutes to reviewed takeoff by measurement entities, comparing USATII Measure and HOVER">
      {[0,15,30,45,60].map(t => <g key={t}><line x1="72" x2="622" y1={y(t)} y2={y(t)} stroke={t === 0 ? "#333" : "#ececec"} /><text x="58" y={y(t)+4} textAnchor="end">{t}</text></g>)}
      <line x1="72" x2="72" y1="80" y2="350" stroke="#333" />
      {hoverChart.points.map(n => <text key={n} x={x(n)} y="374" textAnchor="middle">{n}</text>)}
      <text x="347" y="407" textAnchor="middle">{hoverChart.xLabel}</text>
      <text transform="translate(18 215) rotate(-90)" textAnchor="middle">{hoverChart.yLabel}</text>
      {hoverChart.series.map((series, i) => <g key={series.name} stroke={colors[i]} fill={colors[i]}>
        <motion.path d={series.values.map((value,index)=>`${index ? "L" : "M"}${x(hoverChart.points[index])},${y(value)}`).join(" ")} fill="none" strokeWidth="2.5" initial={reduced ? false : {pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:1.3,delay:i*.15}} />
        {series.values.map((value,index) => i === 0 ? <circle key={index} cx={x(hoverChart.points[index])} cy={y(value)} r="4"><title>{`${series.name}: ${value} minutes for ${hoverChart.points[index]} entities`}</title></circle> : <path key={index} d={`M${x(hoverChart.points[index])},${y(value)-5}l5,5 -5,5 -5,-5Z`}><title>{`${series.name}: ${value} minutes for ${hoverChart.points[index]} entities`}</title></path>)}
      </g>)}
    </svg>
    <div className={styles.plotResult}><strong>27 min</strong><span>USATII at 50 measurement entities</span><span className={styles.plotComparison}><a href="https://hover.to/">HOVER</a> · 53 min</span></div>
  </Reveal>;
}

export function CostAtScale() {
  const reduced = useReducedMotion();
  const vendors = [
    { name: "Clockify Basic", price: 3.99, href: "https://clockify.me/pricing" },
    { name: "Trello Standard", price: 5, href: "https://trello.com/pricing" },
    { name: "ClickUp Unlimited", price: 7, href: "https://clickup.com/pricing" },
    { name: "HubSpot Sales Hub Starter", price: 7, href: "https://www.hubspot.com/pricing/sales" },
    { name: "Jira Standard", price: 7.91, href: "https://www.atlassian.com/software/jira/pricing" },
    { name: "Smartsheet Pro", price: 9, href: "https://www.smartsheet.com/pricing" },
    { name: "monday Basic", price: 9, href: "https://monday.com/pricing" },
    { name: "Toggl Track Starter", price: 9, href: "https://toggl.com/track/pricing/" },
    { name: "Freshsales Growth", price: 9, href: "https://www.freshworks.com/crm/sales/pricing/" },
    { name: "Wrike Team", price: 10, href: "https://www.wrike.com/price/" },
    { name: "Calendly Standard", price: 10, href: "https://calendly.com/pricing/" },
    { name: "Asana Starter", price: 10.99, href: "https://asana.com/pricing" },
    { name: "Cal.com Teams", price: 12, href: "https://cal.com/pricing" },
    { name: "Pipedrive Lite", price: 14, href: "https://www.pipedrive.com/en/pricing" },
    { name: "Zoho CRM Standard", price: 14, href: "https://www.zoho.com/en-us/crm/" },
    { name: "Dialpad Connect", price: 15, href: "https://www.dialpad.com/pricing/" },
    { name: "Quo Starter", price: 15, href: "https://www.quo.com/pricing" },
    { name: "Claude Team", price: 25, href: "https://www.anthropic.com/pricing" },
    { name: "Salesforce Starter Suite", price: 25, href: "https://www.salesforce.com/sales/pricing/" },
    { name: "One Click Estimating", price: 115, href: "https://oneclickcontractor.com/pricing" },
  ].sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
  const min = 0.05;
  const max = 160;
  const left = 188;
  const right = 650;
  const x = value => left + (Math.log10(value) - Math.log10(min)) / (Math.log10(max) - Math.log10(min)) * (right - left);
  const rowTop = 62;
  const rowGap = 23;
  const chartRows = [{ name: "USATII run cost", price: 26 / 375, href: "#suite", ours: true }, ...vendors];
  const axisY = rowTop + chartRows.length * rowGap + 8;
  const ticks = [0.1, 1, 10, 100];
  return <Reveal className={styles.performance}>
    <h3>Monthly cost per user.</h3>
    <svg viewBox={`0 0 680 ${axisY + 46}`} role="img" aria-labelledby="cost-title cost-desc">
      <title id="cost-title">Monthly cost per user</title>
      <desc id="cost-desc">USATII and twenty software products, plotted by monthly cost per user.</desc>
      {chartRows.map((vendor, i) => {
        const y = rowTop + i * rowGap;
        const color = vendor.ours ? "#2868b2" : "#b47a00";
        return <g key={vendor.name}>
          <text x={left - 10} y={y + 4} textAnchor="end">{vendor.ours ? <tspan style={{ fill: color, fontWeight: 600 }}>{vendor.name}</tspan> : <a href={vendor.href} target="_blank" rel="noreferrer" className={styles.costVendor}>{vendor.name}</a>}</text>
          <line x1={x(min)} x2={x(vendor.price)} y1={y} y2={y} stroke={color} strokeWidth={vendor.ours ? 3 : 2} opacity={vendor.ours ? 1 : .48} />
          <motion.circle cx={x(vendor.price)} cy={y} r={vendor.ours ? 5 : 4} fill={color} initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .35, delay: i * .025 }}>
            <title>{vendor.ours ? "USATII: $26 monthly operating cost divided by 350–400 weekly users" : `${vendor.name}: $${vendor.price.toFixed(vendor.price % 1 ? 2 : 0)} per paid seat per month`}</title>
          </motion.circle>
          <text x={Math.min(x(vendor.price) + 9, right + 22)} y={y + 4} style={vendor.ours ? { fill: color, fontWeight: 600 } : undefined}>${vendor.price.toFixed(vendor.price % 1 ? 2 : 0)}</text>
        </g>;
      })}
      {ticks.map(t => <g key={t}><line x1={x(t)} x2={x(t)} y1={rowTop - 14} y2={axisY} stroke="#eeeeee" /><text x={x(t)} y={axisY + 20} textAnchor="middle">${t}</text></g>)}
      <line x1={left} x2={right} y1={axisY} y2={axisY} stroke="#333" />
      <text x={(left + right) / 2} y={axisY + 41} textAnchor="middle">Monthly cost per user</text>
    </svg>
    <div className={styles.plotResult}><strong>$0.07/user</strong><span>$26/month · 350–400 weekly users</span></div>
  </Reveal>;
}

export function WorkflowPerformance() {
  const reduced = useReducedMotion();
  const x = n => 72 + n / 9 * 550;
  const y = seconds => 360 - seconds / 5 * 280;
  const colors = ["#ae7800", "#2868b2"];
  return <Reveal className={styles.performance}>
    <h3>Find the task. Keep moving.</h3>
    <div className={styles.plotLegend}>{lookupSeries.map((series, i) => <span key={series.name}><i style={{ background: colors[i] }} />{series.name}</span>)}</div>
    <svg viewBox="0 0 680 425" role="img" aria-labelledby="lookup-title lookup-desc">
      <title id="lookup-title">Time to complete consecutive task lookups</title>
      <desc id="lookup-desc">Five live browser runs per product. Nine lookups took a median 0.762 seconds in USATII Work Flow and 4.217 seconds in monday. Lines show cumulative medians; whiskers show the observed range.</desc>
      {[0,1,2,3,4,5].map(t => <g key={t}><line x1="72" x2="622" y1={y(t)} y2={y(t)} stroke={t === 0 ? "#333" : "#ececec"} /><text x="57" y={y(t)+4} textAnchor="end">{t}s</text></g>)}
      <line x1="72" x2="72" y1="80" y2="360" stroke="#333" />
      {[0,1,3,5,7,9].map(n => <text key={n} x={x(n)} y="384" textAnchor="middle">{n}</text>)}
      <text x="347" y="415" textAnchor="middle">Completed task lookups</text>
      <text transform="translate(18 220) rotate(-90)" textAnchor="middle">Cumulative time to visible result</text>
      {lookupSeries.map((series,i) => <g key={series.name} stroke={colors[i]} fill={colors[i]}>
        <motion.path d={`M${x(0)},${y(0)} `+series.points.map(p=>`L${x(p.x)},${y(p.y)}`).join(" ")} fill="none" strokeWidth="2.5" initial={reduced ? false : {pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:1.3,delay:i*.15}} />
        {series.points.map(p=><g key={p.x}><title>{`${series.name}: ${p.x} lookups, ${p.y.toFixed(3)} seconds; range ${p.min.toFixed(3)}–${p.max.toFixed(3)}`}</title><path d={`M${x(p.x)},${y(p.min)}V${y(p.max)} M${x(p.x)-3},${y(p.min)}H${x(p.x)+3} M${x(p.x)-3},${y(p.max)}H${x(p.x)+3}`} opacity=".5" />{i===0?<circle cx={x(p.x)} cy={y(p.y)} r="4" />:<path d={`M${x(p.x)},${y(p.y)-5}l5,5 -5,5 -5,-5Z`} />}</g>)}
      </g>)}
    </svg>
    <div className={styles.plotResult}><strong>5.5× faster</strong><span>Nine task lookups · median of five runs</span><a href="#lookup-method">Test details ↗</a></div>
  </Reveal>;
}

export function InventoryPerformance() {
  const reduced = useReducedMotion();
  const points = [
    { name: "Katana", value: 20, href: "https://www.katanapim.com/customer-stories/tippoint-trading", color: "#b47a00" },
    { name: "inFlow", value: 20, href: "https://www.inflowinventory.com/blog/case-study-wentworth-douglass-hospital/", color: "#7b5aa6" },
    { name: "Zoho", value: 10, href: "https://www.zoho.com/us/inventory/customer-testimonials/", color: "#4e7d69" },
  ];
  const usatii = [10, 5, 2.5];
  const x = n => 92 + n / 3 * 520;
  const y = minutes => 338 - minutes / 22 * 230;
  return <Reveal className={styles.performance}>
    <h3>Inventory work, in half the time.</h3>
    <div className={styles.plotLegend}>
      <span><i className={styles.starLegend} style={{ background: "#2868b2" }} />USATII</span>
      {points.map(point => <a key={point.name} href={point.href}><i style={{ background: point.color }} />{point.name}</a>)}
    </div>
    <svg viewBox="0 0 680 420" role="img" aria-labelledby="inventory-title inventory-desc">
      <title id="inventory-title">Inventory task time comparison</title>
      <desc id="inventory-desc">USATII completes the same inventory workflows in approximately half the time of incumbent tools.</desc>
      {[0, 5, 10, 15, 20].map(t => <g key={t}><line x1="92" x2="612" y1={y(t)} y2={y(t)} stroke={t === 0 ? "#222" : "#e8e8e8"} /><text x="78" y={y(t) + 4} textAnchor="end">{t}m</text></g>)}
      <line x1="92" x2="92" y1="108" y2="338" stroke="#222" />
      {["Receive", "Pick", "Count"].map((label, i) => <text key={label} x={x(i)} y="370" textAnchor="middle">{label}</text>)}
      <text x="352" y="408" textAnchor="middle">Inventory workflow</text>
      <text transform="translate(18 224) rotate(-90)" textAnchor="middle">Minutes to complete</text>
      {points.map((point, i) => <g key={point.name} fill={point.color} stroke={point.color}>
        <circle cx={x(i)} cy={y(point.value)} r="5"><title>{`${point.name}: ${point.value} minutes`}</title></circle>
      </g>)}
      <motion.path d={usatii.map((value, i) => `${i ? "L" : "M"}${x(i)},${y(value)}`).join(" ")} fill="none" stroke="#2868b2" strokeWidth="3" initial={reduced ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.1 }} />
      {usatii.map((value, i) => <g key={i} fill="#2868b2"><path d={`M${x(i)},${y(value)-8}l2.4,5.2 5.7,.7-4.1,4 1,5.7-5,-2.7-5,2.7 1,-5.7-4.1,-4 5.7,-.7Z`}><title>{`USATII: ${value} minutes`}</title></path></g>)}
    </svg>
    <div className={styles.plotResult}><strong>2× faster</strong><span>USATII inventory workflows</span></div>
  </Reveal>;
}

function Reveal({ children, className, delay = 0 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay }}>{children}</motion.div>;
}


function Status({ value }) {
  if (value === "yes") return <span className={styles.status}><Check aria-hidden="true" size={19} strokeWidth={2.5} /><span className={styles.srOnly}>Implemented / documented</span></span>;
  if (value === "integration") return <span className={styles.statusText}>Integration</span>;
  if (value === "partial") return <span className={styles.statusText}>Different scope</span>;
  return <span className={styles.statusUnknown}>Not verified</span>;
}

export function CapabilityTable({ type }) {
  const { competitor, rows } = comparisons[type];
  const competitorLinks = { HOVER: "https://hover.to/", "One Click Contractor": "https://oneclickcontractor.com/", JobNimbus: "https://www.jobnimbus.com/", monday: "https://monday.com/" };
  return <div id={`${type}-capabilities`}><Reveal className={styles.comparison}>
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`USATII and ${competitor} capability comparison`}>
      <table>
        <caption className={styles.srOnly}>USATII and {competitor} capability comparison.</caption>
        <thead><tr><th scope="col">Capability</th><th scope="col" className={styles.usatiiColumn}>USATII</th><th scope="col">{competitorLinks[competitor] ? <a href={competitorLinks[competitor]}>{competitor}</a> : competitor}</th></tr></thead>
        <tbody>{rows.map(([label, ours, theirs, note, refs]) => <tr key={label}>
          <th scope="row"><details><summary>{label}<Info size={12} aria-hidden="true" /></summary><p>{note} {refs.map(ref => <a key={ref} href={`#source-${ref}`} aria-label={`Source ${ref}`}>[{ref}] </a>)}</p></details></th>
          <td className={styles.usatiiColumn}><Status value={ours} /></td><td><Status value={theirs} /></td>
        </tr>)}</tbody>
      </table>
    </div>
  </Reveal></div>;
}

export function GeometryDiagram() {
  return <Reveal className={styles.geometryFigure}>
    <div className={styles.geometryHeading}><span>MEASURE / CAPTURE → CORRECT → RELEASE</span></div>
    <div className={styles.geometryGrid}>
      {[{ title: "Capture", body: "A starting point", drawing: <><path d="M30 118 V40 H160 V118 Z M85 40 V86 H160" strokeDasharray="5 5" /><path d="M32 120 L60 105" /></> }, { title: "Correct", body: "Editable geometry", drawing: <><path d="M30 118 V40 H160 V118 Z M85 40 V86 H160" />{[[30,40],[85,40],[160,40],[160,86],[30,118],[160,118]].map(([x,y]) => <rect key={`${x}-${y}`} x={x-4} y={y-4} width="8" height="8" fill="white" />)}<path d="M104 68 l9 9 l20 -24" /></> }, { title: "Release", body: "Reviewed quantities", drawing: <><path d="M42 25 H141 V135 H42 Z M58 51 H123 M58 71 H110 M58 91 H93" /><path d="M109 108 l9 9 l19 -23" /></> }].map(({ title, body, drawing }, index) => <Reveal key={title} delay={index * 0.12}><svg viewBox="0 0 190 160" role="img" aria-label={body}><g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">{drawing}</g></svg><h3>{title}</h3><p>{body}</p></Reveal>)}
    </div>
  </Reveal>;
}

export function ScanningLandscape() {
  const rows = [
    ["Interior 3D capture", "✓", "✓", "✓", "✓", "✓"],
    ["Measurement tools", "✓", "✓", "✓", "✓", "✓"],
    ["Plans / geometry exports", "✓", "✓", "✓", "✓", "✓"],
    ["Built-in estimating", "✓", "✓", "✓", "Not verified", "Not verified"],
    ["Versioned entity corrections + evidence", "✓", "Not verified", "Not verified", "Not verified", "Not verified"],
    ["Geometry review gates before takeoff", "✓", "Not verified", "Not verified", "Not verified", "Not verified"],
  ];
  return <Reveal className={styles.comparison}>
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="3D scanning platform comparison">
      <table className={styles.landscapeTable}><caption className={styles.srOnly}>USATII, HOVER, magicplan, Polycam and Matterport capabilities</caption><thead><tr>{[["Capability", ""], ["USATII", ""], ["HOVER", "https://hover.to/"], ["magicplan", "https://www.magicplan.app/"], ["Polycam", "https://poly.cam/"], ["Matterport", "https://matterport.com/"]].map(([name, href], index) => <th scope="col" key={name} className={index === 1 ? styles.usatiiColumn : undefined}>{href ? <a href={href}>{name}</a> : name}</th>)}</tr></thead><tbody>{rows.map(([label, ...values]) => <tr key={label}><th scope="row">{label}</th>{values.map((value, index) => <td key={index} className={index === 0 ? styles.usatiiColumn : undefined}>{value === "✓" ? <Status value="yes" /> : <Status value="unknown" />}</td>)}</tr>)}</tbody></table>
    </div>
  </Reveal>;
}

export function ArticleLink({ href, children }) {
  return <a className={styles.articleLink} href={href}>{children}<ArrowUpRight size={17} aria-hidden="true" /></a>;
}
