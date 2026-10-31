"use client";
import { useState } from "react";
import { ArrowRight, Clock3, FileText, Filter, RotateCcw, Download } from "lucide-react";
import SiteSelect from "../ui/Selector.js";

export function activityValue(value, column) {
  if (value === null || value === undefined || value === "") return "—";
  const option = column?.settings?.options?.find((entry) => entry.id === value);
  if (option) return option.label;
  if (typeof value === "boolean") return value ? "✓" : "Unchecked";
  if (Array.isArray(value)) return value.map((entry) => typeof entry === "object" ? entry.label || entry.name || entry.id : entry).join(", ");
  if (typeof value === "object") return value.label || value.name || JSON.stringify(value);
  return String(value);
}
function Value({ value, column }) {
  const option = column?.settings?.options?.find((entry) => entry.id === value);
  return <span title={activityValue(value, column)} className="block min-w-0 truncate rounded px-2 py-1 text-xs" style={option?.color ? { backgroundColor: option.color, color: "#fff" } : undefined}>{activityValue(value, column)}</span>;
}
function elapsed(date) {
  const hours = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 3600000));
  return hours >= 24 ? `${Math.floor(hours / 24)}d` : hours ? `${hours}h` : "now";
}
export default function WorkFlowActivityLog({ events, participants, columns, item, onRefresh, onUndo, busy, onExport }) {
  const [kind, setKind] = useState("all");
  const [person, setPerson] = useState("");
  const visible = events.filter((event) => (kind === "all" || event.kind === kind) && (!person || event.actor_principal_id === person));
  return <section aria-label="Item activity log">
    <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[#e6e9ef] pb-4">
      <Filter className="size-4 text-[#676879]" /><SiteSelect aria-label="Filter activity log" value={kind} onChange={(event) => setKind(event.target.value)} className="h-8 rounded border border-[#d0d4e4] bg-white px-2 text-xs"><option value="all">All activities</option><option value="cell">Field changes</option><option value="item">Item actions</option></SiteSelect>
      <SiteSelect aria-label="Filter activity by person" value={person} onChange={(event) => setPerson(event.target.value)} className="h-8 max-w-48 rounded border border-[#d0d4e4] bg-white px-2 text-xs"><option value="">Everyone</option>{participants.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</SiteSelect>
      <button type="button" onClick={onRefresh} disabled={busy} aria-label="Refresh activity log" className="ml-auto rounded p-2 hover:bg-[#f5f6f8]"><RotateCcw className="size-4 text-[#676879]" /></button><button type="button" onClick={() => onExport(visible)} aria-label="Export activity log to Excel" className="rounded p-2 hover:bg-[#f5f6f8]"><Download className="size-4 text-[#676879]" /></button>
    </div>
    <div className="overflow-x-auto"><table className="w-full min-w-[570px] table-fixed text-left text-sm"><colgroup><col className="w-14" /><col className="w-32" /><col className="w-32" /><col /><col className="w-5" /><col /><col className="w-16" /></colgroup><thead className="sr-only"><tr>{["Time", "Person", "Field or action", "Before", "", "After", "Restore"].map((label, index) => <th key={index}>{label}</th>)}</tr></thead><tbody>
      {visible.map((event) => {
        const column = columns.find((entry) => entry.id === event.column_id);
        const index = events.indexOf(event);
        const previous = event.kind === "cell" ? events.slice(index + 1).find((entry) => entry.kind === "cell" && entry.column_id === event.column_id) : null;
        const latest = !events.slice(0, index).some((entry) => entry.kind === "cell" && entry.column_id === event.column_id);
        const canUndo = event.kind === "cell" && previous && latest && column && !column.readOnly && !column.binding && onUndo && JSON.stringify(item.values?.[column.id] ?? null) === JSON.stringify(event.value_json ?? null);
        const actor = participants.find((entry) => entry.id === event.actor_principal_id);
        const name = event.actorName || actor?.label || "Former team member";
        return <tr key={`${event.kind}:${event.id}`} className="h-14 border-b border-[#d0d4e4]">
          <td title={new Date(event.created_at).toLocaleString()} className="text-xs text-[#676879]"><span className="flex items-center gap-1"><Clock3 className="size-3" />{elapsed(event.created_at)}</span></td>
          <td className="pr-2"><span className="flex items-center gap-1.5"><span title={name} className="grid size-7 shrink-0 place-items-center rounded-full bg-[#245a9d] text-[10px] font-medium text-white">{name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</span><span className="truncate text-xs" title={name}>{name}</span></span></td>
          <td className="pr-2"><span className="flex items-center gap-1.5"><FileText className="size-3.5 shrink-0 text-[#676879]" /><span className="truncate text-xs" title={column?.label}>{column?.label || (event.kind === "cell" ? event.value_kind : String(event.action || "Item changed").replaceAll(".", " "))}</span></span></td>
          <td>{event.kind === "cell" && !previous ? <span className="px-2 text-[10px] text-[#9799a6]">Not recorded</span> : <Value column={column} value={event.kind === "cell" ? previous.value_json : event.before_json} />}</td><td><ArrowRight className="size-3 text-[#c3c6d4]" /></td><td><Value column={column} value={event.kind === "cell" ? event.value_json : event.after_json} /></td>
          <td className="pl-1"><button type="button" disabled={!canUndo || busy} onClick={() => onUndo(column, previous.value_json)} title={canUndo ? "Restore the previous field value" : "Only the latest unchanged field value with a recorded previous value can be restored"} className="rounded border border-[#c3c6d4] px-2 py-1 text-xs disabled:opacity-30">Undo</button></td>
        </tr>;
      })}
    </tbody></table></div>{!visible.length && <p className="py-10 text-center text-sm text-[#676879]">No activities match these filters.</p>}
  </section>;
}
