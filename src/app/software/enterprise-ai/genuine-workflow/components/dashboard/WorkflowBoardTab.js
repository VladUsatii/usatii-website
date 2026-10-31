"use client";
import { demoRequest } from "../../demo-transport";
import InvoiceWorkspace, { InvoiceLauncher } from "./InvoiceWorkspace.jsx";
import WorkWindow from "./WorkWindow.js";
import { useWorkFlowLive } from "./useWorkFlowLive.js";
import WorkFlowActivityLog, { activityValue } from "./WorkFlowActivityLog.jsx";
import { exportWorkFlowExcel } from "../../lib/workflow-excel-export.js";
import WorkFlowSubitemCount from "./WorkFlowSubitemCount.jsx";
import { uploadWorkFlowFile } from "../../lib/workflow-upload-client.js";
import WorkFlowMentionText from "./WorkFlowMentionText.jsx";
import WorkFlowFilePreview from "./WorkFlowFilePreview.jsx";
import WorkFlowGridViewport from "./WorkFlowGridViewport.jsx";
import WorkFlowBufferedRows from "./WorkFlowBufferedRows.jsx";
import { isWithinDismissibleLayer, useDismissibleLayer } from "./useDismissibleLayer.js";
import { workFlowColumnSegments, workFlowColumnWindow } from "../../lib/workflow-platform/column-window.js";
import { workFlowContact } from "../../lib/workflow-platform/contact-values.js";
import BugReportMenuItem from "../common/BugReportMenuItem.js";
import MenuDisclosure from "../ui/MenuDisclosure.js";
import AnimatedMenu from "../ui/AnimatedMenu.js";

import DateInput from "../ui/DateTimeSelector.js";

import SiteSelect from "../ui/Selector.js";


import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Columns3, Minimize2, Pencil, ShieldCheck, Users, Archive, ArrowUpDown, Bell, Bot, Check, CheckSquare2, ChevronDown, CircleAlert, Copy, Download, ExternalLink, EyeOff, FileInput, FileText, Filter, Folder, FolderPlus, GripVertical, History, LayoutDashboard, LayoutTemplate, Link2, Loader2, MessageSquare, MoreHorizontal, Network, PanelLeftClose, PanelLeftOpen, Paperclip, Pause, Play, Plus, RotateCcw, Save, Search, Send, Settings2, Table2, ThumbsUp, Trash2, Unlink, Upload, X } from "lucide-react";
import { enqueueWorkFlowOfflineCommand, listWorkFlowOfflineCommands, replayWorkFlowOfflineCommands } from "../../lib/workflow-platform/offline-client.js";
import { resolveWorkFlowMainTablePresentation, resolveWorkFlowViewPresentation } from "../../lib/workflow-platform/view-presentation.js";

const inputClass = "h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const MONDAY_GROUP_COLORS = Object.freeze({ "waiting for approval": "#cab641", new: "#ff5ac4", working: "#ffcb00", stuck: "#df2f4a", finished: "#00c875" });
const workflowGroupColor = (title, fallback = "#579bfc") => MONDAY_GROUP_COLORS[String(title || "").trim().toLowerCase()] || fallback;

async function api(path,options={}) { return demoRequest(path,options); }

function displayValue(value, column) {
  if (value === null || value === undefined) return "";
  if (column.type === "time_tracking") return trackedTimeLabel(Number(value?.totalSeconds || 0));
  if (column.type === "vote") return `${Array.isArray(value) ? value.length : 0} votes`;
  if (column.type === "boolean") return value ? "Yes" : "No";
  if (column.type === "money") {
    const amount = Number(value?.amount);
    if (!Number.isFinite(amount)) return "";
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: value.currency || "USD" }).format(amount); }
    catch { return `${value.currency || ""} ${amount.toLocaleString()}`.trim(); }
  }
  if (column.type === "percent") return Number.isFinite(Number(value)) ? `${Number(value).toLocaleString()}%` : "";
  if (column.type === "status") return column.settings?.options?.find((option) => String(option.id) === String(value?.id || value))?.label || String(value?.label || value);
  if (column.type === "multi_select") return (Array.isArray(value) ? value : []).map((entry) => column.settings?.options?.find((option) => String(option.id) === String(entry?.id || entry))?.label || entry?.label || entry?.id || entry).join(", ");
  if (column.type === "phone") return [value?.raw || value?.normalized, value?.extension ? `ext. ${value.extension}` : ""].filter(Boolean).join(" ");
  if (column.type === "location") return value?.address || (value?.latitude != null && value?.longitude != null && Number.isFinite(Number(value.latitude)) && Number.isFinite(Number(value.longitude)) ? `${Number(value.latitude).toFixed(4)}, ${Number(value.longitude).toFixed(4)}` : "");
  if (column.type === "timeline") return value?.start ? timelineLabel(value) : "";
  if (["date", "datetime", "time_of_day", "week"].includes(column.type)) return formatTemporalValue(value, column.type);
  if (Array.isArray(value)) return value.map((entry) => displayValue(entry, { type: "text" })).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const label = value.label || value.name || value.title || value.displayName || value.address || value.id;
    if (label !== undefined && label !== null) return String(label);
    const entries = Object.entries(value).filter(([, entry]) => entry !== null && entry !== undefined && entry !== "" && typeof entry !== "object").slice(0, 3);
    return entries.length ? entries.map(([key, entry]) => `${key.replaceAll("_", " ")}: ${entry}`).join(" · ") : "Details available";
  }
  return String(value);
}

function workFlowCellValuesEqual(actual, expected, column) {
  if (actual == null && expected == null) return true;
  if (["domain_ref", "domain_refs"].includes(column?.type)) {
    const keys = (value) => (Array.isArray(value) ? value : value ? [value] : []).map((entry) => `${entry?.type || column.settings?.connectionTarget?.domainType || ""}:${entry?.id || ""}`).sort();
    return JSON.stringify(keys(actual)) === JSON.stringify(keys(expected));
  }
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function timelineLabel(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value?.start || "")) || !/^\d{4}-\d{2}-\d{2}$/.test(String(value?.end || ""))) return "Set dates";
  const start = new Date(`${value.start}T12:00:00Z`);
  const end = new Date(`${value.end}T12:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Set dates";
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
  const left = `${month.format(start)} ${start.getUTCDate()}`;
  const right = start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear() ? String(end.getUTCDate()) : `${month.format(end)} ${end.getUTCDate()}`;
  return `${left} – ${right}${start.getUTCFullYear() !== end.getUTCFullYear() ? `, ${end.getUTCFullYear()}` : ""}`;
}

function timelineProgress(value, now = Date.now()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value?.start || "")) || !/^\d{4}-\d{2}-\d{2}$/.test(String(value?.end || ""))) return 0;
  const start = Date.parse(`${value.start}T00:00:00Z`);
  const end = Date.parse(`${value.end}T23:59:59.999Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0;
  return Math.round(Math.max(0, Math.min(100, ((now - start) / Math.max(1, end - start)) * 100)));
}

function formatTemporalValue(value, type) {
  if (!value) return "";
  if (type === "time_of_day") {
    const match = String(value).match(/^(\d{2}):(\d{2})/);
    if (!match) return String(value);
    const date = new Date(Date.UTC(2000, 0, 1, Number(match[1]), Number(match[2])));
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(date);
  }
  if (type === "week") {
    const match = String(value).match(/^(\d{4})-W(\d{2})$/);
    return match ? `Week ${Number(match[2])}, ${match[1]}` : String(value);
  }
  const source = type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? `${value}T12:00:00Z` : value;
  const date = new Date(source);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", type === "datetime"
    ? { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }
    : { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

function trackedTimeLabel(seconds = 0) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}` : `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function relativeUpdateTime(value, now = Date.now()) {
  const elapsed = Math.max(0, now - new Date(value).getTime());
  if (elapsed < 60_000) return "just now";
  const units = [["year", 365 * 86_400_000], ["month", 30 * 86_400_000], ["day", 86_400_000], ["hour", 3_600_000], ["minute", 60_000]];
  const [unit, milliseconds] = units.find(([, size]) => elapsed >= size);
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-Math.floor(elapsed / milliseconds), unit);
}

function conditionalRuleMatches(item, column, rule) {
  const raw = column.type === "name" ? item.name : item.values?.[column.id];
  const value = displayValue(raw, column).trim();
  const expected = String(rule.value ?? "").trim();
  const left = value.toLocaleLowerCase();
  const right = expected.toLocaleLowerCase();
  if (rule.operator === "is_empty") return value === "";
  if (rule.operator === "is_not_empty") return value !== "";
  if (rule.operator === "neq") return left !== right;
  if (rule.operator === "contains") return left.includes(right);
  if (rule.operator === "gt") return Number(value) > Number(expected);
  if (rule.operator === "lt") return Number(value) < Number(expected);
  return left === right;
}

function conditionalCellStyle(item, column, columns, rules = []) {
  return rules.reduce((style, rule) => {
    const source = columns.find((entry) => entry.id === rule.columnId);
    if (!source || (rule.scope !== "row" && source.id !== column.id) || !conditionalRuleMatches(item, source, rule)) return style;
    return { ...style, ...(rule.backgroundColor ? { backgroundColor: rule.backgroundColor } : {}), ...(rule.textColor ? { color: rule.textColor } : {}) };
  }, {});
}

function visibleHierarchy(items, collapsedIds = []) {
  const children = new Map(); const roots = []; const byId = new Set(items.map((item) => item.id));
  for (const item of items) { if (item.parentItemId && byId.has(item.parentItemId)) { if (!children.has(item.parentItemId)) children.set(item.parentItemId, []); children.get(item.parentItemId).push(item); } else roots.push(item); }
  const collapsed = new Set(collapsedIds); const output = [];
  const visit = (item, ancestorContinuations = [], lastSibling = true) => {
    output.push({ ...item, hierarchyAncestorContinuations: ancestorContinuations, hierarchyLastSibling: lastSibling });
    if (collapsed.has(item.id)) return;
    const descendants = children.get(item.id) || [];
    const nextContinuations = Number(item.depth || 0) > 0 ? [...ancestorContinuations, !lastSibling] : [];
    descendants.forEach((child, index) => visit(child, nextContinuations, index === descendants.length - 1));
  };
  roots.forEach((item, index) => visit(item, [], index === roots.length - 1)); return output;
}

function HierarchyThread({ item }) {
  const depth = Math.max(0, Number(item.depth || 0));
  if (!depth) return null;
  const ancestors = Array.isArray(item.hierarchyAncestorContinuations) ? item.hierarchyAncestorContinuations : [];
  return <span className="work-flow-hierarchy-thread" style={{ "--hierarchy-depth": depth }} aria-label={`Subitem level ${depth}`} title={`Subitem · level ${depth}`}>
    {ancestors.map((continues, index) => continues ? <span key={index} className="work-flow-hierarchy-thread__ancestor" style={{ "--hierarchy-level": index }} /> : null)}
    <span className={`work-flow-hierarchy-thread__branch ${item.hierarchyLastSibling ? "is-last" : ""}`} />
    <span className="sr-only">Subitem level {depth}</span>
  </span>;
}

const REFERENCE_COLUMN_TYPES = new Set(["tag_refs", "person_refs", "team_refs", "assignee_refs", "domain_refs"]);

function AnchoredCellPopover({ open, anchorRef, onClose, children, ariaLabel, width = 280, kind: requestedKind }) {
  const reduce=useReducedMotion();
  const [position, setPosition] = useState(null);
  const popoverRef = useRef(null);
  const kind = requestedKind || (ariaLabel?.endsWith(" menu") ? "menu" : "dialog");
  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const place = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      const below = window.innerHeight - rect.bottom > 260;
      setPosition({ left, top: below ? rect.bottom + 4 : undefined, bottom: below ? undefined : window.innerHeight - rect.top + 4, width: Math.max(width, rect.width) });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    const close = (event) => { if (!isWithinDismissibleLayer(event.target, [anchorRef.current, popoverRef.current])) onClose(); };
    const escape = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); anchorRef.current?.querySelector?.('[aria-expanded="true"]')?.focus(); return; }
      if (kind !== "menu" || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const buttons = [...(popoverRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])') || [])];
      if (!buttons.length) return;
      event.preventDefault();
      const index = buttons.indexOf(document.activeElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : event.key === "ArrowDown" ? (index + 1 + buttons.length) % buttons.length : (index - 1 + buttons.length) % buttons.length;
      buttons[next].focus();
    };
    document.addEventListener("pointerdown", close, true);
    document.addEventListener("keydown", escape);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); document.removeEventListener("pointerdown", close, true); document.removeEventListener("keydown", escape); };
  }, [open, anchorRef, kind, onClose, width]);
  useEffect(() => {
    if (!open || kind !== "menu" || !popoverRef.current) return undefined;
    const buttons = [...popoverRef.current.querySelectorAll("button")];
    buttons.forEach((button) => button.setAttribute("role", "menuitem"));
    const frame = requestAnimationFrame(() => buttons.find((button) => !button.disabled)?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open, kind, position]);
  if (typeof document === "undefined") return null;
  return createPortal(<AnimatePresence>{open && position && <motion.div ref={popoverRef} data-work-flow-popover role={kind} aria-label={ariaLabel} initial={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduce ? 0 : -4, scale: reduce ? 1 : 0.98 }} transition={{ duration: reduce ? 0 : 0.14, ease: "easeOut" }} className="fixed z-[90] overflow-hidden rounded-lg border border-[#d0d4e4] bg-white text-[#323338] shadow-[0_8px_24px_rgba(0,0,0,.18)]" style={position}>{children}</motion.div>}</AnimatePresence>, document.body);
}

function PointerContextMenu({ menu, onClose }) {
  const reduce=useReducedMotion();
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menu) return undefined;
    const close = (event) => { if (!menuRef.current?.contains(event.target)) onClose(); };
    const keydown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose({ restoreFocus: true }); return; }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const buttons = [...(menuRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])') || [])];
      if (!buttons.length) return;
      event.preventDefault();
      const index = buttons.indexOf(document.activeElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : event.key === "ArrowDown" ? (index + 1 + buttons.length) % buttons.length : (index - 1 + buttons.length) % buttons.length;
      buttons[next].focus();
    };
    document.addEventListener("pointerdown", close, true);
    document.addEventListener("keydown", keydown);
    const frame = requestAnimationFrame(() => menuRef.current?.querySelector('[role="menuitem"]:not([disabled])')?.focus());
    return () => { cancelAnimationFrame(frame); document.removeEventListener("pointerdown", close, true); document.removeEventListener("keydown", keydown); };
  }, [menu, onClose]);
  if (typeof document === "undefined") return null;
  const width = 248;
  const left = Math.max(8, Math.min(menu?.x || 0, window.innerWidth - width - 8));
  const top = Math.max(8, Math.min(menu?.y || 0, window.innerHeight - Math.min(420, 86 + (menu?.items.length || 0) * 38)));
  return createPortal(<AnimatePresence>{menu&&<motion.div ref={menuRef} role="menu" aria-label={menu.label} initial={{ opacity: 0, scale: reduce?1:.97, y: reduce?0:-4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{opacity:0,y:reduce?0:-3}} transition={{duration:reduce?0:.14}} className="fixed z-[220] max-h-[26rem] w-[248px] overflow-y-auto rounded-lg border border-[#d0d4e4] bg-white p-1.5 text-[#323338] shadow-[0_12px_32px_rgba(0,0,0,.22)]" style={{ left, top }}>
    {menu.title && <p className="truncate px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#9799a6]">{menu.title}</p>}
    {menu.items.map((item, index) => item.separator ? <div key={`separator:${index}`} className="my-1 border-t border-[#d0d4e4]" /> : <button key={item.label} type="button" role="menuitem" disabled={item.disabled} onClick={() => { item.action(); onClose(); }} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8] focus:bg-[#f5f6f8] focus:outline-none disabled:opacity-40 ${item.danger ? "text-[#e2445c] hover:bg-[#fff0f2]" : ""}`}>{item.icon}{item.label}</button>)}
    <BugReportMenuItem onClose={onClose} />
  </motion.div>}</AnimatePresence>, document.body);
}

function contextMenuKey(event) {
  return event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
}

function PersonAvatar({ person, size = 24 }) {
  const initials = String(person?.label || person?.name || "?").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return person?.profilePhotoUrl ? <img src={person.profilePhotoUrl} alt={person.label || "Person"} className="rounded-full border-2 border-white object-cover" style={{ width: size, height: size }} /> : <span title={person?.label} className="grid shrink-0 place-items-center rounded-full border-2 border-white bg-[#c4c4c4] text-[9px] font-semibold text-[#323338]" style={{ width: size, height: size }}>{initials}</span>;
}

function PeopleStack({ value, options }) {
  const selected = (Array.isArray(value) ? value : []).map((entry) => options.find((option) => String(option.id) === String(entry?.id || entry) && (!entry?.type || !option.type || entry.type === option.type)) || entry).filter(Boolean);
  if (!selected.length) return <span className="text-[#9799a6]">—</span>;
  const shown = selected.slice(0, 3); const overflow = selected.length - shown.length;
  return <span className="flex items-center justify-center pl-2">{shown.map((person, index) => <span key={person.id || index} className="-ml-2 first:ml-0"><PersonAvatar person={person} /></span>)}{overflow > 0 && <span className="-ml-1 grid size-6 place-items-center rounded-full border-2 border-white bg-[#676879] text-[10px] font-semibold text-white">+{overflow}</span>}</span>;
}

function ReferenceChips({ value, semantic, target }) {
  const references = (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);
  if (!references.length) return <span className="text-[#9799a6]">—</span>;
  const visible = references.slice(0, 2);
  return <span className="flex min-w-0 items-center justify-center gap-1 px-1">{visible.map((reference, index) => <span key={`${reference?.type || "ref"}:${reference?.id || index}`} title={reference?.label || reference?.name || reference?.id} className="inline-flex min-w-0 max-w-[110px] items-center gap-1 rounded-full border border-[#d0d4e4] bg-white px-2 py-0.5 text-[11px] text-[#323338]"><Link2 className="size-3 shrink-0 text-[#0073ea]" /><span className="truncate">{reference?.label || reference?.name || reference?.id || String(reference)}</span></span>)}{references.length > visible.length && <span className="shrink-0 text-[11px] font-medium text-[#676879]">+{references.length - visible.length}</span>}{target?.label && <span className="sr-only">Connected to {target.label}</span>}{semantic === "mirror" && <span className="sr-only">Mirrored value</span>}</span>;
}

function MirrorValue({ value }) {
  const values = (Array.isArray(value) ? value : value === null || value === undefined ? [] : [value]).filter((entry) => entry !== null && entry !== undefined && entry !== "");
  if (!values.length) return <span className="text-[#9799a6]">—</span>;
  const label = (entry) => displayValue(entry, { type: "text" });
  return <span className="flex min-w-0 items-center justify-center gap-1 px-1">{values.slice(0, 2).map((entry, index) => <span key={`${label(entry)}:${index}`} className="max-w-[120px] truncate rounded-sm bg-[#e6f4ff] px-2 py-0.5 text-[11px] text-[#323338]" title={label(entry)}>{label(entry)}</span>)}{values.length > 2 && <span className="text-[11px] font-medium text-[#676879]">+{values.length - 2}</span>}</span>;
}

function ReadOnlyCellValue({ column, value, updatedBy, peopleOptions = [] }) {
  const semantic = column.settings?.sourceSemantic;
  if (["created_at", "updated_at"].includes(column.type) && value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return <span className="flex min-h-8 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap px-2 text-xs text-[#676879]" title={`${updatedBy?.label ? `${updatedBy.label} · ` : ""}${date.toLocaleString()}`}>{column.type === "updated_at" && updatedBy && <PersonAvatar person={updatedBy} size={24} />}<span className="truncate">{column.type === "updated_at" ? relativeUpdateTime(date) : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date)}</span></span>;
  }
  if (semantic === "progress_tracking") {
    const percent = Math.max(0, Math.min(100, Number(value?.percent ?? value ?? 0)));
    return <span className="flex min-h-8 items-center gap-2 px-2" title={`${percent}% complete`}><span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#e6e9ef]"><motion.span initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="block h-full rounded-full bg-[#00c875]" /></span><span className="w-8 text-right text-[11px] tabular-nums text-[#676879]">{percent}%</span></span>;
  }
  if (semantic === "vote") {
    const votes = Array.isArray(value) ? value : value?.voters || [];
    return <span className="flex min-h-8 items-center justify-center gap-1.5"><PeopleStack value={votes} options={peopleOptions} /><span className="text-[11px] tabular-nums text-[#676879]">{votes.length || Number(value?.count || 0)}</span></span>;
  }
  if (semantic === "mirror") return <span className="flex min-h-8 items-center justify-center"><MirrorValue value={value} /></span>;
  if (["domain_ref", "domain_refs", "board_item_refs", "document_ref", "asset_refs"].includes(column.type)) return <span className="flex min-h-8 items-center justify-center"><ReferenceChips value={value} semantic={semantic} target={column.settings?.connectionTarget} /></span>;
  return <span className="block min-h-8 px-2 py-1.5 text-slate-500">{displayValue(value, column) || "—"}</span>;
}

function StructuredCellDialog({ column, value, onClose, onCommit, disabled }) {
  const [draft, setDraft] = useState(() => {
    if (column.type === "money") return { amount: value?.amount ?? "", currency: value?.currency || column.settings?.currency || "USD" };
    if (column.type === "phone") return { raw: value?.raw || "", extension: value?.extension || "", country: value?.country || "" };
    if (column.type === "location") return { address: value?.address || "", latitude: value?.latitude ?? "", longitude: value?.longitude ?? "" };
    if (column.type === "document_ref" || column.type === "domain_ref") return { id: value?.id || "", type: value?.type || "", label: value?.label || "" };
    return {};
  });
  const update = (key, next) => setDraft((current) => ({ ...current, [key]: next }));
  const save = () => {
    if (column.type === "money") onCommit(draft.amount === "" ? null : { amount: draft.amount, currency: draft.currency.toUpperCase() });
    else if (column.type === "phone") onCommit(draft.raw ? { raw: draft.raw, normalized: "", extension: draft.extension, country: draft.country.toUpperCase() } : null);
    else if (column.type === "location") onCommit(draft.address || draft.latitude !== "" || draft.longitude !== "" ? { address: draft.address, latitude: Number(draft.latitude), longitude: Number(draft.longitude) } : null);
    else onCommit(draft.id ? { id: draft.id, ...(draft.type ? { type: draft.type } : {}), ...(draft.label ? { label: draft.label } : {}) } : null);
    onClose();
  };
  return createPortal(<div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label={`Edit ${column.label}`}><div className="w-full max-w-md rounded-lg border border-[#d0d4e4] bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#d0d4e4] px-5 py-4"><h2 className="font-semibold text-[#323338]">{column.label}</h2><button type="button" onClick={onClose} className="work-flow-icon-button" aria-label={`Close ${column.label} editor`}><X className="size-4" /></button></header><div className="grid gap-4 p-5">
    {column.type === "money" && <><label><span className="mb-1 block text-sm font-medium">Amount</span><input autoFocus type="number" step="any" value={draft.amount} onChange={(event) => update("amount", event.target.value)} className={`${inputClass} w-full`} /></label><label><span className="mb-1 block text-sm font-medium">Currency</span><input value={draft.currency} maxLength={3} onChange={(event) => update("currency", event.target.value)} className={`${inputClass} w-full uppercase`} placeholder="USD" /></label></>}
    {column.type === "phone" && <><label><span className="mb-1 block text-sm font-medium">Phone number</span><input autoFocus type="tel" value={draft.raw} onChange={(event) => update("raw", event.target.value)} className={`${inputClass} w-full`} /></label><div className="grid grid-cols-2 gap-3"><label><span className="mb-1 block text-sm font-medium">Extension</span><input value={draft.extension} onChange={(event) => update("extension", event.target.value)} className={`${inputClass} w-full`} /></label><label><span className="mb-1 block text-sm font-medium">Country code</span><input value={draft.country} maxLength={2} onChange={(event) => update("country", event.target.value)} className={`${inputClass} w-full uppercase`} placeholder="US" /></label></div></>}
    {column.type === "location" && <><label><span className="mb-1 block text-sm font-medium">Address</span><input autoFocus value={draft.address} onChange={(event) => update("address", event.target.value)} className={`${inputClass} w-full`} /></label><div className="grid grid-cols-2 gap-3"><label><span className="mb-1 block text-sm font-medium">Latitude</span><input type="number" step="any" min="-90" max="90" value={draft.latitude} onChange={(event) => update("latitude", event.target.value)} className={`${inputClass} w-full`} /></label><label><span className="mb-1 block text-sm font-medium">Longitude</span><input type="number" step="any" min="-180" max="180" value={draft.longitude} onChange={(event) => update("longitude", event.target.value)} className={`${inputClass} w-full`} /></label></div></>}
    {["document_ref", "domain_ref"].includes(column.type) && <><label><span className="mb-1 block text-sm font-medium">Record ID</span><input autoFocus value={draft.id} onChange={(event) => update("id", event.target.value)} className={`${inputClass} w-full`} /></label>{column.type === "domain_ref" && <label><span className="mb-1 block text-sm font-medium">Record type</span><input value={draft.type} onChange={(event) => update("type", event.target.value)} className={`${inputClass} w-full`} /></label>}<label><span className="mb-1 block text-sm font-medium">Display label</span><input value={draft.label} onChange={(event) => update("label", event.target.value)} className={`${inputClass} w-full`} /></label></>}
  </div><footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-5 py-4"><button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#dcdfec]">Cancel</button><button type="button" disabled={disabled || (column.type === "money" && draft.amount !== "" && !/^[A-Za-z]{3}$/.test(draft.currency))} onClick={save} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Save</button></footer></div></div>, document.body);
}

function TimeTrackingCell({ column, value, onCommit, disabled, currentPrincipalId, peopleOptions }) {
  const [clock, setClock] = useState(0);
  const runningSince = value?.runningSince || null;
  useEffect(() => {
    if (!runningSince) return undefined;
    const timer = window.setInterval(() => setClock(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [runningSince]);
  const elapsed = runningSince && clock ? Math.max(0, Math.floor((clock - new Date(runningSince).getTime()) / 1000)) : 0;
  const totalSeconds = Math.max(0, Number(value?.totalSeconds || 0)) + elapsed;
  const toggle = () => {
    const now = new Date().toISOString();
    if (!runningSince) return onCommit({ totalSeconds: Math.max(0, Number(value?.totalSeconds || 0)), runningSince: now, entries: Array.isArray(value?.entries) ? value.entries : [] });
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(runningSince).getTime()) / 1000));
    const person = peopleOptions.find((entry) => String(entry.id) === String(currentPrincipalId));
    onCommit({ totalSeconds: Math.max(0, Number(value?.totalSeconds || 0)) + seconds, runningSince: null, entries: [...(Array.isArray(value?.entries) ? value.entries : []), { id: crypto.randomUUID(), startedAt: runningSince, endedAt: now, seconds, ...(currentPrincipalId ? { person: { id: String(currentPrincipalId), ...(person?.label ? { label: person.label } : {}) } } : {}) }] });
  };
  return <button type="button" disabled={disabled} onClick={toggle} aria-label={`${runningSince ? "Stop" : "Start"} ${column.label} timer`} className={`flex h-8 w-full items-center justify-center gap-2 px-2 text-xs font-medium ${runningSince ? "bg-[#e2445c] text-white" : "hover:bg-[#f5f6f8]"}`}>{runningSince ? <Pause className="size-3.5" /> : <Play className="size-3.5 text-[#00a66a]" />}<span className="tabular-nums">{trackedTimeLabel(totalSeconds)}</span></button>;
}

function VoteCell({ column, value, onCommit, disabled, currentPrincipalId, peopleOptions }) {
  const votes = Array.isArray(value) ? value : [];
  const voted = votes.some((entry) => String(entry?.id || entry) === String(currentPrincipalId));
  const toggle = () => {
    if (!currentPrincipalId) return;
    if (voted) return onCommit(votes.filter((entry) => String(entry?.id || entry) !== String(currentPrincipalId)));
    const person = peopleOptions.find((entry) => String(entry.id) === String(currentPrincipalId));
    onCommit([...votes, { id: String(currentPrincipalId), ...(person?.label ? { label: person.label } : {}) }]);
  };
  return <button type="button" disabled={disabled || !currentPrincipalId} onClick={toggle} aria-label={`${voted ? "Remove vote from" : "Vote on"} ${column.label}`} aria-pressed={voted} className={`flex h-8 w-full items-center justify-center gap-1.5 px-2 text-xs ${voted ? "bg-[#e5f4ff] text-[#0073ea]" : "hover:bg-[#f5f6f8]"}`}><ThumbsUp className={`size-3.5 ${voted ? "fill-current" : ""}`} /><PeopleStack value={votes} options={peopleOptions} /><span className="tabular-nums">{votes.length}</span></button>;
}

function AutomationButtonCell({ column, itemId, boardId, disabled }) {
  const [running, setRunning] = useState(false);
  const [state, setState] = useState("");
  const automationId = column.settings?.automationId;
  const label = column.settings?.buttonLabel || column.settings?.label || column.label || "Run";
  const execute = async () => {
    if (!automationId || running) return;
    setRunning(true); setState("");
    try {
      const payload = await api(`/api/work-flow/v1/automations/${automationId}/execute`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ input: { boardId, itemId, source: "button_column", columnId: column.id } }) });
      setState(payload.data?.execution?.status === "succeeded" ? "succeeded" : payload.data?.execution?.status || "queued");
    } catch (error) { setState("failed"); }
    finally { setRunning(false); }
  };
  return <button type="button" disabled={disabled || running || !automationId} onClick={execute} aria-label={`${label} for item`} title={!automationId ? "Choose an automation in this column's settings" : state === "failed" ? "Automation failed" : undefined} className={`mx-auto flex h-7 max-w-[calc(100%-8px)] items-center justify-center gap-1.5 rounded px-3 text-xs font-medium transition ${state === "succeeded" ? "bg-[#00c875] text-white" : state === "failed" ? "bg-[#e2445c] text-white" : "bg-[#0073ea] text-white hover:bg-[#0060b9]"} disabled:cursor-not-allowed disabled:bg-[#c3c6d4]`}>{running ? <Loader2 className="size-3.5 animate-spin" /> : state === "succeeded" ? <CheckSquare2 className="size-3.5" /> : <Play className="size-3.5" />}<span className="truncate">{state === "succeeded" ? "Done" : state === "failed" ? "Try again" : label}</span></button>;
}

function CsvImportDialog({ draft, groups, busy, onClose, onImport }) {
  const [step, setStep] = useState("map");
  const [mapping, setMapping] = useState(() => ({ ...(draft.analysis.suggestedMapping || {}) }));
  const [groupId, setGroupId] = useState(draft.groupId || groups[0]?.id || "");
  const destinations = [{ value: "name", label: "Item name", type: "name" }, ...draft.analysis.columns.filter((column) => column.type !== "name" && !column.readOnly).map((column) => ({ value: column.stableKey, label: column.label, type: column.type }))];
  const mappedCount = Object.values(mapping).filter(Boolean).length;
  const hasName = Object.values(mapping).includes("name");
  const duplicateDestinations = Object.values(mapping).filter(Boolean).filter((value, index, values) => values.indexOf(value) !== index);
  const canContinue = hasName && duplicateDestinations.length === 0;
  const sample = draft.analysis.sample || [];
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#323338]/50 p-4" role="dialog" aria-modal="true" aria-label="Import CSV">
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#d0d4e4] bg-white shadow-2xl">
      <header className="flex items-start justify-between border-b border-[#d0d4e4] px-6 py-5"><div><h2 className="text-xl font-semibold text-[#323338]">Import items from CSV</h2><p className="mt-1 text-sm text-[#676879]">{draft.fileName} · {draft.analysis.rowCount} rows · {draft.analysis.headers.length} columns</p></div><button type="button" onClick={onClose} className="work-flow-icon-button" aria-label="Close CSV import"><X className="size-5" /></button></header>
      <div className="flex border-b border-[#d0d4e4] px-6 text-sm"><button type="button" onClick={() => setStep("map")} className={`px-1 py-3 ${step === "map" ? "border-b-2 border-[#0073ea] font-medium text-[#0073ea]" : "text-[#676879]"}`}>1. Map columns</button><button type="button" disabled={!canContinue} onClick={() => setStep("preview")} className={`ml-6 px-1 py-3 disabled:opacity-40 ${step === "preview" ? "border-b-2 border-[#0073ea] font-medium text-[#0073ea]" : "text-[#676879]"}`}>2. Preview & import</button></div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {step === "map" ? <div className="space-y-4"><div className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#676879]"><span>CSV column</span><span /><span>Work Flow column</span></div>{draft.analysis.headers.map((header) => <div key={header} className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-3"><div className="truncate rounded-md border border-[#d0d4e4] bg-[#f5f6f8] px-3 py-2 text-sm" title={header}>{header}</div><span className="text-center text-[#9799a6]">→</span><SiteSelect value={mapping[header] || ""} onChange={(event) => setMapping((current) => ({ ...current, [header]: event.target.value || null }))} className={`${inputClass} w-full`}><option value="">Do not import</option>{destinations.map((destination) => <option key={destination.value} value={destination.value}>{destination.label} · {destination.type}</option>)}</SiteSelect></div>)}{!hasName && <p className="text-sm text-[#d83a52]">Map one CSV column to Item name to continue.</p>}{duplicateDestinations.length > 0 && <p className="text-sm text-[#d83a52]">Each Work Flow column can only be mapped once.</p>}</div> : <div className="space-y-5"><label className="block max-w-sm"><span className="mb-1.5 block text-sm font-medium">Add imported items to</span><SiteSelect value={groupId} onChange={(event) => setGroupId(event.target.value)} className={`${inputClass} w-full`}>{groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}</SiteSelect></label><div><div className="mb-2 flex items-center justify-between"><h3 className="font-medium">Preview</h3><span className="text-sm text-[#676879]">Showing {sample.length} of {draft.analysis.rowCount} rows</span></div><div className="overflow-x-auto rounded-lg border border-[#d0d4e4]"><table className="w-full border-collapse text-sm"><thead className="bg-[#f5f6f8]"><tr>{draft.analysis.headers.filter((header) => mapping[header]).map((header) => <th key={header} className="whitespace-nowrap border-b border-r border-[#d0d4e4] px-3 py-2 text-left font-medium last:border-r-0">{destinations.find((entry) => entry.value === mapping[header])?.label || header}</th>)}</tr></thead><tbody>{sample.map((row, index) => <tr key={index}>{draft.analysis.headers.filter((header) => mapping[header]).map((header) => <td key={header} className="max-w-64 truncate border-b border-r border-[#e6e9ef] px-3 py-2 last:border-r-0" title={String(row[header] || "")}>{row[header] || <span className="text-[#9799a6]">Empty</span>}</td>)}</tr>)}</tbody></table></div></div></div>}
      </div>
      <footer className="flex items-center justify-between border-t border-[#d0d4e4] px-6 py-4"><span className="text-sm text-[#676879]">{mappedCount} of {draft.analysis.headers.length} columns mapped</span><div className="flex gap-2"><button type="button" onClick={step === "preview" ? () => setStep("map") : onClose} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#dcdfec]">{step === "preview" ? "Back" : "Cancel"}</button>{step === "map" ? <button type="button" disabled={!canContinue} onClick={() => setStep("preview")} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Preview import</button> : <button type="button" disabled={busy || !groupId} onClick={() => onImport({ mapping, groupId })} className="inline-flex items-center gap-2 rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{busy && <Loader2 className="size-4 animate-spin" />}Import {draft.analysis.rowCount} items</button>}</div></footer>
    </motion.div>
  </div>;
}

function MondayImportReadinessDialog({ boardId, boards = [], onClose, setError, onImported }) {
  const [sourceBoardId, setSourceBoardId] = useState("");
  const [schemaText, setSchemaText] = useState("");
  const [manifest, setManifest] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [mappings, setMappings] = useState({});
  const [automationMappings, setAutomationMappings] = useState({});
  const [identityMappings, setIdentityMappings] = useState({});
  const [archivedPolicy, setArchivedPolicy] = useState("block");
  const [archivedIdsText, setArchivedIdsText] = useState("");
  const [migrationMode, setMigrationMode] = useState("initial");
  const [cutoverAcknowledged, setCutoverAcknowledged] = useState(false);
  const [missingItemPolicy, setMissingItemPolicy] = useState("preserve");
  const [deltaPlan, setDeltaPlan] = useState(null);
  const [manualAutomations, setManualAutomations] = useState([]);
  const [identityTargets, setIdentityTargets] = useState({ people: [], teams: [] });
  const [busy, setBusy] = useState(true);
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    setBusy(true);
    Promise.all([api("/api/work-flow/v1/compatibility/monday"), api(`/api/work-flow/v1/boards/${boardId}/automations`), api("/api/dashboard/team-members")]).then(([compatibility, automationPayload, memberPayload]) => {
      if (!active) return;
      setManifest(compatibility.data.manifest);
      setManualAutomations((automationPayload.data?.automations || []).filter((entry) => entry.enabled && entry.activeVersion?.trigger?.type === "manual"));
      const members = Array.isArray(memberPayload.items) ? memberPayload.items : [];
      setIdentityTargets({ people: members.map((member) => ({ id: String(member.id), label: member.name || member.email || String(member.id) })), teams: [...new Set(members.map((member) => String(member.department || "").trim()).filter(Boolean))].map((label) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, "_"), label })) });
    }).catch((cause) => { if (active) setError(cause.message); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [boardId, setError]);
  useEffect(() => {
    const jobId = result?.job?.id;
    if (!jobId || !["queued", "running", "retrying"].includes(result.job.status)) return undefined;
    let active = true;
    const timer = setInterval(() => {
      api(`/api/work-flow/v1/imports/${jobId}`).then((payload) => {
        if (!active) return;
        const job = payload.data.job;
        setResult((current) => ({ ...(current || {}), job, migration: payload.data.migration || current?.migration || null }));
        if (job.status === "completed" && job.result?.board) onImported(job.result.board);
        if (job.status === "failed") setError(job.error?.message || "The Monday import failed.");
      }).catch((cause) => { if (active) setError(cause.message); });
    }, 1500);
    return () => { active = false; clearInterval(timer); };
  }, [result?.job?.id, result?.job?.status, onImported, setError]);
  const analyze = async () => {
    setBusy(true); setError("");
    try {
      const source = schemaText.trim() ? JSON.parse(schemaText) : { boardId: sourceBoardId.trim() };
      const archivedItemIds = archivedIdsText.split(/[\s,]+/).map((entry) => entry.trim()).filter(Boolean);
      const payload = await api("/api/work-flow/v1/compatibility/monday", { method: "POST", body: JSON.stringify({ ...source, connectionMappings: mappings, automationMappings, identityMappings, archivedPolicy, archivedItemIds }) });
      setAnalysis({ ...payload.data.analysis, source: payload.data.analysis.source || {} });
      if (migrationMode === "delta" && sourceBoardId.trim()) { const delta = await api("/api/work-flow/v1/imports/monday/delta", { method: "POST", body: JSON.stringify({ boardId: sourceBoardId.trim(), archivedItemIds, deferDiscovery: true }) }); setDeltaPlan(delta.data); }
      else setDeltaPlan(null);
    } catch (cause) { setError(cause instanceof SyntaxError ? "Paste valid Monday board schema JSON." : cause.message); }
    finally { setBusy(false); }
  };
  const runImport = async () => {
    setBusy(true); setError("");
    try {
      const archivedItemIds = archivedIdsText.split(/[\s,]+/).map((entry) => entry.trim()).filter(Boolean);
      const payload = await api("/api/work-flow/v1/imports/monday", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ boardId: sourceBoardId.trim(), connectionMappings: mappings, automationMappings, identityMappings, archivedPolicy, archivedItemIds, migrationMode, cutoverAcknowledged, missingItemPolicy }) });
      setResult(payload.data);
    } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  };
  const controlImport = async (action) => {
    if (!result?.job?.id || (action === "rollback" && !window.confirm("Move the imported Work Flow board to the recycle bin? This rollback remains recoverable."))) return;
    setBusy(true); setError("");
    try { const payload = await api(`/api/work-flow/v1/imports/${result.job.id}`, { method: "POST", body: JSON.stringify({ action }) }); setResult((current) => ({ ...(current || {}), job: { ...(current?.job || {}), ...payload.data.job } })); }
    catch (cause) { setError(cause.message); } finally { setBusy(false); }
  };
  const mappedTarget = (columnId, value) => setMappings((current) => ({ ...current, [columnId]: value === "preserve" ? { kind: "preserve" } : value === "work_flow_board" ? { kind: "work_flow_board", boardId: "select-during-import" } : { kind: "domain", domainType: value } }));
  const mapIdentity = (candidate, destinationId) => { const targets = candidate.kind === "team" ? identityTargets.teams : identityTargets.people; const selected = targets.find((entry) => entry.id === destinationId); setIdentityMappings((current) => destinationId ? { ...current, [candidate.key]: { kind: candidate.kind, destinationId, label: selected?.label || destinationId } } : Object.fromEntries(Object.entries(current).filter(([key]) => key !== candidate.key))); };
  return <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#323338]/50 p-4" role="dialog" aria-modal="true" aria-label="Import from Monday"><motion.div initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#d0d4e4] bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-[#d0d4e4] px-6 py-5"><div><h2 className="text-xl font-semibold text-[#323338]">Import from Monday</h2><p className="mt-1 text-sm text-[#676879]">Check every column and map connected boards to the Rebuildit feature that owns those records.</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close Monday import"><X className="size-5" /></button></header><div className="min-h-0 flex-1 overflow-y-auto p-6">
    {!analysis ? <div className="space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-medium">Monday board ID or URL</span><input autoFocus value={sourceBoardId} onChange={(event) => setSourceBoardId(event.target.value.replace(/^.*\/boards\/(\d+).*$/, "$1"))} className={`${inputClass} w-full`} placeholder="1234567890" /></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Migration run</span><SiteSelect aria-label="Migration run" value={migrationMode} onChange={(event) => { setMigrationMode(event.target.value); setCutoverAcknowledged(false); }} className={`${inputClass} w-full`}><option value="initial">Initial import to a new Work Flow board</option><option value="delta">Delta sync into the prior imported board</option></SiteSelect></label>{migrationMode === "delta" && <div className="space-y-3 rounded-lg border border-[#d0d4e4] p-4"><label className="block"><span className="mb-1.5 block text-sm font-medium">Items missing from the latest Monday read</span><SiteSelect aria-label="Missing item policy" value={missingItemPolicy} onChange={(event) => setMissingItemPolicy(event.target.value)} className={`${inputClass} w-full`}><option value="preserve">Preserve in Work Flow and flag for review</option><option value="archive">Archive in Work Flow during cutover</option></SiteSelect></label><label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={cutoverAcknowledged} onChange={(event) => setCutoverAcknowledged(event.target.checked)} className="mt-0.5 size-4 accent-[#0073ea]" /><span>I have started a controlled cutover window and understand changes made in Monday during this sync may require another delta run.</span></label></div>}<label className="block"><span className="mb-1.5 block text-sm font-medium">Archived item policy</span><SiteSelect aria-label="Archived item policy" value={archivedPolicy} onChange={(event) => setArchivedPolicy(event.target.value)} className={`${inputClass} w-full`}><option value="block">Choose before importing…</option><option value="exclude">Exclude archived items intentionally</option><option value="provided_ids">Import archived items by supplied IDs</option></SiteSelect></label>{archivedPolicy === "provided_ids" && <label className="block"><span className="mb-1.5 block text-sm font-medium">Archived Monday item IDs</span><textarea aria-label="Archived Monday item IDs" rows={3} value={archivedIdsText} onChange={(event) => setArchivedIdsText(event.target.value)} className="w-full rounded-lg border border-[#c3c6d4] p-3 font-mono text-xs outline-none focus:border-[#0073ea]" placeholder="123456789, 987654321" /></label>}<details><summary className="cursor-pointer text-xs font-medium text-[#676879]">Analyze a saved schema instead</summary><label className="mt-3 block"><span className="mb-1.5 block text-sm font-medium">Monday board schema JSON</span><textarea rows={8} value={schemaText} onChange={(event) => setSchemaText(event.target.value)} className="w-full rounded-lg border border-[#c3c6d4] p-3 font-mono text-xs outline-none focus:border-[#0073ea]" /></label></details><p className="text-xs text-[#676879]">Monday’s API lists active items only. Archived items can be recovered when you supply their IDs. Work Flow never changes the source board.</p></div> : result ? <div className="space-y-5 py-10 text-center">{result.job?.status === "completed" ? <CheckSquare2 className="mx-auto size-9 text-[#00a65a]" /> : ["failed", "canceled"].includes(result.job?.status) ? <X className="mx-auto size-9 text-[#d83a52]" /> : <Loader2 className="mx-auto size-9 animate-spin text-[#0073ea]" />}<div><p className="text-lg font-semibold">{result.job?.status === "completed" ? "Import complete" : result.job?.status === "retrying" ? "Import paused for retry" : ["failed", "canceled"].includes(result.job?.status) ? "Import needs attention" : result.job?.status === "rolled_back" ? "Import rolled back" : "Import in progress"}</p><p className="mt-1 text-sm text-[#676879]">{result.job?.status === "completed" ? `${result.job.result?.imported?.items || 0} items, ${result.job.result?.imported?.subitems || 0} subitems, and ${result.job.result?.imported?.updates || 0} updates imported.` : result.job?.error?.message || (result.job?.status === "rolled_back" ? "The destination board is in the recoverable recycle bin." : "You can close this dialog; the durable import will continue in the background.")}</p></div>{Boolean(result.migration?.checkpoints?.length) && <ul aria-label="Import progress" className="mx-auto max-w-2xl space-y-1 text-left text-sm text-[#676879]">{result.migration.checkpoints.map((checkpoint) => <li key={checkpoint.phase}>{checkpoint.phase === "discovery" ? `Source discovery: ${checkpoint.counters_json?.discovered || 0} IDs found, ${checkpoint.counters_json?.hydrated || 0} items saved${checkpoint.status === "completed" ? " · complete" : ""}` : checkpoint.phase === "items" ? `Destination items: ${checkpoint.counters_json?.items || 0}${checkpoint.counters_json?.totalItems ? ` of ${checkpoint.counters_json.totalItems}` : ""} imported · ${checkpoint.counters_json?.subitems || 0} subitems` : `${checkpoint.phase.replaceAll("_", " ")}: ${checkpoint.status}`}</li>)}</ul>}{Boolean(result.migration?.reconciliation?.some((entry) => entry.severity !== "info")) && <div className="mx-auto max-w-2xl text-left"><p className="mb-2 text-sm font-semibold">Items requiring review</p><ul className="space-y-1 text-sm text-[#676879]">{result.migration.reconciliation.filter((entry) => entry.severity !== "info").slice(0, 8).map((entry) => <li key={`${entry.category}:${entry.source_key}`}>• {entry.category.replaceAll("_", " ")}: {entry.details_json?.message || entry.details_json?.reason?.replaceAll("_", " ") || entry.outcome}</li>)}</ul></div>}<div className="flex justify-center gap-2">{["queued", "running", "retrying"].includes(result.job?.status) && <button onClick={() => controlImport("cancel")} disabled={busy} className="rounded-md border border-[#d0d4e4] px-3 py-2 text-sm font-medium">Cancel import</button>}{["failed", "canceled"].includes(result.job?.status) && <button onClick={() => controlImport("retry")} disabled={busy} className="rounded-md bg-[#0073ea] px-3 py-2 text-sm font-medium text-white">Retry safely</button>}{["completed", "failed", "canceled"].includes(result.job?.status) && result.job?.boardId && <button onClick={() => controlImport("rollback")} disabled={busy} className="rounded-md px-3 py-2 text-sm font-medium text-[#d83a52] hover:bg-[#fff0f3]">Rollback to recycle bin</button>}</div></div> : <div className="space-y-5"><div className={`rounded-lg border px-4 py-3 ${analysis.migrationReady ? "border-[#00c875] bg-[#e6f8f2]" : "border-[#fdab3d] bg-[#fff6e5]"}`}><p className="font-semibold text-[#323338]">{analysis.migrationReady ? "Ready for import" : "Mapping required before import"}</p><p className="mt-1 text-sm text-[#676879]">{analysis.source.boardName} · {analysis.counts.supported} of {analysis.counts.total} columns supported · {analysis.counts.requiresMapping} column mappings · {analysis.counts.unresolvedIdentities || 0} people/team mappings unresolved{analysis.counts.archivePolicyRequired ? " · archived-item policy required" : ""}</p>{deltaPlan && <p className="mt-2 text-sm text-[#676879]">{deltaPlan.deferred ? `Prior import found (${deltaPlan.baselineItems || 0} items and subitems). The worker will compare the complete source snapshot before applying the sync.` : `Delta plan: ${deltaPlan.summary.create} new, ${deltaPlan.summary.update} changed, ${deltaPlan.summary.unchanged} unchanged, and ${deltaPlan.summary.missing} missing source objects.`}</p>}{Boolean(analysis.limitations?.length) && <ul className="mt-2 space-y-1 text-xs text-[#676879]">{analysis.limitations.map((limitation) => <li key={limitation.code}>• {limitation.message}</li>)}</ul>}</div><div className="overflow-hidden rounded-lg border border-[#d0d4e4]"><div className="grid grid-cols-[minmax(180px,1fr)_11rem_minmax(220px,1fr)] gap-3 bg-[#f5f6f8] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#676879]"><span>Monday column</span><span>Work Flow type</span><span>Rebuildit feature</span></div>{analysis.columns.map((column) => <div key={column.columnId} className="grid grid-cols-[minmax(180px,1fr)_11rem_minmax(220px,1fr)] items-center gap-3 border-t border-[#e6e9ef] px-4 py-3 text-sm"><span className="min-w-0"><strong className="block truncate">{column.title}</strong><span className="text-xs text-[#9799a6]">{column.mondayType}</span></span><span className="rounded bg-[#f5f6f8] px-2 py-1 text-xs">{column.supported ? column.workFlow.type : "Unsupported"}</span>{column.migrationStatus === "requires_connection_mapping" ? <div className="space-y-2"><SiteSelect aria-label={`Map ${column.title}`} value={["work_flow_board", "preserve"].includes(mappings[column.columnId]?.kind) ? mappings[column.columnId].kind : mappings[column.columnId]?.domainType || ""} onChange={(event) => mappedTarget(column.columnId, event.target.value)} className={`${inputClass} w-full`}><option value="">Choose authoritative feature…</option><option value="preserve">Preserve Monday references for later linking</option>{(manifest?.connectionTargets || []).map((target) => <option key={target.domainType} value={target.domainType}>{target.label}</option>)}</SiteSelect>{mappings[column.columnId]?.kind === "work_flow_board" && <SiteSelect aria-label={`Destination board for ${column.title}`} value={mappings[column.columnId].boardId === "select-during-import" ? "" : mappings[column.columnId].boardId} onChange={(event) => setMappings((current) => ({ ...current, [column.columnId]: { kind: "work_flow_board", boardId: event.target.value || "select-during-import" } }))} className={`${inputClass} w-full`}><option value="">Choose destination board…</option>{boards.map((board) => <option key={board.id} value={board.id}>{board.name}</option>)}</SiteSelect>}</div> : column.migrationStatus === "requires_automation_mapping" ? <SiteSelect aria-label={`Map ${column.title} automation`} value={automationMappings[column.columnId] || ""} onChange={(event) => setAutomationMappings((current) => ({ ...current, [column.columnId]: event.target.value }))} className={`${inputClass} w-full`}><option value="">Choose enabled manual automation…</option>{manualAutomations.map((automation) => <option key={automation.id} value={automation.id}>{automation.name}</option>)}</SiteSelect> : <span className={`text-xs font-medium ${column.supported ? "text-[#00854a]" : "text-[#d83a52]"}`}>{column.supported ? column.connectionTarget?.label || "Preserved natively" : column.reason}</span>}</div>)}</div>{Boolean(analysis.identityCandidates?.length) && <div className="overflow-hidden rounded-lg border border-[#d0d4e4]"><div className="bg-[#f5f6f8] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#676879]">People and team reconciliation</div>{analysis.identityCandidates.map((candidate) => <label key={candidate.key} className="grid grid-cols-[minmax(160px,1fr)_minmax(220px,1.4fr)] items-center gap-3 border-t border-[#e6e9ef] px-4 py-3 text-sm"><span><strong className="block">{candidate.label}</strong><span className="text-xs text-[#9799a6]">Monday {candidate.kind} · {candidate.sourceId}</span></span><SiteSelect aria-label={`Map Monday ${candidate.kind} ${candidate.label}`} value={identityMappings[candidate.key]?.destinationId || ""} onChange={(event) => mapIdentity(candidate, event.target.value)} className={`${inputClass} w-full`}><option value="">Choose Rebuildit {candidate.kind}…</option>{(candidate.kind === "team" ? identityTargets.teams : identityTargets.people).map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}</SiteSelect></label>)}</div>}<button onClick={analyze} disabled={busy} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Apply mappings and recheck</button></div>}
  </div><footer className="flex items-center justify-between border-t border-[#d0d4e4] px-6 py-4"><button onClick={() => { setAnalysis(null); setResult(null); setDeltaPlan(null); setMappings({}); setAutomationMappings({}); setIdentityMappings({}); }} disabled={!analysis || busy} className="text-sm font-medium text-[#676879] disabled:opacity-30">Start over</button><div className="flex gap-2"><button onClick={onClose} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8]">{result ? "Done" : "Close"}</button>{!analysis && <button onClick={analyze} disabled={busy || (!sourceBoardId.trim() && !schemaText.trim()) || (migrationMode === "delta" && !cutoverAcknowledged)} className="inline-flex items-center gap-2 rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{busy && <Loader2 className="size-4 animate-spin" />}Analyze board</button>}{analysis?.migrationReady && !result && sourceBoardId.trim() && <button onClick={runImport} disabled={busy || (migrationMode === "delta" && (!cutoverAcknowledged || !deltaPlan))} className="inline-flex items-center gap-2 rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{busy && <Loader2 className="size-4 animate-spin" />}{migrationMode === "delta" ? "Apply delta sync" : "Import board"}</button>}</div></footer></motion.div></div>;
}

function BoardActivityDrawer({ board, onClose }) {
  const [events, setEvents] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); api(`/api/work-flow/v1/boards/${board.id}/activity?limit=150`).then((payload) => { if (active) setEvents(payload.data.events || []); }).catch((cause) => { if (active) setError(cause.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [board.id]);
  return <div className="fixed inset-0 z-[110] bg-[#323338]/30" role="dialog" aria-modal="true" aria-label="Board activity"><motion.aside initial={{ x: 440 }} animate={{ x: 0 }} exit={{ x: 440 }} transition={{ type: "spring", stiffness: 360, damping: 36 }} className="ml-auto flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#d0d4e4] px-5 py-4"><div><h2 className="text-lg font-semibold text-[#323338]">Activity log</h2><p className="text-sm text-[#676879]">{board.name}</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close activity"><X className="size-5" /></button></header><div className="flex-1 overflow-y-auto p-5">{loading && <div className="flex items-center gap-2 text-sm text-[#676879]"><Loader2 className="size-4 animate-spin" />Loading activity…</div>}{error && <p className="text-sm text-red-600">{error}</p>}{!loading && !error && !events.length && <p className="text-sm text-[#676879]">No board activity yet.</p>}<ol className="relative border-l border-[#d0d4e4] pl-5">{events.map((event) => <li key={event.id} className="relative pb-6 before:absolute before:-left-[25px] before:top-1 before:size-2 before:rounded-full before:bg-[#0073ea]"><p className="text-sm font-medium text-[#323338]">{event.summary}</p><p className="mt-1 text-xs text-[#676879]">{event.actor?.name || "Work Flow"} · {new Date(event.createdAt).toLocaleString()}</p></li>)}</ol></div></motion.aside></div>;
}

function RecoveryDrawer({ boardId, onClose, onChanged }) {
  const [records, setRecords] = useState({ boards: [], items: [] }); const [tab, setTab] = useState("Items"); const [loading, setLoading] = useState(true); const [workingId, setWorkingId] = useState(""); const [error, setError] = useState("");
  const loadRecovery = useCallback(async () => { setLoading(true); setError(""); try { const payload = await api(`/api/work-flow/v1/recovery?${new URLSearchParams({ ...(boardId ? { boardId } : {}), limit: "300" })}`); setRecords(payload.data); } catch (cause) { setError(cause.message); } finally { setLoading(false); } }, [boardId]);
  useEffect(() => { loadRecovery(); }, [loadRecovery]);
  const restore = async (record, kind) => { setWorkingId(record.id); setError(""); try { await api(kind === "board" ? `/api/work-flow/v1/boards/${record.id}/restore` : `/api/work-flow/v1/boards/${record.boardId}/items/${record.id}/restore`, { method: "POST", headers: { "If-Match": `"${record.revision}"` }, body: JSON.stringify({ cascade: true }) }); await loadRecovery(); await onChanged(kind, record); } catch (cause) { setError(cause.message); } finally { setWorkingId(""); } };
  const visible = tab === "Items" ? records.items : records.boards;
  return <div className="fixed inset-0 z-[110] bg-[#323338]/30" role="dialog" aria-modal="true" aria-label="Archive and recycle bin"><motion.aside initial={{ x: 520 }} animate={{ x: 0 }} exit={{ x: 520 }} transition={{ type: "spring", stiffness: 360, damping: 36 }} className="ml-auto flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#d0d4e4] px-5 py-4"><div><h2 className="text-lg font-semibold text-[#323338]">Archive &amp; recycle bin</h2><p className="text-sm text-[#676879]">Restore removed boards and tasks.</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close archive and recycle bin"><X className="size-5" /></button></header><nav className="flex gap-1 border-b border-[#d0d4e4] px-4 pt-2">{["Items", "Boards"].map((label) => <button key={label} onClick={() => setTab(label)} className={`border-b-2 px-4 py-2 text-sm font-medium ${tab === label ? "border-[#0073ea] text-[#0073ea]" : "border-transparent text-[#676879] hover:text-[#323338]"}`}>{label} <span className="ml-1 text-xs">{label === "Items" ? records.items.length : records.boards.length}</span></button>)}</nav><div className="flex-1 overflow-y-auto p-4">{loading && <div className="flex items-center gap-2 text-sm text-[#676879]"><Loader2 className="size-4 animate-spin" />Loading removed work…</div>}{error && <p className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}{!loading && !visible.length && <div className="py-16 text-center"><Archive className="mx-auto mb-3 size-8 text-[#c3c6d4]" /><p className="font-medium text-[#323338]">Nothing removed</p><p className="mt-1 text-sm text-[#676879]">Archived and deleted {tab.toLowerCase()} appear here.</p></div>}<div className="divide-y divide-[#e6e9ef]">{visible.map((record) => <article key={record.id} className="flex items-center gap-3 py-3"><span className={`grid size-9 shrink-0 place-items-center rounded-full ${record.state === "trashed" ? "bg-red-50 text-[#d83a52]" : "bg-[#f5f6f8] text-[#676879]"}`}>{record.state === "trashed" ? <Trash2 className="size-4" /> : <Archive className="size-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#323338]">{record.name}</p><p className="text-xs text-[#676879]">{record.state === "trashed" ? "Recycle bin" : "Archived"}{record.groupTitle ? ` · ${record.groupTitle}` : ""} · {new Date(record.removedAt).toLocaleString()}</p></div><button onClick={() => restore(record, tab === "Boards" ? "board" : "item")} disabled={Boolean(workingId)} className="inline-flex items-center gap-1.5 rounded-md border border-[#c3c6d4] px-3 py-1.5 text-sm font-medium text-[#323338] hover:bg-[#f5f6f8] disabled:opacity-40">{workingId === record.id ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCcw className="size-3.5" />}Restore</button></article>)}</div></div></motion.aside></div>;
}

function BoardDuplicateDialog({ board, busy, onClose, onSubmit }) {
  const [name, setName] = useState(`${board.name} copy`); const [options, setOptions] = useState({ includeItems: true, includeUpdates: true, includeFiles: true, includeViews: true, includeForms: true, includeAutomations: true, includeSubscribers: false });
  const toggle = (key) => setOptions((current) => ({ ...current, [key]: !current[key] }));
  const choices = [{ key: "includeItems", label: "Items and subitems", detail: "Copy every active task and its column values." }, { key: "includeUpdates", label: "Updates and replies", detail: "Keep item discussions, mentions, and reactions.", requiresItems: true }, { key: "includeFiles", label: "Linked files", detail: "Link existing file versions to the copied work.", requiresItems: true }, { key: "includeViews", label: "Views", detail: "Copy table, kanban, calendar, chart, and other saved views." }, { key: "includeForms", label: "Forms", detail: "Copy published intake forms with remapped destinations." }, { key: "includeAutomations", label: "Automations", detail: "Copy recipes in a disabled state for review." }, { key: "includeSubscribers", label: "Board members", detail: "Copy member roles and access grants." }];
  const submit = () => onSubmit({ name: name.trim(), ...options, includeUpdates: options.includeItems && options.includeUpdates, includeFiles: options.includeItems && options.includeFiles });
  return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#323338]/50 p-4" role="dialog" aria-modal="true" aria-label="Duplicate board"><motion.div initial={{ opacity: 0, scale: .97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .97, y: 8 }} className="w-full max-w-xl overflow-hidden rounded-xl border border-[#d0d4e4] bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#d0d4e4] px-6 py-5"><div><h2 className="text-xl font-semibold text-[#323338]">Duplicate board</h2><p className="mt-1 text-sm text-[#676879]">Choose exactly what carries into the new board.</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close duplicate board"><X className="size-5" /></button></header><div className="max-h-[65vh] overflow-y-auto p-6"><label className="block"><span className="mb-1.5 block text-sm font-medium text-[#323338]">Board name</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} className={`${inputClass} w-full`} /></label><div className="mt-5 divide-y divide-[#e6e9ef] border-y border-[#e6e9ef]">{choices.map((choice) => { const disabled = choice.requiresItems && !options.includeItems; return <label key={choice.key} className={`flex cursor-pointer items-start gap-3 py-3 ${disabled ? "opacity-45" : ""}`}><input type="checkbox" checked={disabled ? false : options[choice.key]} disabled={disabled} onChange={() => toggle(choice.key)} className="mt-0.5 size-4 accent-[#0073ea]" /><span><span className="block text-sm font-medium text-[#323338]">{choice.label}</span><span className="block text-xs text-[#676879]">{choice.detail}</span></span></label>; })}</div><p className="mt-4 rounded-md bg-[#f5f6f8] px-3 py-2 text-xs text-[#676879]">Copied automations remain disabled until reviewed. Files reuse their secured stored versions instead of duplicating storage.</p></div><footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-6 py-4"><button onClick={onClose} disabled={busy} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8]">Cancel</button><button onClick={submit} disabled={busy || !name.trim()} className="inline-flex items-center gap-2 rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{busy && <Loader2 className="size-4 animate-spin" />}Duplicate board</button></footer></motion.div></div>;
}

function StatusLabelManager({ column, onClose, onSave }) {
  const [options, setOptions] = useState(() => (column.settings?.options || []).map((option) => ({ active: option.active !== false, description: "", completion: false, ...option })));
  const [saving, setSaving] = useState(false);
  const update = (id, key, value) => setOptions((current) => current.map((option) => option.id === id ? { ...option, [key]: value } : option));
  const add = () => setOptions((current) => [...current, { id: `status_${crypto.randomUUID().slice(0, 8)}`, label: "New label", color: "#579bfc", description: "", active: true, completion: false }]);
  const save = async () => { setSaving(true); try { await onSave({ ...column.settings, options }); onClose(); } finally { setSaving(false); } };
  // Keep the dialog outside table cells so grid styles and clipping cannot affect its controls.
  return createPortal(<div className="fixed inset-0 z-[140] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label={`Manage ${column.label} labels`}><motion.div initial={{ opacity: 0, y: 10, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#d0d4e4] bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-[#d0d4e4] px-5 py-4"><div><h2 className="font-semibold text-[#323338]">Manage {column.label} labels</h2><p className="mt-1 text-sm text-[#676879]">Label IDs remain stable when names or colors change. Deactivate used labels instead of deleting their history.</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close status label manager"><X className="size-4" /></button></header><div className="min-h-0 flex-1 overflow-y-auto p-5"><div className="space-y-2">{options.map((option, index) => <div key={option.id} className={`grid items-center gap-2 rounded-lg border border-[#d0d4e4] p-3 sm:grid-cols-[2.5rem_minmax(120px,1fr)_minmax(150px,1.4fr)_auto] ${option.active ? "" : "opacity-60"}`}><input type="color" aria-label={`Color for ${option.label}`} value={option.color || "#579bfc"} onChange={(event) => update(option.id, "color", event.target.value)} className="size-9 cursor-pointer rounded border border-[#d0d4e4] bg-white p-1" /><label className="sr-only" htmlFor={`status-label-${option.id}`}>Label {index + 1}</label><input id={`status-label-${option.id}`} aria-label={`Status label ${index + 1}`} value={option.label} maxLength={80} onChange={(event) => update(option.id, "label", event.target.value)} className={`${inputClass} w-full`} /><input aria-label={`Description for ${option.label}`} value={option.description || ""} maxLength={240} onChange={(event) => update(option.id, "description", event.target.value)} placeholder="Description" className={`${inputClass} w-full`} /><div className="flex items-center gap-3 whitespace-nowrap text-xs text-[#676879]"><label className="flex items-center gap-1"><input type="checkbox" checked={Boolean(option.completion)} onChange={(event) => update(option.id, "completion", event.target.checked)} />Done</label><label className="flex items-center gap-1"><input type="checkbox" checked={option.active !== false} onChange={(event) => update(option.id, "active", event.target.checked)} />Active</label></div></div>)}</div><button onClick={add} className="mt-3 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#0073ea] hover:bg-[#cce5ff]"><Plus className="size-4" />Add label</button></div><footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-5 py-4"><button onClick={onClose} disabled={saving} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8]">Cancel</button><button onClick={save} disabled={saving || !options.length || options.some((option) => !option.label.trim())} className="inline-flex items-center gap-2 rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{saving && <Loader2 className="size-4 animate-spin" />}Save labels</button></footer></motion.div></div>, document.body);
}

export function DomainReferenceCellEditor({ column, value, onCommit, disabled }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lookupMode, setLookupMode] = useState("search");
  const [results, setResults] = useState([]);
  const [resultLimit, setResultLimit] = useState(25);
  const [cursor, setCursor] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const domainType = column.settings?.connectionTarget?.domainType;
  const multiple = column.type === "domain_refs";
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  useEffect(() => {
    if (!open || !domainType || (lookupMode === "id" && !query.trim())) { setResults([]); return; }
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      setError("");
      try {
        const params = new URLSearchParams(lookupMode === "id" ? { entityId: query.trim() } : { query: query.trim(), limit: String(resultLimit), cursor });
        const payload = await api(`/api/work-flow/v1/domain-types/${encodeURIComponent(domainType)}/objects?${params}`);
        if (active) {
          const objects = payload.data.objects || [];
          setResults((current) => cursor ? [...new Map([...current, ...objects].map((entry) => [entry.entityId, entry])).values()] : objects);
          setHasMoreResults(Boolean(payload.data.pageInfo?.hasNextPage));
          setNextCursor(payload.data.pageInfo?.endCursor || null);
        }
      } catch (cause) { if (active) { setError(cause.message); setResults([]); } }
      finally { if (active) setLoading(false); }
    }, query ? 250 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [open, domainType, query, resultLimit, cursor, lookupMode]);
  const resetSearch = (text) => { setQuery(text); setCursor(""); setNextCursor(null); setResultLimit(25); setResults([]); setHasMoreResults(false); };
  const commit = async (next) => {
    if (saving || disabled) return;
    setSaving(true);
    try { await onCommit(next); if (!multiple) setOpen(false); }
    catch (cause) { setError(cause.message); }
    finally { setSaving(false); }
  };
  const remove = (entry) => commit(multiple ? selected.filter((candidate) => !(candidate.type === entry.type && String(candidate.id) === String(entry.id))) : null);
  const toggle = (object) => {
    const ref = { type: domainType, id: String(object.entityId), label: object.label || String(object.entityId) };
    if (!multiple) { void commit(ref); return; }
    const present = selected.some((entry) => entry.type === ref.type && String(entry.id) === ref.id);
    void commit(present ? selected.filter((entry) => !(entry.type === ref.type && String(entry.id) === ref.id)) : [...selected, ref]);
  };
  return <div ref={anchorRef} className="relative h-8 w-full">
    <button type="button" aria-label={`Connect ${column.label}`} disabled={disabled || saving} onClick={() => { resetSearch(""); setOpen((current) => !current); }} className="flex h-8 w-full items-center justify-center px-2 text-xs hover:bg-[#f5f6f8]"><ReferenceChips value={value} target={column.settings?.connectionTarget} /></button>
    <AnchoredCellPopover open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} ariaLabel={`Connect ${column.label}`} width={360}>
      <div className="space-y-2 border-b border-[#d0d4e4] p-2">
        <SiteSelect aria-label="Record lookup mode" value={lookupMode} onChange={(event) => { setLookupMode(event.target.value); resetSearch(""); }} className={`${inputClass} w-full`}><option value="search">Search records</option><option value="id">Find by record ID</option></SiteSelect>
        <div className="flex items-center gap-2 rounded-md bg-[#f5f6f8] px-2"><Search className="size-4 text-[#676879]" /><input autoFocus value={query} onChange={(event) => resetSearch(event.target.value)} placeholder={lookupMode === "id" ? "Enter the feature’s record ID" : `Search ${column.settings?.connectionTarget?.label || column.label}`} className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none" /></div>
      </div>
      <div className="max-h-72 overflow-y-auto p-1">
        {selected.length > 0 && <div className="border-b border-[#e6e9ef] pb-1">{selected.map((entry) => <div key={`${entry.type}:${entry.id}`} className="flex items-center gap-2 px-3 py-2"><span className="min-w-0 flex-1"><span className="block truncate text-sm">{entry.label || entry.id}</span><span className="text-xs text-[#676879]">ID: {entry.id}</span></span><button type="button" disabled={disabled || saving} aria-label={`Unlink ${entry.label || entry.id}`} onClick={() => remove(entry)} className="rounded p-1 hover:bg-[#f5f6f8]"><X className="size-4" /></button></div>)}</div>}
        {!domainType ? <p className="px-3 py-5 text-sm text-[#676879]">Choose a Rebuildit feature for this column before connecting records.</p> : error ? <p role="alert" className="px-3 py-5 text-sm text-[#e2445c]">{error}</p> : <>{results.map((object) => {
          const checked = selected.some((entry) => entry.type === domainType && String(entry.id) === String(object.entityId));
          return <button key={object.entityId} type="button" disabled={disabled || saving || loading} onClick={() => toggle(object)} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8] disabled:opacity-50"><span className={`grid size-4 shrink-0 place-items-center rounded border ${checked ? "border-[#0073ea] bg-[#0073ea] text-white" : "border-[#c3c6d4]"}`}>{checked ? "✓" : ""}</span><span className="min-w-0 flex-1"><span className="block truncate">{object.label || object.entityId}</span><span className="text-xs text-[#676879]">ID: {object.entityId}</span></span></button>;
        })}{loading ? <p role="status" className="px-3 py-5 text-sm text-[#676879]">Searching records…</p> : !results.length && <p className="px-3 py-5 text-center text-sm text-[#676879]">{lookupMode === "id" && !query.trim() ? "Enter a record ID to look it up." : "No matching records"}</p>}
        {!loading && hasMoreResults && (nextCursor || resultLimit < 250) && <button type="button" onClick={() => nextCursor ? setCursor(nextCursor) : setResultLimit((current) => Math.min(250, current + 25))} className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[#0073ea] hover:bg-[#f5f6f8]">Load more records</button>}
        {!loading && hasMoreResults && !nextCursor && resultLimit >= 250 && <p className="px-3 py-2 text-xs text-[#676879]">Narrow your search or find a record by its ID.</p>}</>}
      </div>
    </AnchoredCellPopover>
  </div>;
}

function AssetCellEditor({ column, value, itemId, disabled }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    if (!itemId) return;
    setLoading(true); setError("");
    try { const payload = await api(`/api/work-flow/v1/targets/item/${itemId}/assets?columnId=${encodeURIComponent(column.id)}`); setAssets(payload.data?.assets || []); }
    catch (cause) { setError(cause.message); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    const node = anchorRef.current;
    if (!node || !itemId) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { load(); observer.disconnect(); }
    });
    observer.observe(node);
    return () => observer.disconnect();
    // Reload when a cell is reused for another item or column.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, column.id, value]);
  const upload = async (file) => {
    if (!file || !itemId) return;
    setUploading(true); setError("");
    try { await uploadWorkFlowFile({ api, path: `/api/work-flow/v1/targets/item/${itemId}/assets`, file, columnId: column.id }); await load(); }
    catch (cause) { setError(cause.message); }
    finally { setUploading(false); }
  };
  const download = async (asset) => {
    if(asset.version?.previewUrl){const a=document.createElement("a");a.href=asset.version.previewUrl;a.download=asset.version.originalFilename;a.click();return;}
    try {
      const response = await fetch(asset.version.downloadUrl, { method: "POST" });
      if (!response.ok) { const payload = await response.json().catch(() => ({})); throw new Error(payload?.error?.message || "Unable to download attachment."); }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = asset.version.originalFilename || asset.logicalName; anchor.click(); URL.revokeObjectURL(url);
    } catch (cause) { setError(cause.message); }
  };
  return <div ref={anchorRef} className="relative flex h-8 w-full items-center justify-center gap-0.5">{assets.slice(0, 3).map((asset) => <WorkFlowFilePreview key={asset.id} asset={asset} onDownload={download} />)}<button type="button" aria-label={`${column.label} files`} aria-expanded={open} disabled={!itemId} onClick={() => { if (!open) load(); setOpen((current) => !current); }} className="flex h-8 min-w-6 items-center justify-center gap-1 px-1 text-xs hover:bg-[#f5f6f8]">{assets.length > 3 ? <span className="rounded-full bg-[#323338] px-1.5 py-1 text-white">+{assets.length - 3}</span> : assets.length ? <MoreHorizontal className="size-3.5 text-[#676879]" /> : <><Paperclip className="size-3.5 shrink-0 text-[#676879]" />{value?.length ? <ReferenceChips value={value} /> : <span className="text-[#9799a6]">{loading ? "Loading…" : "Add files"}</span>}</>}</button><AnchoredCellPopover open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} ariaLabel={`${column.label} attachments`} width={320}><div className="border-b border-[#d0d4e4] px-3 py-2 text-sm font-semibold">Files on this item</div><div className="max-h-72 overflow-y-auto p-2">{loading ? <p className="px-2 py-4 text-sm text-[#676879]">Loading files…</p> : assets.length ? assets.map((asset) => <WorkFlowFilePreview key={asset.id} asset={asset} onDownload={download} fullWidth />) : <p className="px-2 py-4 text-center text-sm text-[#676879]">No files attached yet.</p>}{error && <p role="alert" className="px-2 py-2 text-xs text-red-700">{error}</p>}</div><label className="flex cursor-pointer items-center gap-2 border-t border-[#d0d4e4] px-3 py-3 text-sm text-[#0073ea] hover:bg-[#f5f6f8]"><Upload className="size-4" />{uploading ? "Uploading…" : "Upload file"}<input type="file" className="sr-only" disabled={disabled || uploading} onChange={(event) => { upload(event.target.files?.[0]); event.target.value = ""; }} /></label></AnchoredCellPopover></div>;
}

function DependencyCellEditor({ column, value, itemId, boardId, boardItems = [], boardDependencies, disabled }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [candidateItems, setCandidateItems] = useState(boardItems);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateTypes, setCandidateTypes] = useState({});
  const [dependencies, setDependencies] = useState(boardDependencies || []);
  const [loaded, setLoaded] = useState(Array.isArray(boardDependencies));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setDependencies(boardDependencies || []); setLoaded(Array.isArray(boardDependencies)); }, [itemId, boardDependencies]);
  useEffect(() => {
    if (!open || !boardId) return undefined;
    let active = true;
    setLoadingCandidates(true);
    const timer = setTimeout(async () => {
      try { const payload = await api(`/api/work-flow/v1/boards/${boardId}/relation-candidates?q=${encodeURIComponent(query.trim())}`); if (active) setCandidateItems(payload.data?.candidates || []); }
      catch (cause) { if (active) setError(cause.message); }
      finally { if (active) setLoadingCandidates(false); }
    }, query ? 180 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [open, boardId, query]);
  const load = async () => {
    if (!itemId) return;
    setError("");
    try { const payload = await api(`/api/work-flow/v1/items/${itemId}/dependencies`); setDependencies(payload.data?.dependencies || []); setLoaded(true); }
    catch (cause) { setError(cause.message); }
  };
  const predecessors = dependencies.filter((entry) => entry.successorItemId === itemId);
  const candidates = [...new Map([...predecessors.map((entry) => ({ id: entry.predecessorItemId, name: entry.predecessorName || entry.predecessorItemId })), ...candidateItems].map((entry) => [entry.id, entry])).values()].filter((entry) => entry.id !== itemId && entry.state !== "trashed" && entry.name.toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = async (candidate) => {
    const existing = predecessors.find((entry) => entry.predecessorItemId === candidate.id);
    setBusy(true); setError("");
    try {
      if (existing) await api(`/api/work-flow/v1/items/${itemId}/dependencies/${existing.id}`, { method: "DELETE", headers: { "If-Match": `"${existing.revision}"` } });
      else await api(`/api/work-flow/v1/items/${itemId}/dependencies`, { method: "POST", body: JSON.stringify({ predecessorItemId: candidate.id, dependencyType: candidateTypes[candidate.id] || "finish_start" }) });
      await load();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const changeType = async (candidate, nextType) => {
    const existing = predecessors.find((entry) => entry.predecessorItemId === candidate.id);
    if (!existing) { setCandidateTypes((current) => ({ ...current, [candidate.id]: nextType })); return; }
    if (existing.dependencyType === nextType) return;
    setBusy(true); setError("");
    try {
      await api(`/api/work-flow/v1/items/${itemId}/dependencies/${existing.id}`, { method: "PATCH", headers: { "If-Match": `"${existing.revision}"` }, body: JSON.stringify({ dependencyType: nextType }) });
      await load();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  return <div ref={anchorRef} className="relative h-8 w-full"><button type="button" aria-label={`${column.label} dependencies`} disabled={disabled || !itemId} onClick={() => { if (!open) load(); setOpen((current) => !current); }} className="flex h-8 w-full items-center justify-center px-2 text-xs hover:bg-[#f5f6f8]">{loaded ? <ReferenceChips value={predecessors.map((entry) => ({ id: entry.predecessorItemId, label: entry.predecessorName }))} /> : <ReferenceChips value={value} />}</button><AnchoredCellPopover open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} ariaLabel={`Select ${column.label} dependencies`} width={340}><div className="border-b border-[#d0d4e4] p-2"><div className="flex items-center gap-2 rounded-md bg-[#f5f6f8] px-2"><Search className="size-4 text-[#676879]" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search board tasks" className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none" /></div></div><div className="max-h-72 overflow-y-auto p-1">{candidates.map((candidate) => { const existing = predecessors.find((entry) => entry.predecessorItemId === candidate.id); return <div key={candidate.id} className="flex items-center gap-1 rounded-md px-1 hover:bg-[#f5f6f8]"><button type="button" disabled={busy || disabled || existing?.locked} onClick={() => toggle(candidate)} className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm disabled:opacity-50"><span className={`grid size-4 shrink-0 place-items-center rounded border ${existing ? "border-[#0073ea] bg-[#0073ea] text-white" : "border-[#c3c6d4]"}`}>{existing ? "✓" : ""}</span><span className="truncate">{candidate.name}</span></button><SiteSelect aria-label={`Dependency rule for ${candidate.name}`} value={existing?.dependencyType || candidateTypes[candidate.id] || "finish_start"} onChange={(event) => changeType(candidate, event.target.value)} disabled={busy || disabled || existing?.locked} className="w-32 shrink-0 rounded border border-[#d0d4e4] bg-white px-1 py-1 text-xs text-[#323338]"><option value="finish_start">Finish-To-Start</option><option value="start_start">Start-To-Start</option><option value="finish_finish">Finish-To-Finish</option><option value="start_finish">Start-To-Finish</option></SiteSelect></div>; })}{loadingCandidates && <p className="px-3 py-2 text-center text-xs text-[#676879]">Searching board tasks…</p>}{!loadingCandidates && !candidates.length && <p className="px-3 py-5 text-center text-sm text-[#676879]">No matching board tasks</p>}{candidates.length === 50 && <p className="px-3 py-2 text-xs text-[#676879]">Showing 50 tasks. Search to find more.</p>}{error && <p role="alert" className="px-3 py-2 text-xs text-red-700">{error}</p>}</div><p className="border-t border-[#d0d4e4] px-3 py-2 text-xs text-[#676879]">Each linked task keeps its own scheduling rule.</p></AnchoredCellPopover></div>;
}

function BoardRelationCellEditor({ column, value, itemId, itemRelations, disabled, onUpdateColumnSettings }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const [targetBoardId, setTargetBoardId] = useState(column.settings?.targetBoardId || "");
  const [candidates, setCandidates] = useState([]);
  const [relations, setRelations] = useState(itemRelations || []);
  const [loaded, setLoaded] = useState(Array.isArray(itemRelations));
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setTargetBoardId(column.settings?.targetBoardId || ""); }, [column.settings?.targetBoardId]);
  useEffect(() => { setRelations(itemRelations || []); setLoaded(Array.isArray(itemRelations)); }, [itemId, itemRelations]);
  useEffect(() => {
    if (!open || !targetBoardId || targetBoardId !== column.settings?.targetBoardId) return undefined;
    let active = true;
    setCandidates([]); setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const payload = await api(`/api/work-flow/v1/boards/${targetBoardId}/relation-candidates?q=${encodeURIComponent(query.trim())}`);
        if (active) { setCandidates(payload.data?.candidates || []); setError(""); }
      } catch (cause) { if (active) setError(cause.message); }
      finally { if (active) setSearchLoading(false); }
    }, query ? 180 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [open, targetBoardId, column.settings?.targetBoardId, query]);
  const selected = relations.filter((relation) => relation.sourceItemId === itemId && relation.sourceColumnId === column.id && relation.targetItemId);
  const loadRelations = async () => {
    const payload = await api(`/api/work-flow/v1/items/${itemId}/relations`);
    setRelations(payload.data?.relations || []);
    setLoaded(true);
  };
  const openPicker = async () => {
    setOpen(true); setError(""); setBusy(true);
    try {
      const [boardPayload] = await Promise.all([api("/api/work-flow/v1/boards?limit=100"), loadRelations()]);
      const available = boardPayload.data?.boards || [];
      setBoards(available);
      const configured = column.settings?.targetBoardId || "";
      if (!targetBoardId && configured && available.some((board) => board.id === configured)) setTargetBoardId(configured);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const chooseBoard = (boardId) => { setTargetBoardId(boardId); setCandidates([]); setQuery(""); setError(""); };
  const saveBoard = async () => {
    if (!targetBoardId) return;
    setBusy(true); setError("");
    try { await onUpdateColumnSettings?.({ ...column.settings, targetBoardId }); setOpen(false); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const toggle = async (candidate) => {
    const existing = selected.find((relation) => relation.targetItemId === candidate.id);
    if (column.settings?.targetBoardId !== targetBoardId) { setError("Set the connected board for this column before linking items."); return; }
    setBusy(true); setError("");
    try {
      if (existing) await api(`/api/work-flow/v1/items/${itemId}/relations/${existing.id}`, { method: "DELETE", headers: { "If-Match": `"${existing.revision}"` } });
      else await api(`/api/work-flow/v1/items/${itemId}/relations`, { method: "POST", body: JSON.stringify({ sourceColumnId: column.id, targetItemId: candidate.id, bidirectional: true }) });
      await loadRelations();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const display = loaded ? selected.map((relation) => ({ id: relation.targetItemId, label: relation.targetName || relation.targetItemId })) : value;
  return <div ref={anchorRef} className="relative h-8 w-full"><button type="button" aria-label={`${column.label} connections`} disabled={disabled || !itemId} onClick={() => open ? setOpen(false) : openPicker()} className="flex h-8 w-full items-center justify-center px-2 text-xs hover:bg-[#f5f6f8]"><ReferenceChips value={display} /></button><AnchoredCellPopover open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} ariaLabel={`Connect ${column.label}`} width={360}><div className="border-b border-[#d0d4e4] p-2"><SiteSelect aria-label="Connected board" value={targetBoardId} onChange={(event) => chooseBoard(event.target.value)} className="mb-2 h-8 w-full rounded border border-[#d0d4e4] bg-white px-2 text-sm"><option value="">Choose a board…</option>{boards.map((board) => <option key={board.id} value={board.id}>{board.name}</option>)}</SiteSelect>{targetBoardId !== (column.settings?.targetBoardId || "") && <button type="button" disabled={busy} onClick={saveBoard} className="mb-2 rounded bg-[#0073ea] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Set as column board</button>}<div className="flex items-center gap-2 rounded-md bg-[#f5f6f8] px-2"><Search className="size-4 text-[#676879]" /><input autoFocus disabled={!targetBoardId || targetBoardId !== column.settings?.targetBoardId} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={targetBoardId === column.settings?.targetBoardId ? "Search items on this board" : "Set the column board first"} className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none" /></div></div><div className="max-h-72 overflow-y-auto p-1">{!targetBoardId && <p className="px-3 py-5 text-sm text-[#676879]">Choose the board whose items you want to connect. This links tasks or subitems, not the board itself.</p>}{targetBoardId === column.settings?.targetBoardId && candidates.filter((candidate) => candidate.id !== itemId && candidate.name.toLowerCase().includes(query.trim().toLowerCase())).map((candidate) => { const linked = selected.some((relation) => relation.targetItemId === candidate.id); return <button key={candidate.id} type="button" disabled={busy || disabled} onClick={() => toggle(candidate)} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8] disabled:opacity-50"><span className={`grid size-4 shrink-0 place-items-center rounded border ${linked ? "border-[#0073ea] bg-[#0073ea] text-white" : "border-[#c3c6d4]"}`}>{linked ? "✓" : ""}</span><span className="min-w-0 flex-1 truncate">{candidate.name}</span>{candidate.parentItemId && <span className="shrink-0 text-[11px] text-[#676879]">Subitem</span>}</button>; })}{searchLoading && <p className="px-3 py-5 text-center text-sm text-[#676879]">Searching items…</p>}{targetBoardId === column.settings?.targetBoardId && !busy && !searchLoading && !candidates.length && <p className="px-3 py-5 text-center text-sm text-[#676879]">No items on this board</p>}{candidates.length === 50 && <p className="px-3 py-2 text-xs text-[#676879]">Showing 50 items. Search to find more.</p>}{error && <p role="alert" className="px-3 py-2 text-xs text-red-700">{error}</p>}</div></AnchoredCellPopover></div>;
}

function ContactCell({ column, value, contact, onCommit, disabled }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef(null);
  const raw = typeof value === 'object' && value ? value.raw || value.normalized || '' : String(value || '');
  return <div ref={anchorRef} className="relative h-8 w-full">
    <button type="button" aria-label={`${column.label}: ${contact.label}`} aria-expanded={open} onClick={() => { setOpen(current => !current); setEditing(false); setCopied(false); }} className="h-8 w-full truncate px-2 text-left text-sm text-[#0073ea] hover:underline">{contact.label}</button>
    <AnchoredCellPopover open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} ariaLabel={`${column.label} contact options`} width={300}>
      <div className="grid gap-1 p-2">
        {contact.kind === 'email' && <a href={contact.gmailHref} target="_blank" rel="noopener noreferrer" className="rounded px-3 py-2 text-sm hover:bg-[#f5f6f8]">Compose in Gmail</a>}
        <a href={contact.href} className="rounded px-3 py-2 text-sm hover:bg-[#f5f6f8]">{contact.kind === 'phone' ? 'Call this number' : 'Open email app'}</a>
        <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(raw); setCopied(true); } catch { setCopied(false); } }} className="rounded px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">{copied ? 'Copied' : `Copy ${contact.kind === 'phone' ? 'number' : 'email address'}`}</button>
        {!disabled && <button type="button" onClick={() => { setDraft(raw); setEditing(true); }} className="rounded px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Edit {column.label}</button>}
        {editing && <form className="grid gap-2 border-t border-[#d0d4e4] p-2" onSubmit={event => { event.preventDefault(); onCommit(column.type === 'phone' ? { ...(value || {}), raw: draft, normalized: '', country: value?.country || 'US' } : draft || null); setOpen(false); }}>
          <label className="text-xs">{column.label}<input autoFocus type={contact.kind === 'email' ? 'email' : 'tel'} value={draft} onChange={event => setDraft(event.target.value)} className={`${inputClass} mt-1 w-full`} /></label>
          <button className="rounded bg-[#0073ea] px-3 py-2 text-sm text-white">Save</button>
        </form>}
      </div>
    </AnchoredCellPopover>
  </div>;
}

function CellEditor(props) {
  const callbacks = useRef(props);
  useEffect(() => { callbacks.current = props; });
  const commit = useCallback((...args) => callbacks.current.onCommit?.(...args), []);
  const settings = useCallback((...args) => callbacks.current.onUpdateColumnSettings?.(...args), []);
  return <MemoCellEditor {...props} onCommit={commit} onUpdateColumnSettings={props.onUpdateColumnSettings ? settings : undefined} />;
}

const MemoCellEditor = memo(CellEditorContent, (before, after) => {
  const relation = ["board_item_refs", "dependency_refs"].includes(after.column.type);
  return Object.keys(after).every(key => (!relation && ["boardItems", "itemRelations", "boardDependencies"].includes(key)) || Object.is(before[key], after[key]));
});

function CellEditorContent({ column, value, valueHealth, updatedBy, itemId, itemName = "item", boardId, boardItems = [], itemRelations, boardDependencies, onCommit, onUpdateColumnSettings, disabled, peopleOptions = [], teamOptions = [], currentPrincipalId = "", wrapped = false }) {
  const configuredOptions = Array.isArray(column.settings?.options) ? column.settings.options : [];
  const options = column.type === "person_refs" ? peopleOptions : column.type === "team_refs" ? teamOptions : column.type === "assignee_refs" ? [...peopleOptions.map((entry) => ({ ...entry, type: "person" })), ...teamOptions.map((entry) => ({ ...entry, type: "team" }))] : configuredOptions;
  const [editingTimeline, setEditingTimeline] = useState(false);
  const [editingStructured, setEditingStructured] = useState(false);
  const [managingStatus, setManagingStatus] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [temporalDraft, setTemporalDraft] = useState("");
  const [referenceQuery, setReferenceQuery] = useState("");
  const anchorRef = useRef(null);
  const [timelineDraft, setTimelineDraft] = useState({ start: value?.start || "", end: value?.end || "" });
  if (valueHealth?.health === "error" && valueHealth.sourceKind === "formula") return <span className="block min-h-8 px-2 py-1.5 text-xs text-red-700" title={valueHealth.error?.message || "Unable to calculate this formula."}>Calculation error</span>;
  if (valueHealth?.health === "redacted") return <span className="block min-h-8 px-2 py-1.5 text-xs font-medium text-amber-700">Restricted by source permissions</span>;
  if (valueHealth?.health === "unavailable") return <span className="block min-h-8 px-2 py-1.5 text-xs font-medium text-slate-500">Source unavailable</span>;
  if (column.type === "button") return <AutomationButtonCell column={column} itemId={itemId} boardId={boardId} disabled={disabled} />;
  const contact = workFlowContact(value, column.type);
  if (contact) return <ContactCell column={column} value={value} contact={contact} onCommit={onCommit} disabled={disabled || column.readOnly} />;
  if (column.readOnly || ["auto_number", "created_at", "updated_at", "formula_result", "json_readonly", "audit_actor", "action", "button"].includes(column.type)) return <ReadOnlyCellValue column={column} value={value} updatedBy={updatedBy} peopleOptions={peopleOptions} />;
  if (column.type === "status") {
    const selected = options.find((option) => option.id === value);
    const available = options.filter((option) => (option.active !== false || option.id === value) && String(option.label || option.id).toLowerCase().includes(referenceQuery.trim().toLowerCase()));
    return <><div ref={anchorRef} className="relative h-8 w-full"><button type="button" aria-label={`${column.label} status`} disabled={disabled} onClick={() => { setReferenceQuery(""); setPopoverOpen((current) => !current); }} style={selected?.color ? { backgroundColor: selected.color, color: "white" } : undefined} className="flex h-8 w-full items-center justify-center gap-1 rounded-sm bg-[#f5f6f8] px-2 text-sm font-medium hover:brightness-95"><span className="truncate">{selected?.label || "—"}</span><ChevronDown className="size-3.5 shrink-0 opacity-70" /></button><AnchoredCellPopover open={popoverOpen} anchorRef={anchorRef} onClose={() => setPopoverOpen(false)} ariaLabel={`${column.label} options`} width={300}><div className="border-b border-[#d0d4e4] p-2"><div className="flex items-center gap-2 rounded-md bg-[#f5f6f8] px-2"><Search className="size-4 text-[#676879]" /><input autoFocus value={referenceQuery} onChange={(event) => setReferenceQuery(event.target.value)} placeholder={`Search ${column.label.toLowerCase()} labels`} className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none" /></div></div><div className="max-h-72 overflow-y-auto p-2"><button onClick={() => { onCommit(null); setPopoverOpen(false); }} className="mb-1 flex h-9 w-full items-center rounded-md px-3 text-sm text-[#676879] hover:bg-[#f5f6f8]">Clear</button><div className="grid grid-cols-2 gap-2">{available.map((option) => <button key={option.id} title={option.description || option.label} onClick={() => { onCommit(option.id); setPopoverOpen(false); }} className="min-h-9 rounded-sm px-2 py-1 text-sm font-medium text-white transition hover:brightness-95" style={{ backgroundColor: option.color || "#579bfc" }}>{option.label}{option.active === false && <span className="block text-[10px] opacity-80">Inactive</span>}</button>)}</div>{!available.length && <p className="px-3 py-5 text-center text-sm text-[#676879]">No matching labels</p>}</div>{onUpdateColumnSettings && <div className="border-t border-[#d0d4e4] p-2"><button onClick={() => { setPopoverOpen(false); setManagingStatus(true); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[#f5f6f8]"><Settings2 className="size-4" />Edit labels</button></div>}</AnchoredCellPopover></div>{managingStatus && <StatusLabelManager column={column} onClose={() => setManagingStatus(false)} onSave={onUpdateColumnSettings} />}</>;
  }
  if (column.type === "time_tracking") return <TimeTrackingCell column={column} value={value} onCommit={onCommit} disabled={disabled} currentPrincipalId={currentPrincipalId} peopleOptions={peopleOptions} />;
  if (column.type === "vote") return <VoteCell column={column} value={value} onCommit={onCommit} disabled={disabled} currentPrincipalId={currentPrincipalId} peopleOptions={peopleOptions} />;
  if (column.type === "boolean") return <input aria-label={`${column.label} for ${itemName}`} disabled={disabled} type="checkbox" checked={Boolean(value)} onChange={(event) => onCommit(event.target.checked)} className="ml-3 size-4 accent-blue-600" />;
  if (column.type === "asset_refs") return <AssetCellEditor column={column} value={value} itemId={itemId} disabled={disabled} />;
  if (column.type === "dependency_refs") return <DependencyCellEditor column={column} value={value} itemId={itemId} boardId={boardId} boardItems={boardItems} boardDependencies={boardDependencies} disabled={disabled} />;
  if (column.type === "board_item_refs") return <BoardRelationCellEditor column={column} value={value} itemId={itemId} itemRelations={itemRelations} disabled={disabled} onUpdateColumnSettings={onUpdateColumnSettings} />;
  if (column.type === "domain_ref" || column.type === "domain_refs") return <DomainReferenceCellEditor column={column} value={value} onCommit={onCommit} disabled={disabled} />;
  if (column.type === "multi_select" || REFERENCE_COLUMN_TYPES.has(column.type)) {
    const optionKey = (entry) => `${column.type === "assignee_refs" ? entry?.type || "person" : "ref"}:${String(entry?.id || entry)}`;
    const selectedIds = new Set((Array.isArray(value) ? value : []).map(optionKey));
    const toggle = (option) => { const next = new Set(selectedIds); const key = optionKey(option); next.has(key) ? next.delete(key) : next.add(key); const keys = [...next]; onCommit(column.type === "multi_select" ? keys.map((entry) => entry.replace(/^ref:/, "")) : keys.map((entryKey) => { const match = options.find((entry) => optionKey(entry) === entryKey); return { id: String(match?.id || entryKey.replace(/^[^:]+:/, "")), ...(column.type === "assignee_refs" ? { type: match?.type || entryKey.split(":")[0] } : {}), ...(match?.label ? { label: match.label } : {}) }; })); };
    const filteredOptions = options.filter((option) => String(option.label || option.id).toLowerCase().includes(referenceQuery.trim().toLowerCase()));
    return <div ref={anchorRef} className="relative h-8 w-full"><button type="button" aria-label={`${column.label} values`} disabled={disabled} onClick={() => { setReferenceQuery(""); setPopoverOpen((current) => !current); }} className="flex h-8 w-full items-center justify-center px-2 text-xs hover:bg-[#f5f6f8]">{["person_refs", "assignee_refs"].includes(column.type) ? <PeopleStack value={value} options={options} /> : ["domain_refs", "board_item_refs", "asset_refs"].includes(column.type) ? <ReferenceChips value={value} semantic={column.settings?.sourceSemantic} target={column.settings?.connectionTarget} /> : <span className="truncate">{displayValue(value, column) || "—"}</span>}</button><AnchoredCellPopover open={popoverOpen} anchorRef={anchorRef} onClose={() => setPopoverOpen(false)} ariaLabel={`Select ${column.label}`} width={300}><div className="border-b border-[#d0d4e4] p-2"><div className="flex items-center gap-2 rounded-md bg-[#f5f6f8] px-2"><Search className="size-4 text-[#676879]" /><input autoFocus value={referenceQuery} onChange={(event) => setReferenceQuery(event.target.value)} placeholder={`Search ${column.label.toLowerCase()}`} className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none" /></div></div><div className="max-h-72 overflow-y-auto p-1">{filteredOptions.length ? filteredOptions.map((option) => { const key = optionKey(option); return <button key={key} onClick={() => toggle(option)} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><span className={`grid size-4 place-items-center rounded border ${selectedIds.has(key) ? "border-[#0073ea] bg-[#0073ea] text-white" : "border-[#c3c6d4]"}`}>{selectedIds.has(key) ? "✓" : ""}</span>{["person_refs", "assignee_refs"].includes(column.type) && <PersonAvatar person={option} size={28} />}<span className="min-w-0 flex-1 truncate">{option.label || option.id}</span>{column.type === "assignee_refs" && <span className="text-[10px] uppercase text-[#9799a6]">{option.type}</span>}</button>; }) : <p className="px-3 py-6 text-center text-sm text-[#676879]">No matching options</p>}</div></AnchoredCellPopover></div>;
  }
  if (["money", "phone", "location", "document_ref", "domain_ref"].includes(column.type)) return <><button type="button" disabled={disabled} onClick={() => setEditingStructured(true)} className="h-8 w-full truncate px-2 text-left text-sm hover:bg-slate-50" aria-label={`Edit ${column.label}`}>{displayValue(value, column) || "—"}</button>{editingStructured && <StructuredCellDialog column={column} value={value} onClose={() => setEditingStructured(false)} onCommit={onCommit} disabled={disabled} />}</>;
  if (column.type === "rating") { const maximum = Number(column.settings?.maximum || 5); return <div className="flex h-8 items-center justify-center" aria-label={`${column.label} rating`}>{Array.from({ length: maximum }, (_, index) => <button type="button" key={index} disabled={disabled} onClick={() => onCommit(index + 1 === value ? 0 : index + 1)} className={`text-lg leading-none ${index < Number(value || 0) ? "text-amber-400" : "text-slate-200"}`} aria-label={`Set ${column.label} to ${index + 1}`}>★</button>)}</div>; }
  if (column.type === "color") return <div className="flex h-8 items-center gap-2 px-2"><input aria-label={`${column.label} color`} disabled={disabled} type="color" value={value || "#0073EA"} onChange={(event) => onCommit(event.target.value.toUpperCase())} className="size-6 cursor-pointer border-0 bg-transparent p-0" /><span className="text-xs text-slate-500">{value || "—"}</span></div>;
  if (column.type === "timeline") return <div ref={anchorRef} className="relative h-8 w-full">
    <button type="button" disabled={disabled} onClick={() => { setTimelineDraft({ start: value?.start || "", end: value?.end || "" }); setEditingTimeline((current) => !current); }} style={value?.start ? { backgroundColor: "var(--group-color, #676879)" } : undefined} className={`relative mx-1 flex h-7 min-w-0 max-w-full w-[calc(100%_-_0.5rem)] items-center justify-center overflow-hidden rounded-full px-3 text-xs font-medium transition hover:brightness-95 ${value?.start ? "text-white" : "bg-[#c4c4c4] text-white"}`} aria-label={`Edit ${column.label} timeline`} title={value?.start ? `${value.start} – ${value.end} · ${timelineProgress(value)}% complete` : undefined}>{value?.start && <motion.span role="progressbar" aria-label={`${column.label} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={timelineProgress(value)} initial={{ width: 0 }} animate={{ width: `${timelineProgress(value)}%` }} transition={{ duration: 0.3, ease: "easeOut" }} className="absolute inset-y-0 left-0 bg-black/25" />}<span className="relative z-10 block min-w-0 max-w-full truncate whitespace-nowrap">{timelineLabel(value)}</span></button>
    <AnchoredCellPopover open={editingTimeline} anchorRef={anchorRef} onClose={() => setEditingTimeline(false)} ariaLabel={`Edit ${column.label} timeline`} width={340}>
      <div className="border-b border-[#d0d4e4] px-4 py-3"><h3 className="text-sm font-semibold">{column.label}</h3><p className="text-xs text-[#676879]">Set an inclusive start and finish date.</p></div>
      <div className="grid gap-3 p-4"><label className="text-xs font-medium text-[#676879]">Start date<DateInput autoFocus aria-label="Timeline start date" type="date" value={timelineDraft.start} onChange={(event) => setTimelineDraft((current) => ({ ...current, start: event.target.value }))} className={`${inputClass} mt-1 w-full`} /></label><label className="text-xs font-medium text-[#676879]">Finish date<DateInput aria-label="Timeline finish date" type="date" value={timelineDraft.end} onChange={(event) => setTimelineDraft((current) => ({ ...current, end: event.target.value }))} className={`${inputClass} mt-1 w-full`} /></label>{timelineDraft.start && timelineDraft.end && timelineDraft.end < timelineDraft.start && <p className="text-xs text-red-600">Finish date cannot be before the start date.</p>}</div>
      <div className="flex items-center justify-between border-t border-[#d0d4e4] px-4 py-2"><button type="button" onClick={() => { onCommit(null); setEditingTimeline(false); }} disabled={disabled || (!value?.start && !value?.end)} className="px-2 py-1.5 text-xs text-[#676879] hover:text-[#e2445c] disabled:opacity-40">Clear</button><div className="flex gap-2"><button type="button" onClick={() => setEditingTimeline(false)} className="rounded px-2 py-1.5 text-xs hover:bg-[#f5f6f8]">Cancel</button><button type="button" onClick={() => { onCommit({ start: timelineDraft.start, end: timelineDraft.end }); setEditingTimeline(false); }} disabled={disabled || !timelineDraft.start || !timelineDraft.end || timelineDraft.end < timelineDraft.start} className="rounded bg-[#0073ea] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40">Save dates</button></div></div>
    </AnchoredCellPopover>
  </div>;
  const type = column.type === "date" ? "date" : column.type === "datetime" ? "datetime-local" : column.type === "time_of_day" ? "time" : column.type === "week" ? "week" : ["decimal", "integer", "percent", "duration"].includes(column.type) ? "number" : column.type === "email" ? "email" : column.type === "url" ? "url" : "text";
  const editorValue = column.type === "datetime" && value ? String(value).slice(0, 16) : ["date", "time_of_day", "week"].includes(column.type) ? String(value || "") : displayValue(value, column);
  if (["date", "datetime", "time_of_day", "week"].includes(column.type)) return <div ref={anchorRef} className="relative h-8 w-full"><button type="button" disabled={disabled} onClick={() => { setTemporalDraft(editorValue || ""); setPopoverOpen((current) => !current); }} className="flex h-8 w-full items-center justify-center gap-2 px-2 text-sm hover:bg-[#f5f6f8]" title={editorValue || undefined}><span className={editorValue ? "text-[#323338]" : "text-[#9799a6]"}>{editorValue ? formatTemporalValue(value, column.type) : "—"}</span><ChevronDown className="size-3.5 text-[#676879]" /></button><AnchoredCellPopover open={popoverOpen} anchorRef={anchorRef} onClose={() => setPopoverOpen(false)} ariaLabel={`Edit ${column.label}`} width={280}><div className="p-3"><label className="block text-xs font-medium text-[#676879]">{column.label}<DateInput autoFocus type={type} value={temporalDraft} onChange={(event) => setTemporalDraft(event.target.value)} className={`${inputClass} mt-1 w-full`} /></label><div className="mt-3 flex items-center justify-between"><button onClick={() => { onCommit(null); setPopoverOpen(false); }} className="px-2 py-1.5 text-sm text-[#676879] hover:text-[#e2445c]">Clear</button><button onClick={() => { onCommit(temporalDraft || null); setPopoverOpen(false); }} disabled={!temporalDraft} className="rounded-md bg-[#0073ea] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40">Apply</button></div></div></AnchoredCellPopover></div>;
  if (column.type === "long_text" || (wrapped && type === "text")) return <textarea key={editorValue} disabled={disabled} defaultValue={editorValue} onBlur={(event) => { if (event.target.value !== editorValue) onCommit(event.target.value || null); }} rows={wrapped ? 2 : 1} className="min-h-8 w-full resize-none border-0 bg-transparent px-2 py-1.5 text-sm outline-none hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-200" />;
  return <DateInput key={editorValue} disabled={disabled} type={type} defaultValue={editorValue} onBlur={(event) => { if (event.target.value !== editorValue) onCommit(event.target.value || null); }} className="h-8 w-full rounded-md border-0 bg-transparent px-2 text-sm outline-none hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-200" />;
}

function GroupSummaryCell({ column, items }) {
  const values = items.map((item) => item.values?.[column.id]).filter((value) => value !== null && value !== undefined && value !== "");
  if (column.type === "status") {
    const options = Array.isArray(column.settings?.options) ? column.settings.options : [];
    if (!values.length) return <span className="text-xs text-slate-400">—</span>;
    return <div className="mx-1 flex h-5 overflow-hidden rounded-sm bg-slate-100" title={`${values.length} status values`}>{options.map((option) => { const count = values.filter((value) => value === option.id).length; return count ? <span key={option.id} style={{ width: `${(count / values.length) * 100}%`, backgroundColor: option.color || "#94a3b8" }} title={`${option.label}: ${count}`} /> : null; })}</div>;
  }
  if (["decimal", "integer", "money", "percent", "duration", "rating"].includes(column.type)) { const total = values.reduce((sum, value) => sum + Number(value?.amount ?? value ?? 0), 0); return <span className="text-xs tabular-nums text-slate-600">{values.length ? `Σ ${total.toLocaleString()}` : "—"}</span>; }
  if (column.type === "time_tracking") { const total = values.reduce((sum, value) => sum + Math.max(0, Number(value?.totalSeconds || 0)), 0); return <span className="text-xs tabular-nums text-slate-600">{values.length ? `Σ ${trackedTimeLabel(total)}` : "—"}</span>; }
  if (column.type === "vote") { const total = values.reduce((sum, value) => sum + (Array.isArray(value) ? value.length : 0), 0); return <span className="text-xs tabular-nums text-slate-600">{total ? `${total} votes` : "—"}</span>; }
  if (["date", "datetime"].includes(column.type)) { const sorted = values.map(String).sort(); return <span className="text-xs text-slate-500">{sorted.length ? sorted.length === 1 ? formatTemporalValue(sorted[0], column.type) : `${formatTemporalValue(sorted[0], column.type)} – ${formatTemporalValue(sorted.at(-1), column.type)}` : "—"}</span>; }
  if (column.type === "timeline") { const starts = values.map((value) => value?.start).filter(Boolean).sort(); const ends = values.map((value) => value?.end).filter(Boolean).sort(); return <span className="text-xs text-slate-500">{starts.length ? timelineLabel({ start: starts[0], end: ends.at(-1) || starts.at(-1) }) : "—"}</span>; }
  if (["people", "person", "team_assignees", "person_refs", "team_refs", "assignee_refs"].includes(column.type)) { const count = new Set(values.flat().map((value) => `${value?.type || "ref"}:${value?.id || value}`)).size; return <span className="text-xs text-slate-500">{count ? `${count} assigned` : "—"}</span>; }
  if (["file", "files", "asset", "asset_refs"].includes(column.type)) return <span className="text-xs text-slate-500">{values.flat().length} files</span>;
  return <span className="text-xs text-slate-300">—</span>;
}

export function ColumnHeaderMenu({ column, wrapped, onRename, onToggleWrap, onSort, onHide, onFilter, onGroupBy, onAddColumn, onMoveLeft, onMoveRight, onResize, onDuplicate, onToggleRestriction, onPermissions, onConnectedBoardSettings, onExploreRelationships, onDelete, width, primary = false }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("main");
  const [expandedWidth, setExpandedWidth] = useState(width || column.width || 150);
  const anchorRef = useRef(null);
  const act = (callback) => { callback?.(); setOpen(false); setSection("main"); };
  const startResize = (event) => { event.preventDefault(); event.stopPropagation(); const startX = event.clientX; const startWidth = Number(width || column.width || (primary ? 360 : 150)); const move = (nextEvent) => onResize?.(Math.max(80, Math.min(700, startWidth + nextEvent.clientX - startX)), false); const up = (nextEvent) => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); onResize?.(Math.max(80, Math.min(700, startWidth + nextEvent.clientX - startX)), true); }; document.addEventListener("mousemove", move); document.addEventListener("mouseup", up); };
  const button = "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-normal hover:bg-[#f5f6f8] disabled:opacity-40";
  const entry = (label, Icon, callback, disabled = false) => <button key={label} type="button" disabled={disabled} onClick={() => act(callback)} className={button}><Icon className="size-4 shrink-0 text-[#676879]" />{label}</button>;
  const divider = <div className="my-1 border-t border-[#e6e9ef]" />;
  return <div ref={anchorRef} className="group/column relative flex h-full items-center justify-center"><span className="truncate px-2">{column.label}</span><button type="button" onClick={() => { setSection("main"); setOpen(!open); }} aria-label={`${column.label} column options`} aria-expanded={open} className="absolute right-2 grid size-6 place-items-center rounded text-[#676879] opacity-0 hover:bg-[#dcdfec] group-hover/column:opacity-100 focus:opacity-100 aria-expanded:opacity-100 aria-expanded:bg-[#cce5ff]"><MoreHorizontal className="size-4" /></button><button type="button" aria-label={`Resize ${column.label} column`} onMouseDown={startResize} className="absolute inset-y-0 -right-1 z-10 w-2 cursor-col-resize opacity-0 group-hover/column:opacity-100"><span className="mx-auto block h-full w-px bg-[#0073ea]" /></button>
    <AnchoredCellPopover open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} ariaLabel={`${column.label} column menu`} width={264}><div className="max-h-[75vh] overflow-y-auto p-1.5 text-left">
      {section !== "main" && <button className={button} onClick={() => setSection("main")}><ArrowLeft className="size-4" />Back to column options</button>}
      {section === "settings" ? <>{entry(wrapped ? "Unwrap text" : "Wrap text", FileText, onToggleWrap)}{!primary && <>{entry(column.readOnly ? "Allow all editing" : "Restrict all editing", ShieldCheck, onToggleRestriction)}{entry("Column permissions", Users, onPermissions)}</>}{column.type === "board_item_refs" && entry("Connected board settings", Link2, onConnectedBoardSettings)}{entry("Explore relationships", Network, onExploreRelationships)}</>
      : section === "sort" ? <>{entry("Sort ascending", ArrowUpDown, () => onSort("asc"))}{entry("Sort descending", ArrowUpDown, () => onSort("desc"))}</>
      : section === "departments" ? <>{!primary && entry("Cross-department permissions", ShieldCheck, onPermissions)}{entry("Explore relationships", Network, onExploreRelationships)}{column.type === "board_item_refs" && entry("Connected board settings", Link2, onConnectedBoardSettings)}</>
      : <>
        <button className={button} onClick={() => setSection("settings")}><Settings2 className="size-4 text-[#676879]" />Settings<ChevronDown className="ml-auto size-4 -rotate-90" /></button>
        {divider}
        {!primary && entry("Filter by this column", Filter, onFilter)}
        <button className={button} onClick={() => setSection("sort")}><ArrowUpDown className="size-4 text-[#676879]" />Sort<ChevronDown className="ml-auto size-4 -rotate-90" /></button>
        {!primary && entry(Number(width) <= 80 ? "Expand column" : "Collapse column", Minimize2, () => { if (Number(width) <= 80) onResize(expandedWidth > 80 ? expandedWidth : 150, true); else { setExpandedWidth(width); onResize(80, true); } })}
        {!primary && entry("Group by this column", Columns3, onGroupBy, !onGroupBy)}
        {divider}
        {!primary && entry("Duplicate column", Copy, onDuplicate)}
        {entry("Add column to the right", Plus, onAddColumn)}
        {!primary && <>{entry("Move left", ArrowLeft, onMoveLeft)}{entry("Move right", ArrowRight, onMoveRight)}</>}
        {divider}
        <button className={button} onClick={() => setSection("departments")}><Network className="size-4 text-[#676879]" />Cross-department controls<ChevronDown className="ml-auto size-4 -rotate-90" /></button>
        {divider}
        {entry("Rename", Pencil, onRename)}
        {!primary && <>{entry("Hide column", EyeOff, onHide)}<button onClick={() => act(onDelete)} className={`${button} text-[#d83a52]`}><Trash2 className="size-4" />Delete column</button></>}
      </>}
    </div></AnchoredCellPopover>
  </div>;
}

function ItemRowMenu({ item, busy, groups, items, permissions, onOpenUpdates, onOpenNewTab, onCopyLink, onMove, onAddBelow, onAddSubitem, onDuplicate, onArchive, onTrash }) {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceDirty, setInvoiceDirty] = useState(false);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState("main");
  const anchorRef = useRef(null);
  const act = (callback) => { callback(); setOpen(false); setPanel("main"); };
  const menuButton = "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[#f5f6f8] disabled:cursor-not-allowed disabled:opacity-40";
  const canCreate = permissions?.create !== false;
  const canUpdate = permissions?.update !== false;
  const canArchive = permissions?.archive !== false;
  const canTrash = permissions?.trash !== false;
  const eligibleParents = items.filter((candidate) => candidate.id !== item.id && candidate.parentItemId !== item.id && Number(candidate.depth || 0) < 4);
  return <div ref={anchorRef} className="relative shrink-0">
    <button type="button" disabled={busy} onClick={() => { setPanel("main"); setOpen((current) => !current); }} aria-label={`More options for ${item.name}`} aria-expanded={open} className="grid size-7 place-items-center rounded text-[#676879] opacity-0 transition hover:bg-[#dcdfec] group-hover/row:opacity-100 focus:opacity-100"><MoreHorizontal className="size-4" /></button>
    <AnchoredCellPopover open={open} anchorRef={anchorRef} onClose={() => { setOpen(false); setPanel("main"); }} ariaLabel={`${item.name} item menu`} width={236}>
      <div className="max-h-96 overflow-y-auto p-1.5 text-left">
        {panel !== "main" && <button onClick={() => setPanel("main")} className={`${menuButton} font-medium`}><ChevronDown className="size-4 rotate-90" />Back</button>}
        {panel === "move" && groups.map((group) => <button key={group.id} disabled={!canUpdate} onClick={() => act(() => onMove(group.id, item.parentItemId || null))} className={menuButton}>{group.title}</button>)}
        {panel === "convert" && eligibleParents.map((candidate) => <button key={candidate.id} disabled={!canUpdate} onClick={() => act(() => onMove(candidate.groupId, candidate.id))} className={menuButton}><span className="truncate">{candidate.name}</span></button>)}
        {panel === "convert" && !eligibleParents.length && <p className="px-3 py-4 text-sm text-[#676879]">No eligible parent tasks.</p>}
        {panel === "main" && <>
          <button onClick={() => act(onOpenUpdates)} className={menuButton}><MessageSquare className="size-4" />Open task</button>
          {permissions?.invoice && <button type="button" className={menuButton} onClick={() => act(() => setInvoiceOpen(true))}><FileText className="size-4" />Create invoice</button>}
          <button onClick={() => act(onOpenNewTab)} className={menuButton}><Link2 className="size-4" />Open in new tab</button>
          <button onClick={() => act(onCopyLink)} className={menuButton}><Link2 className="size-4" />Copy task link</button>
          <button disabled={!canUpdate} onClick={() => setPanel("move")} className={menuButton}><ChevronDown className="size-4 -rotate-90" />Move to</button>
          <button disabled={!canCreate} onClick={() => act(onDuplicate)} className={menuButton}><FileText className="size-4" />Duplicate</button>
          <button disabled={!canCreate} onClick={() => act(onAddBelow)} className={menuButton}><Plus className="size-4" />Create new task below</button>
          <button disabled={!canCreate} onClick={() => act(onAddSubitem)} className={menuButton}><Plus className="size-4" />Add subitem</button>
          <button disabled={!canUpdate} onClick={() => setPanel("convert")} className={menuButton}><ChevronDown className="size-4 -rotate-90" />Convert to subitem</button>
          <div className="my-1 border-t border-[#d0d4e4]" />
          <button disabled={!canArchive} onClick={() => act(onArchive)} className={menuButton}><Download className="size-4" />Archive</button>
          <button disabled={!canTrash} onClick={() => act(onTrash)} className={`${menuButton} text-[#e2445c]`}><Trash2 className="size-4" />Delete</button>
        </>}
      </div>
    </AnchoredCellPopover>
    {invoiceOpen && <WorkWindow title="Project invoicing" wide maxWidth={1440} onClose={() => { if (!invoiceDirty || window.confirm('Discard unsaved invoice changes?')) setInvoiceOpen(false); }}><div className="min-h-0 overflow-y-auto p-5"><InvoiceWorkspace workflowItemId={item.id} startNew onDirtyChange={setInvoiceDirty} /></div></WorkWindow>}
  </div>;
}

function GroupActionMenu({ group, busy, items, allGroups, onCollapse, onCollapseAll, onSelectAll, onExpandSubitems, onCollapseSubitems, onAddGroup, onDuplicate, onMove, onRename, onColor, onExport, onArchive, onTrash }) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState("main");
  const anchorRef = useRef(null);
  const close = () => { setOpen(false); setPanel("main"); };
  const act = (callback) => { callback(); close(); };
  const buttonClass = "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[#f5f6f8]";
  const palette = ["#579bfc", "#00c875", "#ffcb00", "#fdab3d", "#e2445c", "#a25ddc", "#ff5ac4", "#cab641", "#0086c0", "#676879"];
  return <div ref={anchorRef} className="relative">
    <button type="button" onClick={() => { setPanel("main"); setOpen((current) => !current); }} disabled={busy} className="work-flow-icon-button" aria-label={`${group.title} options`} aria-expanded={open}><MoreHorizontal className="size-4" /></button>
    <AnchoredCellPopover open={open} anchorRef={anchorRef} onClose={close} ariaLabel={`${group.title} group menu`} width={260}>
      <div className="max-h-[28rem] overflow-y-auto p-1.5 text-left">
        {panel === "color" ? <><button onClick={() => setPanel("main")} className={`${buttonClass} font-medium`}><ChevronDown className="size-4 rotate-90" />Back</button><p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#9799a6]">Group color</p><div className="grid grid-cols-5 gap-2 p-3">{palette.map((color) => <button key={color} onClick={() => act(() => onColor(color))} aria-label={`Use group color ${color}`} className="size-8 rounded-full border-2 border-white shadow ring-1 ring-[#d0d4e4]" style={{ backgroundColor: color }} />)}</div></> : panel === "move" ? <><button onClick={() => setPanel("main")} className={`${buttonClass} font-medium`}><ChevronDown className="size-4 rotate-90" />Back</button><p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#9799a6]">Move before</p>{allGroups.filter((entry) => entry.id !== group.id).map((entry) => <button key={entry.id} onClick={() => act(() => onMove(entry))} className={buttonClass}><span className="size-3 rounded-full" style={{ backgroundColor: entry.color }} />{entry.title}</button>)}</> : <>
          <button onClick={() => act(onCollapse)} className={buttonClass}><ChevronDown className="size-4 -rotate-90" />Collapse this group</button>
          <button onClick={() => act(onCollapseAll)} className={buttonClass}><ChevronDown className="size-4 -rotate-90" />Collapse all groups</button>
          <button onClick={() => act(onSelectAll)} className={buttonClass}><CheckSquare2 className="size-4" />Select all tasks in group</button>
          <button onClick={() => act(onExpandSubitems)} className={buttonClass}><ChevronDown className="size-4" />Expand all subitems</button>
          <button onClick={() => act(onCollapseSubitems)} className={buttonClass}><ChevronDown className="size-4 -rotate-90" />Collapse all subitems</button>
          <div className="my-1 border-t border-[#d0d4e4]" />
          <button onClick={() => act(onAddGroup)} className={buttonClass}><Plus className="size-4" />Add group</button>
          <button onClick={() => act(onDuplicate)} className={buttonClass}><FileText className="size-4" />Duplicate this group</button>
          <button onClick={() => setPanel("move")} className={buttonClass}><ArrowUpDown className="size-4" />Move group</button>
          <button onClick={() => act(onRename)} className={buttonClass}><Settings2 className="size-4" />Rename group</button>
          <button onClick={() => setPanel("color")} className={buttonClass}><span className="size-4 rounded-full" style={{ backgroundColor: group.color }} />Change group color</button>
          <button onClick={() => act(onExport)} className={buttonClass}><Download className="size-4" />Export to CSV</button>
          <div className="my-1 border-t border-[#d0d4e4]" />
          <button onClick={() => act(onArchive)} className={buttonClass}><Download className="size-4" />Archive group</button>
          <button onClick={() => act(onTrash)} className={`${buttonClass} text-[#e2445c]`} disabled={allGroups.length <= 1}><Trash2 className="size-4" />Delete group</button>
        </>}
      </div>
    </AnchoredCellPopover>
  </div>;
}

function EmptySurface({ icon: Icon, title, detail, action, actionLabel }) {
  return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center"><Icon className="mx-auto mb-3 size-8 text-slate-400" /><h2 className="font-semibold">{title}</h2><p className="mx-auto mt-1 max-w-xl text-sm text-slate-500">{detail}</p>{action && <button onClick={action} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{actionLabel}</button>}</div>;
}

function TextEntryDialog({ dialog, onCancel, onSubmit }) {
  const [value, setValue] = useState(dialog.defaultValue || "");
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="work-flow-text-dialog-title">
    <form onSubmit={(event) => { event.preventDefault(); if (value.trim()) onSubmit(value.trim()); }} className="w-full max-w-md rounded-lg border border-[#d0d4e4] bg-white shadow-2xl">
      <header className="flex items-start justify-between border-b border-[#d0d4e4] px-6 py-5"><div><h2 id="work-flow-text-dialog-title" className="text-xl font-semibold text-[#323338]">{dialog.title}</h2>{dialog.description && <p className="mt-1 text-sm text-[#676879]">{dialog.description}</p>}</div><button type="button" onClick={onCancel} className="work-flow-icon-button" aria-label={`Close ${dialog.title}`}><X className="size-5" /></button></header>
      <div className="px-6 py-5"><label className="block"><span className="mb-2 block text-sm font-medium text-[#323338]">{dialog.label}</span><input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder={dialog.placeholder || ""} className="h-10 w-full rounded-md border border-[#c3c6d4] px-3 text-sm text-[#323338] outline-none focus:border-[#0073ea] focus:ring-1 focus:ring-[#0073ea]" /></label></div>
      <footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-6 py-4"><button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-[#323338] hover:bg-[#dcdfec]">Cancel</button><button type="submit" disabled={!value.trim()} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white hover:bg-[#0060b9] disabled:opacity-40">{dialog.submitLabel || "Create"}</button></footer>
    </form>
  </div>;
}

function ConfirmActionDialog({ dialog, onCancel, onConfirm }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#323338]/45 p-4" role="alertdialog" aria-modal="true" aria-labelledby="work-flow-confirm-title">
    <div className="w-full max-w-md rounded-lg border border-[#d0d4e4] bg-white shadow-2xl"><header className="border-b border-[#d0d4e4] px-6 py-5"><h2 id="work-flow-confirm-title" className="text-xl font-semibold text-[#323338]">{dialog.title}</h2><p className="mt-2 text-sm leading-6 text-[#676879]">{dialog.description}</p></header><footer className="flex justify-end gap-2 px-6 py-4"><button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-[#323338] hover:bg-[#dcdfec]">Cancel</button><button type="button" onClick={onConfirm} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white hover:bg-[#0060b9]">{dialog.confirmLabel || "Continue"}</button></footer></div>
  </div>;
}

function NotificationsSurface({ setError }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); try { const payload = await api(`/api/work-flow/v1/notifications?limit=100${unreadOnly ? "&unread=1" : ""}`); setNotifications(payload.data.notifications || []); setUnreadCount(payload.data.unreadCount || 0); } catch (cause) { setError(cause.message); } finally { setLoading(false); } }, [setError, unreadOnly]);
  useEffect(() => { load(); }, [load]);
  const act = async (notification, action) => { try { await api(`/api/work-flow/v1/notifications/${notification.id}`, { method: "PATCH", body: JSON.stringify({ action, ...(action === "snooze" ? { snoozedUntil: new Date(Date.now() + 60 * 60 * 1000).toISOString() } : {}) }) }); await load(); } catch (cause) { setError(cause.message); } };
  const open = async (notification) => { if (!notification.readAt) await act(notification, "read"); if (notification.deepLink?.startsWith("/dashboard")) window.location.assign(notification.deepLink); };
  return <section className="mx-auto max-w-4xl bg-white"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3"><div><h2 className="font-semibold">Update feed</h2><p className="text-sm text-slate-500">{unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}` : "You are caught up"}</p></div><label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} className="size-4 accent-blue-600" />Unread only</label></header>{loading ? <div className="flex items-center justify-center p-12 text-sm text-slate-500"><Loader2 className="mr-2 size-4 animate-spin" />Loading updates…</div> : notifications.length ? <div className="divide-y divide-slate-100">{notifications.map((notification) => <article key={notification.id} className={`flex gap-3 px-4 py-4 ${notification.readAt ? "bg-white" : "bg-blue-50/60"}`}><span className={`mt-1 size-2 shrink-0 rounded-full ${notification.readAt ? "bg-slate-200" : "bg-blue-600"}`} /><button onClick={() => open(notification)} className="min-w-0 flex-1 text-left"><span className="block text-sm font-semibold text-slate-800">{notification.title}</span><span className="mt-0.5 block text-sm text-slate-600">{notification.preview}</span><span className="mt-1 block text-xs text-slate-400">{new Date(notification.createdAt).toLocaleString()}</span></button><div className="flex shrink-0 items-start gap-1">{notification.readAt ? <button onClick={() => act(notification, "unread")} className="rounded p-1.5 text-xs text-slate-500 hover:bg-slate-100">Unread</button> : <button onClick={() => act(notification, "read")} className="rounded p-1.5 text-xs text-blue-700 hover:bg-blue-100">Read</button>}<button onClick={() => act(notification, "snooze")} className="rounded p-1.5 text-xs text-slate-500 hover:bg-slate-100">Snooze</button><button onClick={() => act(notification, "dismiss")} className="rounded p-1.5 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600">Dismiss</button></div></article>)}</div> : <EmptySurface icon={Bell} title={unreadOnly ? "No unread updates" : "No updates yet"} detail="Mentions, subscribed activity, and automation outcomes will appear here." />}</section>;
}

function MyWorkSurface({ setError }) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("open");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); try { const payload = await api(`/api/work-flow/v1/my-work?state=${state}&limit=250`); setItems(payload.data.items || []); } catch (cause) { setError(cause.message); } finally { setLoading(false); } }, [setError, state]);
  useEffect(() => { load(); }, [load]);
  return <section className="mx-auto max-w-5xl bg-white"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3"><div><h2 className="font-semibold">My Work</h2><p className="text-sm text-slate-500">Work assigned to you across every board you can access.</p></div><div className="flex rounded-md border border-slate-200 p-0.5">{[["open", "Open"], ["completed", "Completed"], ["all", "All"]].map(([id, label]) => <button key={id} onClick={() => setState(id)} className={`rounded px-3 py-1.5 text-sm ${state === id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>{label}</button>)}</div></header>{loading ? <div className="flex items-center justify-center p-12 text-sm text-slate-500"><Loader2 className="mr-2 size-4 animate-spin" />Loading assigned work…</div> : items.length ? <div className="divide-y divide-slate-100">{items.map((item) => <a key={item.id} href={item.deepLink} className="grid gap-2 px-4 py-3 hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_12rem_9rem]"><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-900">{item.name}</p><p className="truncate text-xs text-slate-500">{item.boardName} · {item.groupTitle} · {item.assignmentColumn?.label}</p></div><span className="self-center truncate text-sm text-slate-600">{item.dueAt ? new Date(item.dueAt).toLocaleDateString() : "No due date"}</span><span className={`self-center justify-self-start rounded-full px-2 py-1 text-xs font-medium ${item.completed ? "bg-emerald-50 text-emerald-700" : item.overdue ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>{item.completed ? "Completed" : item.overdue ? "Overdue" : "Open"}</span></a>)}</div> : <EmptySurface icon={CheckSquare2} title={state === "completed" ? "No completed work" : "No assigned work"} detail="Items assigned through a People column appear here automatically." />}</section>;
}

function BoardSettingsDialog({ board, onClose, onSaved, setError }) {
  const [baseline, setBaseline] = useState(() => ({ name: board.name || "", description: board.description || "", visibility: board.visibility || "workspace", hierarchyMaxDepth: Number(board.hierarchyMaxDepth || 20), revision: board.revision }));
  const [name, setName] = useState(board.name || "");
  const [description, setDescription] = useState(board.description || "");
  const [visibility, setVisibility] = useState(board.visibility || "workspace");
  const [hierarchyMaxDepth, setHierarchyMaxDepth] = useState(String(board.hierarchyMaxDepth || 20));
  const [saving, setSaving] = useState(false);
  const [access, setAccess] = useState(null);
  const [accessError, setAccessError] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [accessBusy, setAccessBusy] = useState(false);
  const [memberPickerOpen, setMemberPickerOpen] = useState(false);
  const [memberQuery, setMemberQuery] = useState("");
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [workspaceMembersLoading, setWorkspaceMembersLoading] = useState(false);
  const loadAccess = useCallback(async () => { try { const payload = await api(`/api/work-flow/v1/boards/${board.id}/permissions`); setAccess(payload.data); setAccessError(""); } catch (cause) { setAccessError(cause.message); } }, [board.id]);
  useEffect(() => { loadAccess(); }, [loadAccess]);
  const setRole = async (principalId, roleKey) => { setAccessBusy(true); setAccessError(""); try { await api(`/api/work-flow/v1/boards/${board.id}/permissions`, { method: "PUT", body: JSON.stringify({ principalId, roleKey }) }); await loadAccess(); } catch (cause) { setAccessError(cause.message); } finally { setAccessBusy(false); } };
  const removeMember = async (principalId) => { setAccessBusy(true); setAccessError(""); try { await api(`/api/work-flow/v1/boards/${board.id}/permissions`, { method: "DELETE", body: JSON.stringify({ principalId }) }); await loadAccess(); } catch (cause) { setAccessError(cause.message); } finally { setAccessBusy(false); } };
  const openMemberPicker = async () => { setMemberPickerOpen(true); setMemberQuery(""); if (workspaceMembers.length) return; setWorkspaceMembersLoading(true); try { const payload = await api("/api/dashboard/team-members"); setWorkspaceMembers(Array.isArray(payload.items) ? payload.items : Array.isArray(payload.data?.items) ? payload.data.items : []); } catch (cause) { setAccessError(cause.message); } finally { setWorkspaceMembersLoading(false); } };
  const addMember = async (member, roleKey) => { await setRole(String(member.id), roleKey); setMemberPickerOpen(false); };
  const filteredWorkspaceMembers = workspaceMembers.filter((member) => `${member.name || ""} ${member.email || ""}`.toLowerCase().includes(memberQuery.trim().toLowerCase()));
  const save = async () => {
    setSaving(true); setError(""); setSettingsError("");
    const values = { name: name.trim(), description, visibility, hierarchyMaxDepth: Number(hierarchyMaxDepth) };
    const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== baseline[key]));
    try {
      if (!Object.keys(changes).length) { onClose(); return; }
      const patch = (revision) => api(`/api/work-flow/v1/boards/${board.id}`, { method: "PATCH", headers: { "If-Match": `"${revision}"` }, body: JSON.stringify(changes) });
      let payload;
      try { payload = await patch(baseline.revision); }
      catch (cause) {
        if (cause.code !== "REVISION_CONFLICT") throw cause;
        const latest = (await api(`/api/work-flow/v1/boards/${board.id}?limit=1`)).data.board;
        const conflicted = Object.keys(changes).some((key) => (latest[key] ?? baseline[key]) !== baseline[key] && latest[key] !== changes[key]);
        if (!("name" in changes)) setName(latest.name || "");
        if (!("description" in changes)) setDescription(latest.description || "");
        if (!("visibility" in changes)) setVisibility(latest.visibility || "workspace");
        if (!("hierarchyMaxDepth" in changes)) setHierarchyMaxDepth(String(latest.hierarchyMaxDepth || 20));
        setBaseline({ ...latest, description: latest.description || "", hierarchyMaxDepth: Number(latest.hierarchyMaxDepth || 20) });
        if (conflicted) throw new Error("These settings were changed by someone else. Review your values and save again to apply them.");
        payload = await patch(latest.revision);
      }
      await onSaved(payload.data.board); onClose();
    } catch (cause) { setSettingsError(cause.message); } finally { setSaving(false); }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-label="Board settings"><div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="font-semibold">Board settings</h2><p className="mt-1 text-sm text-slate-500">Configure access, structure, and board details.</p></div><button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close board settings"><X className="size-4" /></button></header>{settingsError && <p role="alert" className="mx-5 mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{settingsError}</p>}<div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5"><label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Board name</span><input value={name} onChange={(event) => setName(event.target.value)} className={`${inputClass} w-full`} /></label><label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label><label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Board access</span><SiteSelect aria-label="Board access" value={visibility} onChange={(event) => setVisibility(event.target.value)} className={`${inputClass} w-full`}><option value="private">Private — invited people only</option><option value="workspace">Workspace — everyone in this workspace</option><option value="organization">Organization — everyone at Rebuildit</option></SiteSelect><span className="mt-1 block text-xs text-slate-500">Specific owner, editor, and viewer grants continue to apply to private boards.</span></label><section className="overflow-hidden rounded-lg border border-[#d0d4e4]" aria-label="Board members"><div className="flex items-start justify-between gap-4 border-b border-[#d0d4e4] px-4 py-3"><div><h3 className="text-sm font-semibold">Board members</h3><p className="mt-0.5 text-xs text-[#676879]">{visibility === "private" ? "Only people listed here can open this private board." : "Add explicit roles when someone needs more than the board default."}</p></div><button type="button" onClick={openMemberPicker} disabled={accessBusy} className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#0073ea] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0060b9] disabled:opacity-50"><Plus className="size-3.5" />Add members</button></div>{memberPickerOpen && <div className="border-b border-[#d0d4e4] bg-[#f8f9fb] p-3"><div className="flex items-center gap-2 rounded-md border border-[#d0d4e4] bg-white px-2"><Search className="size-4 text-[#676879]" /><input autoFocus aria-label="Search workspace members" value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} placeholder="Search people by name or email" className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none" /><button type="button" onClick={() => setMemberPickerOpen(false)} className="p-1 text-[#676879]" aria-label="Close member picker"><X className="size-4" /></button></div><div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-[#d0d4e4] bg-white">{workspaceMembersLoading ? <p className="flex items-center justify-center gap-2 px-3 py-5 text-sm text-[#676879]"><Loader2 className="size-4 animate-spin" />Loading workspace members…</p> : filteredWorkspaceMembers.length ? filteredWorkspaceMembers.map((member) => <div key={member.id} className="flex items-center gap-2 px-3 py-2 hover:bg-[#f5f6f8]"><PersonAvatar person={{ id: member.id, label: member.name, profilePhotoUrl: member.profilePhotoUrl }} size={26} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{member.name || member.email}</span><span className="block truncate text-xs text-[#9799a6]">{member.email || member.role || "Workspace member"}</span></span><div className="flex shrink-0 gap-1"><button type="button" onClick={() => addMember(member, "viewer")} disabled={accessBusy} className="rounded border border-[#d0d4e4] px-2 py-1 text-xs hover:bg-white">Viewer</button><button type="button" onClick={() => addMember(member, "editor")} disabled={accessBusy} className="rounded bg-[#0073ea] px-2 py-1 text-xs font-medium text-white hover:bg-[#0060b9]">Editor</button></div></div>) : <p className="px-3 py-5 text-center text-sm text-[#676879]">No workspace members match that search.</p>}</div></div>}{accessError && <p role="alert" className="m-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{accessError}</p>}{access ? <div className="divide-y divide-[#e6e9ef]">{access.principals.map((principal) => <div key={principal.id} className="flex items-center gap-3 px-4 py-3"><PersonAvatar person={{ id: principal.id, label: principal.displayName }} size={30} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{principal.displayName}{principal.id === access.currentPrincipalId ? " (you)" : ""}</p><p className="text-xs text-[#9799a6]">{principal.isBoardOwner ? "Board owner" : principal.roleName || (visibility === "private" ? "No access yet" : "Uses board visibility")}</p></div><SiteSelect aria-label={`Role for ${principal.displayName}`} value={principal.roleKey || "none"} disabled={accessBusy || principal.isBoardOwner} onChange={(event) => event.target.value === "none" ? removeMember(principal.id) : setRole(principal.id, event.target.value)} className="h-8 min-w-28 rounded-md border border-[#d0d4e4] bg-white px-2 text-sm disabled:bg-[#f5f6f8]"><option value="none">No explicit role</option><option value="viewer">Viewer</option><option value="editor">Editor</option><option value="owner">Owner</option></SiteSelect>{principal.roleKey && !principal.isBoardOwner && <button type="button" onClick={() => removeMember(principal.id)} disabled={accessBusy} className="work-flow-icon-button text-[#e2445c]" aria-label={`Remove ${principal.displayName} from board`}><X className="size-4" /></button>}</div>)}</div> : !accessError && <div className="flex items-center justify-center p-6 text-sm text-[#676879]"><Loader2 className="mr-2 size-4 animate-spin" />Loading access…</div>}</section><label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Maximum hierarchy levels</span><input aria-label="Maximum hierarchy levels" type="number" min="1" max="100" value={hierarchyMaxDepth} onChange={(event) => setHierarchyMaxDepth(event.target.value)} className={`${inputClass} w-full`} /><span className="mt-1 block text-xs text-slate-500">Includes the top-level item. Existing items prevent this limit from being lowered beneath their current depth.</span></label></div><footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4"><button onClick={onClose} disabled={saving} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium">Cancel</button><button onClick={save} disabled={saving || !name.trim() || Number(hierarchyMaxDepth) < 1 || Number(hierarchyMaxDepth) > 100} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{saving && <Loader2 className="size-4 animate-spin" />}Save settings</button></footer></div></div>;
}

function ColumnPermissionsDialog({ boardId, column, onClose, setError }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { let active = true; api(`/api/work-flow/v1/boards/${boardId}/columns/${column.id}/permissions`).then((payload) => { if (active) setRoles(payload.data.roles || []); }).catch((cause) => setError(cause.message)).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [boardId, column.id, setError]);
  const update = (roleKey, field, value) => setRoles((current) => current.map((role) => role.roleKey === roleKey ? { ...role, [field]: value, ...(field === "readEffect" && value === "deny" ? { writeEffect: "deny" } : {}) } : role));
  const save = async () => { setSaving(true); setError(""); try { for (const role of roles) await api(`/api/work-flow/v1/boards/${boardId}/columns/${column.id}/permissions`, { method: "PUT", body: JSON.stringify({ roleKey: role.roleKey, readEffect: role.readEffect, writeEffect: role.writeEffect, maskKind: role.readEffect === "redact" ? role.maskKind || "full" : null }) }); onClose(); } catch (cause) { setError(cause.message); } finally { setSaving(false); } };
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label={`${column.label} column permissions`}><motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-xl rounded-xl bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-[#d0d4e4] px-5 py-4"><div><h2 className="font-semibold">Column permissions</h2><p className="mt-1 text-sm text-[#676879]">Control who can see or edit “{column.label}”. Owners always retain access.</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close column permissions"><X className="size-4" /></button></header><div className="p-5">{loading ? <div className="flex items-center justify-center py-10 text-sm text-[#676879]"><Loader2 className="mr-2 size-4 animate-spin" />Loading permissions…</div> : <div className="space-y-3">{roles.map((role) => <section key={role.roleKey} className="grid gap-3 rounded-lg border border-[#d0d4e4] p-4 sm:grid-cols-[1fr_9rem_9rem]"><div><h3 className="text-sm font-semibold">{role.roleName}</h3><p className="text-xs text-[#676879]">Applies to board members with this role.</p></div><label><span className="mb-1 block text-xs font-medium text-[#676879]">Can view</span><SiteSelect aria-label={`${role.roleName} view access`} value={role.readEffect} onChange={(event) => update(role.roleKey, "readEffect", event.target.value)} className={`${inputClass} w-full`}><option value="allow">Full value</option><option value="redact">Masked</option><option value="deny">Hidden</option></SiteSelect></label><label><span className="mb-1 block text-xs font-medium text-[#676879]">Can edit</span><SiteSelect aria-label={`${role.roleName} edit access`} value={role.writeEffect} onChange={(event) => update(role.roleKey, "writeEffect", event.target.value)} className={`${inputClass} w-full`}><option value="allow">Allowed</option><option value="deny">Blocked</option></SiteSelect></label>{role.readEffect === "redact" && <label className="sm:col-start-2 sm:col-span-2"><span className="mb-1 block text-xs font-medium text-[#676879]">Mask style</span><SiteSelect aria-label={`${role.roleName} mask style`} value={role.maskKind || "full"} onChange={(event) => update(role.roleKey, "maskKind", event.target.value)} className={`${inputClass} w-full`}><option value="full">Fully restricted</option><option value="last_four">Show last four characters</option><option value="email">Mask email address</option></SiteSelect></label>}</section>)}</div>}</div><footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-5 py-4"><button onClick={onClose} disabled={saving} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8]">Cancel</button><button onClick={save} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{saving && <Loader2 className="size-4 animate-spin" />}Save permissions</button></footer></motion.div></div>;
}

function ConnectedBoardSettingsDialog({ column, boards, busy, onClose, onSave }) {
  const [targetBoardId, setTargetBoardId] = useState(column.settings?.targetBoardId || "");
  return <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label={`${column.label} connected board settings`}><motion.div initial={{ opacity: 0, y: 10, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-md rounded-xl border border-[#d0d4e4] bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-[#d0d4e4] px-5 py-4"><div><h2 className="font-semibold">Connected board</h2><p className="mt-1 text-sm text-[#676879]">Choose the board whose tasks and subitems this column can link.</p></div><button type="button" onClick={onClose} className="work-flow-icon-button" aria-label="Close connected board settings"><X className="size-4" /></button></header><div className="p-5"><label className="block"><span className="mb-1 block text-sm font-medium text-[#323338]">Connect to board</span><SiteSelect aria-label="Connected board setting" value={targetBoardId} onChange={(event) => setTargetBoardId(event.target.value)} className={`${inputClass} w-full`}><option value="">Choose a board…</option>{boards.map((board) => <option key={board.id} value={board.id}>{board.name}</option>)}</SiteSelect></label><p className="mt-2 text-xs text-[#676879]">Existing links are preserved if the destination changes. New links must come from the selected board.</p></div><footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-5 py-4"><button type="button" onClick={onClose} disabled={busy} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8]">Cancel</button><button type="button" onClick={() => onSave({ ...column.settings, targetBoardId })} disabled={busy || !targetBoardId || targetBoardId === column.settings?.targetBoardId} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Save</button></footer></motion.div></div>;
}

const NATIVE_COLUMN_TYPES = ["text", "long_text", "status", "multi_select", "date", "datetime", "timeline", "time_of_day", "week", "decimal", "integer", "money", "percent", "boolean", "email", "phone", "url", "location", "country", "timezone", "rating", "color", "tag_refs", "person_refs", "team_refs", "assignee_refs", "dependency_refs", "board_item_refs", "asset_refs", "document_ref", "time_tracking", "vote", "button", "auto_number", "created_at", "updated_at"];
const VIEW_OPTIONS = [{ id: "table", label: "Table" }, { id: "kanban", label: "Kanban" }, { id: "calendar", label: "Calendar" }, { id: "timeline", label: "Timeline" }, { id: "gantt", label: "Gantt" }, { id: "chart", label: "Chart" }, { id: "workload", label: "Workload" }, { id: "files", label: "Files" }, { id: "map", label: "Map" }, { id: "form", label: "Form" }, { id: "cards", label: "Cards" }];
const INITIAL_BOARD_PAGE_SIZE = 100;
const BOARD_PAGE_SIZE = 250;
const CHILD_PAGE_SIZE = 100;
const VIEW_PAGE_SIZE = 100;

const FILTER_OPERATORS = [
  { id: "eq", label: "is" }, { id: "neq", label: "is not" }, { id: "contains", label: "contains" },
  { id: "startsWith", label: "starts with" }, { id: "endsWith", label: "ends with" },
  { id: "gt", label: "greater than" }, { id: "gte", label: "at least" }, { id: "lt", label: "less than" }, { id: "lte", label: "at most" },
  { id: "isEmpty", label: "is empty" }, { id: "isNotEmpty", label: "is not empty" },
];

function queryFieldOptions(columns) {
  return [{ id: "item.name", label: "Item name", type: "name" }, { id: "item.createdAt", label: "Created", type: "datetime" }, { id: "item.updatedAt", label: "Updated", type: "datetime" }, ...columns.map((column) => ({ id: column.id, label: column.label, type: column.type, settings: column.settings }))];
}

function filterValue(value, field) {
  if (["integer", "decimal", "percent", "rating", "duration"].includes(field?.type)) return value === "" ? null : Number(value);
  if (field?.type === "boolean") return value === "true";
  return value;
}

function ViewQueryBuilder({ columns, filters, sorts, onFiltersChange, onSortsChange, onApply, onClose, busy }) {
  const root = useDismissibleLayer(true, onClose);
  const fields = queryFieldOptions(columns);
  const combinator = filters[0]?.combinator === "or" ? "or" : "and";
  const addFilter = () => onFiltersChange([...filters, { id: crypto.randomUUID(), fieldId: fields[0]?.id || "item.name", op: "contains", value: "", combinator }]);
  const addSort = () => onSortsChange([...sorts, { id: crypto.randomUUID(), fieldId: fields[0]?.id || "item.name", direction: "asc", nulls: "last" }]);
  return <div id="work-flow-query-builder-root" ref={root} className="mb-3 rounded-lg border border-slate-200 bg-white shadow-sm" role="region" aria-label="Filter and sort builder"><div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><div><h2 className="text-sm font-semibold">Filter and sort</h2><p className="text-xs text-slate-500"></p></div><button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close filter and sort builder"><X className="size-4" /></button></div><div className="space-y-5 p-4"><section><div className="mb-2 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Filter className="size-3.5" />Filters</h3>{filters.length > 1 && <label className="flex items-center gap-2 text-xs text-slate-500">Match<SiteSelect aria-label="Filter match mode" value={combinator} onChange={(event) => onFiltersChange(filters.map((entry) => ({ ...entry, combinator: event.target.value })))} className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"><option value="and">all conditions</option><option value="or">any condition</option></SiteSelect></label>}</div><button onClick={addFilter} className="text-xs font-medium text-blue-700">Add filter</button></div>{filters.length ? <div className="space-y-2">{filters.map((rule, index) => { const field = fields.find((entry) => entry.id === rule.fieldId); const noValue = ["isEmpty", "isNotEmpty"].includes(rule.op); return <div key={rule.id} className="grid gap-2 sm:grid-cols-[5rem_minmax(0,1fr)_9rem_minmax(0,1fr)_2.25rem]"><span className="self-center text-xs text-slate-500">{index ? combinator === "or" ? "Or" : "And" : "Where"}</span><SiteSelect aria-label={`Filter ${index + 1} field`} value={rule.fieldId} onChange={(event) => onFiltersChange(filters.map((entry) => entry.id === rule.id ? { ...entry, fieldId: event.target.value, value: "" } : entry))} className={inputClass}>{fields.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</SiteSelect><SiteSelect aria-label={`Filter ${index + 1} operator`} value={rule.op} onChange={(event) => onFiltersChange(filters.map((entry) => entry.id === rule.id ? { ...entry, op: event.target.value } : entry))} className={inputClass}>{FILTER_OPERATORS.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</SiteSelect>{noValue ? <span className="self-center text-xs text-slate-400">No value needed</span> : field?.type === "boolean" ? <SiteSelect aria-label={`Filter ${index + 1} value`} value={rule.value} onChange={(event) => onFiltersChange(filters.map((entry) => entry.id === rule.id ? { ...entry, value: event.target.value } : entry))} className={inputClass}><option value="true">Yes</option><option value="false">No</option></SiteSelect> : field?.type === "status" ? <SiteSelect aria-label={`Filter ${index + 1} value`} value={rule.value} onChange={(event) => onFiltersChange(filters.map((entry) => entry.id === rule.id ? { ...entry, value: event.target.value } : entry))} className={inputClass}><option value="">Choose…</option>{(field.settings?.options || []).map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</SiteSelect> : <DateInput aria-label={`Filter ${index + 1} value`} type={["date", "datetime"].includes(field?.type) ? "date" : ["integer", "decimal", "percent", "rating", "duration"].includes(field?.type) ? "number" : "text"} value={rule.value} onChange={(event) => onFiltersChange(filters.map((entry) => entry.id === rule.id ? { ...entry, value: event.target.value } : entry))} className={inputClass} />}<button onClick={() => onFiltersChange(filters.filter((entry) => entry.id !== rule.id))} className="flex size-9 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove filter ${index + 1}`}><Trash2 className="size-4" /></button></div>; })}</div> : <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">No filters.</p>}</section><section><div className="mb-2 flex items-center justify-between"><h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><ArrowUpDown className="size-3.5" />Sorts</h3><button onClick={addSort} disabled={sorts.length >= 10} className="text-xs font-medium text-blue-700 disabled:opacity-40">Add sort</button></div>{sorts.length ? <div className="space-y-2">{sorts.map((rule, index) => <div key={rule.id} className="grid gap-2 sm:grid-cols-[5rem_minmax(0,1fr)_8rem_8rem_2.25rem]"><span className="self-center text-xs text-slate-500">{index ? "Then by" : "Sort by"}</span><SiteSelect aria-label={`Sort ${index + 1} field`} value={rule.fieldId} onChange={(event) => onSortsChange(sorts.map((entry) => entry.id === rule.id ? { ...entry, fieldId: event.target.value } : entry))} className={inputClass}>{fields.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</SiteSelect><SiteSelect aria-label={`Sort ${index + 1} direction`} value={rule.direction} onChange={(event) => onSortsChange(sorts.map((entry) => entry.id === rule.id ? { ...entry, direction: event.target.value } : entry))} className={inputClass}><option value="asc">Ascending</option><option value="desc">Descending</option></SiteSelect><SiteSelect aria-label={`Sort ${index + 1} empty values`} value={rule.nulls} onChange={(event) => onSortsChange(sorts.map((entry) => entry.id === rule.id ? { ...entry, nulls: event.target.value } : entry))} className={inputClass}><option value="last">Empty last</option><option value="first">Empty first</option></SiteSelect><button onClick={() => onSortsChange(sorts.filter((entry) => entry.id !== rule.id))} className="flex size-9 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove sort ${index + 1}`}><Trash2 className="size-4" /></button></div>)}</div> : <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">Board order.</p>}</section></div><footer className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3"><button onClick={() => { onFiltersChange([]); onSortsChange([]); }} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium">Clear</button><button onClick={onApply} disabled={busy} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Apply to table</button></footer></div>;
}

function BulkActionBar({ count, groups, columns, actionType, setActionType, groupId, setGroupId, columnId, setColumnId, value, setValue, onPreview, onClear, busy }) {
  const writable = columns.filter((column) => column.type !== "name" && !column.readOnly && !column.binding);
  return <div className="sticky top-2 z-20 mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 shadow-sm" role="toolbar" aria-label="Bulk actions"><span className="mr-1 text-sm font-semibold text-blue-900">{count} selected</span><SiteSelect aria-label="Bulk action" value={actionType} onChange={(event) => setActionType(event.target.value)} className={inputClass}><option value="move_group">Move to group</option><option value="set_cell">Set a field</option><option value="archive">Archive</option><option value="trash">Move to trash</option></SiteSelect>{actionType === "move_group" && <SiteSelect aria-label="Destination group" value={groupId} onChange={(event) => setGroupId(event.target.value)} className={inputClass}>{groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}</SiteSelect>}{actionType === "set_cell" && <><SiteSelect aria-label="Bulk field" value={columnId} onChange={(event) => { setColumnId(event.target.value); setValue(""); }} className={inputClass}><option value="">Choose field…</option>{writable.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</SiteSelect><input aria-label="Bulk value" value={value} onChange={(event) => setValue(event.target.value)} className={inputClass} placeholder="New value" /></>}<button onClick={onPreview} disabled={busy || (actionType === "move_group" && !groupId) || (actionType === "set_cell" && !columnId)} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-40">Preview change</button><button onClick={onClear} disabled={busy} className="rounded-md px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">Clear selection</button></div>;
}

function BulkPlanDialog({ plan, onClose, onExecute, busy }) {
  const action = plan.action?.type?.replaceAll("_", " ") || "change";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-label="Confirm bulk change"><div className="w-full max-w-md rounded-xl bg-white shadow-2xl"><header className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold">Review bulk change</h2><p className="mt-1 text-sm text-slate-500">The affected items were frozen at the current board revision.</p></header><div className="space-y-3 p-5"><p className="text-sm text-slate-700"><span className="font-semibold">{plan.impact?.affectedCount || 0} items</span> will receive this {action} operation.</p>{plan.impact?.warnings?.length > 0 && <ul className="list-disc space-y-1 pl-5 text-sm text-amber-700">{plan.impact.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}<p className="text-xs text-slate-400">This preview expires at {new Date(plan.expiresAt).toLocaleTimeString()} and execution stops if the board changes first.</p></div><footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4"><button onClick={onClose} disabled={busy} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium">Cancel</button><button onClick={onExecute} disabled={busy} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Applying…" : "Apply change"}</button></footer></div></div>;
}

function KanbanView({ data, items, presentation, onOpenItem }) {
  const statusColumn = data.columns.find((column) => column.id === presentation?.groupByColumnId && column.type === "status") || data.columns.find((column) => column.type === "status");
  if (!statusColumn) return <EmptySurface icon={LayoutDashboard} title="Kanban needs a status column" detail="Add a Status column, then this view will organize items into operational lanes." />;
  const options = statusColumn.settings?.options || [];
  const lanes = [...options.map((option) => ({ id: option.id, label: option.label, color: option.color, items: items.filter((item) => item.values?.[statusColumn.id] === option.id) })), { id: "unassigned", label: "No status", color: "#94a3b8", items: items.filter((item) => !item.values?.[statusColumn.id]) }];
  return <div className="flex min-h-[420px] gap-4 overflow-x-auto pb-3" aria-label="Kanban board">{lanes.map((lane) => <section key={lane.id} className="w-72 shrink-0 rounded-lg bg-slate-100/80"><header className="flex items-center gap-2 border-t-4 px-3 py-3" style={{ borderTopColor: lane.color || "#94a3b8" }}><h2 className="text-sm font-semibold text-slate-800">{lane.label}</h2><span className="ml-auto text-xs tabular-nums text-slate-500">{lane.items.length}</span></header><div className="space-y-2 px-2 pb-3">{lane.items.map((item) => <button key={item.id} onClick={() => onOpenItem(item)} className="work-flow-item-enter block w-full rounded-md border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-300 hover:shadow"><span className="block text-sm font-medium text-slate-800">{item.name}</span><span className="mt-2 block text-xs text-slate-400">Open item details</span></button>)}{!lane.items.length && <p className="rounded-md border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-400">No items</p>}</div></section>)}</div>;
}

function CalendarView({ data, items, presentation, onOpenItem }) {
  const temporal = data.columns.find((column) => column.id === presentation?.dateColumnId && ["date", "datetime", "timeline"].includes(column.type)) || data.columns.find((column) => ["date", "datetime", "timeline"].includes(column.type));
  if (!temporal) return <EmptySurface icon={LayoutDashboard} title="Calendar needs a date column" detail="Add a Date, Date & time, or Timeline column to place items on the calendar." />;
  const dated = items.flatMap((item) => { const value = item.values?.[temporal.id]; const day = temporal.type === "timeline" ? value?.start : String(value || "").slice(0, 10); return /^\d{4}-\d{2}-\d{2}$/.test(day || "") ? [{ item, day }] : []; });
  const anchor = dated[0]?.day || new Date().toISOString().slice(0, 10);
  const [year, month] = anchor.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1)); const gridStart = new Date(first); gridStart.setUTCDate(first.getUTCDate() - first.getUTCDay());
  const days = Array.from({ length: 42 }, (_, index) => { const date = new Date(gridStart); date.setUTCDate(gridStart.getUTCDate() + index); return { date, key: date.toISOString().slice(0, 10) }; });
  const monthLabel = first.toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
  return <section className="overflow-hidden border border-slate-200 bg-white" aria-label="Calendar view"><header className="border-b border-slate-200 px-4 py-3"><h2 className="font-semibold text-slate-800">{monthLabel}</h2><p className="text-xs text-slate-500">Scheduled by {temporal.label}</p></header><div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => <div key={label} className="px-2 py-2 text-center text-xs font-medium text-slate-500">{label}</div>)}</div><div className="grid grid-cols-7">{days.map(({ date, key }) => { const dayItems = dated.filter((entry) => entry.day === key); const inMonth = date.getUTCMonth() === month - 1; return <div key={key} className="min-h-28 border-b border-r border-slate-100 p-1.5"><span className={`text-xs tabular-nums ${inMonth ? "text-slate-700" : "text-slate-300"}`}>{date.getUTCDate()}</span><div className="mt-1 space-y-1">{dayItems.map(({ item }) => <button key={item.id} onClick={() => onOpenItem(item)} className="block w-full truncate rounded bg-blue-100 px-1.5 py-1 text-left text-xs font-medium text-blue-800 hover:bg-blue-200">{item.name}</button>)}</div></div>; })}</div></section>;
}

function TimelineView({ data, items, presentation, onOpenItem, gantt = false }) {
  const temporal = data.columns.find((column) => column.id === presentation?.dateColumnId && ["date", "datetime", "timeline"].includes(column.type)) || data.columns.find((column) => ["timeline", "date", "datetime"].includes(column.type));
  if (!temporal) return <EmptySurface icon={LayoutDashboard} title={`${gantt ? "Gantt" : "Timeline"} needs a date column`} detail="Add a Date, Date & time, or Timeline column to schedule items." />;
  const rows = items.map((item) => { const value = item.values?.[temporal.id]; const start = temporal.type === "timeline" ? value?.start : String(value || "").slice(0, 10); const end = temporal.type === "timeline" ? value?.end : start; return { item, start, end }; }).filter((entry) => entry.start && entry.end);
  const stamps = rows.flatMap((entry) => [Date.parse(`${entry.start}T00:00:00Z`), Date.parse(`${entry.end}T00:00:00Z`)]).filter(Number.isFinite);
  if (!stamps.length) return <EmptySurface icon={LayoutDashboard} title={`No scheduled items in this ${gantt ? "Gantt" : "timeline"} view`} detail={`Set values in ${temporal.label} to place work here.`} />;
  const minimum = Math.min(...stamps); const maximum = Math.max(...stamps); const span = Math.max(86400000, maximum - minimum + 86400000);
  return <section className="overflow-hidden rounded-lg border border-[#d0d4e4] bg-white" aria-label={`${gantt ? "Gantt" : "Timeline"} view`}><header className="border-b border-[#d0d4e4] px-4 py-3"><h2 className="font-semibold">{gantt ? "Gantt" : "Timeline"}</h2><p className="text-xs text-[#676879]">Scheduled by {temporal.label}</p></header><div className="divide-y divide-[#e6e9ef]">{rows.map(({ item, start, end }) => { const left = ((Date.parse(`${start}T00:00:00Z`) - minimum) / span) * 100; const width = Math.max(2, ((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`) + 86400000) / span) * 100); return <button key={item.id} onClick={() => onOpenItem(item)} className="grid w-full grid-cols-[220px_1fr] items-center text-left hover:bg-[#f5f6f8]"><span className="truncate border-r border-[#e6e9ef] px-4 py-3 text-sm font-medium">{item.name}</span><span className="relative mx-4 h-8"><span className="absolute top-1 flex h-6 min-w-8 items-center truncate rounded-full bg-[#579bfc] px-2 text-xs font-medium text-white" style={{ left: `${left}%`, width: `${Math.min(100 - left, width)}%` }}>{start === end ? start : `${start} – ${end}`}</span></span></button>; })}</div></section>;
}

function ChartView({ data, items, presentation }) {
  const column = data.columns.find((entry) => entry.id === presentation?.groupByColumnId) || data.columns.find((entry) => ["status", "multi_select", "country"].includes(entry.type));
  if (!column) return <EmptySurface icon={LayoutDashboard} title="Chart needs a category column" detail="Add a Status, Multi-select, or Country column to chart board work." />;
  const counts = items.reduce((map, item) => { const raw = item.values?.[column.id]; const values = Array.isArray(raw) ? raw : [raw]; values.filter(Boolean).forEach((value) => { const id = String(value?.id || value); const option = (column.settings?.options || []).find((entry) => String(entry.id) === id); const label = option?.label || value?.label || id; map.set(label, (map.get(label) || 0) + 1); }); return map; }, new Map());
  const max = Math.max(1, ...counts.values());
  return <section className="rounded-lg border border-[#d0d4e4] bg-white p-5" aria-label="Chart view"><h2 className="font-semibold">Items by {column.label}</h2><div className="mt-5 space-y-3">{[...counts.entries()].map(([label, count], index) => <div key={label} className="grid grid-cols-[160px_1fr_3rem] items-center gap-3"><span className="truncate text-sm">{label}</span><span className="h-7 rounded-sm bg-[#f0f1f4]"><span className="block h-full rounded-sm" style={{ width: `${(count / max) * 100}%`, backgroundColor: ["#579bfc", "#00c875", "#fdab3d", "#a25ddc", "#e2445c"][index % 5] }} /></span><span className="text-right text-sm tabular-nums">{count}</span></div>)}{!counts.size && <p className="text-sm text-[#676879]">No categorized items yet.</p>}</div></section>;
}

function WorkloadView({ data, items, onOpenItem }) {
  const column = data.columns.find((entry) => ["person_refs", "team_refs", "assignee_refs", "people", "person", "team_assignees"].includes(entry.type));
  if (!column) return <EmptySurface icon={LayoutDashboard} title="Workload needs a People or Team column" detail="Add an assignment column to balance work across the team." />;
  const lanes = items.reduce((map, item) => { const assigned = item.values?.[column.id]; const refs = Array.isArray(assigned) && assigned.length ? assigned : [{ id: "unassigned", label: "Unassigned" }]; refs.forEach((ref) => { const key = String(ref?.id || ref); if (!map.has(key)) map.set(key, { label: ref?.label || key, items: [] }); map.get(key).items.push(item); }); return map; }, new Map());
  return <div className="grid gap-4 lg:grid-cols-2" aria-label="Workload view">{[...lanes.entries()].map(([id, lane]) => <section key={id} className="rounded-lg border border-[#d0d4e4] bg-white"><header className="flex items-center justify-between border-b border-[#d0d4e4] px-4 py-3"><h2 className="font-semibold">{lane.label}</h2><span className="text-sm text-[#676879]">{lane.items.length} assigned</span></header><div className="divide-y divide-[#e6e9ef]">{lane.items.map((item) => <button key={item.id} onClick={() => onOpenItem(item)} className="block w-full px-4 py-3 text-left text-sm hover:bg-[#f5f6f8]">{item.name}</button>)}</div></section>)}</div>;
}

function FilesView({ data, items, onOpenItem, refreshKey }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/assets`);
        if (!cancelled) setAttachments(payload.data?.attachments || []);
      } catch (error) {
        if (!cancelled) setLoadError(error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [data.board.id, refreshKey]);
  const itemById = new Map(items.map((item) => [item.id, item]));
  const visibleAttachments = attachments.flatMap(({ itemId, asset }) => itemById.has(itemId) ? [{ item: itemById.get(itemId), asset }] : []);
  const columns = data.columns.filter((entry) => ["asset_refs", "document_ref"].includes(entry.type));
  const documentEntries = items.flatMap((item) => columns.filter((column) => column.type === "document_ref").flatMap((column) => { const raw = item.values?.[column.id]; return (Array.isArray(raw) ? raw : raw ? [raw] : []).map((asset) => ({ item, asset, column })); }));
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Files view">{visibleAttachments.map(({ item, asset }) => <button key={`${item.id}:${asset.id}`} onClick={() => onOpenItem(item)} className="rounded-lg border border-[#d0d4e4] bg-white p-4 text-left hover:border-[#0073ea]"><Paperclip className="mb-3 size-6 text-[#676879]" /><span className="block truncate text-sm font-semibold">{asset.logicalName || asset.version?.originalFilename || "File"}</span><span className="mt-1 block truncate text-xs text-[#676879]">{item.name} · File</span></button>)}{documentEntries.map(({ item, asset, column }, index) => <button key={`${item.id}:${column.id}:${asset?.id || index}`} onClick={() => onOpenItem(item)} className="rounded-lg border border-[#d0d4e4] bg-white p-4 text-left hover:border-[#0073ea]"><FileText className="mb-3 size-6 text-[#676879]" /><span className="block truncate text-sm font-semibold">{asset?.label || asset?.name || asset?.id || "Document"}</span><span className="mt-1 block truncate text-xs text-[#676879]">{item.name} · {column.label}</span></button>)}{loading && <p className="text-sm text-[#676879]">Loading files…</p>}{loadError && <p role="alert" className="text-sm text-red-700">{loadError}</p>}{!loading && !loadError && !visibleAttachments.length && !documentEntries.length && <p className="text-sm text-[#676879]">No files attached yet.</p>}</div>;
}

function MapView({ data, items, onOpenItem }) {
  const column = data.columns.find((entry) => entry.type === "location");
  if (!column) return <EmptySurface icon={LayoutDashboard} title="Map needs a Location column" detail="Add locations to coordinate site visits and field work." />;
  const places = items.map((item) => ({ item, value: item.values?.[column.id] })).filter((entry) => Number.isFinite(Number(entry.value?.latitude)) && Number.isFinite(Number(entry.value?.longitude)));
  return <section className="overflow-hidden rounded-lg border border-[#d0d4e4] bg-white" aria-label="Map view"><header className="border-b border-[#d0d4e4] px-4 py-3"><h2 className="font-semibold">Locations</h2><p className="text-xs text-[#676879]">{places.length} mapped items</p></header><div className="divide-y divide-[#e6e9ef]">{places.map(({ item, value }) => <button key={item.id} onClick={() => onOpenItem(item)} className="grid w-full grid-cols-[1fr_auto] gap-4 px-4 py-3 text-left hover:bg-[#f5f6f8]"><span><strong className="block text-sm">{item.name}</strong><span className="text-xs text-[#676879]">{value.address || `${value.latitude}, ${value.longitude}`}</span></span><span className="text-xs text-[#0073ea]">{Number(value.latitude).toFixed(4)}, {Number(value.longitude).toFixed(4)}</span></button>)}</div></section>;
}

function CardsView({ data, items, onOpenItem }) {
  const columns = data.columns.filter((column) => column.type !== "name").slice(0, 4);
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Cards view">{items.map((item) => <button key={item.id} onClick={() => onOpenItem(item)} className="work-flow-item-enter rounded-lg border border-[#d0d4e4] bg-white p-4 text-left shadow-sm hover:border-[#0073ea] hover:shadow-md"><h2 className="font-semibold">{item.name}</h2><dl className="mt-3 space-y-2">{columns.map((column) => <div key={column.id} className="grid grid-cols-[7rem_1fr] gap-2 text-xs"><dt className="truncate text-[#676879]">{column.label}</dt><dd className="truncate text-[#323338]">{displayValue(item.values?.[column.id], column) || "—"}</dd></div>)}</dl></button>)}</div>;
}

function ColumnBuilderDialog({ initialType = "text", busy, onClose, onCreate, setError, boardId, boardColumns = [], boards = [] }) {
  const [mode, setMode] = useState("native");
  const [multipleRecords, setMultipleRecords] = useState(true);
  const [label, setLabel] = useState(initialType === "person_refs" ? "People" : "");
  const [type, setType] = useState(initialType);
  const [optionLabels, setOptionLabels] = useState("Not started\nWorking\nDone");
  const [domainTypes, setDomainTypes] = useState([]);
  const [domainType, setDomainType] = useState("");
  const [fieldId, setFieldId] = useState("");
  const [writeMode, setWriteMode] = useState("read_only");
  const [writeCommand, setWriteCommand] = useState("");
  const [sourceRole, setSourceRole] = useState("");
  const [expression, setExpression] = useState("");
  const [resultType, setResultType] = useState("number");
  const [precision, setPrecision] = useState("2");
  const [targetBoardId, setTargetBoardId] = useState("");
  const [bindingKind, setBindingKind] = useState("mirror");
  const [relationColumnId, setRelationColumnId] = useState("");
  const [sourceColumnId, setSourceColumnId] = useState("");
  const [sourceColumns, setSourceColumns] = useState([]);
  const [aggregation, setAggregation] = useState("count");
  const [automations, setAutomations] = useState([]);
  const [buttonAutomationId, setButtonAutomationId] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Run");
  useEffect(() => { api("/api/work-flow/v1/domain-types").then((payload) => { const types = payload.data.domainTypes || []; setDomainTypes(types); setDomainType(types[0]?.domainType || ""); setFieldId(Object.keys(types[0]?.fields || {})[0] || ""); }).catch((cause) => setError(cause.message)); }, [setError]);
  const adapter = domainTypes.find((entry) => entry.domainType === domainType);
  const relationColumns = boardColumns.filter((entry) => ["domain_ref", "domain_refs"].includes(entry.type) && entry.settings?.connectionTarget?.domainType === domainType);
  const resolvedSourceRole = sourceRole || (relationColumns.length === 1 ? `column:${relationColumns[0].id}` : relationColumns.length ? "" : "primary");
  const chooseDomain = (value) => { const next = domainTypes.find((entry) => entry.domainType === value); setDomainType(value); setFieldId(Object.keys(next?.fields || {})[0] || ""); setWriteCommand(""); setSourceRole(""); };
  const chooseField = (value) => { setFieldId(value); if (!label.trim()) setLabel(adapter?.fields?.[value] ? value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : ""); };
  const boardRelationColumns = boardColumns.filter((entry) => entry.type === "board_item_refs" && entry.settings?.targetBoardId);
  const relationTargetBoardId = boardColumns.find((entry) => entry.id === relationColumnId)?.settings?.targetBoardId || "";
  useEffect(() => {
    if (mode !== "computed" || !relationTargetBoardId) { setSourceColumns([]); setSourceColumnId(""); return; }
    let active = true;
    api(`/api/work-flow/v1/boards/${relationTargetBoardId}?limit=1`).then((payload) => {
      if (!active) return;
      const columns = payload.data?.columns || [];
      setSourceColumns(columns);
      setSourceColumnId((current) => columns.some((entry) => entry.id === current) ? current : columns[0]?.id || "");
    }).catch((cause) => { if (active) setError(cause.message); });
    return () => { active = false; };
  }, [mode, relationTargetBoardId, setError]);
  useEffect(() => {
    if (mode !== "native" || type !== "button") return;
    let active = true;
    api(`/api/work-flow/v1/boards/${boardId}/automations`).then((payload) => {
      if (!active) return;
      const available = (payload.data?.automations || []).filter((entry) => entry.enabled && entry.activeVersion?.trigger?.type === "manual");
      setAutomations(available);
      setButtonAutomationId((current) => available.some((entry) => entry.id === current) ? current : available[0]?.id || "");
    }).catch((cause) => { if (active) setError(cause.message); });
    return () => { active = false; };
  }, [mode, type, boardId, setError]);
  const submit = () => {
    if (!label.trim()) return;
    if (mode === "relation") {
      if (!adapter?.objectDiscovery) return;
      onCreate({ label: label.trim(), type: multipleRecords ? "domain_refs" : "domain_ref", readOnly: false, settings: { connectionTarget: { kind: "domain", domainType, displayField: adapter.identityField || "id", label: adapter.label } } });
    } else if (mode === "connected") {
      const fieldType = adapter?.fields?.[fieldId];
      if (!fieldType || !resolvedSourceRole || (writeMode === "command" && !writeCommand)) return;
      onCreate({ label: label.trim(), type: fieldType, readOnly: writeMode === "read_only", settings: {}, binding: { domainType, fieldId, writeMode, writeCommand: writeMode === "command" ? writeCommand : null, config: { role: resolvedSourceRole } } });
    } else if (mode === "formula") {
      if (!expression.trim()) return;
      onCreate({ label: label.trim(), type: "formula_result", readOnly: true, settings: { resultType }, formula: { expression: expression.trim(), resultType, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", locale: navigator.language || "en-US", precision: resultType === "number" ? Number(precision) : null } });
    } else if (mode === "computed") {
      if (!relationColumnId || !sourceColumnId) return;
      onCreate({ label: label.trim(), type: "json_readonly", readOnly: true, settings: { sourceSemantic: bindingKind }, binding: { bindingKind, relationColumnId, sourceColumnId, ...(bindingKind === "rollup" ? { aggregation } : {}) } });
    } else {
      const labels = optionLabels.split("\n").map((entry) => entry.trim()).filter(Boolean).slice(0, 50);
      const optionSettings = labels.map((entry, index) => ({ id: entry.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || `option_${index + 1}`, label: entry, ...(type === "status" ? { color: ["#579bfc", "#fdab3d", "#00c875", "#a25ddc", "#e2445c"][index % 5], ...(index === labels.length - 1 ? { completion: true } : {}) } : {}) }));
      if (type === "board_item_refs" && !targetBoardId) return;
      if (type === "button" && !buttonAutomationId) return;
      onCreate({ label: label.trim(), type, readOnly: ["button", "auto_number", "created_at", "updated_at"].includes(type), settings: ["status", "multi_select", "tag_refs"].includes(type) ? { options: optionSettings } : type === "money" ? { currency: "USD" } : type === "rating" ? { maximum: 5 } : type === "board_item_refs" ? { targetBoardId } : type === "button" ? { automationId: buttonAutomationId, buttonLabel: buttonLabel.trim() || "Run" } : {} });
    }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-label="Add board column">
    <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div><h2 className="font-semibold">Add a column</h2><p className="text-sm text-slate-500">Store data, connect authoritative records, or calculate a result.</p></div>
        <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close column builder"><X className="size-4" /></button>
      </header>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-5 rounded-lg bg-slate-100 p-1">
          {[["native", "Board data"], ["relation", "Connect records"], ["connected", "Connected data"], ["computed", "Mirror / rollup"], ["formula", "Formula"]].map(([key, title]) => <button key={key} onClick={() => setMode(key)} className={`rounded-md px-2 py-2 text-xs font-medium ${mode === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>{title}</button>)}
        </div>
        <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Column name</span><input autoFocus value={label} onChange={(event) => setLabel(event.target.value)} className={`${inputClass} w-full`} placeholder="e.g. Forecast total" /></label>
        {mode === "native" && <>
          <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Data type</span><SiteSelect value={type} onChange={(event) => setType(event.target.value)} className={`${inputClass} w-full`}>{NATIVE_COLUMN_TYPES.filter((entry) => !["domain_ref", "domain_refs"].includes(entry)).map((entry) => <option key={entry} value={entry}>{({ person_refs: "People", team_refs: "Teams", assignee_refs: "People and teams", asset_refs: "Files" })[entry] || entry.replaceAll("_", " ")}</option>)}</SiteSelect></label>
          {type === "board_item_refs" && <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Connect to board</span><SiteSelect aria-label="Connect to board" value={targetBoardId} onChange={(event) => setTargetBoardId(event.target.value)} className={`${inputClass} w-full`}><option value="">Choose a board…</option>{boards.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</SiteSelect><span className="mt-1 block text-xs text-slate-500">Each cell will select tasks or subitems from this board.</span></label>}
          {type === "button" && <><label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Manual automation</span><SiteSelect aria-label="Button automation" value={buttonAutomationId} onChange={(event) => setButtonAutomationId(event.target.value)} className={`${inputClass} w-full`}><option value="">Choose an enabled manual automation…</option>{automations.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</SiteSelect>{!automations.length && <span className="mt-1 block text-xs text-amber-700">Create and enable a manual automation before adding this button.</span>}</label><label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Button text</span><input aria-label="Button text" value={buttonLabel} onChange={(event) => setButtonLabel(event.target.value)} className={`${inputClass} w-full`} maxLength={40} /></label></>}
          {["status", "multi_select", "tag_refs"].includes(type) && <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Choices</span><textarea aria-label="Column choices" rows={4} value={optionLabels} onChange={(event) => setOptionLabels(event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /><span className="mt-1 block text-xs text-slate-500">Enter one choice per line.</span></label>}
        </>}
        {mode === "formula" && <>
          <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Formula</span><input value={expression} onChange={(event) => setExpression(event.target.value)} className={`${inputClass} w-full font-mono`} placeholder="e.g. {Quantity} * {Unit price}" /><span className="mt-1 block text-xs text-slate-500">Reference columns by name inside braces. Formulas are validated before publishing.</span></label>
          <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1 block text-sm font-medium text-slate-700">Result type</span><SiteSelect value={resultType} onChange={(event) => setResultType(event.target.value)} className={`${inputClass} w-full`}><option value="number">Number</option><option value="text">Text</option><option value="boolean">True / false</option><option value="date">Date</option><option value="datetime">Date &amp; time</option></SiteSelect></label>{resultType === "number" && <label><span className="mb-1 block text-sm font-medium text-slate-700">Decimal places</span><input type="number" min="0" max="12" value={precision} onChange={(event) => setPrecision(event.target.value)} className={`${inputClass} w-full`} /></label>}</div>
        </>}
        {mode === "computed" && <>
          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1"><button type="button" onClick={() => setBindingKind("mirror")} className={`rounded-md px-3 py-2 text-sm ${bindingKind === "mirror" ? "bg-white font-medium shadow-sm" : "text-slate-500"}`}>Mirror values</button><button type="button" onClick={() => setBindingKind("rollup")} className={`rounded-md px-3 py-2 text-sm ${bindingKind === "rollup" ? "bg-white font-medium shadow-sm" : "text-slate-500"}`}>Calculate rollup</button></div>
          <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Connect Boards column</span><SiteSelect aria-label="Connect Boards column" value={relationColumnId} onChange={(event) => { setRelationColumnId(event.target.value); setSourceColumnId(""); }} className={`${inputClass} w-full`}><option value="">Choose a connection…</option>{boardRelationColumns.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</SiteSelect>{!boardRelationColumns.length && <span className="mt-1 block text-xs text-amber-700">Add a Connect Boards column before creating a mirror or rollup.</span>}</label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Column from connected board</span><SiteSelect aria-label="Column from connected board" disabled={!relationColumnId || !sourceColumns.length} value={sourceColumnId} onChange={(event) => setSourceColumnId(event.target.value)} className={`${inputClass} w-full`}><option value="">Choose a source column…</option>{sourceColumns.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</SiteSelect></label>
          {bindingKind === "rollup" && <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Calculation</span><SiteSelect aria-label="Rollup calculation" value={aggregation} onChange={(event) => setAggregation(event.target.value)} className={`${inputClass} w-full`}><option value="count">Count values</option><option value="count_unique">Count unique</option><option value="sum">Sum</option><option value="average">Average</option><option value="min">Minimum</option><option value="max">Maximum</option><option value="join">Join text</option></SiteSelect></label>}
        </>}
        {["relation", "connected"].includes(mode) && <>
          {mode === "relation" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={multipleRecords} onChange={(event) => setMultipleRecords(event.target.checked)} />Allow multiple linked records in each cell</label>}<label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Rebuildit feature</span><SiteSelect value={domainType} onChange={(event) => chooseDomain(event.target.value)} className={`${inputClass} w-full`}>{domainTypes.filter((entry) => mode !== "relation" || entry.objectDiscovery).map((entry) => <option key={entry.domainType} value={entry.domainType}>{entry.label}</option>)}</SiteSelect></label>
          {mode === "relation" ? <p className="text-xs text-[#676879]">Select real records from this feature in each board row. The feature remains the source of truth.</p> : <>
            <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Source field</span><SiteSelect value={fieldId} onChange={(event) => chooseField(event.target.value)} className={`${inputClass} w-full`}>{Object.entries(adapter?.fields || {}).map(([key, value]) => <option key={key} value={key}>{key.replaceAll("_", " ")} · {value}</option>)}</SiteSelect></label>
            <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Use connection from</span><SiteSelect aria-label="Use connection from" value={resolvedSourceRole} onChange={(event) => setSourceRole(event.target.value)} className={`${inputClass} w-full`}>
              {relationColumns.length > 1 && <option value="">Choose a connection…</option>}
              <option value="primary">Item linked record</option>
              {relationColumns.map((entry) => <option key={entry.id} value={`column:${entry.id}`}>{entry.label}</option>)}
            </SiteSelect></label>
            <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Behavior</span><SiteSelect value={writeMode} onChange={(event) => { setWriteMode(event.target.value); setWriteCommand(""); }} className={`${inputClass} w-full`}><option value="read_only">Live read-only projection</option><option value="command">Change through source command</option></SiteSelect></label>
            {writeMode === "command" && <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Owning-service command</span><SiteSelect value={writeCommand} onChange={(event) => setWriteCommand(event.target.value)} className={`${inputClass} w-full`}><option value="">Choose command…</option>{(adapter?.commands || []).map((command) => <option key={command} value={command}>{command.replaceAll("_", " ")}</option>)}</SiteSelect></label>}
            <p className="rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-800">Values remain in the source feature and are re-authorized whenever this board loads.</p>
          </>}
        </>}
      </div>
      <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4"><button onClick={onClose} disabled={busy} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium">Cancel</button><button onClick={submit} disabled={busy || !label.trim() || (mode === "native" && type === "board_item_refs" && !targetBoardId) || (mode === "native" && type === "button" && !buttonAutomationId) || (mode === "formula" && !expression.trim()) || (mode === "computed" && (!relationColumnId || !sourceColumnId)) || (mode === "connected" && (!fieldId || !resolvedSourceRole || (writeMode === "command" && !writeCommand))) || (mode === "relation" && !adapter?.objectDiscovery)} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{busy && <Loader2 className="size-4 animate-spin" />}Add column</button></footer>
    </div>
  </div>;
}

function LinkedRecordsPanel({ itemId, setError }) {
  const [refs, setRefs] = useState([]);
  const [domainTypes, setDomainTypes] = useState([]);
  const [domainType, setDomainType] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [resultLimit, setResultLimit] = useState(25);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [busy, setBusy] = useState(true);
  const load = useCallback(async () => {
    setBusy(true);
    try {
      const [refPayload, typePayload] = await Promise.all([api(`/api/work-flow/v1/items/${itemId}/domain-refs`), api("/api/work-flow/v1/domain-types")]);
      const available = (typePayload.data.domainTypes || []).filter((entry) => entry.objectDiscovery);
      setRefs(refPayload.data.domainRefs || []); setDomainTypes(available); setDomainType((current) => current || available[0]?.domainType || "");
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }, [itemId, setError]);
  useEffect(() => { load(); }, [load]);
  const search = async (limit = 25) => {
    if (!domainType) return;
    setBusy(true); setError("");
    try { const payload = await api(`/api/work-flow/v1/domain-types/${encodeURIComponent(domainType)}/objects?query=${encodeURIComponent(query.trim())}&limit=${limit}`); setResults(payload.data.objects || []); setResultLimit(limit); setHasMoreResults(Boolean(payload.data.pageInfo?.hasNextPage)); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const link = async (object) => {
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/items/${itemId}/domain-refs`, { method: "POST", body: JSON.stringify({ domainType: object.domainType, entityId: object.entityId, role: "primary" }) }); setResults([]); setQuery(""); await load(); }
    catch (cause) { setError(cause.message); setBusy(false); }
  };
  const unlink = async (refId) => {
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/items/${itemId}/domain-refs/${refId}`, { method: "DELETE" }); await load(); }
    catch (cause) { setError(cause.message); setBusy(false); }
  };
  return <div className="space-y-4">
    <div className="rounded-lg border border-slate-200 p-3"><p className="text-sm font-medium text-slate-800">Connect this item to a Rebuildit feature</p><p className="mt-0.5 text-xs text-slate-500">Choose an existing CRM customer, inventory item, estimate, or other site record. That feature remains the authoritative source.</p><div className="mt-3 flex gap-2"><SiteSelect value={domainType} onChange={(event) => { setDomainType(event.target.value); setResults([]); setResultLimit(25); setHasMoreResults(false); }} disabled={busy} className={`${inputClass} min-w-0 flex-1`} aria-label="Rebuildit feature"><option value="">Choose feature…</option>{domainTypes.map((entry) => <option key={entry.domainType} value={entry.domainType}>{entry.label}</option>)}</SiteSelect><button onClick={() => search()} disabled={busy || !domainType} className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white disabled:opacity-40" aria-label="Search records"><Search className="size-4" /></button></div><input value={query} onChange={(event) => { setQuery(event.target.value); setResults([]); setHasMoreResults(false); }} onKeyDown={(event) => { if (event.key === "Enter") search(); }} placeholder="Search records in this feature" disabled={busy || !domainType} className={`${inputClass} mt-2 w-full`} /></div>
    {busy && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" />Loading linked data…</div>}
    {results.length > 0 && <div className="rounded-lg border border-blue-200 bg-blue-50/40"><p className="border-b border-blue-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700">Search results</p><div className="divide-y divide-blue-100">{results.map((object) => <button key={`${object.domainType}:${object.entityId}`} onClick={() => link(object)} disabled={busy} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-blue-50"><Link2 className="size-4 shrink-0 text-blue-600" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-800">{object.label}</span><span className="block truncate text-xs text-slate-500">{domainTypes.find((entry) => entry.domainType === object.domainType)?.label || object.domainType}</span></span><span className="text-xs font-medium text-blue-700">Link</span></button>)}</div>{hasMoreResults && resultLimit < 250 && <button type="button" onClick={() => search(Math.min(250, resultLimit + 25))} disabled={busy} className="w-full border-t border-blue-100 px-3 py-2 text-left text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-40">Load more records</button>}</div>}
    <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Linked records</p>{refs.length ? <div className="space-y-2">{refs.map((ref) => <article key={ref.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><Link2 className={`size-4 shrink-0 ${ref.health === "healthy" ? "text-emerald-600" : "text-slate-400"}`} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-800">{ref.object?.label || (ref.health === "redacted" ? "Restricted record" : "Unavailable record")}</span><span className="block text-xs text-slate-500">{domainTypes.find((entry) => entry.domainType === ref.domainType)?.label || ref.domainType} · {ref.role}</span></span><button onClick={() => unlink(ref.id)} disabled={busy} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Unlink ${ref.object?.label || "record"}`}><Unlink className="size-4" /></button></article>)}</div> : !busy && <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">No duplicate records here. Link this item to existing operational data.</p>}</div>
  </div>;
}

function ScheduleCascadePanel({ boardId, item, boardItems, columns, setError, onApplied }) {
  const timelineColumns = columns.filter((column) => column.type === "timeline" && !column.readOnly && !column.binding);
  const [timelineColumnId, setTimelineColumnId] = useState(timelineColumns[0]?.id || "");
  const currentTimeline = item.values?.[timelineColumnId] || {};
  const [start, setStart] = useState(currentTimeline.start || "");
  const [end, setEnd] = useState(currentTimeline.end || "");
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const chooseColumn = (columnId) => { const value = item.values?.[columnId] || {}; setTimelineColumnId(columnId); setStart(value.start || ""); setEnd(value.end || ""); setPreview(null); };
  const buildPreview = async () => {
    if (!timelineColumnId || !start || !end) return;
    setBusy(true); setError(""); setPreview(null);
    try { const payload = await api(`/api/work-flow/v1/boards/${boardId}/schedule/preview`, { method: "POST", body: JSON.stringify({ timelineColumnId, changedItemId: item.id, proposedStart: start, proposedEnd: end }) }); setPreview(payload.data.preview); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const apply = async () => {
    if (!preview) return;
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/boards/${boardId}/schedule/apply`, { method: "POST", body: JSON.stringify({ timelineColumnId, changedItemId: item.id, proposedStart: start, proposedEnd: end, fingerprint: preview.fingerprint }) }); setPreview(null); await onApplied(); }
    catch (cause) { setError(cause.message); if (cause.code === "REVISION_CONFLICT") setPreview(null); }
    finally { setBusy(false); }
  };
  if (!timelineColumns.length) return <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600"><p className="font-medium text-slate-800">Schedule cascade unavailable</p><p className="mt-1">Add a writable Timeline column to preview and apply dependency-driven dates.</p></div>;
  return <div className="rounded-lg border border-slate-200 p-3"><div><p className="text-sm font-medium text-slate-800">Reschedule dependencies</p><p className="mt-0.5 text-xs text-slate-500">Review every affected item before dates are changed atomically.</p></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><SiteSelect aria-label="Schedule timeline column" value={timelineColumnId} onChange={(event) => chooseColumn(event.target.value)} className={`${inputClass} sm:col-span-2`}>{timelineColumns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</SiteSelect><label><span className="mb-1 block text-xs font-medium text-slate-500">Start</span><DateInput aria-label="Schedule start" type="date" value={start} onChange={(event) => { setStart(event.target.value); setPreview(null); }} className={`${inputClass} w-full`} /></label><label><span className="mb-1 block text-xs font-medium text-slate-500">End</span><DateInput aria-label="Schedule end" type="date" value={end} onChange={(event) => { setEnd(event.target.value); setPreview(null); }} className={`${inputClass} w-full`} /></label></div><button onClick={buildPreview} disabled={busy || !start || !end || end < start} className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 disabled:opacity-40">{busy ? "Calculating…" : "Preview schedule"}</button>{preview && <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3" role="region" aria-label="Schedule impact preview"><p className="text-sm font-semibold text-slate-800">{preview.changes.length} item{preview.changes.length === 1 ? "" : "s"} will change</p>{preview.changes.length ? <ul className="mt-2 space-y-2">{preview.changes.map((change) => <li key={change.itemId} className="text-xs text-slate-600"><span className="font-medium text-slate-800">{boardItems.find((entry) => entry.id === change.itemId)?.name || "Item"}</span><span className="block">{change.before.start || "—"} → {change.before.end || "—"} becomes {change.proposed.start} → {change.proposed.end}</span></li>)}</ul> : <p className="mt-1 text-xs text-slate-500">The proposed dates already satisfy the schedule.</p>}{preview.conflicts.length > 0 && <div className="mt-3 rounded-md bg-amber-50 p-2 text-xs text-amber-800">{preview.conflicts.length} locked conflict{preview.conflicts.length === 1 ? "" : "s"} must be resolved before applying.</div>}<div className="mt-3 flex justify-end gap-2"><button onClick={() => setPreview(null)} disabled={busy} className="rounded-md px-3 py-2 text-sm font-medium text-slate-600">Cancel</button><button onClick={apply} disabled={busy || preview.conflicts.length > 0 || preview.changes.length === 0} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-40">Apply schedule</button></div></div>}</div>;
}

function DependenciesPanel({ boardId, item, boardItems, columns, setError, onScheduleApplied }) {
  const [dependencies, setDependencies] = useState([]);
  const [targetId, setTargetId] = useState("");
  const [direction, setDirection] = useState("predecessor");
  const [dependencyType, setDependencyType] = useState("finish_start");
  const [lagAmount, setLagAmount] = useState("0");
  const [lagUnit, setLagUnit] = useState("day");
  const [busy, setBusy] = useState(true);
  const candidates = boardItems.filter((entry) => entry.id !== item.id);
  const load = useCallback(async () => { setBusy(true); try { const payload = await api(`/api/work-flow/v1/items/${item.id}/dependencies`); setDependencies(payload.data.dependencies || []); } catch (cause) { setError(cause.message); } finally { setBusy(false); } }, [item.id, setError]);
  useEffect(() => { load(); }, [load]);
  const create = async () => {
    if (!targetId) return;
    setBusy(true); setError("");
    const ids = direction === "predecessor" ? { predecessorItemId: targetId, successorItemId: item.id } : { predecessorItemId: item.id, successorItemId: targetId };
    try { await api(`/api/work-flow/v1/items/${item.id}/dependencies`, { method: "POST", body: JSON.stringify({ ...ids, dependencyType, lagAmount: Number(lagAmount) || 0, lagUnit }) }); setTargetId(""); await load(); }
    catch (cause) { setError(cause.message); setBusy(false); }
  };
  const remove = async (dependency) => {
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/items/${item.id}/dependencies/${dependency.id}`, { method: "DELETE", headers: { "If-Match": `"${dependency.revision}"` } }); await load(); }
    catch (cause) { setError(cause.message); setBusy(false); }
  };
  return <div className="space-y-4"><ScheduleCascadePanel boardId={boardId} item={item} boardItems={boardItems} columns={columns} setError={setError} onApplied={onScheduleApplied} /><div className="rounded-lg border border-slate-200 p-3"><p className="text-sm font-medium text-slate-800">Add a scheduling dependency</p><p className="mt-0.5 text-xs text-slate-500">Cycles are rejected by the server before the dependency is saved.</p><div className="mt-3 grid gap-2 sm:grid-cols-2"><SiteSelect value={direction} onChange={(event) => setDirection(event.target.value)} className={inputClass} aria-label="Dependency direction"><option value="predecessor">This item waits for…</option><option value="successor">This item blocks…</option></SiteSelect><SiteSelect value={targetId} onChange={(event) => setTargetId(event.target.value)} className={inputClass} aria-label="Dependency item"><option value="">Choose an item…</option>{candidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}</SiteSelect><SiteSelect value={dependencyType} onChange={(event) => setDependencyType(event.target.value)} className={inputClass} aria-label="Dependency type"><option value="finish_start">Finish to start</option><option value="start_start">Start to start</option><option value="finish_finish">Finish to finish</option><option value="start_finish">Start to finish</option></SiteSelect><div className="flex gap-2"><input type="number" value={lagAmount} onChange={(event) => setLagAmount(event.target.value)} className={`${inputClass} min-w-0 flex-1`} aria-label="Dependency lag" /><SiteSelect value={lagUnit} onChange={(event) => setLagUnit(event.target.value)} className={inputClass} aria-label="Dependency lag unit"><option value="minute">minutes</option><option value="hour">hours</option><option value="day">days</option><option value="business_day">business days</option><option value="week">weeks</option></SiteSelect></div></div><button onClick={create} disabled={busy || !targetId} className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-40">Add dependency</button></div>{busy && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" />Loading dependencies…</div>}{!busy && !dependencies.length && <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">No scheduling dependencies yet.</p>}{dependencies.map((dependency) => { const otherName = dependency.direction === "incoming" ? dependency.predecessorName : dependency.successorName; return <article key={dependency.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{dependency.direction === "incoming" ? "Waits for" : "Blocks"} {otherName}</p><p className="text-xs text-slate-500">{dependency.dependencyType.replaceAll("_", " → ")} · {dependency.lagAmount} {dependency.lagUnit.replaceAll("_", " ")}{Math.abs(dependency.lagAmount) === 1 ? "" : "s"}</p></div><button onClick={() => remove(dependency)} disabled={busy || dependency.locked} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40" aria-label={`Remove dependency with ${otherName}`}><Trash2 className="size-4" /></button></article>; })}</div>;
}

export function ItemDiscussionDrawer({ boardId, item, boardItems, columns, groups = [], permissions, onMove, onArchive, onTrash, onUndo, onClose, onScheduleApplied, onUpdatesChanged, requestConfirmation, requestText, canViewInvoices = false }) {
  const menuRef = useRef(null);
  const [drawerMenu, setDrawerMenu] = useState("");
  const [participants, setParticipants] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [canManageSubscribers, setCanManageSubscribers] = useState(false);
  const can = (permission) => !Array.isArray(permissions) || permissions.includes(permission);
  const [threads, setThreads] = useState([]);
  const [currentPrincipalId, setCurrentPrincipalId] = useState("");
  const [mentionCandidates, setMentionCandidates] = useState([]);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [history, setHistory] = useState([]);
  const [assets, setAssets] = useState([]);
  const [subscription, setSubscription] = useState("none");
  const [drawerTab, setDrawerTab] = useState("Updates");
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingUpdateId, setEditingUpdateId] = useState("");
  const [editingBody, setEditingBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const loadThreads = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const payload = await api(`/api/work-flow/v1/items/${item.id}/details?boardId=${encodeURIComponent(boardId)}`);
      setThreads(payload.data.threads || []);
      setCurrentPrincipalId(payload.data.currentPrincipalId || "");
      setMentionCandidates(payload.data.mentionCandidates || []);
      setHistory(payload.data.history || []);
      setParticipants(payload.data.participants || []);
      setAssets(payload.data.assets || []);
      setSubscription(payload.data.subscription || "none");
      return (payload.data.threads || []).reduce((total, thread) => total + (thread.updates || []).filter((update) => update.state !== "deleted").length, 0);
    }
    catch (cause) { setError(cause.message); }
    finally { setLoading(false); }
  }, [boardId, item.id]);
  useEffect(() => { loadThreads(); }, [loadThreads]);
  const mentionQuery = message.match(/(?:^|\s)@([^@\n]*)$/)?.[1]?.trim().toLowerCase() || "";
  const matchingMentions = [{ id: "everyone", displayName: "everyone" }, ...mentionCandidates].filter((candidate) => candidate.id !== currentPrincipalId && candidate.displayName?.toLowerCase().includes(mentionQuery)).slice(0, 8);
  const chooseMention = (person) => {
    setMessage((current) => { const prefix = current.replace(/(?:^|\s)@([^@\n]*)$/, "").trimEnd(); return `${prefix ? `${prefix} ` : ""}@${person.displayName} `; });
    setSelectedMentions((current) => current.some((entry) => entry.id === person.id) ? current : [...current, person]);
    setShowMentions(false);
  };
  const post = async () => {
    const bodyText = message.trim();
    if (!bodyText) return;
    setSending(true); setError("");
    try {
      const latest = threads[0];
      const mentionPrincipalIds = selectedMentions.filter((person) => person.id !== "everyone" && bodyText.includes(`@${person.displayName}`)).map((person) => person.id);
      if (latest) await api(`/api/work-flow/v1/threads/${latest.id}/updates`, { method: "POST", body: JSON.stringify({ bodyText, parentUpdateId: replyTo?.id || null, mentionPrincipalIds }) });
      else await api(`/api/work-flow/v1/targets/item/${item.id}/threads`, { method: "POST", body: JSON.stringify({ title: item.name, bodyText, mentionPrincipalIds }) });
      setMessage(""); setReplyTo(null); setSelectedMentions([]); setShowMentions(false); const count = await loadThreads(); onUpdatesChanged?.({ count, delta: 1 });
    } catch (cause) { setError(cause.message); }
    finally { setSending(false); }
  };
  const updates = threads.flatMap((thread) => (thread.updates || []).map((update) => ({ ...update, threadId: thread.id, threadRevision: thread.revision, threadState: thread.state }))).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const react = async (update, reaction) => { setSending(true); setError(""); try { const payload = await api(`/api/work-flow/v1/updates/${update.id}/reaction`, { method: "POST", body: JSON.stringify({ reaction }) }); setThreads((current) => current.map((thread) => ({ ...thread, updates: (thread.updates || []).map((entry) => entry.id === update.id ? { ...entry, reactions: payload.data.reactions || [] } : entry) }))); } catch (cause) { setError(cause.message); } finally { setSending(false); } };
  const saveUpdate = async (update) => { const bodyText = editingBody.trim(); if (!bodyText) return; setSending(true); setError(""); try { await api(`/api/work-flow/v1/updates/${update.id}`, { method: "PATCH", headers: { "If-Match": `"${update.revision}"` }, body: JSON.stringify({ bodyText }) }); setEditingUpdateId(""); setEditingBody(""); await loadThreads(); } catch (cause) { setError(cause.message); } finally { setSending(false); } };
  const removeUpdate = async (update) => { const confirmed = await requestConfirmation({ title: "Delete update", description: "Delete this update from the item discussion?", confirmLabel: "Delete update" }); if (!confirmed) return; setSending(true); setError(""); try { await api(`/api/work-flow/v1/updates/${update.id}`, { method: "DELETE", headers: { "If-Match": `"${update.revision}"` } }); const count = await loadThreads(); onUpdatesChanged?.({ count, delta: -1 }); } catch (cause) { setError(cause.message); } finally { setSending(false); } };
  const toggleResolved = async (thread) => { setSending(true); setError(""); try { await api(`/api/work-flow/v1/threads/${thread.id}`, { method: "PATCH", headers: { "If-Match": `"${thread.revision}"` }, body: JSON.stringify({ resolved: thread.state !== "resolved" }) }); await loadThreads(); } catch (cause) { setError(cause.message); } finally { setSending(false); } };
  const upload = async (file) => {
    if (!file) return;
    setSending(true); setError("");
    try { await uploadWorkFlowFile({ api, path: `/api/work-flow/v1/targets/item/${item.id}/assets`, file }); await loadThreads(); }
    catch (cause) { setError(cause.message); }
    finally { setSending(false); }
  };
  const download = async (asset) => {
    if(asset.version?.previewUrl){const a=document.createElement("a");a.href=asset.version.previewUrl;a.download=asset.version.originalFilename;a.click();return;}
    setSending(true); setError("");
    try {
      const response = await fetch(asset.version.downloadUrl, { method: "POST" });
      if (!response.ok) { const payload = await response.json().catch(() => ({})); throw new Error(payload?.error?.message || "Unable to download attachment."); }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = asset.version.originalFilename; anchor.click(); URL.revokeObjectURL(url);
    } catch (cause) { setError(cause.message); }
    finally { setSending(false); }
  };
  const renameAsset = async (asset) => { const logicalName = await requestText({ title: "Rename attachment", description: "Change the display name without replacing the stored file.", label: "Attachment name", defaultValue: asset.logicalName, submitLabel: "Rename" }); if (!logicalName?.trim() || logicalName.trim() === asset.logicalName) return; setSending(true); setError(""); try { await api(`/api/work-flow/v1/assets/${asset.id}`, { method: "PATCH", headers: { "If-Match": `"${asset.revision}"` }, body: JSON.stringify({ logicalName: logicalName.trim() }) }); await loadThreads(); } catch (cause) { setError(cause.message); } finally { setSending(false); } };
  const uploadAssetVersion = async (asset, file) => { if (!file) return; setSending(true); setError(""); try { await uploadWorkFlowFile({ api, path: `/api/work-flow/v1/assets/${asset.id}/versions`, file, revision: asset.revision }); await loadThreads(); } catch (cause) { setError(cause.message); } finally { setSending(false); } };
  const removeAsset = async (asset) => { const confirmed = await requestConfirmation({ title: "Remove attachment", description: `Remove “${asset.logicalName}” from this task?`, confirmLabel: "Remove attachment" }); if (!confirmed) return; setSending(true); setError(""); try { await api(`/api/work-flow/v1/assets/${asset.id}`, { method: "PATCH", headers: { "If-Match": `"${asset.revision}"` }, body: JSON.stringify({ state: "archived" }) }); await loadThreads(); } catch (cause) { setError(cause.message); } finally { setSending(false); } };
  const toggleFollow = async () => {
    const next = subscription === "none" ? "all" : "none";
    setSending(true); setError("");
    try { await api(`/api/work-flow/v1/subscriptions/item/${item.id}`, { method: "PUT", body: JSON.stringify({ level: next, channels: { inApp: true } }) }); setSubscription(next); }
    catch (cause) { setError(cause.message); }
    finally { setSending(false); }
  };
  const people = [...new Map([...participants, ...updates.map((update) => ({ id: update.authorPrincipalId, label: update.authorName || "Former team member" }))].filter((person) => person.id).map((person) => [person.id, person])).values()];
  const exportUpdates = async () => {
    try { await exportWorkFlowExcel(`${item.name}-updates`, ["Author", "Date", "Update", "State"], updates.map((update) => [update.authorName || "Former team member", update.createdAt, update.state === "deleted" ? "This update was deleted." : update.bodyText, update.state])); }
    catch (cause) { setError(cause.message); }
  };
  const exportActivity = async (events) => {
    try { await exportWorkFlowExcel(`${item.name}-activity`, ["Date", "Person", "Field / action", "Value"], events.map((event) => [event.created_at, event.actorName || people.find((person) => person.id === event.actor_principal_id)?.label || "Former team member", columns.find((column) => column.id === event.column_id)?.label || event.action, activityValue(event.kind === "cell" ? event.value_json : event.after_json, columns.find((column) => column.id === event.column_id))])); }
    catch (cause) { setError(cause.message); }
  };
  const openSubscribers = async () => {
    setDrawerMenu("subscribers"); setSending(true); setError("");
    try { const result = await api(`/api/work-flow/v1/items/${item.id}/subscribers`); setSubscribers(result.data.subscribers || []); setCanManageSubscribers(Boolean(result.data.canManage)); }
    catch (cause) { setError(cause.message); }
    finally { setSending(false); }
  };
  const changeSubscriber = async (principalId, level) => {
    setSending(true); setError("");
    try { await api(`/api/work-flow/v1/items/${item.id}/subscribers`, { method: "PUT", body: JSON.stringify({ principalId, level }) }); if (principalId === currentPrincipalId) setSubscription(level); const result = await api(`/api/work-flow/v1/items/${item.id}/subscribers`); setSubscribers(result.data.subscribers || []); }
    catch (cause) { setError(cause.message); }
    finally { setSending(false); }
  };
  const menuButton = "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm hover:bg-[#f5f6f8] disabled:opacity-40";
  const latestItem = boardItems.find((entry) => entry.id === item.id) || item;
  return <motion.aside initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ type: "spring", stiffness: 360, damping: 36 }} className="workflow-updates-drawer fixed right-0 z-40 flex w-full max-w-[720px] flex-col border-l border-slate-200 bg-white shadow-2xl">
    <header className="flex items-center gap-3 px-5 py-4"><h2 className="min-w-0 flex-1 truncate text-xl font-semibold" title={latestItem.name}>{latestItem.name}</h2>
      <div ref={menuRef} className="flex items-center gap-2">
        {canViewInvoices && <InvoiceLauncher workflowItemId={item.id} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50" />}
        <button type="button" onClick={() => setDrawerMenu(drawerMenu === "people" ? "" : "people")} aria-label={`View ${people.length} row participants`} aria-expanded={drawerMenu === "people"} className="flex -space-x-2 rounded p-1 focus-visible:outline-2 focus-visible:outline-[#0073ea]">{people.slice(0, 3).map((person) => <PersonAvatar key={person.id} person={person} size={28} />)}{people.length > 3 && <span className="grid size-7 place-items-center rounded-full border-2 border-white bg-[#e6e9ef] text-[10px]">+{people.length - 3}</span>}{!people.length && <Users className="size-5 text-[#676879]" />}</button>
        <button onClick={toggleFollow} disabled={sending} className={`rounded-md p-2 ${subscription === "none" ? "text-[#676879]" : "text-[#0073ea]"}`} aria-label={subscription === "none" ? "Follow item" : "Unfollow item"} title={subscription === "none" ? "Follow item" : "Following"}><Bell className="size-4" /></button>
        <button type="button" onClick={() => setDrawerMenu(drawerMenu ? "" : "main")} aria-label="Item discussion options" aria-expanded={Boolean(drawerMenu)} className="rounded-md p-2 text-[#676879] hover:bg-[#f5f6f8]"><MoreHorizontal className="size-5" /></button>
      </div>
      <button type="button" onClick={onClose} className="workflow-updates-close" aria-label="Close item discussion"><X size={18} aria-hidden="true" /></button>
      <AnchoredCellPopover kind={["people", "subscribers"].includes(drawerMenu) ? "dialog" : "menu"} open={Boolean(drawerMenu)} anchorRef={menuRef} onClose={() => setDrawerMenu("")} ariaLabel="Item discussion menu" width={300}><div className="max-h-[65vh] overflow-y-auto p-1.5">
        {drawerMenu === "people" ? <><p className="px-3 py-2 text-sm font-semibold">Row participants</p>{people.map((person) => <div key={person.id} className="flex items-center gap-2 px-3 py-2"><PersonAvatar person={person} size={28} /><span className="truncate text-sm">{person.label}</span></div>)}{!people.length && <p className="px-3 py-3 text-sm text-[#676879]">No participation recorded yet.</p>}</>
        : drawerMenu === "subscribers" ? <><p className="px-3 py-2 text-sm font-semibold">Manage subscribers</p>{sending && <p className="px-3 text-xs text-[#676879]">Updating subscribers…</p>}{[...new Map([...subscribers, ...mentionCandidates.filter((person) => canManageSubscribers || person.id === currentPrincipalId).map((person) => ({ id: person.id, label: person.displayName }))].map((person) => [person.id, person])).values()].map((person) => <label key={person.id} className="flex items-center gap-2 px-3 py-2 text-xs"><span className="min-w-0 flex-1 truncate">{person.label}</span><SiteSelect aria-label={`Notifications for ${person.label}`} value={subscribers.find((entry) => entry.id === person.id)?.level || "none"} disabled={sending || (!canManageSubscribers && person.id !== currentPrincipalId)} onChange={(event) => changeSubscriber(person.id, event.target.value)} className="h-8 max-w-36 rounded border border-[#d0d4e4] bg-white px-1"><option value="none">Off</option><option value="mentions">Mentions</option><option value="participating">Participating</option><option value="all">All updates</option></SiteSelect></label>)}</>
        : drawerMenu === "move" ? <><button className={menuButton} onClick={() => setDrawerMenu("main")}><ArrowLeft className="size-4" />Back</button>{groups.map((group) => <button key={group.id} disabled={sending || group.id === latestItem.groupId} className={menuButton} onClick={async () => { setSending(true); try { await onMove(group.id); setDrawerMenu(""); } catch (cause) { setError(cause.message); } finally { setSending(false); } }}><Folder className="size-4" />{group.title}</button>)}</>
        : <><button className={menuButton} onClick={openSubscribers}><Users className="size-4 text-[#676879]" />Manage subscribers</button><div className="my-1 border-t border-[#e6e9ef]" /><button className={menuButton} onClick={() => { exportUpdates(); setDrawerMenu(""); }}><Download className="size-4 text-[#676879]" />Export updates to Excel</button><div className="my-1 border-t border-[#e6e9ef]" /><button className={menuButton} disabled={!can("item.update") || !onMove} onClick={() => setDrawerMenu("move")}><ArrowRight className="size-4 text-[#676879]" />Move to<ChevronDown className="ml-auto size-4 -rotate-90" /></button><button className={menuButton} onClick={async () => { try { const url = new URL(window.location.href); url.searchParams.set("board", boardId); url.searchParams.set("target", `item:${item.id}`); await navigator.clipboard.writeText(url.toString()); setDrawerMenu(""); } catch { setError("Unable to copy the row link."); } }}><Link2 className="size-4 text-[#676879]" />Copy row link</button><div className="my-1 border-t border-[#e6e9ef]" /><button disabled={!can("item.archive") || !onArchive} className={menuButton} onClick={() => { onArchive(); setDrawerMenu(""); }}><Archive className="size-4 text-[#676879]" />Archive</button><button disabled={!can("item.trash") || !onTrash} className={`${menuButton} text-[#d83a52]`} onClick={() => { onTrash(); setDrawerMenu(""); }}><Trash2 className="size-4" />Delete</button></>}
      </div></AnchoredCellPopover>
    </header>
    <nav className="flex gap-5 overflow-x-auto border-b border-slate-200 px-4 pt-3 text-sm">{["Updates", "Activity", "Files", "Linked records", "Dependencies"].map((tab) => <button key={tab} onClick={() => setDrawerTab(tab)} className={`relative whitespace-nowrap pb-3 ${drawerTab === tab ? "font-medium text-blue-700" : "text-slate-500"}`}>{tab === "Activity" ? "Activity Log" : tab}{tab === "Updates" ? ` / ${updates.filter((update) => update.state !== "deleted").length}` : ""}{tab === "Files" && assets.length ? ` (${assets.length})` : ""}{drawerTab === tab && <motion.span layoutId="work-flow-thread-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />}</button>)}</nav>
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {drawerTab === "Dependencies" ? <DependenciesPanel boardId={boardId} item={item} boardItems={boardItems} columns={columns} setError={setError} onScheduleApplied={onScheduleApplied} />
        : drawerTab === "Linked records" ? <LinkedRecordsPanel itemId={item.id} setError={setError} />
        : loading ? <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" />Loading item details…</div>
        : drawerTab === "Files" ? <>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 px-4 py-5 text-sm font-medium text-slate-600 hover:border-blue-300 hover:bg-blue-50"><Upload className="size-4" />Attach a file<input type="file" className="sr-only" disabled={sending} onChange={(event) => { upload(event.target.files?.[0]); event.target.value = ""; }} /></label>
          {assets.length ? assets.map((asset) => <article key={asset.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500"><Paperclip className="size-4" /></div><div className="min-w-0 flex-1"><WorkFlowFilePreview asset={asset} onDownload={download} fullWidth /><p className="text-xs text-slate-400">{Math.max(1, Math.round((asset.version?.sizeBytes || 0) / 1024))} KB · version {asset.version?.versionNumber || 1} · {asset.version?.originalFilename}</p></div><label className="cursor-pointer rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label={`Upload new version of ${asset.logicalName}`} title="Upload new version"><Upload className="size-4" /><input type="file" className="sr-only" disabled={sending} onChange={(event) => { uploadAssetVersion(asset, event.target.files?.[0]); event.target.value = ""; }} /></label><button onClick={() => renameAsset(asset)} disabled={sending} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label={`Rename ${asset.logicalName}`}><Settings2 className="size-4" /></button><button onClick={() => download(asset)} disabled={sending || asset.version?.scanStatus !== "clean"} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40" aria-label={`Download ${asset.logicalName}`}><Download className="size-4" /></button><button onClick={() => removeAsset(asset)} disabled={sending} className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${asset.logicalName}`}><Trash2 className="size-4" /></button></article>) : <p className="py-8 text-center text-sm text-slate-500">No files are attached to this item.</p>}
        </> : drawerTab === "Activity" ? <WorkFlowActivityLog events={history} participants={people} columns={columns} item={latestItem} busy={sending} onRefresh={loadThreads} onExport={exportActivity} onUndo={can("item.update") && onUndo ? async (column, value) => { setSending(true); try { await onUndo(column, value); await loadThreads(); } catch (cause) { setError(cause.message); } finally { setSending(false); } } : undefined} />
        : updates.length ? <>
          {threads[0] && <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><span className="text-xs font-medium text-slate-600">{threads[0].state === "resolved" ? "Discussion resolved" : "Open discussion"}</span><button onClick={() => toggleResolved(threads[0])} disabled={sending} className="text-xs font-medium text-blue-700">{threads[0].state === "resolved" ? "Reopen" : "Resolve"}</button></div>}
          {updates.map((update) => <article key={update.id} className={`rounded-lg border p-3 ${update.parentUpdateId ? "ml-6 border-l-4 border-l-blue-200" : "border-slate-200"}`}>
            <div className="mb-3 flex items-center gap-2"><PersonAvatar person={{ id: update.authorPrincipalId, label: update.authorName || "Former team member" }} size={30} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#323338]">{update.authorName || "Former team member"}</p><p className="text-xs text-[#9799a6]">{new Date(update.createdAt).toLocaleString()}{update.state === "edited" ? " · edited" : ""}</p></div></div>
            {editingUpdateId === update.id ? <div><textarea autoFocus value={editingBody} onChange={(event) => setEditingBody(event.target.value)} rows={3} className="w-full resize-none rounded-md border border-[#0073ea] p-2 text-sm outline-none ring-2 ring-[#cce5ff]" /><div className="mt-2 flex justify-end gap-2"><button onClick={() => { setEditingUpdateId(""); setEditingBody(""); }} className="rounded-md px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100">Cancel</button><button onClick={() => saveUpdate(update)} disabled={sending || !editingBody.trim()} className="rounded-md bg-[#0073ea] px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-40">Save</button></div></div> : <p className={`whitespace-pre-wrap text-sm ${update.state === "deleted" ? "italic text-slate-400" : "text-slate-800"}`}>{update.state === "deleted" ? "This update was deleted." : <WorkFlowMentionText text={update.bodyText} people={[...mentionCandidates, ...(update.mentions || [])]} />}</p>}
            {update.state !== "deleted" && editingUpdateId !== update.id && <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#e6e9ef] pt-2"><button onClick={() => { setReplyTo(update); setMessage(""); }} className="rounded px-1.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100">Reply</button>{update.authorPrincipalId === currentPrincipalId && <><button onClick={() => { setEditingUpdateId(update.id); setEditingBody(update.bodyText); }} className="rounded px-1.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100">Edit</button><button onClick={() => removeUpdate(update)} className="rounded px-1.5 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600">Delete</button></>}{[{ id: "like", icon: "👍" }, { id: "celebrate", icon: "🎉" }, { id: "support", icon: "❤️" }].map(({ id, icon }) => { const reaction = update.reactions?.find((entry) => entry.reaction === id); return <button key={id} onClick={() => react(update, id)} disabled={sending} aria-label={`${id} reaction`} className={`rounded-full border px-2 py-0.5 text-xs ${reaction?.reactedByMe ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}>{icon}{reaction?.count ? ` ${reaction.count}` : ""}</button>; })}</div>}
          </article>)}
        </> : <p className="py-10 text-center text-sm text-slate-500">No updates yet. Start the discussion with context, a decision, or a question.</p>}
    </div>
    {drawerTab === "Updates" && <footer className="border-t border-slate-200 p-4">
      {replyTo && <div className="mb-2 flex items-center justify-between rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-800"><span className="truncate">Replying to: {replyTo.bodyText}</span><button onClick={() => setReplyTo(null)} className="ml-2 font-medium">Cancel</button></div>}
      <div className="relative">
        {<AnimatePresence>{showMentions && <AnimatedMenu onDismiss={()=>setShowMentions(false)} role="listbox" aria-label="Mention a team member" className="absolute bottom-full left-0 z-50 mb-2 max-h-56 w-72 overflow-y-auto rounded-lg border border-[#d0d4e4] bg-white p-1 shadow-xl">
          {matchingMentions.length ? matchingMentions.map((person) => <button key={person.id} type="button" role="option" aria-selected="false" onClick={() => chooseMention(person)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-[#f5f6f8]"><PersonAvatar person={{ id: person.id, label: person.displayName }} size={26} /><span className="truncate">{person.displayName}</span></button>) : <p className="px-2 py-3 text-sm text-[#676879]">No available team members match.</p>}
        </AnimatedMenu>}</AnimatePresence>}
        <div className="overflow-hidden rounded-md border border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <textarea value={message} onChange={(event) => { setMessage(event.target.value); setShowMentions(/(?:^|\s)@[^@\n]*$/.test(event.target.value)); }} onKeyDown={(event) => { if (event.key === "Escape") setShowMentions(false); if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); post(); } else if (showMentions && event.key === "Enter" && !event.shiftKey && matchingMentions[0]) { event.preventDefault(); chooseMention(matchingMentions[0]); } }} placeholder={replyTo ? "Write a reply and mention others with @" : "Write an update and mention others with @"} rows={5} className="w-full resize-none border-0 p-3 text-sm outline-none" />
          <div className="flex items-center gap-1 border-t border-slate-200 px-2 py-1.5"><button onClick={() => { setMessage((current) => `${current}${current && !current.endsWith(" ") ? " " : ""}@`); setShowMentions(true); }} className="grid size-8 place-items-center rounded-md text-sm font-semibold text-[#676879] hover:bg-[#f5f6f8]" aria-label="Mention someone">@</button><label className="grid size-8 cursor-pointer place-items-center rounded-md text-[#676879] hover:bg-[#f5f6f8]" aria-label="Attach file"><Paperclip className="size-4" /><input type="file" className="sr-only" disabled={sending} onChange={(event) => { upload(event.target.files?.[0]); event.target.value = ""; }} /></label><button onClick={() => setMessage((current) => `${current}🙂`)} className="grid size-8 place-items-center rounded-md text-sm text-[#676879] hover:bg-[#f5f6f8]" aria-label="Add emoji">🙂</button><button onClick={() => setMessage((current) => `${current}${current && !current.endsWith("\n") ? "\n" : ""}- [ ] `)} className="grid size-8 place-items-center rounded-md text-xs font-semibold text-[#676879] hover:bg-[#f5f6f8]" aria-label="Add checklist">☑</button><button onClick={() => setMessage((current) => `${current}**bold**`)} className="grid size-8 place-items-center rounded-md text-sm font-bold text-[#676879] hover:bg-[#f5f6f8]" aria-label="Add bold text">B</button><span className="ml-1 text-xs text-slate-400">⌘ Enter to post</span><button onClick={post} disabled={sending || !message.trim()} className="ml-auto inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"><Send className="size-4" />{replyTo ? "Post reply" : "Post update"}</button></div>
        </div>
      </div>
    </footer>}
  </motion.aside>;
}

function BoardDiscussionDrawer({ board, onClose }) {
  const [threads, setThreads] = useState([]);
  const [message, setMessage] = useState("");
  const [subscription, setSubscription] = useState("none");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const [threadPayload, subscriptionPayload] = await Promise.all([api(`/api/work-flow/v1/targets/board/${board.id}/threads`), api(`/api/work-flow/v1/subscriptions/board/${board.id}`)]); setThreads(threadPayload.data.threads || []); setSubscription(subscriptionPayload.data.subscription?.level || "none"); }
    catch (cause) { setError(cause.message); }
    finally { setLoading(false); }
  }, [board.id]);
  useEffect(() => { load(); }, [load]);
  const post = async () => {
    const bodyText = message.trim(); if (!bodyText) return;
    setSending(true); setError("");
    try { const latest = threads[0]; if (latest) await api(`/api/work-flow/v1/threads/${latest.id}/updates`, { method: "POST", body: JSON.stringify({ bodyText }) }); else await api(`/api/work-flow/v1/targets/board/${board.id}/threads`, { method: "POST", body: JSON.stringify({ title: `${board.name} board discussion`, bodyText }) }); setMessage(""); await load(); }
    catch (cause) { setError(cause.message); }
    finally { setSending(false); }
  };
  const toggleFollow = async () => { const next = subscription === "none" ? "all" : "none"; setSending(true); try { await api(`/api/work-flow/v1/subscriptions/board/${board.id}`, { method: "PUT", body: JSON.stringify({ level: next, channels: { inApp: true } }) }); setSubscription(next); } catch (cause) { setError(cause.message); } finally { setSending(false); } };
  const updates = threads.flatMap((thread) => thread.updates || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return <motion.aside initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ type: "spring", stiffness: 360, damping: 36 }} className="fixed inset-y-0 right-0 z-[120] flex w-full max-w-[720px] flex-col border-l border-[#d0d4e4] bg-white shadow-2xl"><header className="flex items-center gap-3 border-b border-[#d0d4e4] p-5"><span className="grid size-10 place-items-center rounded-lg bg-[#e6f4ff] text-[#0073ea]"><MessageSquare className="size-5" /></span><div className="min-w-0 flex-1"><h2 className="truncate text-lg font-semibold">{board.name}</h2><p className="text-sm text-[#676879]">Board discussion</p></div><button onClick={toggleFollow} disabled={sending} className={`rounded-md border px-3 py-1.5 text-sm font-medium ${subscription === "none" ? "border-[#c3c6d4]" : "border-[#0073ea] bg-[#e6f4ff] text-[#0060b9]"}`}>{subscription === "none" ? "Follow" : "Following"}</button><button onClick={onClose} className="work-flow-icon-button" aria-label="Close board discussion"><X className="size-5" /></button></header><div className="min-h-0 flex-1 overflow-y-auto p-5">{error && <p className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}{loading ? <div className="flex items-center gap-2 text-sm text-[#676879]"><Loader2 className="size-4 animate-spin" />Loading discussion…</div> : updates.length ? <div className="space-y-3">{updates.map((update) => <article key={update.id} className="rounded-lg border border-[#d0d4e4] bg-white p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-[#323338]"><WorkFlowMentionText text={update.bodyText} people={update.mentions || []} /></p><p className="mt-3 text-xs text-[#9799a6]">{update.author?.name || "Team member"} · {new Date(update.createdAt).toLocaleString()}</p></article>)}</div> : <div className="py-20 text-center"><MessageSquare className="mx-auto mb-3 size-8 text-[#c3c6d4]" /><p className="font-medium">Start the board discussion</p><p className="mt-1 text-sm text-[#676879]">Share decisions and context that apply to the whole board.</p></div>}</div><footer className="border-t border-[#d0d4e4] p-4"><div className="overflow-hidden rounded-lg border border-[#c3c6d4] focus-within:border-[#0073ea] focus-within:ring-1 focus-within:ring-[#0073ea]"><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") post(); }} rows={5} placeholder="Write an update and mention others with @" className="w-full resize-none border-0 p-3 text-sm outline-none" /><div className="flex items-center gap-1 border-t border-[#e6e9ef] p-2"><button onClick={() => setMessage((current) => `${current}${current && !current.endsWith(" ") ? " " : ""}@`)} aria-label="Mention someone" className="grid size-8 place-items-center rounded-md font-semibold text-[#676879] hover:bg-[#f5f6f8]">@</button><button onClick={() => setMessage((current) => `${current}🙂`)} aria-label="Add emoji" className="grid size-8 place-items-center rounded-md hover:bg-[#f5f6f8]">🙂</button><span className="ml-1 text-xs text-[#9799a6]">⌘ Enter to post</span><button onClick={post} disabled={sending || !message.trim()} className="ml-auto inline-flex items-center gap-2 rounded-md bg-[#0073ea] px-3 py-2 text-sm font-medium text-white disabled:opacity-40"><Send className="size-4" />Post update</button></div></div></footer></motion.aside>;
}

function FormsSurface({ data, busy, setBusy, setError, requestText }) {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [receipt, setReceipt] = useState(null);
  const [designerOpen, setDesignerOpen] = useState(false);
  const writableColumns = data.columns.filter((column) => !column.readOnly);
  const [formDraft, setFormDraft] = useState(() => ({ name: `${data.board.name} intake`, groupId: data.groups[0]?.id || "", fieldIds: data.columns.filter((column) => !column.readOnly).map((column) => column.id), requiredIds: data.columns.filter((column) => !column.readOnly && column.required).map((column) => column.id), responseLimit: "", submitLabel: "Submit" }));
  const load = useCallback(async () => { const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/forms`); setForms(payload.data.forms || []); }, [data.board.id]);
  useEffect(() => { load().catch((cause) => setError(cause.message)); }, [load, setError]);
  const create = async () => {
    if (!formDraft.name.trim()) return;
    const fields = writableColumns.filter((column) => formDraft.fieldIds.includes(column.id)).map((column) => ({ key: column.stableKey || column.id, columnId: column.id, label: column.label, required: formDraft.requiredIds.includes(column.id) }));
    if (!fields.length) { setError("This board has no writable columns for a form."); return; }
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/boards/${data.board.id}/forms`, { method: "POST", body: JSON.stringify({ name: formDraft.name.trim(), fields, destination: { groupId: formDraft.groupId }, presentation: { submitLabel: formDraft.submitLabel }, responseLimit: formDraft.responseLimit ? Number(formDraft.responseLimit) : null }) }); setDesignerOpen(false); await load(); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const submit = async () => {
    setBusy(true); setError(""); setReceipt(null);
    try { const payload = await api(`/api/work-flow/v1/forms/${selectedForm.id}/submissions`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ answers }) }); setReceipt(payload.data.submission); setAnswers({}); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  return <><div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]"><div className="rounded-lg border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-200 p-4"><div><h2 className="font-semibold">Forms</h2><p className="text-sm text-slate-500">Published intake definitions for this board.</p></div><button onClick={() => setDesignerOpen(true)} disabled={busy} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">New form</button></div><div className="divide-y divide-slate-100">{forms.length ? forms.map((form) => <button key={form.id} onClick={() => { setSelectedForm(form); setAnswers({}); setReceipt(null); }} className={`flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50 ${selectedForm?.id === form.id ? "bg-blue-50" : ""}`}><FileInput className="size-5 text-slate-400" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{form.name}</p><p className="text-xs text-slate-500">{form.activeVersion?.fields?.length || 0} fields · {form.state}</p></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">Published</span></button>) : <button onClick={() => setDesignerOpen(true)} className="w-full p-10 text-center text-sm text-slate-500 hover:bg-slate-50">Create a form mapped to this board’s typed columns.</button>}</div></div>{selectedForm ? <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="mb-4"><h3 className="font-semibold">{selectedForm.name}</h3><p className="text-xs text-slate-500">Responses create typed items in {data.board.name}.</p>{selectedForm.publicPath && <a href={selectedForm.publicPath} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#0073ea] hover:underline">Open public form <ExternalLink className="size-3" /></a>}</div>{receipt ? <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><p className="font-medium">Response accepted</p><p className="mt-1">A new board item was created and linked to submission {receipt.id.slice(0, 8)}.</p><button onClick={() => setReceipt(null)} className="mt-3 font-medium underline">Submit another</button></div> : <div className="space-y-4">{(selectedForm.activeVersion?.fields || []).map((field) => { const column = data.columns.find((entry) => entry.id === field.columnId); const options = column?.settings?.options || []; return <label key={field.key} className="block"><span className="mb-1 block text-sm font-medium text-slate-700">{field.label || column?.label || field.key}{field.required && <span className="text-red-500"> *</span>}</span>{column?.type === "boolean" ? <input type="checkbox" checked={Boolean(answers[field.key])} onChange={(event) => setAnswers((current) => ({ ...current, [field.key]: event.target.checked }))} className="size-4 accent-blue-600" /> : column?.type === "status" ? <SiteSelect value={answers[field.key] || ""} onChange={(event) => setAnswers((current) => ({ ...current, [field.key]: event.target.value }))} className={`${inputClass} w-full`}><option value="">Select…</option>{options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</SiteSelect> : <DateInput type={column?.type === "date" ? "date" : ["decimal", "integer", "percent", "duration", "rating"].includes(column?.type) ? "number" : column?.type === "email" ? "email" : "text"} value={answers[field.key] || ""} onChange={(event) => setAnswers((current) => ({ ...current, [field.key]: event.target.value }))} className={`${inputClass} w-full`} />}</label>; })}<button onClick={submit} disabled={busy} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{selectedForm.activeVersion?.presentation?.submitLabel || "Submit response"}</button></div>}</div> : <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Select a form to preview and submit it.</div>}</div>{designerOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label="Form designer"><div className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#d0d4e4] px-6 py-5"><div><h2 className="text-xl font-semibold">Create form</h2><p className="mt-1 text-sm text-[#676879]">Choose which board fields respondents can complete.</p></div><button onClick={() => setDesignerOpen(false)} className="work-flow-icon-button" aria-label="Close form designer"><X className="size-5" /></button></header><div className="space-y-4 overflow-y-auto p-6"><label className="block"><span className="mb-1 block text-sm font-medium">Form name</span><input autoFocus value={formDraft.name} onChange={(event) => setFormDraft((current) => ({ ...current, name: event.target.value }))} className={`${inputClass} w-full`} /></label><label className="block"><span className="mb-1 block text-sm font-medium">Responses go to</span><SiteSelect value={formDraft.groupId} onChange={(event) => setFormDraft((current) => ({ ...current, groupId: event.target.value }))} className={`${inputClass} w-full`}>{data.groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}</SiteSelect></label><div><p className="mb-2 text-sm font-medium">Form fields</p><div className="divide-y rounded-lg border border-[#d0d4e4]">{writableColumns.map((column) => { const included = formDraft.fieldIds.includes(column.id); return <div key={column.id} className="flex items-center gap-3 px-3 py-2.5"><input type="checkbox" checked={included} onChange={() => setFormDraft((current) => ({ ...current, fieldIds: included ? current.fieldIds.filter((id) => id !== column.id) : [...current.fieldIds, column.id] }))} aria-label={`Include ${column.label}`} /><span className="min-w-0 flex-1 truncate text-sm">{column.label}</span><label className="flex items-center gap-1.5 text-xs text-[#676879]"><input type="checkbox" disabled={!included} checked={formDraft.requiredIds.includes(column.id)} onChange={() => setFormDraft((current) => ({ ...current, requiredIds: current.requiredIds.includes(column.id) ? current.requiredIds.filter((id) => id !== column.id) : [...current.requiredIds, column.id] }))} />Required</label></div>; })}</div></div><div className="grid grid-cols-2 gap-3"><label><span className="mb-1 block text-sm font-medium">Submit button</span><input value={formDraft.submitLabel} onChange={(event) => setFormDraft((current) => ({ ...current, submitLabel: event.target.value }))} className={`${inputClass} w-full`} /></label><label><span className="mb-1 block text-sm font-medium">Response limit</span><input type="number" min="1" value={formDraft.responseLimit} onChange={(event) => setFormDraft((current) => ({ ...current, responseLimit: event.target.value }))} className={`${inputClass} w-full`} placeholder="Unlimited" /></label></div></div><footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-6 py-4"><button onClick={() => setDesignerOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8]">Cancel</button><button onClick={create} disabled={busy || !formDraft.name.trim() || !formDraft.fieldIds.length || !formDraft.groupId} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Publish form</button></footer></div></div>}</>;
}

function WorkFlowDetailList({ value, depth = 0 }) {
  if (value === null || value === undefined || value === "") return <span className="text-[#9799a6]">—</span>;
  if (typeof value !== "object") return <span className="break-words">{typeof value === "boolean" ? value ? "Yes" : "No" : String(value)}</span>;
  const entries = Array.isArray(value) ? value.map((entry, index) => [String(index + 1), entry]) : Object.entries(value);
  if (!entries.length) return <span className="text-[#9799a6]">No details</span>;
  if (depth >= 3) return <span className="text-[#676879]">{entries.length} {entries.length === 1 ? "detail" : "details"}</span>;
  return <dl className="divide-y divide-[#e6e9ef] rounded-md border border-[#e6e9ef] bg-white">{entries.map(([key, entry]) => <div key={key} className="grid gap-1 px-3 py-2 sm:grid-cols-[8rem_minmax(0,1fr)]"><dt className="text-xs font-medium capitalize text-[#676879]">{Array.isArray(value) ? `Item ${key}` : key.replaceAll("_", " ").replace(/([a-z])([A-Z])/g, "$1 $2")}</dt><dd className="min-w-0 text-xs text-[#323338]"><WorkFlowDetailList value={entry} depth={depth + 1} /></dd></div>)}</dl>;
}

function AutomationRunsDrawer({ automation, onClose, setError }) {
  const [executions, setExecutions] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    api(`/api/work-flow/v1/automations/${automation.id}/executions?limit=100`).then((payload) => {
      if (!active) return;
      const rows = payload.data.executions || [];
      setExecutions(rows);
      setSelectedId(rows[0]?.id || "");
    }).catch((cause) => { if (active) setError(cause.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [automation.id, setError]);
  const selected = executions.find((execution) => execution.id === selectedId) || executions[0] || null;
  const statusClass = (status) => status === "succeeded" ? "bg-[#dff7ed] text-[#00854a]" : status === "failed" ? "bg-[#ffe6e9] text-[#d83a52]" : status?.startsWith("waiting") ? "bg-[#fff4dd] text-[#9b6500]" : "bg-[#e6f4ff] text-[#0060b9]";
  const duration = (entry) => entry?.startedAt && entry?.finishedAt ? `${Math.max(0, new Date(entry.finishedAt) - new Date(entry.startedAt))} ms` : "—";
  return <div className="fixed inset-0 z-[125] bg-[#323338]/30" role="dialog" aria-modal="true" aria-label={`${automation.name} run history`}><motion.aside initial={{ x: 760 }} animate={{ x: 0 }} exit={{ x: 760 }} transition={{ type: "spring", stiffness: 340, damping: 36 }} className="ml-auto flex h-full w-full max-w-4xl flex-col bg-white shadow-2xl"><header className="flex items-center gap-3 border-b border-[#d0d4e4] px-5 py-4"><span className="grid size-10 place-items-center rounded-lg bg-[#e6f4ff] text-[#0073ea]"><History className="size-5" /></span><div className="min-w-0 flex-1"><h2 className="truncate text-lg font-semibold">{automation.name}</h2><p className="text-sm text-[#676879]">Run history and step inspection</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close automation run history"><X className="size-5" /></button></header><div className="grid min-h-0 flex-1 md:grid-cols-[320px_minmax(0,1fr)]"><div className="overflow-y-auto border-r border-[#d0d4e4]">{loading ? <div className="flex items-center gap-2 p-5 text-sm text-[#676879]"><Loader2 className="size-4 animate-spin" />Loading runs…</div> : executions.length ? executions.map((execution) => <button key={execution.id} onClick={() => setSelectedId(execution.id)} className={`block w-full border-b border-[#e6e9ef] p-4 text-left hover:bg-[#f5f6f8] ${selected?.id === execution.id ? "bg-[#e6f4ff]" : ""}`}><span className="flex items-center justify-between gap-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusClass(execution.status)}`}>{execution.status.replaceAll("_", " ")}</span><span className="text-[11px] text-[#9799a6]">v{execution.versionNumber || "—"}</span></span><p className="mt-2 text-sm font-medium text-[#323338]">{new Date(execution.createdAt).toLocaleString()}</p><p className="mt-1 truncate text-xs text-[#676879]">{execution.actor?.name || "System"} · {duration(execution)}</p></button>) : <div className="p-8 text-center text-sm text-[#676879]">No runs recorded yet.</div>}</div><div className="min-w-0 overflow-y-auto p-5">{selected ? <div className="space-y-5"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass(selected.status)}`}>{selected.status.replaceAll("_", " ")}</span><span className="text-xs text-[#676879]">Correlation {String(selected.correlationId || selected.id).slice(0, 8)}</span><span className="text-xs text-[#676879]">{duration(selected)}</span></div>{selected.error && <div className="flex gap-2 rounded-lg border border-[#e2445c]/30 bg-[#ffe6e9] p-3 text-sm text-[#b5263d]"><CircleAlert className="mt-0.5 size-4 shrink-0" /><div><p className="font-medium">{selected.error.message || "Execution failed"}</p><p className="mt-1 text-xs">{selected.error.code || "AUTOMATION_FAILED"}{selected.error.stepKey ? ` · ${selected.error.stepKey}` : ""}</p></div></div>}<section><h3 className="mb-2 text-sm font-semibold text-[#323338]">Steps</h3><div className="overflow-hidden rounded-lg border border-[#d0d4e4]">{selected.steps?.length ? selected.steps.map((step, index) => <article key={step.id || step.key} className="border-b border-[#e6e9ef] p-4 last:border-b-0"><div className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-[#f5f6f8] text-xs font-semibold text-[#676879]">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{step.key}</p><p className="text-xs text-[#676879]">{step.type.replaceAll("_", " ")} · {step.attempts} attempt{step.attempts === 1 ? "" : "s"} · {duration(step)}</p></div><span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusClass(step.status)}`}>{step.status.replaceAll("_", " ")}</span></div>{step.error?.message && <p className="mt-2 rounded bg-[#ffe6e9] px-3 py-2 text-xs text-[#b5263d]">{step.error.message}</p>}{step.output && <details className="mt-2"><summary className="cursor-pointer text-xs font-medium text-[#0073ea]">View output</summary><div className="mt-2 max-h-48 overflow-auto"><WorkFlowDetailList value={step.output} /></div></details>}</article>) : <p className="p-4 text-sm text-[#676879]">No step records were captured.</p>}</div></section><details><summary className="cursor-pointer text-sm font-medium text-[#0073ea]">Execution input and output</summary><div className="mt-2 max-h-72 overflow-auto"><WorkFlowDetailList value={{ input: selected.input, output: selected.output }} /></div></details></div> : !loading && <div className="py-20 text-center text-sm text-[#676879]">Run this automation to inspect its execution here.</div>}</div></div></motion.aside></div>;
}

function AutomationsSurface({ data, busy, setBusy, setError, requestText }) {
  const [automations, setAutomations] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState({ smsInboxes: [], emailConfigured: false });
  const [lastRun, setLastRun] = useState(null);
  const [historyAutomation, setHistoryAutomation] = useState(null);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiDraft, setAiDraft] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const emptyDraft = { name: "", triggerType: "item.created", triggerColumnId: "", triggerValue: "", frequency: "daily", scheduleTime: "09:00", weekday: "Mon", dayOfMonth: "1", actionType: "notify", columnId: "", value: "", message: "", groupId: data.groups[0]?.id || "", itemName: "", delaySeconds: "300", smsInboxId: "", recipientColumnId: "", recipient: "", subject: "" };
  const [draft, setDraft] = useState(emptyDraft);
  const load = useCallback(async () => { const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/automations`); setAutomations(payload.data.automations || []); setDeliveryOptions(payload.data.deliveryOptions || { smsInboxes: [], emailConfigured: false }); }, [data.board.id]);
  useEffect(() => { load().catch((cause) => setError(cause.message)); }, [load, setError]);
  const create = async () => {
    if (!draft.name.trim()) return;
    const step = draft.actionType === "set_cell" ? { key: "set_cell", type: "set_cell", columnId: draft.columnId, value: draft.value }
      : draft.actionType === "create_update" ? { key: "create_update", type: "create_update", bodyText: draft.message || draft.name }
      : draft.actionType === "create_item" ? { key: "create_item", type: "create_item", name: draft.itemName || draft.name, groupId: draft.groupId }
      : draft.actionType === "move_item" ? { key: "move_item", type: "move_item", groupId: draft.groupId }
      : draft.actionType === "archive_item" ? { key: "archive_item", type: "archive_item" }
      : draft.actionType === "delay" ? { key: "delay", type: "delay", durationSeconds: Number(draft.delaySeconds) }
      : draft.actionType === "send_sms" ? { key: "send_sms", type: "send_sms", inboxId: draft.smsInboxId, ...(draft.recipientColumnId ? { recipientColumnId: draft.recipientColumnId } : { to: draft.recipient }), message: draft.message }
      : draft.actionType === "send_email" ? { key: "send_email", type: "send_email", ...(draft.recipientColumnId ? { recipientColumnId: draft.recipientColumnId } : { to: draft.recipient }), subject: draft.subject, message: draft.message }
      : { key: draft.actionType, type: draft.actionType, audience: "board_subscribers", message: draft.message || `Automation: ${draft.name}` };
    const triggerColumnId = draft.triggerColumnId || (draft.triggerType === "date.reached" ? data.columns.find((column) => ["date", "datetime"].includes(column.type))?.id : draft.triggerType.startsWith("status.") ? data.columns.find((column) => column.type === "status")?.id : data.columns.find((column) => !column.readOnly && column.type !== "name")?.id);
    const trigger = { type: draft.triggerType, ...(["cell.changed", "status.entered", "status.left", "assignment.changed", "date.reached"].includes(draft.triggerType) && triggerColumnId ? { columnId: triggerColumnId } : {}), ...(["status.entered", "status.left"].includes(draft.triggerType) && draft.triggerValue ? { value: draft.triggerValue } : {}), ...(draft.triggerType === "schedule.recurring" ? { frequency: draft.frequency, time: draft.scheduleTime, ...(draft.frequency === "weekly" ? { weekday: draft.weekday } : {}), ...(draft.frequency === "monthly" ? { dayOfMonth: Number(draft.dayOfMonth) } : {}) } : {}) };
    const steps = draft.actionType === "delay" ? [step, { key: "notify_after_delay", type: "notify", audience: "board_subscribers", message: draft.message || `Automation resumed: ${draft.name}` }] : [step];
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/boards/${data.board.id}/automations`, { method: "POST", body: JSON.stringify({ name: draft.name.trim(), enabled: true, trigger, steps }) }); setDesignerOpen(false); setDraft(emptyDraft); await load(); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const composeWithAi = async () => {
    if (aiPrompt.trim().length < 3) return;
    setAiBusy(true); setError(""); setAiDraft(null);
    try { const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/automations/compose`, { method: "POST", body: JSON.stringify({ prompt: aiPrompt.trim() }) }); setAiDraft(payload.data); }
    catch (cause) { setError(cause.message); }
    finally { setAiBusy(false); }
  };
  const publishAiDraft = async () => {
    if (!aiDraft?.draft) return;
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/boards/${data.board.id}/automations`, { method: "POST", body: JSON.stringify(aiDraft.draft) }); setDesignerOpen(false); setAiDraft(null); setAiPrompt(""); await load(); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const run = async (automationId, itemId = "") => { setBusy(true); setError(""); setLastRun(null); try { const payload = await api(`/api/work-flow/v1/automations/${automationId}/execute`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ input: { boardId: data.board.id, ...(itemId ? { itemId } : {}) } }) }); setLastRun(payload.data.execution); if (payload.data.execution.status === "failed") setError(payload.data.execution.error?.message || "The automation failed."); return payload.data.execution; } catch (cause) { setError(cause.message); return null; } finally { setBusy(false); } };
  if (data) return <AutomationManager data={data} busy={busy} setError={setError} automations={automations} deliveryOptions={deliveryOptions} lastRun={lastRun} designerOpen={designerOpen} setDesignerOpen={setDesignerOpen} historyAutomation={historyAutomation} setHistoryAutomation={setHistoryAutomation} draft={draft} setDraft={setDraft} create={create} run={run} aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} aiDraft={aiDraft} setAiDraft={setAiDraft} aiBusy={aiBusy} composeWithAi={composeWithAi} publishAiDraft={publishAiDraft} />;
  return <><div className="rounded-lg border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-200 p-4"><div><h2 className="font-semibold">Automations</h2><p className="text-sm text-slate-500">Published workflows for this board.</p></div><button onClick={() => setDesignerOpen(true)} disabled={busy} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">New automation</button></div>{lastRun?.status === "succeeded" && <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Automation completed successfully.</div>}<div className="divide-y divide-slate-100">{automations.length ? automations.map((automation) => <div key={automation.id} className="flex flex-wrap items-center gap-3 p-4"><Bot className="size-5 text-slate-400" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{automation.name}</p><p className="text-xs text-slate-500">{String(automation.activeVersion?.trigger?.type || "trigger").replaceAll(".", " ")} · {automation.activeVersion?.steps?.length || 0} steps</p></div><span className={`rounded-full px-2 py-1 text-xs ${automation.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{automation.enabled ? "Enabled" : "Disabled"}</span><button onClick={() => setHistoryAutomation(automation)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"><History className="size-3.5" />Runs</button>{automation.activeVersion?.trigger?.type === "manual" && <button onClick={() => run(automation.id)} disabled={busy || !automation.enabled} className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">Run</button>}</div>) : <button onClick={() => setDesignerOpen(true)} className="flex w-full flex-col items-center p-12 text-center hover:bg-slate-50"><Bot className="mb-3 size-8 text-slate-400" /><span className="font-semibold">Automate repeatable work</span><span className="mt-1 text-sm text-slate-500">Choose a trigger and action, then publish it to this board.</span></button>}</div></div>{designerOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label="Automation designer"><div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#d0d4e4] px-6 py-5"><div><h2 className="text-xl font-semibold">Create automation</h2><p className="mt-1 text-sm text-[#676879]">When this happens, perform that action.</p></div><button onClick={() => setDesignerOpen(false)} className="work-flow-icon-button" aria-label="Close automation designer"><X className="size-5" /></button></header><div className="space-y-5 p-6"><label className="block"><span className="mb-1 block text-sm font-medium">Automation name</span><input autoFocus value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className={`${inputClass} w-full`} placeholder="Notify owners when a task is created" /></label><div className="grid gap-3 md:grid-cols-[7rem_minmax(0,1fr)]"><span className="pt-2 text-sm font-semibold text-[#0073ea]">When</span><SiteSelect value={draft.triggerType} onChange={(event) => setDraft((current) => ({ ...current, triggerType: event.target.value }))} className={`${inputClass} w-full`}><option value="item.created">A task is created</option><option value="cell.changed">A column changes</option><option value="status.entered">A status changes to a value</option><option value="date.reached">A date arrives</option><option value="form.submitted">A form is submitted</option><option value="update.posted">An update is posted</option><option value="schedule.recurring">On a recurring schedule</option><option value="manual">The automation is run manually</option></SiteSelect><span className="pt-2 text-sm font-semibold text-[#a25ddc]">Then</span><SiteSelect value={draft.actionType} onChange={(event) => setDraft((current) => ({ ...current, actionType: event.target.value }))} className={`${inputClass} w-full`}><option value="notify">Notify board subscribers</option><option value="set_cell">Set a column value</option><option value="create_update">Create an update</option><option value="create_item">Create an item</option><option value="move_item">Move the item to a group</option><option value="archive_item">Archive the item</option><option value="delay">Wait before continuing</option></SiteSelect></div>{["cell.changed", "status.entered", "date.reached"].includes(draft.triggerType) && <div className="grid gap-3 md:grid-cols-[7rem_minmax(0,1fr)]"><span className="pt-2 text-sm font-semibold text-[#0073ea]">Column</span><SiteSelect value={draft.triggerColumnId} onChange={(event) => setDraft((current) => ({ ...current, triggerColumnId: event.target.value, triggerValue: "" }))} className={`${inputClass} w-full`}><option value="">Choose a column…</option>{data.columns.filter((column) => draft.triggerType === "date.reached" ? ["date", "datetime"].includes(column.type) : draft.triggerType === "status.entered" ? column.type === "status" : !column.readOnly).map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</SiteSelect></div>}{draft.triggerType === "status.entered" && draft.triggerColumnId && <div className="grid gap-3 md:grid-cols-[7rem_minmax(0,1fr)]"><span className="pt-2 text-sm font-semibold text-[#0073ea]">Value</span><SiteSelect value={draft.triggerValue} onChange={(event) => setDraft((current) => ({ ...current, triggerValue: event.target.value }))} className={`${inputClass} w-full`}><option value="">Any status</option>{(data.columns.find((column) => column.id === draft.triggerColumnId)?.settings?.options || []).map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</SiteSelect></div>}{draft.triggerType === "schedule.recurring" && <div className="grid gap-3 md:grid-cols-[7rem_repeat(2,minmax(0,1fr))]"><span className="pt-2 text-sm font-semibold text-[#0073ea]">Schedule</span><SiteSelect value={draft.frequency} onChange={(event) => setDraft((current) => ({ ...current, frequency: event.target.value }))} className={inputClass}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></SiteSelect><DateInput type="time" value={draft.scheduleTime} onChange={(event) => setDraft((current) => ({ ...current, scheduleTime: event.target.value }))} className={inputClass} />{draft.frequency === "weekly" && <SiteSelect value={draft.weekday} onChange={(event) => setDraft((current) => ({ ...current, weekday: event.target.value }))} className={`${inputClass} md:col-start-2`}><option value="Mon">Monday</option><option value="Tue">Tuesday</option><option value="Wed">Wednesday</option><option value="Thu">Thursday</option><option value="Fri">Friday</option><option value="Sat">Saturday</option><option value="Sun">Sunday</option></SiteSelect>}{draft.frequency === "monthly" && <input type="number" min="1" max="31" value={draft.dayOfMonth} onChange={(event) => setDraft((current) => ({ ...current, dayOfMonth: event.target.value }))} className={`${inputClass} md:col-start-2`} aria-label="Day of month" />}</div>}{draft.actionType === "set_cell" && <div className="grid grid-cols-2 gap-3"><SiteSelect value={draft.columnId} onChange={(event) => setDraft((current) => ({ ...current, columnId: event.target.value }))} className={inputClass}><option value="">Choose column…</option>{data.columns.filter((column) => !column.readOnly && column.type !== "name").map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</SiteSelect><input value={draft.value} onChange={(event) => setDraft((current) => ({ ...current, value: event.target.value }))} className={inputClass} placeholder="Value" /></div>}{draft.actionType === "delay" && <label className="block"><span className="mb-1 block text-sm font-medium">Delay in seconds</span><input type="number" min="0" max="31536000" value={draft.delaySeconds} onChange={(event) => setDraft((current) => ({ ...current, delaySeconds: event.target.value }))} className={`${inputClass} w-full`} /></label>}{["create_item", "move_item"].includes(draft.actionType) && <div className="grid grid-cols-2 gap-3"><SiteSelect value={draft.groupId} onChange={(event) => setDraft((current) => ({ ...current, groupId: event.target.value }))} className={inputClass}>{data.groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}</SiteSelect>{draft.actionType === "create_item" && <input value={draft.itemName} onChange={(event) => setDraft((current) => ({ ...current, itemName: event.target.value }))} className={inputClass} placeholder="New item name" />}</div>}{["notify", "create_update"].includes(draft.actionType) && <label className="block"><span className="mb-1 block text-sm font-medium">Message</span><textarea value={draft.message} onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))} rows={3} className="w-full resize-none rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" placeholder="Write the notification or update…" /></label>}</div><footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-6 py-4"><button onClick={() => setDesignerOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8]">Cancel</button><button onClick={create} disabled={busy || !draft.name.trim() || (draft.actionType === "set_cell" && !draft.columnId) || (["cell.changed", "status.entered", "date.reached"].includes(draft.triggerType) && !draft.triggerColumnId)} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Create automation</button></footer></div></div>}<AnimatePresence>{historyAutomation && <AutomationRunsDrawer automation={historyAutomation} onClose={() => setHistoryAutomation(null)} setError={setError} />}</AnimatePresence></>;
}

function AutomationManager({ data, busy, setError, automations, deliveryOptions, lastRun, designerOpen, setDesignerOpen, historyAutomation, setHistoryAutomation, draft, setDraft, create, run, aiPrompt, setAiPrompt, aiDraft, setAiDraft, aiBusy, composeWithAi, publishAiDraft }) {
  const [runTarget, setRunTarget] = useState(null);
  const [runItemId, setRunItemId] = useState("");
  const triggerNeedsColumn = ["cell.changed", "status.entered", "date.reached"].includes(draft.triggerType);
  const deliveryAction = ["send_sms", "send_email"].includes(draft.actionType);
  const recipientColumns = data.columns.filter((column) => draft.actionType === "send_sms" ? ["phone", "text"].includes(column.type) : ["email", "text"].includes(column.type));
  const canCreate = draft.name.trim() && (!triggerNeedsColumn || draft.triggerColumnId) && (draft.actionType !== "set_cell" || draft.columnId) && (!["create_item", "move_item"].includes(draft.actionType) || draft.groupId) && (draft.actionType !== "delay" || Number(draft.delaySeconds) >= 0) && (draft.actionType !== "send_sms" || (draft.smsInboxId && (draft.recipientColumnId || draft.recipient) && draft.message.trim())) && (draft.actionType !== "send_email" || ((draft.recipientColumnId || draft.recipient) && draft.subject.trim() && draft.message.trim()));
  const requestRun = (automation) => {
    const needsItem = (automation.activeVersion?.steps || []).some((step) => {
      const type = step.type || step.stepType || step.step_type;
      return ["set_cell", "create_update", "move_item", "archive_item"].includes(type) || (["send_sms", "send_email"].includes(type) && step.recipientColumnId);
    });
    if (!needsItem) { run(automation.id); return; }
    setRunItemId(data.items?.[0]?.id || "");
    setRunTarget(automation);
  };
  return <>
    <div className="rounded-lg border border-[#d0d4e4] bg-white">
      <div className="flex items-center justify-between border-b border-[#d0d4e4] p-4"><div><h2 className="font-semibold">Automations</h2><p className="text-sm text-[#676879]">Board actions, field communication, and AI-built workflows.</p></div><button onClick={() => setDesignerOpen(true)} disabled={busy} className="rounded-md bg-[#0073ea] px-3 py-2 text-sm font-medium text-white">New automation</button></div>
      {lastRun?.status === "succeeded" && <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Automation completed successfully.</div>}
      <div className="divide-y divide-[#e6e9ef]">{automations.length ? automations.map((automation) => <div key={automation.id} className="flex flex-wrap items-center gap-3 p-4"><Bot className="size-5 text-[#676879]" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{automation.name}</p><p className="text-xs text-[#676879]">{String(automation.activeVersion?.trigger?.type || "trigger").replaceAll(".", " ")} · {(automation.activeVersion?.steps || []).map((step) => String(step.type).replaceAll("_", " ")).join(" → ")}</p></div><span className={`rounded-full px-2 py-1 text-xs ${automation.enabled ? "bg-emerald-50 text-emerald-700" : "bg-[#f5f6f8] text-[#676879]"}`}>{automation.enabled ? "Enabled" : "Disabled"}</span><button onClick={() => setHistoryAutomation(automation)} className="rounded-md border border-[#c3c6d4] px-3 py-1.5 text-sm">Runs</button>{automation.activeVersion?.trigger?.type === "manual" && <button onClick={() => requestRun(automation)} disabled={busy || !automation.enabled} className="rounded-md border border-[#c3c6d4] px-3 py-1.5 text-sm disabled:opacity-40">Run</button>}</div>) : <button onClick={() => setDesignerOpen(true)} className="w-full p-12 text-center"><span className="block font-semibold">Automate real work</span><span className="mt-1 block text-sm text-[#676879]">Text customers and crews, send email, update tasks, and coordinate the board.</span></button>}</div>
    </div>
    {designerOpen && <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label="Automation designer"><div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#d0d4e4] px-6 py-5"><div><h2 className="text-xl font-semibold">Create automation</h2><p className="mt-1 text-sm text-[#676879]">Describe it to Rebuildit AI or configure it directly.</p></div><button onClick={() => setDesignerOpen(false)} className="work-flow-icon-button" aria-label="Close automation designer"><X className="size-5" /></button></header><div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
      <section className="rounded-lg border border-[#cce5ff] bg-[#f0f7ff] p-4"><h3 className="font-semibold text-[#323338]">Build with Rebuildit AI</h3><p className="mt-1 text-xs text-[#676879]">Explain the trigger, recipient, timing, and action. AI returns a validated preview and never publishes without your click.</p><textarea value={aiPrompt} onChange={(event) => { setAiPrompt(event.target.value); setAiDraft(null); }} rows={3} className="mt-3 w-full resize-none rounded-md border border-[#c3c6d4] bg-white p-3 text-sm outline-none focus:border-[#0073ea]" placeholder="When Status becomes Done, text Customer Phone from Project Texts and email Customer Email." /><div className="mt-2 flex justify-end"><button onClick={composeWithAi} disabled={aiBusy || aiPrompt.trim().length < 3} className="inline-flex items-center gap-2 rounded-md bg-[#323338] px-3 py-2 text-sm font-medium text-white disabled:opacity-40">{aiBusy && <Loader2 className="size-4 animate-spin" />}Build draft</button></div>{aiDraft?.draft && <div className="mt-3 rounded-md border border-[#d0d4e4] bg-white p-3"><p className="font-medium">{aiDraft.draft.name}</p><p className="mt-1 text-xs text-[#676879]">{String(aiDraft.draft.trigger?.type || "trigger").replaceAll(".", " ")} · {(aiDraft.draft.steps || []).map((step) => String(step.type).replaceAll("_", " ")).join(" → ")}</p><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-[#9799a6]">{aiDraft.generatedBy === "rebuildit_ai" ? "Rebuildit AI draft" : "Verified rules draft"}</span><button onClick={publishAiDraft} disabled={busy} className="rounded-md bg-[#0073ea] px-3 py-1.5 text-xs font-medium text-white">Publish automation</button></div></div>}</section>
      <div className="flex items-center gap-3"><span className="h-px flex-1 bg-[#e6e9ef]" /><span className="text-xs font-medium text-[#9799a6]">MANUAL BUILDER</span><span className="h-px flex-1 bg-[#e6e9ef]" /></div>
      <label className="block"><span className="mb-1 block text-sm font-medium">Automation name</span><input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className={`${inputClass} w-full`} placeholder="Text the customer when work is complete" /></label>
      <div className="grid gap-3 md:grid-cols-[7rem_minmax(0,1fr)]"><span className="pt-2 text-sm font-semibold text-[#0073ea]">When</span><SiteSelect value={draft.triggerType} onChange={(event) => setDraft((current) => ({ ...current, triggerType: event.target.value, triggerColumnId: "" }))} className={`${inputClass} w-full`}><option value="item.created">A task is created</option><option value="cell.changed">A column changes</option><option value="status.entered">A status changes to a value</option><option value="date.reached">A date arrives</option><option value="form.submitted">A form is submitted</option><option value="update.posted">An update is posted</option><option value="schedule.recurring">On a recurring schedule</option><option value="manual">Run manually</option></SiteSelect><span className="pt-2 text-sm font-semibold text-[#a25ddc]">Then</span><SiteSelect value={draft.actionType} onChange={(event) => setDraft((current) => ({ ...current, actionType: event.target.value, recipientColumnId: "", recipient: "" }))} className={`${inputClass} w-full`}><option value="notify">Notify board subscribers</option><option value="send_sms">Send an SMS text</option><option value="send_email">Send an email</option><option value="set_cell">Set a column value</option><option value="create_update">Create an update</option><option value="create_item">Create an item</option><option value="move_item">Move the item to a group</option><option value="archive_item">Archive the item</option><option value="delay">Wait before continuing</option></SiteSelect></div>
      {triggerNeedsColumn && <label className="block"><span className="mb-1 block text-sm font-medium">Trigger column</span><SiteSelect value={draft.triggerColumnId} onChange={(event) => setDraft((current) => ({ ...current, triggerColumnId: event.target.value }))} className={`${inputClass} w-full`}><option value="">Choose a column…</option>{data.columns.filter((column) => draft.triggerType === "date.reached" ? ["date", "datetime"].includes(column.type) : draft.triggerType === "status.entered" ? column.type === "status" : !column.readOnly).map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</SiteSelect></label>}
      {draft.actionType === "send_sms" && <label className="block"><span className="mb-1 block text-sm font-medium">Send from VoIP.ms text number</span><SiteSelect value={draft.smsInboxId} onChange={(event) => setDraft((current) => ({ ...current, smsInboxId: event.target.value }))} className={`${inputClass} w-full`}><option value="">Choose a text inbox…</option>{deliveryOptions.smsInboxes.map((inbox) => <option key={inbox.id} value={inbox.id}>{inbox.name} · {inbox.phoneNumber}</option>)}</SiteSelect>{!deliveryOptions.smsInboxes.length && <span className="mt-1 block text-xs text-amber-700">No eligible VoIP.ms text inbox is configured. The primary calling number is intentionally excluded.</span>}</label>}
      {deliveryAction && <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1 block text-sm font-medium">Recipient column</span><SiteSelect value={draft.recipientColumnId} onChange={(event) => setDraft((current) => ({ ...current, recipientColumnId: event.target.value, recipient: "" }))} className={`${inputClass} w-full`}><option value="">Use a fixed recipient…</option>{recipientColumns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</SiteSelect></label><label><span className="mb-1 block text-sm font-medium">Fixed recipient</span><input disabled={Boolean(draft.recipientColumnId)} value={draft.recipient} onChange={(event) => setDraft((current) => ({ ...current, recipient: event.target.value }))} className={`${inputClass} w-full disabled:bg-[#f5f6f8]`} placeholder={draft.actionType === "send_sms" ? "+1 555 555 0100" : "crew@example.com"} /></label></div>}
      {draft.actionType === "send_email" && <label className="block"><span className="mb-1 block text-sm font-medium">Subject</span><input value={draft.subject} onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))} className={`${inputClass} w-full`} placeholder="Update for {{item.name}}" />{!deliveryOptions.emailConfigured && <span className="mt-1 block text-xs text-amber-700">Production email delivery is not configured.</span>}</label>}
      {["notify", "create_update", "send_sms", "send_email"].includes(draft.actionType) && <label className="block"><span className="mb-1 block text-sm font-medium">Message</span><textarea value={draft.message} onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))} rows={3} className="w-full resize-none rounded-md border border-[#c3c6d4] p-3 text-sm outline-none focus:border-[#0073ea]" placeholder="Use {{item.name}} or {{column.COLUMN_ID}} to insert live board values." /></label>}
      {draft.actionType === "set_cell" && <div className="grid gap-3 sm:grid-cols-2"><SiteSelect value={draft.columnId} onChange={(event) => setDraft((current) => ({ ...current, columnId: event.target.value }))} className={inputClass}><option value="">Choose column…</option>{data.columns.filter((column) => !column.readOnly && column.type !== "name").map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</SiteSelect><input value={draft.value} onChange={(event) => setDraft((current) => ({ ...current, value: event.target.value }))} className={inputClass} placeholder="Value" /></div>}
      {["create_item", "move_item"].includes(draft.actionType) && <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1 block text-sm font-medium">Destination group</span><SiteSelect value={draft.groupId} onChange={(event) => setDraft((current) => ({ ...current, groupId: event.target.value }))} className={`${inputClass} w-full`}>{data.groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}</SiteSelect></label>{draft.actionType === "create_item" && <label><span className="mb-1 block text-sm font-medium">New task name</span><input value={draft.itemName} onChange={(event) => setDraft((current) => ({ ...current, itemName: event.target.value }))} className={`${inputClass} w-full`} placeholder="Use automation name" /></label>}</div>}
      {draft.actionType === "delay" && <label className="block"><span className="mb-1 block text-sm font-medium">Delay in seconds</span><input type="number" min="0" max="31536000" value={draft.delaySeconds} onChange={(event) => setDraft((current) => ({ ...current, delaySeconds: event.target.value }))} className={`${inputClass} w-full`} /></label>}
    </div><footer className="flex justify-end gap-2 border-t border-[#d0d4e4] px-6 py-4"><button onClick={() => setDesignerOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f6f8]">Cancel</button><button onClick={create} disabled={busy || !canCreate} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Create automation</button></footer></div></div>}
    {runTarget && <div className="fixed inset-0 z-[140] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label="Choose automation item"><div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"><h2 className="text-lg font-semibold">Run on a task</h2><p className="mt-1 text-sm text-[#676879]">Choose the task that {runTarget.name} should use.</p><label className="mt-4 block"><span className="mb-1 block text-sm font-medium">Task</span><SiteSelect value={runItemId} onChange={(event) => setRunItemId(event.target.value)} className={`${inputClass} w-full`}><option value="">Choose a task…</option>{(data.items || []).filter((item) => !item.archivedAt && !item.trashedAt).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SiteSelect></label><div className="mt-5 flex justify-end gap-2"><button onClick={() => setRunTarget(null)} className="rounded-md border border-[#c3c6d4] px-4 py-2 text-sm font-medium">Cancel</button><button disabled={busy || !runItemId} onClick={async () => { const execution = await run(runTarget.id, runItemId); if (execution) setRunTarget(null); }} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Run automation</button></div></div></div>}
    <AnimatePresence>{historyAutomation && <AutomationRunsDrawer automation={historyAutomation} onClose={() => setHistoryAutomation(null)} setError={setError} />}</AnimatePresence>
  </>;
}

function DashboardsSurface({ data, busy, setBusy, setError, requestText }) {
  const [dashboards, setDashboards] = useState([]);
  const [openDashboardId, setOpenDashboardId] = useState("");
  const [widgets, setWidgets] = useState([]);
  const [results, setResults] = useState({});
  const load = useCallback(async () => { const payload = await api("/api/work-flow/v1/dashboards"); setDashboards(payload.data.dashboards || []); }, []);
  useEffect(() => { load().catch((cause) => setError(cause.message)); }, [load, setError]);
  const create = async () => {
    const name = await requestText({ title: "Create dashboard", description: "Build a board dashboard for operational decisions.", label: "Dashboard name", defaultValue: `${data.board.name} dashboard`, submitLabel: "Create dashboard" }); if (!name?.trim()) return;
    setBusy(true); setError("");
    try { const result = await api("/api/work-flow/v1/dashboards", { method: "POST", body: JSON.stringify({ name: name.trim(), visibility: "workspace" }) }); await api(`/api/work-flow/v1/dashboards/${result.data.dashboard.id}/widgets`, { method: "POST", body: JSON.stringify({ title: `${data.board.name} items`, type: "number", query: { boardId: data.board.id, aggregate: "count" } }) }); await load(); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const open = async (dashboardId) => {
    if (openDashboardId === dashboardId) { setOpenDashboardId(""); setWidgets([]); return; }
    setBusy(true); setError("");
    try {
      const payload = await api(`/api/work-flow/v1/dashboards/${dashboardId}/widgets`);
      const nextWidgets = payload.data.widgets || [];
      setOpenDashboardId(dashboardId); setWidgets(nextWidgets);
      const entries = await Promise.all(nextWidgets.map(async (widget) => {
        try { const execution = await api(`/api/work-flow/v1/widgets/${widget.id}/execute`, { method: "POST", body: "{}" }); return [widget.id, execution.data.result]; }
        catch (cause) { return [widget.id, { error: cause.message }]; }
      }));
      setResults(Object.fromEntries(entries));
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  if (!dashboards.length) return <EmptySurface icon={LayoutDashboard} title="Turn board data into decisions" detail="Build a permission-aware dashboard with live widgets and drill-down-ready query definitions." action={create} actionLabel="Create dashboard" />;
  return <div className="rounded-lg border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-200 p-4"><div><h2 className="font-semibold">Dashboards</h2><p className="text-sm text-slate-500">Workspace dashboards can combine authorized Work Flow sources.</p></div><button onClick={create} disabled={busy} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">New dashboard</button></div><div className="divide-y divide-slate-100">{dashboards.map((dashboard) => <div key={dashboard.id}><button onClick={() => open(dashboard.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50"><LayoutDashboard className="size-5 text-slate-400" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{dashboard.name}</p><p className="text-xs text-slate-500">{dashboard.visibility} · version {dashboard.activeVersion?.versionNumber || 1}</p></div><ChevronDown className={`size-4 text-slate-400 transition ${openDashboardId === dashboard.id ? "rotate-180" : ""}`} /></button>{openDashboardId === dashboard.id && <div className="border-t border-slate-100 bg-slate-50 p-4">{widgets.length ? <div className="space-y-2">{widgets.map((widget) => <div key={widget.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3"><div><p className="text-sm font-medium">{widget.activeVersion.title}</p><p className="text-xs text-slate-500">{widget.activeVersion.widgetType} · {widget.activeVersion.query?.aggregate || "count"}</p></div><div className="text-right">{results[widget.id]?.error ? <span className="text-xs text-red-600">Unavailable</span> : results[widget.id] ? <><p className="text-lg font-semibold tabular-nums">{results[widget.id].value ?? "—"}</p><p className="text-[11px] text-slate-400">{results[widget.id].grain}</p></> : <Loader2 className="size-4 animate-spin text-slate-400" />}</div></div>)}</div> : <p className="text-sm text-slate-500">This dashboard has no widgets yet.</p>}</div>}</div>)}</div></div>;
}

function DocumentsSurface({ data, busy, setBusy, setError, requestText }) {
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [plainText, setPlainText] = useState("");
  const load = useCallback(async () => { const payload = await api(`/api/work-flow/v1/documents?workspaceId=${data.board.workspaceId}`); setDocuments(payload.data.documents || []); return payload.data.documents || []; }, [data.board.workspaceId]);
  useEffect(() => { load().catch((cause) => setError(cause.message)); }, [load, setError]);
  const choose = (document) => { setSelected(document); setTitle(document.title); setPlainText(document.activeVersion?.plainText || ""); };
  const create = async () => {
    const name = await requestText({ title: "Create document", description: "Add shared context, decisions, and procedures to this workspace.", label: "Document title", defaultValue: "Untitled document", submitLabel: "Create document" }); if (!name?.trim()) return;
    setBusy(true); setError("");
    try { const payload = await api("/api/work-flow/v1/documents", { method: "POST", body: JSON.stringify({ workspaceId: data.board.workspaceId, title: name.trim(), visibility: "workspace", plainText: "" }) }); const next = await load(); choose(next.find((entry) => entry.id === payload.data.document.id) || payload.data.document); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const save = async () => {
    if (!selected || !title.trim()) return;
    setBusy(true); setError("");
    try { const payload = await api(`/api/work-flow/v1/documents/${selected.id}`, { method: "PATCH", headers: { "If-Match": `"${selected.revision}"` }, body: JSON.stringify({ title: title.trim(), plainText }) }); setSelected(payload.data.document); setDocuments((current) => current.map((entry) => entry.id === selected.id ? payload.data.document : entry)); }
    catch (cause) { setError(cause.message); if (cause.code === "REVISION_CONFLICT") { const next = await load(); const current = next.find((entry) => entry.id === selected.id); if (current) choose(current); } }
    finally { setBusy(false); }
  };
  if (!documents.length) return <EmptySurface icon={FileText} title="Create a shared document" detail="Write decisions, procedures, and project context in immutable document versions inside this workspace." action={create} actionLabel="Create document" />;
  return <div className="grid min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-white lg:grid-cols-[18rem_minmax(0,1fr)]"><aside className="border-b border-slate-200 lg:border-b-0 lg:border-r"><div className="flex items-center justify-between border-b border-slate-200 p-3"><h2 className="font-semibold">Documents</h2><button onClick={create} disabled={busy} className="rounded-md p-2 text-blue-700 hover:bg-blue-50" aria-label="Create document"><Plus className="size-4" /></button></div><div className="divide-y divide-slate-100">{documents.map((document) => <button key={document.id} onClick={() => choose(document)} className={`flex w-full items-start gap-2 p-3 text-left hover:bg-slate-50 ${selected?.id === document.id ? "bg-blue-50" : ""}`}><FileText className="mt-0.5 size-4 shrink-0 text-slate-400" /><span className="min-w-0"><span className="block truncate text-sm font-medium">{document.title}</span><span className="text-xs text-slate-400">Version {document.activeVersion?.versionNumber || 1}</span></span></button>)}</div></aside>{selected ? <div className="flex min-w-0 flex-col"><div className="flex items-center gap-3 border-b border-slate-200 p-3"><input value={title} onChange={(event) => setTitle(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-lg font-semibold outline-none" aria-label="Document title" /><button onClick={save} disabled={busy || !title.trim()} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"><Save className="size-4" />Save version</button></div><textarea value={plainText} onChange={(event) => setPlainText(event.target.value)} className="min-h-[450px] flex-1 resize-none border-0 p-5 text-sm leading-7 outline-none" placeholder="Write context, decisions, procedures, and notes…" aria-label="Document content" /></div> : <div className="flex items-center justify-center p-10 text-center text-sm text-slate-500">Select a document to read or edit it.</div>}</div>;
}

function TemplatesSurface({ data, busy, setBusy, setError, onCreatedBoard, requestText }) {
  const [templates, setTemplates] = useState([]);
  const load = useCallback(async () => { const payload = await api("/api/work-flow/v1/templates"); setTemplates(payload.data.templates || []); }, []);
  useEffect(() => { load().catch((cause) => setError(cause.message)); }, [load, setError]);
  const save = async () => {
    const name = await requestText({ title: "Save board template", description: "Reuse this board’s schema, groups, and views.", label: "Template name", defaultValue: `${data.board.name} template`, submitLabel: "Save template" }); if (!name?.trim()) return;
    setBusy(true); setError("");
    try { await api("/api/work-flow/v1/templates", { method: "POST", body: JSON.stringify({ name: name.trim(), boardId: data.board.id }) }); await load(); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  const instantiateTemplate = async (template) => {
    const name = await requestText({ title: "Create board from template", description: `Create a new board from ${template.name}.`, label: "Board name", defaultValue: `${template.name} board`, submitLabel: "Create board" }); if (!name?.trim()) return;
    setBusy(true); setError("");
    try { const payload = await api(`/api/work-flow/v1/templates/${template.id}/instantiate`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ name: name.trim(), visibility: "workspace" }) }); await onCreatedBoard(payload.data.board); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };
  if (!templates.length) return <EmptySurface icon={LayoutTemplate} title="Reuse a proven board" detail="Save this board’s typed schema, groups, and shared views as a versioned template." action={save} actionLabel="Save as template" />;
  return <div className="rounded-lg border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-200 p-4"><div><h2 className="font-semibold">Board templates</h2><p className="text-sm text-slate-500">Definitions are versioned; new boards receive fresh identities.</p></div><button onClick={save} disabled={busy} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">Save current board</button></div><div className="divide-y divide-slate-100">{templates.map((template) => <div key={template.id} className="flex flex-wrap items-center gap-3 p-4"><LayoutTemplate className="size-5 text-slate-400" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{template.name}</p><p className="text-xs text-slate-500">Version {template.activeVersion?.versionNumber || 1} · {template.activeVersion?.package?.columns?.length || 0} columns · {template.activeVersion?.package?.groups?.length || 0} groups</p></div><button onClick={() => instantiateTemplate(template)} disabled={busy} className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50">Use template</button></div>)}</div></div>;
}

function ConditionalFormattingDialog({ columns, rules, onChange, onClose }) {
  const available = columns.filter((column) => column.type !== "name" || column.id);
  const [draft, setDraft] = useState({ columnId: available[0]?.id || "", operator: "eq", value: "", scope: "cell", backgroundColor: "#fff0f0", textColor: "#323338" });
  const selected = available.find((column) => column.id === draft.columnId);
  const add = () => {
    if (!draft.columnId) return;
    onChange([...rules, { ...draft, id: crypto.randomUUID() }]);
    setDraft((current) => ({ ...current, value: "" }));
  };
  return <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#323338]/45 p-4" role="dialog" aria-modal="true" aria-label="Conditional formatting"><motion.div initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#d0d4e4] bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-[#d0d4e4] px-5 py-4"><div><h2 className="font-semibold text-[#323338]">Conditional formatting</h2><p className="mt-1 text-sm text-[#676879]">Highlight matching cells or the entire item row in this view.</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close conditional formatting"><X className="size-4" /></button></header><div className="space-y-5 p-5"><div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1 block text-xs font-medium text-[#676879]">Column</span><SiteSelect aria-label="Formatting column" value={draft.columnId} onChange={(event) => setDraft((current) => ({ ...current, columnId: event.target.value, value: "" }))} className={`${inputClass} w-full`}>{available.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</SiteSelect></label><label><span className="mb-1 block text-xs font-medium text-[#676879]">Condition</span><SiteSelect aria-label="Formatting operator" value={draft.operator} onChange={(event) => setDraft((current) => ({ ...current, operator: event.target.value }))} className={`${inputClass} w-full`}><option value="eq">is</option><option value="neq">is not</option><option value="contains">contains</option><option value="is_empty">is empty</option><option value="is_not_empty">is not empty</option><option value="gt">is greater than</option><option value="lt">is less than</option></SiteSelect></label></div>{!["is_empty", "is_not_empty"].includes(draft.operator) && <label className="block"><span className="mb-1 block text-xs font-medium text-[#676879]">Value</span>{selected?.type === "status" ? <SiteSelect aria-label="Formatting value" value={draft.value} onChange={(event) => setDraft((current) => ({ ...current, value: event.target.value }))} className={`${inputClass} w-full`}><option value="">Choose status…</option>{(selected.settings?.options || []).map((option) => <option key={option.id} value={option.id}>{option.label || option.id}</option>)}</SiteSelect> : <DateInput aria-label="Formatting value" type={["integer", "decimal", "percent", "rating", "duration"].includes(selected?.type) ? "number" : "text"} value={draft.value} onChange={(event) => setDraft((current) => ({ ...current, value: event.target.value }))} className={`${inputClass} w-full`} />}</label>}<div className="grid gap-3 sm:grid-cols-3"><label><span className="mb-1 block text-xs font-medium text-[#676879]">Apply to</span><SiteSelect aria-label="Formatting scope" value={draft.scope} onChange={(event) => setDraft((current) => ({ ...current, scope: event.target.value }))} className={`${inputClass} w-full`}><option value="cell">Matching cell</option><option value="row">Entire row</option></SiteSelect></label><label><span className="mb-1 block text-xs font-medium text-[#676879]">Background</span><input aria-label="Formatting background" type="color" value={draft.backgroundColor} onChange={(event) => setDraft((current) => ({ ...current, backgroundColor: event.target.value }))} className="h-9 w-full cursor-pointer rounded-md border border-[#d0d4e4] bg-white p-1" /></label><label><span className="mb-1 block text-xs font-medium text-[#676879]">Text</span><input aria-label="Formatting text color" type="color" value={draft.textColor} onChange={(event) => setDraft((current) => ({ ...current, textColor: event.target.value }))} className="h-9 w-full cursor-pointer rounded-md border border-[#d0d4e4] bg-white p-1" /></label></div><button onClick={add} disabled={!draft.columnId || (!["is_empty", "is_not_empty"].includes(draft.operator) && !draft.value)} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white disabled:opacity-40">Add rule</button>{rules.length > 0 && <div className="overflow-hidden rounded-lg border border-[#d0d4e4]"><p className="bg-[#f5f6f8] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#676879]">Active rules</p>{rules.map((rule) => { const column = columns.find((entry) => entry.id === rule.columnId); return <div key={rule.id} className="flex items-center gap-3 border-t border-[#e6e9ef] px-3 py-2"><span className="size-5 rounded border border-[#d0d4e4]" style={{ backgroundColor: rule.backgroundColor }} /><span className="min-w-0 flex-1 truncate text-sm">{column?.label || "Column"} · {rule.operator.replaceAll("_", " ")}{rule.value ? ` · ${rule.value}` : ""} · {rule.scope}</span><button onClick={() => onChange(rules.filter((entry) => entry.id !== rule.id))} aria-label={`Remove formatting rule for ${column?.label || "column"}`} className="work-flow-icon-button text-[#d83a52]"><Trash2 className="size-4" /></button></div>; })}</div>}</div><footer className="flex justify-end border-t border-[#d0d4e4] px-5 py-4"><button onClick={onClose} className="rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white">Done</button></footer></motion.div></div>;
}

function CompactBoardViewSelector({views,selectedViewId,selectMainTable,applyView}) { return <div className="mr-3 shrink-0"><SiteSelect label="Current board view" value={selectedViewId||""} options={[{value:"",label:"Main table"},...views.map(view=>({value:view.id,label:view.name}))]} onChange={event=>{const view=views.find(view=>String(view.id)===event.target.value);if(view)applyView(view);else selectMainTable();}}/></div>; }

function RelationshipGraphCanvas({ graph }) {
  const nodes = (graph?.nodes || []).slice(0, 40);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const items = nodes.filter((node) => node.kind === "item");
  const targets = nodes.filter((node) => node.kind === "domain_object");
  const height = Math.max(180, (Math.max(items.length, targets.length) + 1) * 58);
  const positions = new Map([[`column:${graph?.column?.id}`, { x: 62, y: height / 2 }]]);
  items.forEach((node, index) => positions.set(node.id, { x: 245, y: 48 + index * 58 }));
  targets.forEach((node, index) => positions.set(node.id, { x: 460, y: 48 + index * 58 }));
  const edges = (graph?.edges || []).filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));
  if (nodes.length <= 1) return null;
  return <div className="mb-5 overflow-x-auto rounded-lg border border-[#d0d4e4] bg-[#fafbfc]" aria-label="Relationship graph visualization"><svg viewBox={`0 0 530 ${height}`} className="min-w-[530px]" style={{ height: Math.min(440, height) }} role="img" aria-label={`${edges.length} visible relationships across ${nodes.length} nodes`}>
    {edges.map((edge) => { const from = positions.get(edge.source); const to = positions.get(edge.target); if (!from || !to) return null; const color = edge.kind === "confirmed" ? "#00854a" : edge.kind === "inferred" ? "#784bd1" : edge.kind === "computed" ? "#0086c0" : "#676879"; return <line key={edge.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={edge.kind === "inferred" ? 2 : 2.5} strokeDasharray={edge.kind === "inferred" ? "5 4" : undefined}><title>{edge.kind} relationship{edge.confidence ? `, ${Math.round(edge.confidence * 100)}% confidence` : ""}</title></line>; })}
    {nodes.map((node) => { const point = positions.get(node.id); if (!point) return null; const fill = node.kind === "column" ? "#0073ea" : node.kind === "item" ? "#323338" : "#fff"; const text = node.kind === "domain_object" ? "#323338" : "#fff"; return <g key={node.id} transform={`translate(${point.x} ${point.y})`}><rect x={-58} y={-17} width={116} height={34} rx={8} fill={fill} stroke={node.kind === "domain_object" ? "#a25ddc" : fill} /><text textAnchor="middle" y={4} fill={text} fontSize="11" fontWeight="600">{String(node.label || "Relationship").slice(0, 17)}</text><title>{node.label}</title></g>; })}
  </svg>{(graph?.nodes || []).length > nodes.length && <p className="border-t border-[#d0d4e4] px-3 py-2 text-xs text-[#676879]">Showing the first 40 nodes here; all matches remain available in the review list below.</p>}</div>;
}

function RelationshipGraphDrawer({ boardId, column, onClose, setError }) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanProgress, setScanProgress] = useState(null);
  const endpoint = `/api/work-flow/v1/boards/${boardId}/columns/${column.id}/relationship-graph`;
  const load = useCallback(async () => { setLoading(true); try { const payload = await api(endpoint); setGraph(payload.data); } catch (error) { setError(error.message); } finally { setLoading(false); } }, [endpoint, setError]);
  useEffect(() => { load(); }, [load]);
  const scan = async () => { setLoading(true); setScanProgress({ scanned: 0, discovered: 0 }); try { let cursor = 0; let hasMore = true; let scanned = 0; let discovered = 0; while (hasMore) { const payload = await api(endpoint, { method: "POST", body: JSON.stringify({ cursor }) }); scanned += payload.data.scannedItems; discovered += payload.data.discovered; if (payload.data.graph) setGraph(payload.data.graph); setScanProgress({ scanned, discovered }); hasMore = payload.data.hasMore; cursor = payload.data.nextCursor; } } catch (error) { setError(error.message); } finally { setLoading(false); } };
  const loadMoreMatches = async () => { const cursor = graph?.pageInfo?.nextCursor; if (cursor == null) return; setLoading(true); try { const payload = await api(`${endpoint}?cursor=${cursor}`); const next = payload.data; setGraph((current) => ({ ...next, nodes: [...new Map([...(current?.nodes || []), ...next.nodes].map((node) => [node.id, node])).values()], edges: [...new Map([...(current?.edges || []), ...next.edges].map((edge) => [edge.id, edge])).values()], suggestions: [...new Map([...(current?.suggestions || []), ...next.suggestions].map((entry) => [entry.id, entry])).values()] })); } catch (error) { setError(error.message); } finally { setLoading(false); } };
  const decide = async (suggestionId, action) => { try { await api(`/api/work-flow/v1/relationship-suggestions/${suggestionId}`, { method: "POST", body: JSON.stringify({ action }) }); await load(); } catch (error) { setError(error.message); } };
  const suggestions = graph?.suggestions || [];
  return <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 320 }} className="fixed inset-y-0 right-0 z-[140] flex w-full max-w-xl flex-col border-l border-[#d0d4e4] bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={`Relationships for ${column.label}`}>
    <header className="flex items-start justify-between border-b border-[#d0d4e4] px-5 py-4"><div><div className="flex items-center gap-2"><Network className="size-5 text-[#0073ea]" /><h2 className="font-semibold text-[#323338]">{column.label} relationships</h2></div><p className="mt-1 text-sm text-[#676879]">Suggested links stay separate from confirmed business relationships until you approve them.</p></div><button onClick={onClose} className="work-flow-icon-button" aria-label="Close relationship graph"><X className="size-4" /></button></header>
    <div className="flex items-center gap-3 border-b border-[#d0d4e4] px-5 py-3"><button onClick={scan} disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-[#0073ea] px-3 py-2 text-sm font-medium text-white disabled:opacity-50">{loading ? <Loader2 className="size-4 animate-spin" /> : <Network className="size-4" />}Find connections</button><span className="text-xs text-[#676879]">{loading && scanProgress ? `Checked ${scanProgress.scanned} rows; found ${scanProgress.discovered} matches…` : scanProgress ? `Checked all ${scanProgress.scanned} populated rows.` : "Exact identifiers and conservative text similarity; nothing auto-links."}</span></div>
    <div className="min-h-0 flex-1 overflow-y-auto p-5"><RelationshipGraphCanvas graph={graph} />{!loading && suggestions.length === 0 && (graph?.edges || []).length === 0 && <div className="rounded-lg border border-dashed border-[#c3c6d4] p-8 text-center"><Network className="mx-auto size-8 text-[#9799a6]" /><p className="mt-3 font-medium text-[#323338]">No relationships mapped yet</p><p className="mt-1 text-sm text-[#676879]">Run the scan to compare every populated row with CRM, communications, inventory, projects, and other authorized Rebuildit domains.</p></div>}{suggestions.length > 0 && <div className="space-y-3">{suggestions.map((suggestion) => <article key={suggestion.id} className="rounded-lg border border-[#d0d4e4] p-4"><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-[#9799a6]">Work Flow item</p><p className="mt-1 truncate text-sm font-medium text-[#323338]">{suggestion.itemName}</p><p className="truncate text-xs text-[#676879]">{displayValue(suggestion.sourceValue, column)}</p></div><div className="flex flex-col items-center"><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${suggestion.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : suggestion.status === "rejected" ? "bg-slate-100 text-slate-500" : "bg-violet-50 text-violet-700"}`}>{suggestion.status === "confirmed" ? "Confirmed" : suggestion.status === "rejected" ? "Rejected" : `${Math.round(suggestion.confidence * 100)}% inferred`}</span><span className="mt-2 h-px w-12 bg-[#c3c6d4]" /></div><div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-[#9799a6]">{suggestion.candidateDomainType?.replaceAll("_", " ")}</p><p className="mt-1 truncate text-sm font-medium text-[#323338]">{suggestion.candidateLabel}</p><p className="truncate text-xs text-[#676879]">{suggestion.evidence?.map((entry) => entry.kind.replaceAll("_", " ")).join(", ") || "Pattern similarity"}</p></div></div>{suggestion.status === "pending" && <div className="mt-4 flex justify-end gap-2"><button onClick={() => decide(suggestion.id, "reject")} className="rounded-md border border-[#d0d4e4] px-3 py-1.5 text-sm hover:bg-[#f5f6f8]">Not related</button><button onClick={() => decide(suggestion.id, "confirm")} className="rounded-md bg-[#0073ea] px-3 py-1.5 text-sm font-medium text-white">Confirm link</button></div>}</article>)}</div>}{graph?.pageInfo?.hasMore && <button onClick={loadMoreMatches} disabled={loading} className="mt-4 w-full rounded-md border border-[#d0d4e4] px-3 py-2 text-sm font-medium hover:bg-[#f5f6f8] disabled:opacity-50">Load more matches</button>}</div>
  </motion.aside>;
}

export function WorkFlowInfiniteLoader({ hasMore, loading, pageKey, onLoad, loadingOnly = false, automatic = false }) {
  const markerRef = useRef(null);
  const requestInFlight = useRef(false);
  const lastRequestedPage = useRef(null);
  const [failedPageKey, setFailedPageKey] = useState("");
  const failed = failedPageKey === pageKey;
  const requestNext = useCallback((retry = false) => {
    if (!hasMore || loadingOnly || loading || requestInFlight.current || (failed && !retry)) return;
    // A repeated cursor must never create an endless background request loop.
    if (!retry && lastRequestedPage.current === pageKey) { setFailedPageKey(pageKey); return; }
    lastRequestedPage.current = pageKey;
    requestInFlight.current = true;
    Promise.resolve(onLoad()).then((succeeded) => {
      if (succeeded === false) setFailedPageKey(pageKey);
      else setFailedPageKey("");
    }).catch(() => setFailedPageKey(pageKey)).finally(() => { requestInFlight.current = false; });
  }, [failed, hasMore, loading, loadingOnly, onLoad, pageKey]);
  useEffect(() => {
    if (automatic) {
      if (!hasMore || loadingOnly || loading || failed) return;
      // Yield to paint and input between batches; no scroll is needed to buffer them.
      const timer = window.setTimeout(() => requestNext(), 50);
      return () => window.clearTimeout(timer);
    }
    const marker = markerRef.current;
    if (!marker || !hasMore || loadingOnly || failed || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) requestNext();
    }, { rootMargin: "600px 0px" });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [automatic, failed, hasMore, loading, loadingOnly, requestNext]);
  if (!hasMore && !loadingOnly) return null;
  return <div ref={markerRef} className="work-flow-load-skeleton" role="status" aria-live="polite" aria-label={failed ? "More tasks could not be loaded" : "Loading more tasks"}>
    {failed ? <button type="button" onClick={() => requestNext(true)} className="rounded-md border border-[#d0d4e4] bg-white px-4 py-2 text-sm font-medium text-[#323338] hover:bg-[#f5f6f8]">Couldn’t load more tasks. Try again</button> : <div className="w-full space-y-2" aria-hidden="true">{[0, 1, 2].map((index) => <div key={index} className="flex h-10 items-center gap-4 rounded-md border border-[#e6e9ef] bg-white px-4"><span className="size-4 rounded bg-[#e8eaee]" /><span className="h-3 rounded bg-[#e8eaee]" style={{ width: `${34 - index * 5}%` }} /><span className="ml-auto h-3 w-16 rounded bg-[#e8eaee]" /></div>)}</div>}
    <span className="sr-only">{failed ? "Loading failed. Use the retry button." : "Loading more tasks"}</span>
  </div>;
}

function WorkspaceSidebarTree({ workspace, folders, boards, search, currentId, selectBoard, createBoard, createFolder, moveBoard }) {
  const [collapsed, setCollapsed] = useState({});
  useEffect(() => {
    const closeMenus = (event) => {
      if (event.type === "pointerdown" && event.target.closest?.(".work-flow-sidebar-menu")) return;
      if (event.type === "keydown" && event.key !== "Escape") return;
      document.querySelectorAll(".work-flow-sidebar-menu[open]").forEach((menu) => menu.removeAttribute("open"));
    };
    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeMenus);
    return () => { document.removeEventListener("pointerdown", closeMenus); document.removeEventListener("keydown", closeMenus); };
  }, []);
  const needle = search.trim().toLowerCase();
  const visibleBoards = boards.filter((board) => !needle || board.name.toLowerCase().includes(needle));
  const renderBoard = (board, depth = 0) => <button key={board.id} type="button" draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application/x-work-flow-board", board.id); }} data-board-id={board.id} onClick={() => selectBoard(board.id)} className={board.id === currentId ? "is-active" : ""} style={{ paddingLeft: 10 + depth * 17 }}><Table2 className="size-4 shrink-0" /><span className="truncate">{board.name}</span></button>;
  const renderFolder = (folder, depth = 0) => {
    const children = folders.filter((entry) => entry.parentFolderId === folder.id);
    const ownBoards = visibleBoards.filter((board) => board.folderId === folder.id);
    const hasMatches = ownBoards.length || children.some((child) => visibleBoards.some((board) => board.folderId === child.id));
    if (needle && !hasMatches && !folder.name.toLowerCase().includes(needle)) return null;
    const isCollapsed = collapsed[folder.id] && !needle;
    return <div key={folder.id} className="work-flow-sidebar-folder"><div className="work-flow-sidebar-folder-row" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const boardId = event.dataTransfer.getData("application/x-work-flow-board"); if (boardId) moveBoard(boardId, workspace.id, folder.id); }}><button type="button" onClick={() => setCollapsed((current) => ({ ...current, [folder.id]: !current[folder.id] }))} style={{ paddingLeft: 10 + depth * 17 }}><ChevronDown className={`size-4 shrink-0 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} /><Folder className="size-4 shrink-0" /><span className="truncate">{folder.name}</span></button><button type="button" className="work-flow-sidebar-folder-add" onClick={() => createBoard(folder.id)} aria-label={`Add table to ${folder.name}`} title="Add table to folder"><Plus className="size-3.5" /></button></div>{!isCollapsed && <div>{ownBoards.map((board) => renderBoard(board, depth + 1))}{children.map((child) => renderFolder(child, depth + 1))}</div>}</div>;
  };
  const roots = folders.filter((folder) => !folder.parentFolderId);
  return <section>{[...roots.map((folder) => ({ ...folder, kind: "folder" })), ...visibleBoards.filter((board) => !board.folderId).map((board) => ({ ...board, kind: "board" }))].sort((left, right) => String(left.rank).localeCompare(String(right.rank))).map((entry) => entry.kind === "folder" ? renderFolder(entry) : renderBoard(entry))}{!visibleBoards.length && <p className="px-3 py-5 text-center text-xs text-[#9799a6]">{needle ? "No matching boards" : "No boards yet"}</p>}</section>;
}

function WorkFlowParitySurface({ children, boardViewContent, onNewTask, data, boards, workspaces, folders, selectedWorkspaceId, selectWorkspace, createWorkspace, createFolder, cloneWorkspace, moveBoard, cloneBoardStructure, currentId, selectBoard, views, selectedViewId, applyView, selectMainTable, updateView, duplicateView, query, setQuery, busy, saveState, searching, visibleItems, visibleColumns, collapsedGroupIds, setCollapsedGroupIds, collapsedItemIds, setCollapsedItemIds, selectedItemIds, setSelectedItemIds, toggleSelection, updateItem, moveItem, transitionItem, setSelectedItem, newName, setNewName, createItem, renameColumn, duplicateColumn, toggleColumnRestriction, updateColumnSettings, deleteColumn, persistColumnWidth, setPermissionColumn, setRelationshipColumn, setShowQueryBuilder, filterRules, setFilterRules, sortRules, setSortRules, showColumnVisibility, setShowColumnVisibility, activeViewPresentation, setActiveViewPresentation, showPersonMenu, setShowPersonMenu, personFilter, setPersonFilter, showGroupByMenu, setShowGroupByMenu, showBoardMenu, setShowBoardMenu, createGroup, editGroup, duplicateGroup, updateGroup, transitionGroup, importCsv, exportCsv, setShowMondayImport, setSurface, showTools, setShowTools, setShowBoardSettings, setShowColumnBuilder, createBoard, duplicateBoard, transitionBoard, openBoardDiscussion, openBoardActivity, openRecovery, showAddViewMenu, setShowAddViewMenu, createView, peopleOptions, teamOptions, loadMoreItems, loadingMore, pageKey, canLoadMore, childPages, loadingChildIds, loadMoreSubitems, viewsCollapsed, setViewsCollapsed, canViewInvoices }) {
  const [showHeaderBoardMenu, setShowHeaderBoardMenu] = useState(false);
  const [showNewTaskMenu, setShowNewTaskMenu] = useState(false);
  const toolsMenuRef = useDismissibleLayer(showTools, () => setShowTools(false));
  const headerMenuRef = useDismissibleLayer(showHeaderBoardMenu, () => setShowHeaderBoardMenu(false));
  const hideMenuRef = useDismissibleLayer(showColumnVisibility, () => setShowColumnVisibility(false));
  const personMenuRef = useDismissibleLayer(showPersonMenu, () => setShowPersonMenu(false));
  const groupMenuRef = useDismissibleLayer(showGroupByMenu, () => setShowGroupByMenu(false));
  const boardMenuRef = useDismissibleLayer(showBoardMenu, () => setShowBoardMenu(false));
  const addViewMenuRef = useDismissibleLayer(showAddViewMenu, () => setShowAddViewMenu(false));
  const newTaskMenuRef = useRef(null);
  useEffect(() => {
    const closeMenu = (event) => {
      if (event.type === "pointerdown" && newTaskMenuRef.current?.contains(event.target)) return;
      if (event.type === "keydown" && event.key !== "Escape") return;
      setShowNewTaskMenu(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeMenu);
    return () => { document.removeEventListener("pointerdown", closeMenu); document.removeEventListener("keydown", closeMenu); };
  }, []);
  const [openViewMenuId, setOpenViewMenuId] = useState("");
  const viewMenuRef = useDismissibleLayer(Boolean(openViewMenuId), () => setOpenViewMenuId(""));
  const [favorite, setFavorite] = useState(Boolean(data.board.favorite));
  const workspacePanelOpen = false; const setWorkspacePanelOpen = () => {};
  const [boardSearch, setBoardSearch] = useState("");
  const [showConditionalFormatting, setShowConditionalFormatting] = useState(false);
  const [connectedBoardColumn, setConnectedBoardColumn] = useState(null);
  const [gridWindows, setGridWindows] = useState({});
  const [focusedColumnId, setFocusedColumnId] = useState("");
  const [draggedItemId, setDraggedItemId] = useState("");
  const [dragPreview, setDragPreview] = useState(null);
  const [draggedColumnId, setDraggedColumnId] = useState("");
  const [draggedGroupId, setDraggedGroupId] = useState("");
  const [groupDropTarget, setGroupDropTarget] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  useEffect(() => { setFavorite(Boolean(data.board.favorite)); }, [data.board.favorite, data.board.id]);
  const toggleFavorite = async () => {
    const previous = favorite;
    const next = !previous;
    setFavorite(next);
    try { await api(`/api/work-flow/v1/boards/${data.board.id}/favorite`, { method: "PATCH", body: JSON.stringify({ favorite: next }) }); }
    catch { setFavorite(previous); }
  };
  const peopleColumns = useMemo(() => data.columns.filter((column) => ["person_refs", "team_refs", "assignee_refs", "people", "person", "team_assignees"].includes(column.type)), [data.columns]);
  const people = useMemo(() => [...new Map(data.items.flatMap((item) => peopleColumns.flatMap((column) => { const value = item.values?.[column.id]; return (Array.isArray(value) ? value : value ? [value] : []).map((entry) => [String(entry?.id || entry), entry?.label || entry?.name || String(entry?.id || entry)]); }))).entries()], [data.items, peopleColumns]);
  const groupByColumn = data.columns.find((column) => column.id === activeViewPresentation?.groupByColumnId);
  const nameColumn = data.columns.find((column) => column.type === "name") || { id: "item.name", label: "Task", type: "name" };
  const taskWrapped = activeViewPresentation?.wrapColumnIds?.includes(nameColumn.id);
  const columnWidths = activeViewPresentation?.columnWidths || {};
  const startItemDrag = (event, item) => { if (busy) return; setDraggedItemId(item.id); setDragPreview({ name: item.name, x: event.clientX, y: event.clientY }); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application/x-work-flow-item", item.id); event.dataTransfer.setData("text/plain", item.name); };
  const dropItemInGroup = async (event, groupId) => { event.preventDefault(); const itemId = event.dataTransfer.getData("application/x-work-flow-item") || draggedItemId; const item = data.items.find((entry) => entry.id === itemId); setDraggedItemId(""); setDragPreview(null); if (!item || item.groupId === groupId) return; await moveItem(item, groupId, null); };
  const handleGridKeyDown = (event) => {
    const cell = event.target.closest?.("[data-grid-cell]");
    if (!cell) return;
    if (event.key === "Escape" && event.target !== cell) { event.target.blur(); cell.focus(); return; }
    if (event.target !== cell) return;
    if (event.key === "Enter") {
      const editor = cell.querySelector('input:not([type="hidden"]), textarea, select, button:not([disabled])');
      if (editor) { event.preventDefault(); editor.focus(); if (editor.matches('input:not([type="checkbox"]), textarea')) editor.select?.(); }
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const row = cell.closest("[data-grid-row]");
    const table = cell.closest("table");
    const rows = [...(table?.querySelectorAll("[data-grid-row]") || [])];
    const rowIndex = rows.indexOf(row);
    const columnIndex = Number(cell.dataset.gridCell);
    const nextRowIndex = event.key === "ArrowUp" ? rowIndex - 1 : event.key === "ArrowDown" ? rowIndex + 1 : rowIndex;
    const nextColumnIndex = event.key === "ArrowLeft" ? columnIndex - 1 : event.key === "ArrowRight" ? columnIndex + 1 : columnIndex;
    const next = rows[nextRowIndex]?.querySelector(`[data-grid-cell="${nextColumnIndex}"]`);
    if (next) { event.preventDefault(); next.focus(); }
    else if (rows[nextRowIndex] && nextColumnIndex >= 2) {
      const target = visibleColumns.filter(column => column.type !== 'name')[nextColumnIndex - 2];
      if (target) {
        event.preventDefault(); setFocusedColumnId(target.id);
        requestAnimationFrame(() => { const revealed = rows[nextRowIndex]?.querySelector(`[data-grid-cell="${nextColumnIndex}"]`); revealed?.focus(); revealed?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }); });
      }
    }
  };
  const resizeColumn = (column, width, commit = false) => { const rounded = Math.round(width); setActiveViewPresentation((current) => ({ ...current, columnWidths: { ...(current.columnWidths || {}), [column.id]: rounded } })); if (commit && rounded !== Number(column.width || (column.type === "name" ? 360 : 150))) persistColumnWidth(column, rounded); };
  const moveColumn = (columnId, direction) => setActiveViewPresentation((current) => { const currentOrder = Array.isArray(current.columnOrder) && current.columnOrder.length ? current.columnOrder : data.columns.map((column) => column.id); const order = [...currentOrder]; const index = order.indexOf(columnId); const target = index + direction; if (index < 0 || target < 1 || target >= order.length) return current; [order[index], order[target]] = [order[target], order[index]]; return { ...current, columnOrder: order }; });
  const reorderColumn = (sourceId, targetId) => { if (!sourceId || sourceId === targetId) return; setActiveViewPresentation((current) => { const currentOrder = Array.isArray(current.columnOrder) && current.columnOrder.length ? current.columnOrder : data.columns.map((column) => column.id); const order = currentOrder.filter((id) => id !== sourceId); const targetIndex = order.indexOf(targetId); if (targetIndex < 0) return current; order.splice(targetIndex, 0, sourceId); return { ...current, columnOrder: order }; }); };
  const renderedGroups = useMemo(() => {
    if (groupByColumn) {
      const buckets = new Map();
      const options = new Map((groupByColumn.settings?.options || []).map((option) => [option.id, option]));
      for (const item of visibleItems) {
        const raw = item.values?.[groupByColumn.id];
        const key = options.get(raw)?.label || displayValue(raw, groupByColumn) || "No value";
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(item);
      }
      const labelOrder = new Map((groupByColumn.settings?.options || []).map((option, index) => [option.label, index]));
      const entries = [...buckets.entries()];
      if (groupByColumn.type === "status") entries.sort(([left], [right]) => (labelOrder.get(left) ?? Number.MAX_SAFE_INTEGER) - (labelOrder.get(right) ?? Number.MAX_SAFE_INTEGER));
      return entries.map(([title, items], index) => ({ id: `group-by:${groupByColumn.id}:${title}`, title, color: options.get(items[0]?.values?.[groupByColumn.id])?.color || ["#579bfc", "#00c875", "#fdab3d", "#a25ddc"][index % 4], items, sourceGroupId: items[0]?.groupId || data.groups[0]?.id }));
    }
    const itemsByGroup = new Map(data.groups.map((group) => [group.id, []]));
    for (const item of visibleItems) itemsByGroup.get(item.groupId)?.push(item);
    return data.groups.map((group) => ({ ...group, items: itemsByGroup.get(group.id), sourceGroupId: group.id }));
  }, [data.groups, groupByColumn, visibleItems]);
  const workspace = workspaces.find((entry) => entry.id === selectedWorkspaceId) || workspaces.find((entry) => entry.id === data.board.workspaceId) || { id: data.board.workspaceId, name: "Workspace" };
  const workspaceBoards = boards.filter((board) => board.workspaceId === workspace.id);
  const favoriteBoards = workspaceBoards.filter((board) => board.favorite && board.name.toLowerCase().includes(boardSearch.trim().toLowerCase()));
  const permissionSet = new Set(Array.isArray(data.permissions) ? data.permissions : []);
  const filterColumn = (column) => {
    const fieldId = column.type === "name" ? "item.name" : column.id;
    setFilterRules((current) => current.some((rule) => rule.fieldId === fieldId) ? current : [...current, { id: crypto.randomUUID(), fieldId, op: "eq", value: "", combinator: current[0]?.combinator || "and" }]);
    setShowQueryBuilder(true);
  };
  const hasPermission = (permission) => !Array.isArray(data.permissions) || permissionSet.has(permission);
  const pointForContextEvent = (event) => {
    if (event.clientX || event.clientY) return { x: event.clientX, y: event.clientY };
    const rect = event.target.getBoundingClientRect?.();
    return { x: rect ? rect.left + 12 : 24, y: rect ? rect.bottom + 4 : 24 };
  };
  const openPointerMenu = (event, menu) => {
    const returnFocus = event.target.closest?.("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({ ...pointForContextEvent(event), returnFocus, ...menu });
  };
  const boardUrl = (boardId) => { const url = new URL(window.location.href); url.searchParams.set("board", boardId); url.searchParams.set("tab", "workflow"); return url.toString(); };
  const handleContextMenu = (event) => {
    if (event.target.closest?.("input, textarea, select, [contenteditable=true], [data-work-flow-popover]")) return;
    const sidebar = event.target.closest?.(".work-flow-workspace-panel nav");
    const sidebarButton = sidebar && event.target.closest?.("button");
    if (sidebarButton && !sidebarButton.classList.contains("work-flow-workspace-panel__new")) {
      const board = boards.find((candidate) => candidate.id === sidebarButton.dataset.boardId);
      if (board) {
        const current = board.id === currentId;
        openPointerMenu(event, { label: `${board.name} board actions`, title: board.name, items: [
          { label: "Open board", icon: <LayoutDashboard className="size-4" />, action: () => selectBoard(board.id) },
          { label: "Open in new tab", icon: <ExternalLink className="size-4" />, action: () => window.open(boardUrl(board.id), "_blank", "noopener,noreferrer") },
          { label: "Copy board link", icon: <Link2 className="size-4" />, action: () => navigator.clipboard?.writeText(boardUrl(board.id)) },
          ...(current ? [{ separator: true }, { label: favorite ? "Remove from favorites" : "Add to favorites", icon: <span className="w-4 text-center">{favorite ? "★" : "☆"}</span>, action: toggleFavorite }, { label: "Duplicate board", icon: <Copy className="size-4" />, disabled: !hasPermission("board.configure"), action: duplicateBoard }, { label: "Board settings", icon: <Settings2 className="size-4" />, disabled: !hasPermission("board.configure"), action: () => setShowBoardSettings(true) }, { label: "Activity log", icon: <History className="size-4" />, action: openBoardActivity }, { separator: true }, { label: "Archive board", icon: <Archive className="size-4" />, disabled: !hasPermission("board.configure"), action: () => transitionBoard("archive") }, { label: "Move board to trash", icon: <Trash2 className="size-4" />, danger: true, disabled: !hasPermission("board.delete"), action: () => transitionBoard("trash") }] : []),
        ] });
        return;
      }
    }
    if (sidebar && !sidebarButton) {
      openPointerMenu(event, { label: "Workspace sidebar actions", title: "Rebuildit Operations", items: [
        { label: "New board", icon: <Plus className="size-4" />, action: createBoard },
        { label: "Archive and recycle bin", icon: <Archive className="size-4" />, action: openRecovery },
        { label: "Collapse sidebar", icon: <PanelLeftClose className="size-4" />, action: () => setWorkspacePanelOpen(false) },
      ] });
      return;
    }
    const row = event.target.closest?.("[data-grid-row]");
    if (row) {
      if (hasPermission("item.update") || hasPermission("item.create") || hasPermission("item.archive") || hasPermission("item.trash")) { event.preventDefault(); row.querySelector('button[aria-label^="More options for"]')?.click(); return; }
      const item = data.items.find((candidate) => candidate.id === row.dataset.gridRow);
      if (item) openPointerMenu(event, { label: `${item.name} item actions`, title: item.name, items: [
        { label: "Open task", icon: <MessageSquare className="size-4" />, action: () => setSelectedItem(item) },
        { label: "Open in new tab", icon: <ExternalLink className="size-4" />, action: () => { const url = new URL(boardUrl(data.board.id)); url.searchParams.set("target", `item:${item.id}`); window.open(url.toString(), "_blank", "noopener,noreferrer"); } },
        { label: "Copy task link", icon: <Link2 className="size-4" />, action: () => { const url = new URL(boardUrl(data.board.id)); url.searchParams.set("target", `item:${item.id}`); navigator.clipboard?.writeText(url.toString()); } },
      ] });
      return;
    }
    const groupHeading = event.target.closest?.(".work-flow-group__heading");
    if (groupHeading) {
      if (hasPermission("board.configure")) { event.preventDefault(); groupHeading.querySelector('button[aria-label$=" options"]')?.click(); return; }
      const group = renderedGroups.find((candidate) => candidate.title === groupHeading.querySelector("h2")?.textContent);
      if (group) openPointerMenu(event, { label: `${group.title} group actions`, title: group.title, items: [
        { label: collapsedGroupIds.includes(group.id) ? "Expand group" : "Collapse group", icon: <ChevronDown className="size-4" />, action: () => setCollapsedGroupIds((current) => current.includes(group.id) ? current.filter((id) => id !== group.id) : [...current, group.id]) },
        { label: "Select all tasks", icon: <CheckSquare2 className="size-4" />, action: () => group.items.forEach((item) => { if (!selectedItemIds.includes(item.id)) toggleSelection(item.id); }) },
        { label: "Export group", icon: <Download className="size-4" />, action: () => exportCsv(group.sourceGroupId) },
      ] });
      return;
    }
    const columnHeader = event.target.closest?.("th");
    if (columnHeader) { const trigger = columnHeader.querySelector('button[aria-label$=" column options"]'); if (trigger) { if (hasPermission("board.configure")) { event.preventDefault(); trigger.click(); return; } const column = data.columns.find((candidate) => trigger.getAttribute("aria-label") === `${candidate.label} column options`); if (column) openPointerMenu(event, { label: `${column.label} column actions`, title: column.label, items: [{ label: "Sort ascending", icon: <ArrowUpDown className="size-4" />, action: () => { setSortRules((current) => [...current.filter((rule) => rule.fieldId !== column.id), { id: crypto.randomUUID(), fieldId: column.type === "name" ? "item.name" : column.id, direction: "asc", nulls: "last" }]); setShowQueryBuilder(true); } }, { label: "Sort descending", icon: <ArrowUpDown className="size-4 rotate-180" />, action: () => { setSortRules((current) => [...current.filter((rule) => rule.fieldId !== column.id), { id: crypto.randomUUID(), fieldId: column.type === "name" ? "item.name" : column.id, direction: "desc", nulls: "last" }]); setShowQueryBuilder(true); } }, { label: "Filter by this column", icon: <Filter className="size-4" />, action: () => setShowQueryBuilder(true) }, { label: "Explore relationships", icon: <Network className="size-4" />, action: () => setRelationshipColumn(column) } ] }); return; } }
    const viewNav = event.target.closest?.('[aria-label="Board views"]');
    if (viewNav) { const viewButton = event.target.closest?.("button"); const menuButton = viewButton?.nextElementSibling?.matches?.('button[aria-label$=" view menu"]') ? viewButton.nextElementSibling : viewButton?.matches?.('button[aria-label$=" view menu"]') ? viewButton : null; if (menuButton) { if (hasPermission("view.update")) { event.preventDefault(); menuButton.click(); return; } const view = views.find((candidate) => `${candidate.name} view menu` === menuButton.getAttribute("aria-label")); if (view) openPointerMenu(event, { label: `${view.name} view actions`, title: view.name, items: [{ label: "Open view", icon: <EyeOff className="size-4" />, action: () => applyView(view) }, { label: "Duplicate view", icon: <Copy className="size-4" />, disabled: !hasPermission("view.create"), action: () => duplicateView(view) }] }); return; } }
    const header = event.target.closest?.(".work-flow-parity__header");
    if (header) {
      openPointerMenu(event, { label: "Current board actions", title: data.board.name, items: [
        { label: "Copy board link", icon: <Link2 className="size-4" />, action: () => navigator.clipboard?.writeText(boardUrl(data.board.id)) },
        { label: favorite ? "Remove from favorites" : "Add to favorites", icon: <span className="w-4 text-center">{favorite ? "★" : "☆"}</span>, action: toggleFavorite },
        { label: "Duplicate board", icon: <Copy className="size-4" />, disabled: !hasPermission("board.configure"), action: duplicateBoard },
        { label: "Board settings", icon: <Settings2 className="size-4" />, disabled: !hasPermission("board.configure"), action: () => setShowBoardSettings(true) },
        { label: "Activity log", icon: <History className="size-4" />, action: openBoardActivity },
        { separator: true },
        { label: "Archive board", icon: <Archive className="size-4" />, disabled: !hasPermission("board.configure"), action: () => transitionBoard("archive") },
        { label: "Move board to trash", icon: <Trash2 className="size-4" />, danger: true, disabled: !hasPermission("board.delete"), action: () => transitionBoard("trash") },
      ] });
      return;
    }
    const main = event.target.closest?.("main");
    if (main) openPointerMenu(event, { label: "Board workspace actions", title: data.board.name, items: [
      { label: "New task", icon: <Plus className="size-4" />, disabled: !hasPermission("item.create"), action: onNewTask },
      { label: "New group", icon: <LayoutTemplate className="size-4" />, disabled: !hasPermission("board.configure"), action: createGroup },
      { label: "Add column", icon: <Table2 className="size-4" />, disabled: !hasPermission("board.configure"), action: () => setShowColumnBuilder(true) },
      { separator: true },
      { label: "Search and filter", icon: <Filter className="size-4" />, action: () => setShowQueryBuilder(true) },
      { label: "Expand all groups", icon: <ChevronDown className="size-4" />, action: () => setCollapsedGroupIds([]) },
      { label: "Collapse all groups", icon: <ChevronDown className="size-4 -rotate-90" />, action: () => setCollapsedGroupIds(renderedGroups.map((group) => group.id)) },
      { label: "Board settings", icon: <Settings2 className="size-4" />, disabled: !hasPermission("board.configure"), action: () => setShowBoardSettings(true) },
      { label: "Activity log", icon: <History className="size-4" />, action: openBoardActivity },
      { separator: true },
      { label: "Export board", icon: <Download className="size-4" />, action: () => exportCsv() },
      { label: "Import from Monday", icon: <FileInput className="size-4" />, disabled: !hasPermission("board.configure"), action: () => setShowMondayImport(true) },
    ] });
  };
  const handleContextKey = (event) => { if (contextMenuKey(event)) handleContextMenu(event); };
  return <div onContextMenu={handleContextMenu} onKeyDown={handleContextKey} className={`work-flow-parity ${workspacePanelOpen ? "has-workspace-panel" : ""}`}>
    {workspacePanelOpen && <button type="button" className="work-flow-workspace-backdrop" onClick={() => setWorkspacePanelOpen(false)} aria-label="Close workspace navigation" />}
     <AnimatePresence initial={false}>{workspacePanelOpen && <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 420, damping: 40 }} className="work-flow-workspace-panel"><div className="work-flow-workspace-panel__top"><SiteSelect aria-label="Workspace" value={workspace.id} onChange={(event) => selectWorkspace(event.target.value)}>{workspaces.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</SiteSelect><button onClick={() => setWorkspacePanelOpen(false)} className="work-flow-icon-button" aria-label="Collapse workspace navigation"><PanelLeftClose className="size-4" /></button></div><div className="work-flow-workspace-panel__search"><Search className="size-4" /><input value={boardSearch} onChange={(event) => setBoardSearch(event.target.value)} placeholder="Search boards" aria-label="Search workspace boards" /></div><nav aria-label="Workspace boards"><div className="work-flow-sidebar-toolbar"><MenuDisclosure className="work-flow-sidebar-menu"><summary><Plus className="size-4" />Add<ChevronDown className="size-3.5" /></summary><div><button type="button" onClick={() => createBoard(null)}><Table2 className="size-4" />New table</button><button type="button" onClick={() => createFolder(null)}><FolderPlus className="size-4" />New folder</button><button type="button" onClick={createWorkspace}><Plus className="size-4" />New workspace</button></div></MenuDisclosure><MenuDisclosure className="work-flow-sidebar-menu work-flow-sidebar-menu--more"><summary aria-label="Workspace options"><MoreHorizontal className="size-5" /></summary><div><button type="button" onClick={() => cloneWorkspace(false)}><Copy className="size-4" /><span>Copy workspace layout<small>Folders and tables, without entries</small></span></button><button type="button" onClick={() => cloneWorkspace(true)}><Copy className="size-4" /><span>Copy entire workspace<small>Includes all entries</small></span></button><button type="button" onClick={cloneBoardStructure}><Table2 className="size-4" /><span>Copy this table layout<small>Columns and groups, without entries</small></span></button></div></MenuDisclosure></div>{favoriteBoards.length > 0 && <section><p className="work-flow-workspace-panel__label">Favorites</p>{favoriteBoards.map((board) => <button key={`favorite:${board.id}`} data-board-id={board.id} onClick={() => selectBoard(board.id)} className={board.id === currentId ? "is-active" : ""}><span className="text-[#fdab3d]">★</span><span className="truncate">{board.name}</span></button>)}</section>}<WorkspaceSidebarTree workspace={workspace} folders={folders.filter((folder) => folder.workspaceId === workspace.id)} boards={workspaceBoards} search={boardSearch} currentId={currentId} selectBoard={selectBoard} createBoard={createBoard} createFolder={createFolder} moveBoard={moveBoard} /></nav><button onClick={openRecovery} className="work-flow-workspace-panel__footer"><Archive className="size-4" />Archive &amp; recycle bin</button></motion.aside>}</AnimatePresence>
    <header className="work-flow-parity__header">
      <div className="work-flow-parity__title-row">
        
        <div className="min-w-0">
          <h1 className="m-0 max-w-[34rem] truncate text-[26px] font-semibold leading-8 tracking-tight">{data.board.name}</h1>
        </div>
        <div className="flex items-center gap-1">
          <AnimatePresence mode="wait">{saveState.status !== "idle" && <motion.div key={saveState.status} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mr-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium ${saveState.status === "error" ? "bg-red-50 text-[#d83a52]" : saveState.status === "saved" ? "bg-emerald-50 text-emerald-700" : "bg-[#f5f6f8] text-[#676879]"}`} aria-live="polite">{saveState.status === "saving" ? <Loader2 className="size-3.5 animate-spin" /> : saveState.status === "saved" ? <Check className="size-3.5" /> : <CircleAlert className="size-3.5" />}{saveState.status === "saving" ? "Saving…" : saveState.status === "saved" ? "Saved" : "Not saved"}</motion.div>}</AnimatePresence>
          <button onClick={() => setSurface("Notifications")} className="work-flow-icon-button" aria-label="Update feed"><Bell className="size-4" /></button>
          <button onClick={() => setSurface("My Work")} className="work-flow-tool"><CheckSquare2 className="size-4" />My Work</button>
          <button onClick={() => setSurface("Automations")} className="work-flow-tool"><Bot className="size-4" />Automate</button>
          <div ref={toolsMenuRef} className="relative"><button onClick={() => setShowTools((current) => !current)} className="work-flow-tool" aria-expanded={showTools}><Settings2 className="size-4" />Tools<ChevronDown className="size-3.5" /></button>{showTools && <div className="absolute right-0 top-9 z-40 w-48 overflow-hidden rounded-md border border-[#d0d4e4] bg-white py-1 shadow-xl">{["Forms", "Documents", "Dashboards", "Templates"].map((label) => <button key={label} onClick={() => { setSurface(label); setShowTools(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">{label}</button>)}<div className="my-1 border-t border-[#d0d4e4]" /><button onClick={() => { setShowBoardSettings(true); setShowTools(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Board settings</button><button onClick={() => { setShowColumnBuilder(true); setShowTools(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Add column</button><button onClick={() => { createBoard(); setShowTools(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">New board</button></div>}</div>
          <button onClick={openBoardDiscussion} className="work-flow-icon-button" aria-label="Start a board discussion"><MessageSquare className="size-4" /></button>
          <button onClick={() => setShowBoardSettings(true)} className="work-flow-tool" aria-label="Invite board members"><Plus className="size-4" /><span>Invite</span></button>
          <button onClick={() => { const url = new URL(window.location.href); url.searchParams.set("board", data.board.id); navigator.clipboard?.writeText(url.toString()); }} className="work-flow-icon-button" aria-label="Copy board link"><Link2 className="size-4" /></button>
          <button onClick={toggleFavorite} className={`work-flow-icon-button ${favorite ? "text-[#fdab3d]" : ""}`} aria-label={favorite ? "Remove board from favorites" : "Add board to favorites"} aria-pressed={favorite}>{favorite ? "★" : "☆"}</button>
          <div ref={headerMenuRef} className="relative"><button onClick={() => setShowHeaderBoardMenu((current) => !current)} className="work-flow-icon-button" aria-label="Board menu" aria-expanded={showHeaderBoardMenu}><MoreHorizontal className="size-5" /></button>{showHeaderBoardMenu && <div className="absolute right-0 top-9 z-40 w-60 overflow-hidden rounded-md border border-[#d0d4e4] bg-white py-1 shadow-xl"><button onClick={() => { setShowBoardSettings(true); setShowHeaderBoardMenu(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Board settings</button><button onClick={() => { openBoardActivity(); setShowHeaderBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><History className="size-4" />Activity log</button><button onClick={() => { openRecovery(); setShowHeaderBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><Archive className="size-4" />Archive &amp; recycle bin</button><button onClick={() => { duplicateBoard(); setShowHeaderBoardMenu(false); }} disabled={busy} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><Copy className="size-4" />Duplicate board</button><button onClick={() => { setShowColumnBuilder(true); setShowHeaderBoardMenu(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Add column</button><button onClick={() => { createGroup(); setShowHeaderBoardMenu(false); }} disabled={busy} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">New group</button><div className="my-1 border-t border-[#d0d4e4]" /><button onClick={() => { setShowMondayImport(true); setShowHeaderBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><FileInput className="size-4" />Import from Monday</button><label className="block cursor-pointer px-3 py-2 text-sm hover:bg-[#f5f6f8]">Import CSV<input type="file" accept=".csv,text/csv" disabled={busy} className="sr-only" onChange={(event) => { importCsv(event.target.files?.[0]); event.target.value = ""; setShowHeaderBoardMenu(false); }} /></label><button onClick={() => { exportCsv(); setShowHeaderBoardMenu(false); }} disabled={busy} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Export CSV</button><button onClick={() => { createBoard(); setShowHeaderBoardMenu(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">New board</button><div className="my-1 border-t border-[#d0d4e4]" />{data.board.state === "archived" ? <button onClick={() => { transitionBoard("restore"); setShowHeaderBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><RotateCcw className="size-4" />Restore board</button> : <button onClick={() => { transitionBoard("archive"); setShowHeaderBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><Archive className="size-4" />Archive board</button>}<button onClick={() => { transitionBoard("trash"); setShowHeaderBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#d83a52] hover:bg-[#f5f6f8]"><Trash2 className="size-4" />Move to trash</button></div>}</div>
        </div>
      </div>
      {!viewsCollapsed && <nav className={`work-flow-parity__views ${openViewMenuId || showAddViewMenu ? "has-open-menu" : ""}`} aria-label="Board views">
        <button onClick={selectMainTable} className={!selectedViewId ? "is-active" : ""}>Main table</button>
        {views.map((view) => <div key={view.id} ref={openViewMenuId === view.id ? viewMenuRef : undefined} className={`relative flex items-center ${selectedViewId === view.id ? "is-active" : ""}`}><button onClick={() => applyView(view)} className={selectedViewId === view.id ? "is-active pr-0" : "pr-0"}>{view.name}</button><button aria-label={`${view.name} view menu`} aria-expanded={openViewMenuId === view.id} onClick={() => setOpenViewMenuId((current) => current === view.id ? "" : view.id)} className="px-1 py-2 text-[#676879] hover:text-[#323338]"><ChevronDown className="size-3.5" /></button>{openViewMenuId === view.id && <motion.div initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="absolute left-0 top-10 z-50 w-56 rounded-lg border border-[#d0d4e4] bg-white p-1.5 text-[#323338] shadow-xl"><button onClick={() => { updateView(view, "rename"); setOpenViewMenuId(""); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Rename view</button><button onClick={() => { duplicateView(view); setOpenViewMenuId(""); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Duplicate view</button><button onClick={() => { updateView(view, view.activeVersion?.presentation?.pinned ? "unpin" : "pin"); setOpenViewMenuId(""); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">{view.activeVersion?.presentation?.pinned ? "Unpin view" : "Pin view"}</button><button onClick={() => { updateView(view, view.activeVersion?.presentation?.locked ? "unlock" : "lock"); setOpenViewMenuId(""); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">{view.activeVersion?.presentation?.locked ? "Unlock view" : "Lock view"}</button><button onClick={() => { updateView(view, view.scope === "personal" ? "shared" : "personal"); setOpenViewMenuId(""); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Make {view.scope === "personal" ? "shared" : "personal"}</button><div className="my-1 border-t border-[#d0d4e4]" /><button onClick={() => { updateView(view, "delete"); setOpenViewMenuId(""); }} className="block w-full rounded-md px-3 py-2 text-left text-sm text-[#e2445c] hover:bg-[#fff0f2]">Delete view</button></motion.div>}</div>)}
        <div ref={addViewMenuRef} className="relative"><button onClick={() => setShowAddViewMenu((current) => !current)} aria-label="Save current view" aria-expanded={showAddViewMenu} className="inline-flex items-center gap-1"><Plus className="size-4" />Add view</button>{showAddViewMenu && <div className="absolute left-0 top-9 z-40 max-h-96 w-44 overflow-y-auto rounded-md border border-[#d0d4e4] bg-white py-1 shadow-xl">{VIEW_OPTIONS.map((option) => <button key={option.id} onClick={() => createView(option.id)} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">{option.label}</button>)}</div>}</div>
      </nav>}
    </header>

    <main className="work-flow-parity__body">
      <div className="work-flow-parity__toolbar">
        {viewsCollapsed && <CompactBoardViewSelector views={views} selectedViewId={selectedViewId} selectMainTable={selectMainTable} applyView={applyView} />}
        <div className="relative flex" ref={newTaskMenuRef} data-new-task-menu><button onClick={boardViewContent ? onNewTask : () => document.querySelector('.work-flow-parity input[placeholder="Add task"]')?.focus()} disabled={busy} className="work-flow-primary rounded-r-none pr-3"><Plus className="size-4" />New task</button><button onClick={() => setShowNewTaskMenu((current) => !current)} disabled={busy} aria-label="New item options" aria-expanded={showNewTaskMenu} className="grid h-8 w-8 place-items-center rounded-r-md border-l border-white/30 bg-[#0073ea] text-white hover:bg-[#0060b9]"><ChevronDown className="size-4 text-white" style={{ color: "#fff", stroke: "#fff" }} /></button><AnimatePresence>{showNewTaskMenu && <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.14 }} className="absolute left-0 top-10 z-40 w-60 rounded-lg border border-[#d0d4e4] bg-white p-1.5 shadow-xl"><button onClick={() => { createGroup(); setShowNewTaskMenu(false); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm hover:bg-[#f5f6f8]"><span className="grid size-8 place-items-center rounded-md bg-[#e6f4ff] text-[#0073ea]"><Plus className="size-4" /></span><span><span className="block font-medium">New group of tasks</span><span className="block text-xs text-[#676879]">Create another workflow section</span></span></button><label className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-[#f5f6f8]"><span className="grid size-8 place-items-center rounded-md bg-[#f0f0ff] text-[#a25ddc]"><Upload className="size-4" /></span><span><span className="block font-medium">Import tasks</span><span className="block text-xs text-[#676879]">Add tasks from a CSV file</span></span><input type="file" accept=".csv,text/csv" disabled={busy} className="sr-only" onChange={(event) => { importCsv(event.target.files?.[0]); event.target.value = ""; setShowNewTaskMenu(false); }} /></label></motion.div>}</AnimatePresence></div>
        <label className="work-flow-tool">{searching ? <Loader2 className="size-4 animate-spin" aria-label="Searching board" /> : <Search className="size-4" />}<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /></label>
        <div ref={personMenuRef} className="relative"><button aria-expanded={showPersonMenu} onClick={() => setShowPersonMenu((current) => !current)} className={`work-flow-tool ${personFilter ? "bg-[#cce5ff]" : ""}`}><span className="size-5 rounded-full bg-[#c4c4c4]" />Person{personFilter ? " (1)" : ""}</button>{showPersonMenu && <div className="absolute left-0 top-9 z-40 w-60 rounded-md border border-[#d0d4e4] bg-white py-1 shadow-xl"><button onClick={() => { setPersonFilter(""); setShowPersonMenu(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">All people</button>{people.map(([id, label]) => <button key={id} onClick={() => { setPersonFilter(id); setShowPersonMenu(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">{label}</button>)}{!peopleColumns.length && <button onClick={() => { setShowColumnBuilder({ initialType: "person_refs" }); setShowPersonMenu(false); }} className="block w-full px-3 py-2 text-left text-sm text-[#0073ea] hover:bg-[#f5f6f8]">Add a People column</button>}{peopleColumns.length > 0 && !people.length && <p className="px-3 py-2 text-sm text-[#676879]">No people assigned yet.</p>}</div>}</div>
        <button onClick={() => setShowQueryBuilder((current) => !current)} data-selector-trigger="work-flow-query-builder" aria-label="Filter & sort" className="work-flow-tool"><Filter className="size-4" />Filter{filterRules.length ? ` (${filterRules.length})` : ""}</button>
        <button data-selector-trigger="work-flow-query-builder" onClick={() => setShowQueryBuilder(true)} className="work-flow-tool"><ArrowUpDown className="size-4" />Sort{sortRules.length ? ` (${sortRules.length})` : ""}</button>
        <div ref={hideMenuRef} className="relative"><button onClick={() => setShowColumnVisibility((current) => !current)} aria-label="Hide columns" aria-expanded={showColumnVisibility} className="work-flow-tool"><EyeOff className="size-4" />Hide</button>{showColumnVisibility && <div className="absolute left-0 top-9 z-40 w-56 rounded-md border border-[#d0d4e4] bg-white py-1 shadow-xl"><p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#9799a6]">Visible columns</p>{data.columns.filter((column) => column.type !== "name").map((column) => { const checked = visibleColumns.some((entry) => entry.id === column.id); return <label key={column.id} className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[#f5f6f8]"><input type="checkbox" aria-label={column.label} checked={checked} onChange={() => setActiveViewPresentation((current) => { const ids = Array.isArray(current.visibleColumnIds) ? current.visibleColumnIds : data.columns.map((entry) => entry.id); return { ...current, visibleColumnIds: checked ? ids.filter((id) => id !== column.id) : [...new Set([...ids, column.id])] }; })} />{column.label}</label>; })}</div>}</div>
        <div ref={groupMenuRef} className="relative"><button aria-expanded={showGroupByMenu} onClick={() => setShowGroupByMenu((current) => !current)} className={`work-flow-tool ${groupByColumn ? "bg-[#cce5ff]" : ""}`}>Group by{groupByColumn ? `: ${groupByColumn.label}` : ""}</button>{showGroupByMenu && <div className="absolute left-0 top-9 z-40 w-56 rounded-md border border-[#d0d4e4] bg-white py-1 shadow-xl"><button onClick={() => { setActiveViewPresentation((current) => ({ ...current, groupByColumnId: null })); setShowGroupByMenu(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">Board groups</button>{data.columns.filter((column) => column.type !== "name").map((column) => <button key={column.id} onClick={() => { setActiveViewPresentation((current) => ({ ...current, groupByColumnId: column.id })); setShowGroupByMenu(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]">{column.label}</button>)}</div>}</div>
        <div ref={boardMenuRef} className="relative"><button onClick={() => setShowBoardMenu((current) => !current)} className="work-flow-icon-button" aria-label="Board actions" aria-expanded={showBoardMenu}><MoreHorizontal className="size-5" /></button><AnimatePresence>{showBoardMenu && <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.14 }} className="absolute right-0 top-9 z-40 w-60 overflow-hidden rounded-md border border-[#d0d4e4] bg-white py-1 shadow-xl"><p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#9799a6]">Table actions</p><button onClick={() => { createGroup(); setShowBoardMenu(false); }} disabled={busy} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><Plus className="size-4" />New group</button><button onClick={() => { setShowColumnBuilder(true); setShowBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><Table2 className="size-4" />Add column</button><button onClick={() => { setShowConditionalFormatting(true); setShowBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><Filter className="size-4" />Conditional formatting</button><div className="px-3 py-2"><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#9799a6]">Row density</p><div className="grid grid-cols-3 gap-1 rounded-md bg-[#f5f6f8] p-1">{["compact", "comfortable", "spacious"].map((density) => <button key={density} aria-label={`${density} row density`} onClick={() => { setActiveViewPresentation((current) => ({ ...current, rowDensity: density })); setShowBoardMenu(false); }} className={`rounded px-1 py-1.5 text-[10px] capitalize ${(activeViewPresentation?.rowDensity || "comfortable") === density ? "bg-white font-semibold text-[#0073ea] shadow-sm" : "text-[#676879]"}`}>{density === "comfortable" ? "Comfy" : density}</button>)}</div></div><button onClick={() => { setCollapsedGroupIds(renderedGroups.map((group) => group.id)); setShowBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><ChevronDown className="size-4 -rotate-90" />Collapse all groups</button><button onClick={() => { setCollapsedGroupIds([]); setShowBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><ChevronDown className="size-4" />Expand all groups</button><button onClick={() => { setShowBoardSettings(true); setShowBoardMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><Settings2 className="size-4" />Board settings</button><div className="my-1 border-t border-[#d0d4e4]" /><label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[#f5f6f8]"><Upload className="size-4" />Import items<input type="file" accept=".csv,text/csv" disabled={busy} className="sr-only" onChange={(event) => { importCsv(event.target.files?.[0]); event.target.value = ""; setShowBoardMenu(false); }} /></label><button onClick={() => { exportCsv(); setShowBoardMenu(false); }} disabled={busy} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f6f8]"><Download className="size-4" />Export board</button></motion.div>}</AnimatePresence></div>
        <button type="button" onClick={() => { setViewsCollapsed((current) => !current); setOpenViewMenuId(""); setShowAddViewMenu(false); }} aria-label="Header Tabs" aria-expanded={!viewsCollapsed} className="work-flow-icon-button ml-auto" title={viewsCollapsed ? "Expand header tabs" : "Collapse header tabs"}><ChevronDown className={`size-4 transition-transform ${viewsCollapsed ? "" : "rotate-180"}`} /></button>
      </div>
      {children}
      {showConditionalFormatting && <ConditionalFormattingDialog columns={data.columns} rules={activeViewPresentation?.conditionalFormattingRules || []} onChange={(conditionalFormattingRules) => setActiveViewPresentation((current) => ({ ...current, conditionalFormattingRules }))} onClose={() => setShowConditionalFormatting(false)} />}

      {boardViewContent ? <div className="work-flow-parity__saved-view">{boardViewContent}</div> : <div className="work-flow-parity__groups">
        {renderedGroups.map((group) => {
          const groupItems = group.items;
          const items = visibleHierarchy(groupItems, collapsedItemIds);
          const childLoaderAfter = new Map();
          for (const parentId of new Set([...Object.keys(childPages), ...Object.keys(loadingChildIds)])) {
            const initialLoading = Boolean(loadingChildIds[parentId] && !childPages[parentId]);
            if ((!childPages[parentId]?.hasMoreItems && !initialLoading) || (collapsedItemIds.includes(parentId) && !initialLoading)) continue;
            const parentIndex = items.findIndex((item) => item.id === parentId);
            if (parentIndex < 0) continue;
            let lastIndex = parentIndex;
            while (lastIndex + 1 < items.length && Number(items[lastIndex + 1].depth) > Number(items[parentIndex].depth)) lastIndex += 1;
            const lastId = items[lastIndex].id;
            childLoaderAfter.set(lastId, [...(childLoaderAfter.get(lastId) || []), parentId]);
          }
          const tableRows = items.flatMap((item) => [item, ...(childLoaderAfter.get(item.id) || []).map((parentId) => ({ id: `child-loader:${parentId}`, childLoaderFor: parentId }))]);
          const renderedColumnIds = workFlowColumnWindow(visibleColumns.filter(column => column.type !== "name"), { ...gridWindows[group.id], widths: columnWidths, stickyWidth: 34 + Number(columnWidths[nameColumn.id] || nameColumn.width || 360), pinned: focusedColumnId, wrapped: activeViewPresentation?.wrapColumnIds || [] });
          const columnSegments = workFlowColumnSegments(visibleColumns.filter(column => column.type !== "name"), renderedColumnIds);
          const taskCount = groupItems.filter((item) => !item.parentItemId).length;
          const subitemCount = groupItems.length - taskCount;
          const collapsed = collapsedGroupIds.includes(group.id);
          return <section key={group.id} onDragOver={(event) => { if (!draggedGroupId && !draggedItemId) return; event.preventDefault(); event.dataTransfer.dropEffect = "move"; if (draggedGroupId && !groupByColumn) { const bounds = event.currentTarget.querySelector(".work-flow-group__heading").getBoundingClientRect(); setGroupDropTarget({ id: group.id, after: event.clientY > bounds.top + bounds.height / 2 }); } }} onDrop={(event) => {
            if (!draggedGroupId) { if (draggedItemId) dropItemInGroup(event, group.id); return; }
            event.preventDefault(); event.stopPropagation();
            const source = data.groups.find((entry) => entry.id === draggedGroupId);
            const after = groupDropTarget?.id === group.id && groupDropTarget.after;
            setDraggedGroupId(""); setGroupDropTarget(null);
            if (source && source.id !== group.id && !busy && !groupByColumn) updateGroup(source, { [after ? "moveAfterGroupId" : "moveBeforeGroupId"]: group.id });
          }} className={`work-flow-group ${draggedItemId ? "is-drag-target" : ""} ${draggedGroupId === group.id ? "is-dragging-group" : ""} ${draggedGroupId && draggedGroupId !== group.id && groupDropTarget?.id === group.id ? groupDropTarget.after ? "group-drop-after" : "group-drop-before" : ""}`} style={{ "--group-color": group.color || "#579bfc" }}>
            <div className="work-flow-group__heading">
              {!groupByColumn && hasPermission("board.configure") && <button type="button" className="work-flow-group__drag" disabled={busy} draggable={!busy} aria-label={`Reorder ${group.title}`} title="Drag to reorder for everyone. Alt + Up or Down also moves this group." onDragStart={(event) => { event.stopPropagation(); setDraggedGroupId(group.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application/x-work-flow-group", group.id); }} onDragEnd={() => { setDraggedGroupId(""); setGroupDropTarget(null); }} onKeyDown={(event) => {
                if (!event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key) || busy) return;
                event.preventDefault(); const index = data.groups.findIndex((entry) => entry.id === group.id); const target = data.groups[index + (event.key === "ArrowUp" ? -1 : 1)];
                if (target) updateGroup(group, { [event.key === "ArrowUp" ? "moveBeforeGroupId" : "moveAfterGroupId"]: target.id });
              }}><GripVertical className="size-4" /></button>}
              <button type="button" onClick={() => setCollapsedGroupIds((current) => current.includes(group.id) ? current.filter((id) => id !== group.id) : [...current, group.id])} aria-label={`${collapsed ? "Expand" : "Collapse"} ${group.title}`} aria-expanded={!collapsed}><ChevronDown className={`size-4 ${collapsed ? "-rotate-90" : ""}`} /></button>
              <h2>{group.title}</h2>{!groupByColumn && <GroupActionMenu group={group} busy={busy} items={groupItems} allGroups={data.groups} onCollapse={() => setCollapsedGroupIds((current) => [...new Set([...current, group.id])])} onCollapseAll={() => setCollapsedGroupIds(renderedGroups.map((entry) => entry.id))} onSelectAll={() => { const ids = groupItems.map((item) => item.id); setSelectedItemIds((current) => [...new Set([...current, ...ids])]); }} onExpandSubitems={() => setCollapsedItemIds((current) => current.filter((id) => !groupItems.some((item) => item.id === id)))} onCollapseSubitems={() => setCollapsedItemIds((current) => [...new Set([...current, ...groupItems.filter((item) => item.childCount > 0).map((item) => item.id)])])} onAddGroup={createGroup} onDuplicate={() => duplicateGroup(group)} onMove={(target) => updateGroup(group, { moveBeforeGroupId: target.id })} onRename={() => editGroup(group)} onColor={(color) => updateGroup(group, { color })} onExport={() => exportCsv(group.id)} onArchive={() => transitionGroup(group, "archived")} onTrash={() => transitionGroup(group, "trashed")} />}<span>{taskCount} {taskCount === 1 ? "task" : "tasks"}{subitemCount ? ` / ${subitemCount} subitems` : ""}</span>
            </div>
{!collapsed && <WorkFlowGridViewport className={`work-flow-grid-wrap ${groupItems.length ? "" : "is-empty"}`} onViewportChange={({ left, width }) => { setGridWindows(current => current[group.id]?.left === left && current[group.id]?.width === width ? current : { ...current, [group.id]: { left, width } }); }} onFocusCapture={event => { const cell = event.target.closest("[data-column-id]"); if (cell) setFocusedColumnId(cell.dataset.columnId); }}> <table className={`work-flow-grid density-${activeViewPresentation?.rowDensity || "comfortable"}`} onKeyDown={handleGridKeyDown}><colgroup><col style={{ width: 34 }} /><col style={{ width: columnWidths[nameColumn.id] || nameColumn.width || 360 }} />{visibleColumns.filter((column) => column.type !== "name").map((column) => <col key={column.id} style={{ width: columnWidths[column.id] || column.width || 150 }} />)}<col style={{ width: 36 }} /></colgroup><thead><tr>
              <th className="work-flow-grid__select"><input type="checkbox" checked={items.length > 0 && items.every((item) => selectedItemIds.includes(item.id))} onChange={() => { const ids = items.map((item) => item.id); setSelectedItemIds((current) => ids.every((id) => current.includes(id)) ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])]); }} aria-label={`Select all items in ${group.title}`} /></th>
              <th className="work-flow-grid__task"><ColumnHeaderMenu primary column={nameColumn} width={columnWidths[nameColumn.id] || nameColumn.width || 360} wrapped={taskWrapped} onResize={(width, commit) => resizeColumn(nameColumn, width, commit)} onRename={() => renameColumn(nameColumn)} onToggleWrap={() => setActiveViewPresentation((current) => { const ids = Array.isArray(current.wrapColumnIds) ? current.wrapColumnIds : []; return { ...current, wrapColumnIds: taskWrapped ? ids.filter((id) => id !== nameColumn.id) : [...new Set([...ids, nameColumn.id])] }; })} onSort={(direction) => { setSortRules((current) => [...current.filter((rule) => rule.fieldId !== "item.name"), { id: crypto.randomUUID(), fieldId: "item.name", direction, nulls: "last" }]); setShowQueryBuilder(true); }} onExploreRelationships={() => setRelationshipColumn(nameColumn)} onAddColumn={() => setShowColumnBuilder(nameColumn.id)} /></th>
              {columnSegments.map(segment => { if (!segment.column) return <th key={segment.key} colSpan={segment.count} aria-hidden="true" />; const { column } = segment; const wrapped = activeViewPresentation?.wrapColumnIds?.includes(column.id); return <th key={column.id} data-column-id={column.id} draggable={!busy} onDragStart={(event) => { setDraggedColumnId(column.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application/x-work-flow-column", column.id); }} onDragOver={(event) => { if (draggedColumnId) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); reorderColumn(event.dataTransfer.getData("application/x-work-flow-column") || draggedColumnId, column.id); setDraggedColumnId(""); }} onDragEnd={() => setDraggedColumnId("")} className={`select-none cursor-grab active:cursor-grabbing transition ${draggedColumnId === column.id ? "opacity-45" : ""}`}><ColumnHeaderMenu column={column} width={columnWidths[column.id] || column.width || 150} wrapped={wrapped} onResize={(width, commit) => resizeColumn(column, width, commit)} onRename={() => renameColumn(column)} onToggleWrap={() => setActiveViewPresentation((current) => { const ids = Array.isArray(current.wrapColumnIds) ? current.wrapColumnIds : []; return { ...current, wrapColumnIds: wrapped ? ids.filter((id) => id !== column.id) : [...new Set([...ids, column.id])] }; })} onSort={(direction) => { setSortRules((current) => [...current.filter((rule) => rule.fieldId !== column.id), { id: crypto.randomUUID(), fieldId: column.id, direction, nulls: "last" }]); setShowQueryBuilder(true); }} onGroupBy={() => setActiveViewPresentation((current) => ({ ...current, groupByColumnId: column.id }))} onMoveLeft={() => moveColumn(column.id, -1)} onMoveRight={() => moveColumn(column.id, 1)} onFilter={() => filterColumn(column)} onHide={() => setActiveViewPresentation((current) => { const ids = Array.isArray(current.visibleColumnIds) ? current.visibleColumnIds : data.columns.map((entry) => entry.id); return { ...current, visibleColumnIds: ids.filter((id) => id !== column.id) }; })} onDuplicate={() => duplicateColumn(column)} onToggleRestriction={() => toggleColumnRestriction(column)} onPermissions={() => setPermissionColumn(column)} onConnectedBoardSettings={() => setConnectedBoardColumn(column)} onExploreRelationships={() => setRelationshipColumn(column)} onDelete={() => deleteColumn(column)} onAddColumn={() => setShowColumnBuilder(column.id)} /></th>; })}
              <th className="work-flow-grid__add"><button type="button" onClick={() => setShowColumnBuilder(true)} disabled={busy} className="mx-auto flex size-8 items-center justify-center rounded hover:bg-[#dcdfec]" aria-label="Add board column" title="Add column"><Plus className="size-4" /></button></th>
            </tr></thead><WorkFlowBufferedRows rows={tableRows} columnCount={visibleColumns.length + 2} rowHeight={taskWrapped ? 56 : ({ compact: 30, comfortable: 36, spacious: 44 }[activeViewPresentation?.rowDensity] || 36)} pinnedItemId={draggedItemId} renderRow={(item) => item.childLoaderFor ? <tr key={item.id}><td className="work-flow-grid__loader-cell" colSpan={visibleColumns.length + 2}><WorkFlowInfiniteLoader hasMore={Boolean(childPages[item.childLoaderFor]?.hasMoreItems)} loading={Boolean(loadingChildIds[item.childLoaderFor])} loadingOnly={Boolean(loadingChildIds[item.childLoaderFor] && !childPages[item.childLoaderFor])} pageKey={`${data.board.id}:${item.childLoaderFor}:${childPages[item.childLoaderFor]?.nextOffset}`} onLoad={() => loadMoreSubitems(item.childLoaderFor)} /></td></tr> : <tr key={item.id} draggable={!busy} onDragStart={(event) => startItemDrag(event, item)} onDrag={(event) => { if (event.clientX || event.clientY) setDragPreview((current) => current ? { ...current, x: event.clientX, y: event.clientY } : current); }} onDragEnd={() => { setDraggedItemId(""); setDragPreview(null); }} data-grid-row={item.id} className={`work-flow-item-enter group/row cursor-grab active:cursor-grabbing transition-opacity duration-150 ${draggedItemId === item.id ? "opacity-45" : ""} ${selectedItemIds.includes(item.id) ? "is-selected" : ""}`}>
                <td className="work-flow-grid__select" data-grid-cell="0" tabIndex={0}><input type="checkbox" checked={selectedItemIds.includes(item.id)} onChange={() => toggleSelection(item.id)} aria-label={`Select ${item.name}`} /></td>
                <td className={`work-flow-grid__task ${taskWrapped ? "align-top" : ""}`} data-grid-cell="1" data-monday-conflict={item.sourceConflicts?.name || item.sourceConflicts?.groupId || undefined} title={item.sourceConflicts?.name || item.sourceConflicts?.groupId ? "Edited here. Your change is kept while Monday continues syncing." : undefined} tabIndex={0} style={selectedItemIds.includes(item.id) ? undefined : conditionalCellStyle(item, nameColumn, data.columns, activeViewPresentation?.conditionalFormattingRules)}>
                  <div className={`flex items-center ${taskWrapped ? "min-h-14" : "work-flow-grid__task-content"}`}>
                    <HierarchyThread item={item} />
                    <ItemRowMenu item={item} busy={busy} groups={data.groups} items={data.items} permissions={{ invoice: canViewInvoices, create: hasPermission("item.create"), update: hasPermission("item.update"), archive: hasPermission("item.archive"), trash: hasPermission("item.trash") }} onOpenUpdates={() => setSelectedItem(item)} onOpenNewTab={() => { const url = new URL(window.location.href); url.searchParams.set("board", data.board.id); url.searchParams.set("target", `item:${item.id}`); window.open(url.toString(), "_blank", "noopener,noreferrer"); }} onCopyLink={() => { const url = new URL(window.location.href); url.searchParams.set("board", data.board.id); url.searchParams.set("target", `item:${item.id}`); navigator.clipboard?.writeText(url.toString()); }} onMove={(groupId, parentItemId) => moveItem(item, groupId, parentItemId)} onAddBelow={() => createItem(item.groupId, item.parentItemId || null, "New task")} onAddSubitem={() => createItem(item.groupId, item.id, "New subitem")} onDuplicate={() => createItem(item.groupId, item.parentItemId || null, `${item.name} copy`, item.values)} onArchive={() => transitionItem(item, "archive")} onTrash={() => transitionItem(item, "trash")} />
                    {item.childCount > 0 && <button type="button" onClick={() => data.toggleItemSubitems(item)} aria-label={`${collapsedItemIds.includes(item.id) ? "Expand" : "Collapse"} subitems for ${item.name}`} className="work-flow-subitem-toggle grid size-6 shrink-0 place-items-center rounded hover:bg-[#dcdfec]"><ChevronDown className={`size-3.5 transition ${collapsedItemIds.includes(item.id) ? "-rotate-90" : ""}`} /></button>}
                    {taskWrapped ? <textarea key={item.name} defaultValue={item.name} rows={2} onBlur={(event) => { const name = event.target.value.trim(); if (name && name !== item.name) updateItem(item, { name }); }} className="min-h-12 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm outline-none" /> : <input key={item.name} style={item.childCount > 0 ? { flex: "0 1 auto", width: `${Math.min(40, item.name.length + 2)}ch` } : undefined} defaultValue={item.name} onBlur={(event) => { const name = event.target.value.trim(); if (name && name !== item.name) updateItem(item, { name }); }} />}
                    {item.childCount > 0 && <WorkFlowSubitemCount count={item.childCount} onClick={() => data.toggleItemSubitems(item)} />}
                    <button onClick={() => setSelectedItem(item)} aria-label={`Open updates for ${item.name}`} className="ml-auto inline-flex items-center gap-0.5"><MessageSquare className="size-4 shrink-0" />{item.updateCount > 0 && <span className="inline-flex min-w-3.5 items-center justify-center rounded-full bg-[#0073ea] px-0.5 text-[10px] font-semibold leading-3.5 !text-white">{item.updateCount > 99 ? "99+" : item.updateCount}</span>}</button>
                  </div>
                </td>
                {columnSegments.map(segment => { if (!segment.column) return <td key={segment.key} colSpan={segment.count} aria-hidden="true" />; const { column, index: columnIndex } = segment; const wrapped = activeViewPresentation?.wrapColumnIds?.includes(column.id); return <td key={column.id} data-column-id={column.id} data-grid-cell={columnIndex + 2} data-monday-conflict={item.sourceConflicts?.[column.id] || undefined} title={item.sourceConflicts?.[column.id] ? "Edited here. Your value differs from Monday and is kept." : undefined} tabIndex={0} className={wrapped ? "align-top" : ""} style={selectedItemIds.includes(item.id) ? undefined : conditionalCellStyle(item, column, data.columns, activeViewPresentation?.conditionalFormattingRules)}>{renderedColumnIds.has(column.id) && <CellEditor column={column} value={item.values?.[column.id]} valueHealth={item.valueHealth?.[column.id]} updatedBy={item.updatedBy} itemId={item.id} itemName={item.name} boardId={data.board.id} boardItems={data.items} itemRelations={data.relations} boardDependencies={data.dependencies} disabled={busy} peopleOptions={peopleOptions} teamOptions={teamOptions} currentPrincipalId={data.currentPrincipalId} wrapped={wrapped} onUpdateColumnSettings={(settings) => updateColumnSettings(column, settings)} onCommit={(value) => updateItem(item, { values: { [column.id]: value } })} />}</td>; })}
                <td className="work-flow-grid__add" />
              </tr>} /><tbody>
              <tr className="work-flow-grid__new"><td /><td><div><Plus className="size-4" /><input value={newName} onChange={(event) => setNewName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createItem(group.sourceGroupId); }} placeholder="Add task" /></div></td><td colSpan={visibleColumns.length} /></tr>
              {groupItems.length > 0 && <tr className="work-flow-grid__summary"><td colSpan={2} />{columnSegments.map(segment => segment.column ? <td key={segment.column.id}><GroupSummaryCell column={segment.column} items={groupItems} /></td> : <td key={segment.key} colSpan={segment.count} aria-hidden="true" />)}<td /></tr>}
            </tbody></table></WorkFlowGridViewport>}
          </section>;
        })}
      </div>}
      <WorkFlowInfiniteLoader automatic hasMore={Boolean(data.hasMoreItems) && canLoadMore} loading={loadingMore} pageKey={pageKey} onLoad={loadMoreItems} />
    </main>
    <AnimatePresence>{dragPreview && <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: .96, scale: 1 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .14 }} className="pointer-events-none fixed z-[200] flex max-w-72 items-center gap-2 rounded-md border border-[#579bfc] bg-white px-3 py-2 text-sm font-medium text-[#323338] shadow-[0_10px_28px_rgba(0,0,0,.22)]" style={{ left: dragPreview.x + 14, top: dragPreview.y + 14 }}><span className="size-2 shrink-0 rounded-full bg-[#579bfc]" /><span className="truncate">{dragPreview.name}</span></motion.div>}</AnimatePresence>
    {connectedBoardColumn && <ConnectedBoardSettingsDialog column={connectedBoardColumn} boards={boards} busy={busy} onClose={() => setConnectedBoardColumn(null)} onSave={async (settings) => { await updateColumnSettings(connectedBoardColumn, settings); setConnectedBoardColumn(null); }} />}
    <PointerContextMenu menu={contextMenu} onClose={({ restoreFocus } = {}) => { const target = contextMenu?.returnFocus; setContextMenu(null); if (restoreFocus) requestAnimationFrame(() => target?.focus?.()); }} />
  </div>;
}

export function WorkflowBoardTab({ canViewInvoices = false } = {}) {
  const textDialogResolver = useRef(null);
  const [textDialog, setTextDialog] = useState(null);
  const confirmDialogResolver = useRef(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  useEffect(() => {
    const dismissBackdrop = (event) => {
      const dialog = event.target.closest?.('[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]');
      if (!dialog || event.target !== dialog) return;
      const labeledClose = dialog.querySelector('button[aria-label^="Close "]');
      const fallback = [...dialog.querySelectorAll("button")].find((button) => ["cancel", "close", "done"].includes(button.textContent.trim().toLowerCase()));
      (labeledClose || fallback)?.click();
    };
    document.addEventListener("pointerdown", dismissBackdrop);
    return () => document.removeEventListener("pointerdown", dismissBackdrop);
  }, []);
  const [boards, setBoards] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [data, setData] = useState(null);
  const boardLoadSequence = useRef(0);
  const initialLoadSequence = useRef(0);
  const [viewResult, setViewResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saveState, setSaveState] = useState({ status: "idle", pending: 0 });
  const pendingSavesRef = useRef(0);
  const liveMutationSequence = useRef(0);
  const savedIndicatorTimerRef = useRef(null);
  const itemMutationQueuesRef = useRef(new Map());
  const itemRevisionRef = useRef(new Map());
  const cellMutationVersionRef = useRef(new Map());
  const [error, setError] = useState("");
  const [peopleOptions, setPeopleOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [newName, setNewName] = useState("");
  const [offlineCommands, setOfflineCommands] = useState(0);
  const [surface, setSurface] = useState("Main table");
  const [viewsCollapsed, setViewsCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [views, setViews] = useState([]);
  const [selectedViewId, setSelectedViewId] = useState("");
  const [activeViewType, setActiveViewType] = useState("table");
  const [activeViewPresentation, setActiveViewPresentation] = useState({});
  const viewPresentationBaselineRef = useRef("");
  const requestText = useCallback((dialog) => new Promise((resolve) => { textDialogResolver.current = resolve; setTextDialog(dialog); }), []);
  const closeTextDialog = useCallback((value = null) => { const resolve = textDialogResolver.current; textDialogResolver.current = null; setTextDialog(null); resolve?.(value); }, []);
  const requestConfirmation = useCallback((dialog) => new Promise((resolve) => { confirmDialogResolver.current = resolve; setConfirmDialog(dialog); }), []);
  const closeConfirmDialog = useCallback((confirmed) => { const resolve = confirmDialogResolver.current; confirmDialogResolver.current = null; setConfirmDialog(null); resolve?.(confirmed); }, []);
  const [showAddViewMenu, setShowAddViewMenu] = useState(false);
  const [showColumnBuilder, setShowColumnBuilder] = useState(false);
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);
  const [filterRules, setFilterRules] = useState([]);
  const [sortRules, setSortRules] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [bulkActionType, setBulkActionType] = useState("move_group");
  const [bulkGroupId, setBulkGroupId] = useState("");
  const [bulkColumnId, setBulkColumnId] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [bulkPlan, setBulkPlan] = useState(null);
  const [showTools, setShowTools] = useState(false);
  const secondaryToolsRef = useDismissibleLayer(showTools && surface !== "Main table", () => setShowTools(false));
  const [showPersonMenu, setShowPersonMenu] = useState(false);
  const [personFilter, setPersonFilter] = useState("");
  const [showGroupByMenu, setShowGroupByMenu] = useState(false);
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [showBoardSettings, setShowBoardSettings] = useState(false);
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);
  const [collapsedGroupIds, setCollapsedGroupIds] = useState([]);
  const [collapsedItemIds, setCollapsedItemIds] = useState([]);
  const [loadedParentIds, setLoadedParentIds] = useState([]);
  const [childPages, setChildPages] = useState({});
  const [loadingChildIds, setLoadingChildIds] = useState({});
  const [csvImportDraft, setCsvImportDraft] = useState(null);
  const [showMondayImport, setShowMondayImport] = useState(false);
  const [permissionColumn, setPermissionColumn] = useState(null);
  const [relationshipColumn, setRelationshipColumn] = useState(null);
  const [showBoardActivity, setShowBoardActivity] = useState(false);
  const [showBoardDiscussion, setShowBoardDiscussion] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showDuplicateBoard, setShowDuplicateBoard] = useState(false);

  const beginSave = () => {
    liveMutationSequence.current += 1;
    pendingSavesRef.current += 1;
    if (savedIndicatorTimerRef.current) window.clearTimeout(savedIndicatorTimerRef.current);
    setSaveState({ status: "saving", pending: pendingSavesRef.current });
  };
  const finishSave = (failed = false) => {
    pendingSavesRef.current = Math.max(0, pendingSavesRef.current - 1);
    if (failed) { setSaveState({ status: "error", pending: pendingSavesRef.current }); return; }
    if (pendingSavesRef.current > 0) { setSaveState({ status: "saving", pending: pendingSavesRef.current }); return; }
    setSaveState({ status: "saved", pending: 0 });
    savedIndicatorTimerRef.current = window.setTimeout(() => setSaveState((current) => current.status === "saved" ? { status: "idle", pending: 0 } : current), 1800);
  };
  useEffect(() => () => {
    if (savedIndicatorTimerRef.current) window.clearTimeout(savedIndicatorTimerRef.current);
  }, []);

  const loadBoard = useCallback(async (boardId) => {
    const sequence = ++boardLoadSequence.current;
    if (!boardId) { setData(null); return; }
    const viewsRequest = api(`/api/work-flow/v1/boards/${boardId}/views`).then(payload => ({ payload }), error => ({ error }));
    const payload = await api(`/api/work-flow/v1/boards/${boardId}?limit=${INITIAL_BOARD_PAGE_SIZE}`);
    if (sequence !== boardLoadSequence.current) return;
    itemRevisionRef.current = new Map((payload.data.items || []).map((item) => [item.id, item.revision]));
    setData(payload.data); setCollapsedItemIds((payload.data.items || []).filter((item) => item.childCount > 0).map((item) => item.id)); setLoadedParentIds([]); setChildPages({}); setLoadingChildIds({}); setViewResult(null); setViews([]); setSelectedViewId(""); setActiveViewType("table"); setActiveViewPresentation(resolveWorkFlowMainTablePresentation(payload.data.board, payload.data.columns)); viewPresentationBaselineRef.current = ""; setFilterRules([]); setSortRules([]); setSelectedItemIds([]); setBulkGroupId(payload.data.groups?.[0]?.id || "");
    void viewsRequest.then(({ payload: viewPayload, error: failure }) => { if (sequence !== boardLoadSequence.current) return; if (failure) setError(failure.message); else setViews(viewPayload.data.views || []); });
    const target = new URLSearchParams(window.location.search).get("target") || "";
    const [targetKind, targetId] = target.split(":");
    if (targetKind === "item" && targetId) setSelectedItem((payload.data.items || []).find((item) => item.id === targetId) || null);
    return payload.data;
  }, []);

  const refreshLiveBoard = async () => {
    const boardId = data.board.id, startingRevision = data.board.revision;
    const mutationSequence = liveMutationSequence.current;
    const baseCount = data.items.filter(item => !item.parentItemId).length;
    const parts = [];
    let offset = 0;
    do {
      const payload = await api(`/api/work-flow/v1/boards/${boardId}?limit=500&offset=${offset}`);
      if (parts.length && payload.data.board.revision !== parts[0].board.revision) return false;
      parts.push(payload.data);
      offset = payload.data.nextOffset;
    } while (offset != null && parts.reduce((count, part) => count + part.items.length, 0) < baseCount);
    const lastRoot = parts.at(-1);
    for (const parentId of loadedParentIds) {
      let childOffset = 0;
      const childCount = data.items.filter(item => item.parentItemId === parentId).length;
      let fetched = 0;
      do {
        const payload = await api(`/api/work-flow/v1/boards/${boardId}?limit=500&offset=${childOffset}&parentItemId=${encodeURIComponent(parentId)}`);
        if (payload.data.board.revision !== parts[0].board.revision) return false;
        parts.push(payload.data); fetched += payload.data.items.length;
        childOffset = payload.data.nextOffset;
      } while (childOffset != null && fetched < childCount);
    }
    if (liveMutationSequence.current !== mutationSequence || pendingSavesRef.current || document.activeElement?.closest?.('[data-grid-cell], [data-work-flow-popover], [role="dialog"]')) return false;
    const first = parts[0];
    setData(current => {
      if (!current || current.board.id !== boardId || current.board.revision !== startingRevision || liveMutationSequence.current !== mutationSequence || pendingSavesRef.current) return current;
      const oldItems = new Map(current.items.map(item => [item.id, item]));
      const items = [...new Map(parts.flatMap(part => part.items).map(item => { const old = oldItems.get(item.id); return [item.id, old && JSON.stringify(old) === JSON.stringify(item) ? old : item]; })).values()];
      itemRevisionRef.current = new Map(items.map(item => [item.id, item.revision]));
      return { ...first, columns: JSON.stringify(first.columns) === JSON.stringify(current.columns) ? current.columns : first.columns, items, relations: parts.flatMap(part => part.relations || []), dependencies: [...new Map(parts.flatMap(part => part.dependencies || []).map(entry => [entry.id, entry])).values()], hasMoreItems: lastRoot.hasMoreItems, nextOffset: lastRoot.nextOffset };
    });
    if (viewResult?.queryRequest) {
      const refreshedItems = [], cursors = new Set();
      let cursor, pageInfo;
      do {
        const payload = await api('/api/work-flow/v1/queries/execute', { method: 'POST', body: JSON.stringify({ boardId, ...viewResult.queryRequest, ...(cursor ? { cursor } : {}), limit: 500, topLevelOnly: true }) });
        if (payload.meta?.revision && payload.meta.revision !== first.board.revision) return false;
        refreshedItems.push(...(payload.data.items || []));
        pageInfo = payload.meta?.pageInfo || {};
        cursor = pageInfo.endCursor;
        if (cursor && cursors.has(cursor)) return false;
        if (cursor) cursors.add(cursor);
      } while (pageInfo.hasNextPage && cursor && refreshedItems.length < viewResult.items.length);
      if (liveMutationSequence.current !== mutationSequence || pendingSavesRef.current) return false;
      setViewResult(current => current?.queryRequest === viewResult.queryRequest ? { ...current, items: refreshedItems, hasMoreItems: Boolean(pageInfo.hasNextPage), nextCursor: cursor || null } : current);
    }
    return true;
  };
  const liveState = useWorkFlowLive({ boardId: data?.board?.id, revision: data?.board?.revision, blocked: busy || loading || loadingMore || saveState.pending > 0 || Boolean(selectedItem), request: api, refresh: refreshLiveBoard });

  const toggleItemSubitems = async (item) => {
    if (loadingChildIds[item.id]) return;
    if (!collapsedItemIds.includes(item.id)) { setCollapsedItemIds((current) => [...new Set([...current, item.id])]); return; }
    if (!loadedParentIds.includes(item.id)) {
      setError("");
      setLoadingChildIds((current) => ({ ...current, [item.id]: true }));
      try {
        const payload = await api(`/api/work-flow/v1/boards/${data.board.id}?limit=${CHILD_PAGE_SIZE}&parentItemId=${encodeURIComponent(item.id)}`);
        const children = payload.data.items || [];
        setData((current) => current ? { ...current, items: [...new Map([...current.items, ...children].map((entry) => [entry.id, entry])).values()] } : current);
        setViewResult((current) => current?.items.some((entry) => entry.id === item.id) ? { ...current, items: [...new Map([...current.items, ...children].map((entry) => [entry.id, entry])).values()] } : current);
        setChildPages((current) => ({ ...current, [item.id]: { hasMoreItems: Boolean(payload.data.hasMoreItems), nextOffset: payload.data.nextOffset } }));
        children.forEach((child) => itemRevisionRef.current.set(child.id, child.revision));
        setLoadedParentIds((current) => [...new Set([...current, item.id])]);
        setCollapsedItemIds((current) => [...new Set([...current.filter((id) => id !== item.id), ...children.filter((child) => child.childCount > 0).map((child) => child.id)])]);
      } catch (cause) { setError(cause.message); }
      finally { setLoadingChildIds((current) => ({ ...current, [item.id]: false })); }
      return;
    }
    setCollapsedItemIds((current) => current.filter((id) => id !== item.id));
  };

  const loadMoreSubitems = async (parentId) => {
    const page = childPages[parentId];
    if (!page?.hasMoreItems || page.nextOffset == null || loadingChildIds[parentId]) return false;
    const boardId = data.board.id;
    const offset = page.nextOffset;
    setLoadingChildIds((current) => ({ ...current, [parentId]: true }));
    try {
      const payload = await api(`/api/work-flow/v1/boards/${boardId}?limit=${CHILD_PAGE_SIZE}&offset=${offset}&parentItemId=${encodeURIComponent(parentId)}`);
      const children = payload.data.items || [];
      const merge = (current) => current ? { ...current, items: [...new Map([...current.items, ...children].map((entry) => [entry.id, entry])).values()] } : current;
      setData(merge);
      setViewResult((current) => current?.items.some((item) => item.id === parentId) ? merge(current) : current);
      children.forEach((child) => itemRevisionRef.current.set(child.id, child.revision));
      setCollapsedItemIds((current) => [...new Set([...current, ...children.filter((child) => child.childCount > 0).map((child) => child.id)])]);
      setChildPages((current) => current[parentId]?.nextOffset === offset ? { ...current, [parentId]: { hasMoreItems: Boolean(payload.data.hasMoreItems), nextOffset: payload.data.nextOffset } } : current);
      return true;
    } catch (cause) { setError(cause.message); return false; }
    finally { setLoadingChildIds((current) => ({ ...current, [parentId]: false })); }
  };

  const refreshItemUpdateCount = (itemId, { count, delta = 0 } = {}) => {
    const apply = (payload) => payload?.items ? {
      ...payload,
      items: payload.items.map((entry) => entry.id === itemId ? { ...entry, updateCount: Number.isFinite(count) ? count : Math.max(0, Number(entry.updateCount || 0) + delta) } : entry),
    } : payload;
    setData((current) => apply(current));
    setSearchResult((current) => current ? { ...current, payload: apply(current.payload) } : current);
    setSelectedItem((current) => current?.id === itemId ? { ...current, updateCount: Number.isFinite(count) ? count : Math.max(0, Number(current.updateCount || 0) + delta) } : current);
  };

  const applyUpdatedItem = (itemId, updated, { bumpBoardRevision = true } = {}) => {
    if (!updated) return;
    const merge = (entry) => entry.id === itemId ? { ...entry, ...updated, values: { ...entry.values, ...updated.values }, sourceConflicts: { ...entry.sourceConflicts, ...updated.sourceConflicts } } : entry;
    setData((current) => current ? { ...current, board: bumpBoardRevision ? { ...current.board, revision: String(Number(current.board.revision) + 1) } : current.board, items: current.items.map(merge) } : current);
    setViewResult((current) => current ? { ...current, items: current.items.map(merge) } : current);
    setSearchResult((current) => current?.payload ? { ...current, payload: { ...current.payload, items: current.payload.items.map(merge) } } : current);
    setSelectedItem((current) => current?.id === itemId ? merge(current) : current);
  };

  const loadMoreItems = async () => {
    const activeSearch = query.trim() && searchResult?.boardId === data?.board.id && searchResult?.query === query.trim();
    const source = activeSearch ? searchResult.payload : viewResult || data;
    if (!source?.hasMoreItems || loadingMore || (!activeSearch && viewResult ? !viewResult.nextCursor : source.nextOffset == null)) return false;
    const boardId = data.board.id;
    setLoadingMore(true); setError("");
    try {
      if (!activeSearch && viewResult) {
        const cursor = viewResult.nextCursor;
        const payload = await api("/api/work-flow/v1/queries/execute", { method: "POST", body: JSON.stringify({ boardId, ...viewResult.queryRequest, cursor, limit: BOARD_PAGE_SIZE, topLevelOnly: true }) });
        const knownIds = new Set(viewResult.items.map((item) => item.id));
        setCollapsedItemIds((current) => [...new Set([...current, ...(payload.data.items || []).filter((item) => !knownIds.has(item.id) && item.childCount > 0).map((item) => item.id)])]);
        setViewResult((current) => current?.queryRequest === viewResult.queryRequest && current?.nextCursor === cursor ? { ...current, items: [...current.items, ...(payload.data.items || []).filter((item) => !current.items.some((existing) => existing.id === item.id))], hasMoreItems: Boolean(payload.meta?.pageInfo?.hasNextPage), nextCursor: payload.meta?.pageInfo?.endCursor || null } : current);
        return true;
      }
      const offset = source.nextOffset;
      const payload = await api(`/api/work-flow/v1/boards/${boardId}?limit=${BOARD_PAGE_SIZE}&offset=${offset}${activeSearch ? `&search=${encodeURIComponent(query.trim())}` : ""}`);
      const knownIds = new Set(source.items.map((item) => item.id));
      setCollapsedItemIds((current) => [...new Set([...current, ...(payload.data.items || []).filter((item) => !knownIds.has(item.id) && item.childCount > 0).map((item) => item.id)])]);
      const mergeById = (before = [], after = []) => { const known = new Set(before.map((entry) => entry.id)); return [...before, ...after.filter((entry) => !known.has(entry.id))]; };
      const mergePage = (current) => ({ ...current, items: mergeById(current.items, payload.data.items), relations: mergeById(current.relations, payload.data.relations), dependencies: mergeById(current.dependencies, payload.data.dependencies), hasMoreItems: payload.data.hasMoreItems, nextOffset: payload.data.nextOffset });
      if (activeSearch) setSearchResult((current) => current?.boardId === boardId && current?.query === query.trim() && current.payload.nextOffset === offset ? { ...current, payload: mergePage(current.payload) } : current);
      else setData((current) => current?.board.id === boardId && current.nextOffset === offset ? mergePage(current) : current);
      return true;
    } catch (cause) { setError(cause.message); return false; }
    finally { setLoadingMore(false); }
  };

  const load = useCallback(async () => {
    const sequence = ++initialLoadSequence.current;
    setLoading(true); setError("");
    try {
      const urlBoardId = new URLSearchParams(window.location.search).get("board") || "";
      const rememberedBoardId = "";
      const requestedBoardId = urlBoardId || rememberedBoardId;
      const speculativeBoard = requestedBoardId ? loadBoard(requestedBoardId).then(() => true).catch(() => false) : Promise.resolve(false);
      const payload = await api("/api/work-flow/v1/navigation");
      if (sequence !== initialLoadSequence.current) return;
      const nextBoards = payload.data.boards || [];
      setWorkspaces(payload.data.workspaces || []); setFolders(payload.data.folders || []);
      setBoards(nextBoards);
      const selected = requestedBoardId && nextBoards.some((board) => board.id === requestedBoardId) ? requestedBoardId : currentId && nextBoards.some((board) => board.id === currentId) ? currentId : nextBoards[0]?.id || "";
      setCurrentId(selected);
      setSelectedWorkspaceId(nextBoards.find((board) => board.id === selected)?.workspaceId || payload.data.defaultWorkspaceId || payload.data.workspaces?.[0]?.id || "");
      const speculativeLoaded = await speculativeBoard;
      if (sequence !== initialLoadSequence.current) return;
      if (!speculativeLoaded || selected !== requestedBoardId) await loadBoard(selected);
      
    } catch (cause) { if (sequence === initialLoadSequence.current) setError(cause.message); }
    finally { if (sequence === initialLoadSequence.current) setLoading(false); }
  }, [currentId, loadBoard]);

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const needle = query.trim();
    const boardId = data?.board?.id;
    if (!needle || !boardId) { setSearchResult(null); setSearching(false); return; }
    let active = true;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const payload = await api(`/api/work-flow/v1/boards/${boardId}?limit=${INITIAL_BOARD_PAGE_SIZE}&offset=0&search=${encodeURIComponent(needle)}`);
        if (active) setSearchResult({ boardId, query: needle, payload: payload.data });
      } catch (cause) { if (active) { setSearchResult(null); setError(cause.message); } }
      finally { if (active) setSearching(false); }
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [data?.board?.id, data?.board?.revision, query]);
  useEffect(() => {
    let active = true;
    api("/api/dashboard/team-members").then((payload) => {
      if (!active) return;
      const members = Array.isArray(payload.items) ? payload.items : Array.isArray(payload.data?.items) ? payload.data.items : [];
      setPeopleOptions(members.map((member) => ({ id: String(member.id), label: member.name || member.email || String(member.id), email: member.email || "", profilePhotoUrl: member.profilePhotoUrl || "" })));
      setTeamOptions([...new Set(members.map((member) => String(member.department || "").trim()).filter(Boolean))].map((department) => ({ id: department.toLowerCase().replace(/[^a-z0-9]+/g, "_"), label: department })));
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const refresh = () => setOfflineCommands(listWorkFlowOfflineCommands().length);
    const replay = async () => { const result = await replayWorkFlowOfflineCommands({ onChange: refresh }); refresh(); if (!result.blocked && !result.offline && currentId) await loadBoard(currentId); };
    refresh(); window.addEventListener("online", replay); return () => window.removeEventListener("online", replay);
  }, [currentId, loadBoard]);
  useEffect(() => {
    if (!selectedViewId || !data) return;
    const serialized = JSON.stringify(activeViewPresentation || {});
    if (serialized === viewPresentationBaselineRef.current) return;
    const view = views.find((entry) => entry.id === selectedViewId);
    if (!view) return;
    const timeout = window.setTimeout(async () => {
      try {
        const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/views/${view.id}`, { method: "PATCH", headers: { "If-Match": `"${view.revision}"` }, body: JSON.stringify({ presentation: activeViewPresentation }) });
        viewPresentationBaselineRef.current = serialized;
        setViews((current) => current.map((entry) => entry.id === view.id ? payload.data.view : entry));
      } catch (cause) {
        setError(cause.message);
        if (cause.code === "REVISION_CONFLICT") await refreshViews().catch(() => {});
      }
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [activeViewPresentation, data, selectedViewId, views]); // eslint-disable-line react-hooks/exhaustive-deps

  const mutation = async (path, method, body, observedRevision = null) => {
    const idempotencyKey = crypto.randomUUID();
    if (!navigator.onLine) { enqueueWorkFlowOfflineCommand({ path, method, body, observedRevision, idempotencyKey }); setOfflineCommands(listWorkFlowOfflineCommands().length); return { queued: true }; }
    const request = () => api(path, { method, headers: { "Idempotency-Key": idempotencyKey, ...(observedRevision === null ? {} : { "If-Match": `"${observedRevision}"` }) }, body: JSON.stringify(body) });
    try {
      try { return await request(); }
      catch (cause) {
        if (!(cause instanceof TypeError) && !cause.retryable) throw cause;
        await new Promise((resolve) => setTimeout(resolve, 150));
        return await request();
      }
    }
    catch (cause) { if (cause instanceof TypeError) { enqueueWorkFlowOfflineCommand({ path, method, body, observedRevision, idempotencyKey }); setOfflineCommands(listWorkFlowOfflineCommands().length); return { queued: true }; } throw cause; }
  };

  const selectBoard = async (boardId) => {
    setCurrentId(boardId); setSelectedWorkspaceId(boards.find((board) => board.id === boardId)?.workspaceId || selectedWorkspaceId); setSelectedItem(null); setLoading(true); setError("");
    try { const url = new URL(window.location.href); url.searchParams.set("board", boardId); window.history.replaceState({}, "", url);  await loadBoard(boardId); } catch (cause) { setError(cause.message); } finally { setLoading(false); }
  };

  const createBoard = async (targetFolderId = null) => {
    const folderId = typeof targetFolderId === "string" ? targetFolderId : null;
    const name = await requestText({ title: "Create board", description: "Start a new board in this workspace.", label: "Board name", placeholder: "e.g. Roofing operations", submitLabel: "Create board" });
    if (!name?.trim()) return;
    setBusy(true); setError("");
    try {
      const payload = await api("/api/work-flow/v1/boards", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ name: name.trim(), workspaceId: selectedWorkspaceId || undefined, folderId }) });
      setBoards((existing) => [...existing, payload.data.board]); setCurrentId(payload.data.board.id); await loadBoard(payload.data.board.id);
    } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  };

  const refreshNavigation = async () => { const payload = await api("/api/work-flow/v1/navigation"); setBoards(payload.data.boards || []); setWorkspaces(payload.data.workspaces || []); setFolders(payload.data.folders || []); return payload.data; };
  const createWorkspace = async () => { const name = await requestText({ title: "New workspace", label: "Workspace name", placeholder: "e.g. 2027 Workspace", submitLabel: "Create workspace" }); if (!name?.trim()) return; setBusy(true); try { const payload = await api("/api/work-flow/v1/workspaces", { method: "POST", body: JSON.stringify({ name: name.trim() }) }); await refreshNavigation(); setSelectedWorkspaceId(payload.data.workspace.id); setCurrentId(""); setData(null); } catch (cause) { setError(cause.message); } finally { setBusy(false); } };
  const createFolder = async (parentFolderId = null) => { if (!selectedWorkspaceId) return; const name = await requestText({ title: "New folder", label: "Folder name", placeholder: "Folder name", submitLabel: "Create folder" }); if (!name?.trim()) return; setBusy(true); try { await api(`/api/work-flow/v1/workspaces/${selectedWorkspaceId}/folders`, { method: "POST", body: JSON.stringify({ name: name.trim(), parentFolderId }) }); await refreshNavigation(); } catch (cause) { setError(cause.message); } finally { setBusy(false); } };
  const selectWorkspace = async (workspaceId) => { setSelectedWorkspaceId(workspaceId); const first = boards.find((board) => board.workspaceId === workspaceId); if (first) await selectBoard(first.id); else { setCurrentId(""); setData(null); } };
  const cloneWorkspace = async (includeItems) => { const source = workspaces.find((entry) => entry.id === selectedWorkspaceId); if (!source) return; const name = await requestText({ title: includeItems ? "Copy workspace with entries" : "Copy workspace layout", description: includeItems ? "Copy folders, tables, and all entries." : "Copy folders and table structure without entries.", label: "New workspace name", defaultValue: `${source.name} copy`, submitLabel: "Copy workspace" }); if (!name?.trim()) return; setBusy(true); try { const payload = await api(`/api/work-flow/v1/workspaces/${source.id}/duplicate`, { method: "POST", body: JSON.stringify({ name: name.trim(), includeItems }) }); await refreshNavigation(); setSelectedWorkspaceId(payload.data.workspace.id); if (payload.data.copiedBoards?.[0]) { await selectBoard(payload.data.copiedBoards[0].id); setSelectedWorkspaceId(payload.data.workspace.id); } else { setCurrentId(""); setData(null); } } catch (cause) { setError(cause.message); } finally { setBusy(false); } };

  const moveBoard = async (boardId, workspaceId, folderId) => { const board = boards.find((entry) => entry.id === boardId); if (!board || (board.workspaceId === workspaceId && board.folderId === folderId)) return; setBusy(true); try { await api(`/api/work-flow/v1/boards/${boardId}/location`, { method: "PATCH", headers: { "If-Match": `"${board.revision}"` }, body: JSON.stringify({ workspaceId, folderId }) }); await refreshNavigation(); if (boardId === currentId) await loadBoard(boardId); } catch (cause) { setError(cause.message); await refreshNavigation(); } finally { setBusy(false); } };
  const cloneBoardStructure = async () => { if (!data?.board) return; const name = await requestText({ title: "Copy table layout", description: "Columns and groups are copied without entries.", label: "New table name", defaultValue: `${data.board.name} copy`, submitLabel: "Copy table" }); if (!name?.trim()) return; setBusy(true); try { const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/duplicate`, { method: "POST", body: JSON.stringify({ name: name.trim(), includeItems: false, includeViews: true, includeForms: false, includeAutomations: false, includeUpdates: false, includeFiles: false, includeSubscribers: false }) }); await refreshNavigation(); await selectBoard(payload.data.board.id); setSelectedWorkspaceId(payload.data.board.workspaceId); } catch (cause) { setError(cause.message); } finally { setBusy(false); } };

  const duplicateBoard = async (options) => {
    if (!data) return;
    setBusy(true); setError("");
    try { const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/duplicate`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(options) }); setShowDuplicateBoard(false); await load(); setCurrentId(payload.data.board.id); await loadBoard(payload.data.board.id); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const transitionBoard = async (action) => {
    if (!data) return;
    const destructive = action === "trash"; const verb = action === "restore" ? "Restore" : action === "archive" ? "Archive" : "Move to trash";
    const confirmed = await requestConfirmation({ title: `${verb} board`, description: `${verb} “${data.board.name}”?${destructive ? " It will disappear from the board list." : ""}`, confirmLabel: verb });
    if (!confirmed) return;
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/boards/${data.board.id}/${action}`, { method: "POST", headers: { "If-Match": `"${data.board.revision}"` }, body: JSON.stringify({}) }); if (action === "restore") { await loadBoard(data.board.id); const payload = await api("/api/work-flow/v1/boards?limit=100"); setBoards(payload.data.boards || []); } else await load(); }
    catch (cause) { setError(cause.message); if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id); }
    finally { setBusy(false); }
  };

  const adoptCreatedBoard = async (board) => { setBoards((current) => [...current.filter((entry) => entry.id !== board.id), board]); setCurrentId(board.id); setSurface("Main table"); await loadBoard(board.id); };

  const createItem = async (groupId, parentItemId = null, explicitName = null, values = undefined) => {
    const name = String(explicitName ?? newName).trim();
    if (!name || !data) return;
    setError("");
    const temporaryId = `pending:${crypto.randomUUID()}`;
    const parent = parentItemId ? data.items.find((entry) => entry.id === parentItemId) : null;
    const optimisticItem = { id: temporaryId, boardId: data.board.id, groupId, parentItemId, schemaVersionId: data.board.activeSchemaVersionId, name, rank: `${Date.now()}`, depth: parent ? Number(parent.depth || 0) + 1 : 0, state: "active", revision: "0", values: values || {}, updateCount: 0, childCount: 0, pending: true };
    setData((current) => current?.board.id === data.board.id ? { ...current, items: [...current.items, optimisticItem] } : current);
    if (explicitName === null) setNewName("");
    beginSave();
    try {
      const result = await mutation(`/api/work-flow/v1/boards/${data.board.id}/items`, "POST", { name, groupId, ...(parentItemId ? { parentItemId } : {}), ...(values ? { values } : {}) }, data.board.revision);
      if (!result.queued) {
        itemRevisionRef.current.set(result.data.item.id, result.data.item.revision);
        setData((current) => current?.board.id === data.board.id ? { ...current, board: { ...current.board, revision: result.data.boardRevision || current.board.revision }, items: current.items.map((entry) => entry.id === temporaryId ? result.data.item : entry) } : current);
      }
      finishSave(false);
    } catch (cause) { setData((current) => current ? { ...current, items: current.items.filter((entry) => entry.id !== temporaryId) } : current); finishSave(true); setError(cause.message); if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id); }
  };

  const createTaskFromView = async () => {
    const name = await requestText({ title: "New task", label: "Task name", placeholder: "What needs to be done?", submitLabel: "Create task" });
    if (!name?.trim() || !data?.groups?.[0]) return;
    setBusy(true); setError("");
    try {
      const result = await mutation(`/api/work-flow/v1/boards/${data.board.id}/items`, "POST", { name: name.trim(), groupId: data.groups[0].id }, data.board.revision);
      if (result.queued) return;
      setData((current) => current?.board.id === data.board.id ? { ...current, board: { ...current.board, revision: result.data.boardRevision }, items: [...current.items, result.data.item] } : current);
      const view = views.find((entry) => entry.id === selectedViewId);
      if (view) await applyView(view);
    } catch (cause) { setError(cause.message); if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id); }
    finally { setBusy(false); }
  };

  const updateItem = async (item, change) => {
    setError("");
    const changedColumnId = change.values && Object.keys(change.values).length === 1 ? Object.keys(change.values)[0] : null;
    const column = changedColumnId ? data.columns.find((entry) => entry.id === changedColumnId || entry.stableKey === changedColumnId) : null;
    const mutationKey = `${item.id}:${changedColumnId || "name"}`;
    const mutationVersion = (cellMutationVersionRef.current.get(mutationKey) || 0) + 1;
    cellMutationVersionRef.current.set(mutationKey, mutationVersion);
    const previous = { name: item.name, value: changedColumnId ? item.values?.[column?.id || changedColumnId] : undefined };
    applyUpdatedItem(item.id, change, { bumpBoardRevision: false });
    beginSave();
    const execute = async () => {
      let result;
      if (column?.binding?.writeMode === "command") {
        const source = item.valueHealth?.[column.id];
        if (!source?.entityId) throw new Error("Link this item to an authorized source record before changing this field.");
        result = await mutation("/api/work-flow/v1/domain-commands", "POST", { domainType: column.binding.domainType, entityId: source.entityId, command: column.binding.writeCommand, input: { value: change.values[changedColumnId], fieldId: column.binding.fieldId }, observedSourceRevision: source.sourceRevision || null, sourceItemId: item.id });
        if (!result.queued && result.data?.execution?.status !== "succeeded") throw new Error(result.data?.execution?.error?.message || "The source system rejected this change.");
      } else result = await mutation(`/api/work-flow/v1/boards/${data.board.id}/items/${item.id}`, "PATCH", change, itemRevisionRef.current.get(item.id) || item.revision);
      if (!result.queued) {
        if (column?.binding?.writeMode === "command" || !result.data?.item) {
          const authoritative = await loadBoard(data.board.id);
          finishSave(false);
          return authoritative;
        }
        itemRevisionRef.current.set(item.id, result.data.item.revision);
        const stillLatest = cellMutationVersionRef.current.get(mutationKey) === mutationVersion;
        const patch = { revision: result.data.item.revision, updatedAt: result.data.item.updatedAt, ...(stillLatest && change.name !== undefined ? { name: result.data.item.name } : {}), ...(stillLatest && change.values ? { values: result.data.item.values } : {}), ...(stillLatest && result.data.item.sourceConflicts ? { sourceConflicts: result.data.item.sourceConflicts } : {}) };
        applyUpdatedItem(item.id, patch);
        const calculatedColumns = data.columns.filter((entry) => entry.type === "formula_result");
        if (change.values && calculatedColumns.length) {
          try {
            const refreshed = await api(`/api/work-flow/v1/boards/${data.board.id}?itemId=${encodeURIComponent(item.id)}&limit=1`);
            const calculated = refreshed.data.items?.find((entry) => entry.id === item.id);
            if (calculated) applyUpdatedItem(item.id, {
              values: Object.fromEntries(calculatedColumns.map((entry) => [entry.id, calculated.values?.[entry.id] ?? null])),
              valueHealth: { ...item.valueHealth, ...calculated.valueHealth },
            }, { bumpBoardRevision: false });
          } catch { setError("Your changes were saved, but calculated values could not be refreshed. Reload the board to retry."); }
        }
      }
      finishSave(false);
      return result;
    };
    const prior = itemMutationQueuesRef.current.get(item.id) || Promise.resolve();
    const queued = prior.catch(() => {}).then(execute).catch(async (cause) => {
      finishSave(true);
      if (cellMutationVersionRef.current.get(mutationKey) === mutationVersion) applyUpdatedItem(item.id, changedColumnId ? { values: { [column?.id || changedColumnId]: previous.value } } : { name: previous.name }, { bumpBoardRevision: false });
      if (changedColumnId && column) {
        try {
          const authoritative = await loadBoard(data.board.id);
          const savedItem = authoritative?.items?.find((entry) => entry.id === item.id);
          if (savedItem && workFlowCellValuesEqual(savedItem.values?.[column.id], change.values[changedColumnId], column)) { setError(""); setSaveState({ status: pendingSavesRef.current ? "saving" : "saved", pending: pendingSavesRef.current }); return; }
        } catch { /* Preserve the original mutation error when reconciliation is unavailable. */ }
      } else if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id);
      setError(cause.message);
      throw cause;
    }).finally(() => { if (itemMutationQueuesRef.current.get(item.id) === queued) itemMutationQueuesRef.current.delete(item.id); });
    itemMutationQueuesRef.current.set(item.id, queued);
    return queued.catch(() => null);
  };

  const moveItem = async (item, groupId, parentItemId = null) => {
    setError("");
    const previous = { groupId: item.groupId, parentItemId: item.parentItemId };
    applyUpdatedItem(item.id, { groupId, parentItemId }, { bumpBoardRevision: false }); beginSave();
    try {
      await mutation(`/api/work-flow/v1/boards/${data.board.id}/items/${item.id}/move`, "POST", { groupId, parentItemId }, item.revision);
      await loadBoard(data.board.id);
      finishSave(false);
    } catch (cause) { applyUpdatedItem(item.id, previous, { bumpBoardRevision: false }); finishSave(true); setError(cause.message); if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id); }
  };

  const transitionItem = async (item, action) => {
    const deleting = action === "trash";
    const confirmed = await requestConfirmation({ title: deleting ? "Delete task" : "Archive task", description: `${deleting ? "Delete" : "Archive"} “${item.name}”${item.childCount ? ` and its ${item.childCount} subitems` : ""}?`, confirmLabel: deleting ? "Delete task" : "Archive task" });
    if (!confirmed) return;
    setError("");
    const originalIndex = data.items.findIndex((entry) => entry.id === item.id);
    const removedIds = new Set([item.id, ...(action === "trash" || action === "archive" ? data.items.filter((entry) => entry.parentItemId === item.id).map((entry) => entry.id) : [])]);
    setData((current) => current ? { ...current, items: current.items.filter((entry) => !removedIds.has(entry.id)) } : current); beginSave();
    try {
      await mutation(`/api/work-flow/v1/boards/${data.board.id}/items/${item.id}/${action}`, "POST", { cascade: true }, item.revision);
      finishSave(false);
      return true;
    } catch (cause) { setData((current) => current ? { ...current, items: [...current.items.slice(0, originalIndex), ...data.items.filter((entry) => removedIds.has(entry.id)), ...current.items.slice(originalIndex)] } : current); finishSave(true); setError(cause.message); if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id); }
  };

  const applyView = async (view) => {
    setBusy(true); setError(""); setSurface("Main table");
    try { const queryRequest = { viewVersionId: view.activeVersion.id }; const payload = await api("/api/work-flow/v1/queries/execute", { method: "POST", body: JSON.stringify({ boardId: data.board.id, ...queryRequest, limit: VIEW_PAGE_SIZE, topLevelOnly: true }) }); const presentation = resolveWorkFlowViewPresentation(view, data.columns); viewPresentationBaselineRef.current = JSON.stringify(presentation); setViewResult({ items: payload.data.items || [], hasMoreItems: Boolean(payload.meta?.pageInfo?.hasNextPage), nextCursor: payload.meta?.pageInfo?.endCursor || null, queryRequest }); setSelectedViewId(view.id); setActiveViewType(view.activeVersion?.viewType || view.type || "table"); setActiveViewPresentation(presentation); const saved = view.activeVersion?.query || {}; const savedCombinator = ["and", "or"].includes(saved.where?.op) ? saved.where.op : "and"; const savedFilters = ["and", "or"].includes(saved.where?.op) ? saved.where.children : saved.where ? [saved.where] : []; setFilterRules(savedFilters.map((rule) => ({ ...rule, id: crypto.randomUUID(), value: rule.value ?? "", combinator: savedCombinator }))); setSortRules((saved.sort || []).map((rule) => ({ ...rule, id: crypto.randomUUID() }))); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const currentQuery = () => {
    const fields = queryFieldOptions(data.columns);
    const combinator = filterRules[0]?.combinator === "or" ? "or" : "and";
    const predicates = filterRules.map(({ id: _id, combinator: _combinator, ...rule }) => { const field = fields.find((entry) => entry.id === rule.fieldId); return { ...rule, nulls: "exclude", value: ["isEmpty", "isNotEmpty"].includes(rule.op) ? null : filterValue(rule.value, field) }; });
    return { version: 1, where: predicates.length > 1 ? { op: combinator, children: predicates } : predicates[0] || null, sort: sortRules.map(({ id: _id, ...rule }) => rule) };
  };

  const toggleColumnSort = (fieldId) => {
    setSortRules((current) => {
      const existing = current.find((rule) => rule.fieldId === fieldId);
      if (!existing) return [...current, { id: crypto.randomUUID(), fieldId, direction: "asc", nulls: "last" }];
      if (existing.direction === "asc") return current.map((rule) => rule.id === existing.id ? { ...rule, direction: "desc" } : rule);
      return current.filter((rule) => rule.id !== existing.id);
    });
    setShowQueryBuilder(true);
  };

  const applyQuery = async () => {
    setBusy(true); setError("");
    try {
      const queryDefinition = currentQuery();
      const payload = await api("/api/work-flow/v1/queries/execute", { method: "POST", body: JSON.stringify({ boardId: data.board.id, query: queryDefinition, limit: VIEW_PAGE_SIZE, topLevelOnly: true }) });
      setViewResult({ items: payload.data.items || [], hasMoreItems: Boolean(payload.meta?.pageInfo?.hasNextPage), nextCursor: payload.meta?.pageInfo?.endCursor || null, queryRequest: { query: queryDefinition } });
      if (selectedViewId) {
        const view = views.find((entry) => entry.id === selectedViewId);
        if (view) { viewPresentationBaselineRef.current = JSON.stringify(activeViewPresentation || {}); const updated = await api(`/api/work-flow/v1/boards/${data.board.id}/views/${view.id}`, { method: "PATCH", headers: { "If-Match": `"${view.revision}"` }, body: JSON.stringify({ query: queryDefinition, presentation: activeViewPresentation }) }); setViews((current) => current.map((entry) => entry.id === view.id ? updated.data.view : entry)); }
      } else setSelectedViewId("");
      setShowQueryBuilder(false);
    }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const createView = async (type = "table") => {
    const name = await requestText({ title: `Create ${type} view`, description: "Save the current filters, sorting, and visible columns as a reusable view.", label: "View name", defaultValue: `New ${type} view`, submitLabel: "Create view" }); if (!name?.trim()) return;
    setBusy(true); setError("");
    try { const presentation = { visibleColumnIds: data.columns.map((column) => column.id), ...(["kanban", "chart"].includes(type) ? { groupByColumnId: data.columns.find((column) => column.type === "status")?.id || null } : {}), ...(["calendar", "timeline", "gantt"].includes(type) ? { dateColumnId: data.columns.find((column) => ["date", "datetime", "timeline"].includes(column.type))?.id || null } : {}) }; const created = await api(`/api/work-flow/v1/boards/${data.board.id}/views`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ name: name.trim(), type, scope: "shared", query: currentQuery(), presentation }) }); const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/views`); viewPresentationBaselineRef.current = JSON.stringify(presentation); setViews(payload.data.views || []); setSelectedViewId(created.data.view.id); setActiveViewType(type); setActiveViewPresentation(presentation); setShowAddViewMenu(false); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const refreshViews = async () => {
    const payload = await api(`/api/work-flow/v1/boards/${data.board.id}/views`);
    setViews(payload.data.views || []);
    return payload.data.views || [];
  };

  const updateView = async (view, action) => {
    if (!view || !data) return;
    let change = {};
    if (action === "rename") {
      const name = await requestText({ title: "Rename view", description: "Change the name shown in the board view bar.", label: "View name", defaultValue: view.name, submitLabel: "Save" });
      if (!name?.trim() || name.trim() === view.name) return;
      change = { name: name.trim() };
    } else if (action === "delete") {
      const confirmed = await requestConfirmation({ title: "Delete view", description: `Delete “${view.name}”? The board and its tasks will not be affected.`, confirmLabel: "Delete view" });
      if (!confirmed) return;
      change = { state: "trashed" };
    } else if (action === "shared" || action === "personal") change = { scope: action };
    else change = { presentation: { ...(view.activeVersion?.presentation || {}), [action === "pin" || action === "unpin" ? "pinned" : "locked"]: action === "pin" || action === "lock" } };
    setBusy(true); setError("");
    try {
      await api(`/api/work-flow/v1/boards/${data.board.id}/views/${view.id}`, { method: "PATCH", headers: { "If-Match": `"${view.revision}"` }, body: JSON.stringify(change) });
      const nextViews = await refreshViews();
      if (action === "delete" && selectedViewId === view.id) await loadBoard(data.board.id);
      else if (selectedViewId === view.id) {
        const next = nextViews.find((entry) => entry.id === view.id);
        if (next) { setActiveViewPresentation(next.activeVersion?.presentation || {}); setSelectedViewId(next.id); }
      }
    } catch (cause) { setError(cause.message); if (cause.code === "REVISION_CONFLICT") await refreshViews(); }
    finally { setBusy(false); }
  };

  const duplicateView = async (view) => {
    if (!view || !data) return;
    setBusy(true); setError("");
    try {
      const created = await api(`/api/work-flow/v1/boards/${data.board.id}/views`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ name: `${view.name} copy`, type: view.type, scope: view.scope, query: view.activeVersion?.query || { version: 1, where: null, sort: [] }, presentation: view.activeVersion?.presentation || {} }) });
      await refreshViews(); setSelectedViewId(created.data.view.id); setActiveViewType(created.data.view.type); setActiveViewPresentation(created.data.view.activeVersion?.presentation || {});
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const createGroup = async () => {
    const title = await requestText({ title: "Create group", description: "Add a section for organizing related tasks on this board.", label: "Group name", defaultValue: "New group", submitLabel: "Create group" }); if (!title?.trim() || !data) return;
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/boards/${data.board.id}/groups`, { method: "POST", body: JSON.stringify({ title: title.trim(), color: workflowGroupColor(title) }) }); await loadBoard(data.board.id); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const editGroup = async (group) => {
    if (!group?.id || String(group.id).startsWith("group-by:")) return;
    const title = await requestText({ title: "Edit group", description: "Rename this workflow section.", label: "Group name", defaultValue: group.title, submitLabel: "Save group" });
    if (!title?.trim() || title.trim() === group.title) return;
    setBusy(true); setError("");
    try { await api(`/api/work-flow/v1/boards/${data.board.id}/groups/${group.id}`, { method: "PATCH", headers: { "If-Match": `"${group.revision}"` }, body: JSON.stringify({ title: title.trim(), color: workflowGroupColor(title, group.color) }) }); await loadBoard(data.board.id); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const updateGroup = async (group, change) => {
    setBusy(true); setError("");
    try {
      const reordering = Boolean(change.moveBeforeGroupId || change.moveAfterGroupId);
      const response = await api(`/api/work-flow/v1/boards/${data.board.id}/groups/${group.id}`, { method: "PATCH", headers: { "X-Work-Flow-Revision": String(group.revision) }, body: JSON.stringify({ ...change, ...(reordering ? { expectedBoardRevision: String(data.board.revision) } : {}) }) });
      if (reordering) setData((current) => ({ ...current, groups: response.data.groups, board: { ...current.board, revision: response.data.boardRevision } }));
      else await loadBoard(data.board.id);
    }
    catch (cause) { setError(cause.message); if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id); }
    finally { setBusy(false); }
  };

  const duplicateGroup = async (group) => {
    setBusy(true); setError("");
    try {
      const created = await api(`/api/work-flow/v1/boards/${data.board.id}/groups`, { method: "POST", body: JSON.stringify({ title: `${group.title} copy`, description: group.description || "", color: group.color }) });
      const newGroup = created.data.group;
      const idMap = new Map();
      const sourceItems = data.items.filter((item) => item.groupId === group.id).sort((a, b) => Number(a.depth || 0) - Number(b.depth || 0));
      for (const item of sourceItems) {
        const response = await api(`/api/work-flow/v1/boards/${data.board.id}/items`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ name: item.name, groupId: newGroup.id, ...(item.parentItemId && idMap.has(item.parentItemId) ? { parentItemId: idMap.get(item.parentItemId) } : {}), values: item.values || {} }) });
        idMap.set(item.id, response.data.item.id);
      }
      await loadBoard(data.board.id);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const transitionGroup = async (group, action) => {
    const deleting = action === "trashed";
    const groupItems = data.items.filter((item) => item.groupId === group.id);
    if (!await requestConfirmation({ title: deleting ? "Delete group" : "Archive group", description: `${deleting ? "Delete" : "Archive"} “${group.title}” and its ${groupItems.length} task${groupItems.length === 1 ? "" : "s"}?`, confirmLabel: deleting ? "Delete group" : "Archive group" })) return;
    setBusy(true); setError("");
    try {
      for (const item of groupItems.filter((entry) => !entry.parentItemId)) await api(`/api/work-flow/v1/boards/${data.board.id}/items/${item.id}/${deleting ? "trash" : "archive"}`, { method: "POST", headers: { "If-Match": `"${item.revision}"`, "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ cascade: true }) });
      await api(`/api/work-flow/v1/boards/${data.board.id}/groups/${group.id}`, { method: "PATCH", headers: { "If-Match": `"${group.revision}"` }, body: JSON.stringify({ state: action }) });
      await loadBoard(data.board.id);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const addColumn = async (definition) => {
    if (!data) return;
    setBusy(true); setError("");
    try {
      const draft = await api(`/api/work-flow/v1/boards/${data.board.id}/schema-versions`, { method: "POST", body: JSON.stringify({ changeSummary: `Add ${definition.label} column` }) });
      const schemaVersionId = draft.data.schemaVersion.id;
      const created = await api(`/api/work-flow/v1/boards/${data.board.id}/schema-versions/${schemaVersionId}/columns`, { method: "POST", body: JSON.stringify({ label: definition.label, type: definition.type, readOnly: definition.readOnly, settings: definition.settings || {} }) });
      if (definition.formula) await api(`/api/work-flow/v1/schema-versions/${schemaVersionId}/columns/${created.data.column.id}/formula`, { method: "PUT", body: JSON.stringify(definition.formula) });
      const validation = await api(`/api/work-flow/v1/schema-versions/${schemaVersionId}/validate`, { method: "POST", body: "{}" });
      if (!validation.data.valid) throw new Error(validation.data.errors?.[0]?.message || "The new schema is invalid.");
      await api(`/api/work-flow/v1/schema-versions/${schemaVersionId}/publish`, { method: "POST", headers: { "If-Match": `"${data.board.revision}"` }, body: "{}" });
      if (definition.binding) await api(`/api/work-flow/v1/boards/${data.board.id}/columns/${created.data.column.id}/binding`, { method: "PUT", body: JSON.stringify(definition.binding) });
      setShowColumnBuilder(false);
      await loadBoard(data.board.id);
      if (Array.isArray(activeViewPresentation.visibleColumnIds)) setActiveViewPresentation((current) => ({ ...current, visibleColumnIds: [...new Set([...(current.visibleColumnIds || []), created.data.column.id])] }));
      if (typeof showColumnBuilder === "string") {
        const newId = created.data.column.id;
        const order = (activeViewPresentation.columnOrder || data.columns.map((column) => column.id)).filter((id) => id !== newId);
        const index = order.indexOf(showColumnBuilder);
        order.splice(index < 0 ? order.length : index + 1, 0, newId);
        setActiveViewPresentation((current) => ({ ...current, columnOrder: order, ...(activeViewPresentation.visibleColumnIds ? { visibleColumnIds: [...activeViewPresentation.visibleColumnIds, newId] } : {}) }));
      }
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const renameColumn = async (column) => {
    const label = await requestText({ title: "Rename column", description: "Update this column everywhere on the board while preserving its data and stable identity.", label: "Column name", defaultValue: column.label, submitLabel: "Rename column" });
    if (!label?.trim() || label.trim() === column.label) return;
    setBusy(true); setError("");
    try {
      const draft = await api(`/api/work-flow/v1/boards/${data.board.id}/schema-versions`, { method: "POST", body: JSON.stringify({ changeSummary: `Rename ${column.label} to ${label.trim()}` }) });
      const schemaVersionId = draft.data.schemaVersion.id;
      await api(`/api/work-flow/v1/boards/${data.board.id}/schema-versions/${schemaVersionId}/columns/${column.id}`, { method: "PATCH", body: JSON.stringify({ label: label.trim() }) });
      const validation = await api(`/api/work-flow/v1/schema-versions/${schemaVersionId}/validate`, { method: "POST", body: "{}" });
      if (!validation.data.valid) throw new Error(validation.data.errors?.[0]?.message || "The renamed schema is invalid.");
      await api(`/api/work-flow/v1/schema-versions/${schemaVersionId}/publish`, { method: "POST", headers: { "If-Match": `"${data.board.revision}"` }, body: "{}" });
      await loadBoard(data.board.id);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const mutateColumnDefinition = async (column, { method = "PATCH", body = null, changeSummary }) => {
    setBusy(true); setError("");
    try {
      const draft = await api(`/api/work-flow/v1/boards/${data.board.id}/schema-versions`, { method: "POST", body: JSON.stringify({ changeSummary }) });
      const schemaVersionId = draft.data.schemaVersion.id;
      await api(`/api/work-flow/v1/boards/${data.board.id}/schema-versions/${schemaVersionId}/columns/${column.id}`, { method, ...(body ? { body: JSON.stringify(body) } : {}) });
      const validation = await api(`/api/work-flow/v1/schema-versions/${schemaVersionId}/validate`, { method: "POST", body: "{}" });
      if (!validation.data.valid) throw new Error(validation.data.errors?.[0]?.message || "The changed schema is invalid.");
      await api(`/api/work-flow/v1/schema-versions/${schemaVersionId}/publish`, { method: "POST", headers: { "If-Match": `"${data.board.revision}"` }, body: "{}" });
      await loadBoard(data.board.id);
    } catch (cause) { setError(cause.message); if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id); }
    finally { setBusy(false); }
  };

  const duplicateColumn = (column) => mutateColumnDefinition(column, { method: "POST", changeSummary: `Duplicate ${column.label}` });
  const toggleColumnRestriction = (column) => mutateColumnDefinition(column, { body: { readOnly: !column.readOnly }, changeSummary: `${column.readOnly ? "Allow" : "Restrict"} editing for ${column.label}` });
  const updateColumnSettings = (column, settings) => mutateColumnDefinition(column, { body: { settings }, changeSummary: `Update ${column.label} settings` });
  const persistColumnWidth = (column, width) => mutateColumnDefinition(column, { body: { width }, changeSummary: `Resize ${column.label} to ${width}px` });
  const deleteColumn = async (column) => { const confirmed = await requestConfirmation({ title: "Delete column", description: `Delete “${column.label}” from this board? Existing values remain in historical revisions but will no longer appear in the active table.`, confirmLabel: "Delete column" }); if (!confirmed) return; await mutateColumnDefinition(column, { method: "DELETE", changeSummary: `Delete ${column.label}` }); };

  const importCsv = async (file) => {
    if (!file || !data) return;
    setBusy(true); setError("");
    try {
      const csvText = await file.text();
      const analysis = await api("/api/work-flow/v1/imports/analyze", { method: "POST", body: JSON.stringify({ boardId: data.board.id, csvText }) });
      setCsvImportDraft({ fileName: file.name, csvText, analysis: analysis.data, groupId: data.groups[0]?.id || "" });
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const executeCsvImport = async ({ mapping, groupId }) => {
    if (!csvImportDraft || !data) return;
    setBusy(true); setError("");
    try {
      const result = await api("/api/work-flow/v1/imports", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ boardId: data.board.id, csvText: csvImportDraft.csvText, mapping, groupId }) });
      setCsvImportDraft(null);
      await loadBoard(data.board.id);
      if (result.data.job.result.failed) setError(`${result.data.job.result.imported} rows imported; ${result.data.job.result.failed} rows need reconciliation.`);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const exportCsv = async (groupId = null) => {
    if (!data) return;
    setBusy(true); setError("");
    try {
      const columns = data.columns.filter((column) => column.type !== "name");
      const csvCell = (value) => { const text = String(value ?? ""); return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; };
      const rows = [["Item", ...columns.map((column) => column.label)]];
      let offset = 0;
      let hasMore = true;
      while (hasMore) {
        const payload = await api(`/api/work-flow/v1/boards/${data.board.id}?limit=500&offset=${offset}`);
        const page = payload.data;
        for (const item of page.items || []) {
          if (groupId && item.groupId !== groupId) continue;
          rows.push([item.name, ...columns.map((column) => displayValue(item.values?.[column.id], column))]);
        }
        hasMore = Boolean(page.hasMoreItems);
        if (hasMore && (!Number.isSafeInteger(page.nextOffset) || page.nextOffset <= offset)) throw new Error("Board export could not advance to the next page.");
        offset = page.nextOffset;
      }
      const url = URL.createObjectURL(new Blob([`${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`], { type: "text/csv;charset=utf-8" }));
      const group = groupId ? data.groups.find((entry) => entry.id === groupId) : null;
      const filename = group ? `${data.board.name}-${group.title}` : data.board.name;
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${filename.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "work-flow"}.csv`; anchor.click(); URL.revokeObjectURL(url);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const previewBulkAction = async () => {
    if (!selectedItemIds.length) return;
    let action = { type: bulkActionType };
    if (bulkActionType === "move_group") action = { type: "move_group", groupId: bulkGroupId };
    if (bulkActionType === "set_cell") {
      const column = data.columns.find((entry) => entry.id === bulkColumnId);
      action = { type: "set_cell", columnId: bulkColumnId, value: filterValue(bulkValue, column) };
    }
    setBusy(true); setError("");
    try { const payload = await api("/api/work-flow/v1/bulk/plan", { method: "POST", body: JSON.stringify({ boardId: data.board.id, selection: { mode: "explicit", itemIds: selectedItemIds }, action }) }); setBulkPlan(payload.data.plan); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  };

  const executeBulkAction = async () => {
    setBusy(true); setError("");
    try { await api("/api/work-flow/v1/bulk/execute", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ planId: bulkPlan.id, queryHash: bulkPlan.queryHash }) }); setBulkPlan(null); setSelectedItemIds([]); await loadBoard(data.board.id); }
    catch (cause) { setError(cause.message); setBulkPlan(null); if (cause.code === "REVISION_CONFLICT") await loadBoard(data.board.id); }
    finally { setBusy(false); }
  };

  const toggleSelection = (itemId) => setSelectedItemIds((current) => current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]);

  const selectMainTable = () => { setSurface("Main table"); setViewResult(null); setSelectedViewId(""); setActiveViewType("table"); setActiveViewPresentation(resolveWorkFlowMainTablePresentation(data?.board, data?.columns)); viewPresentationBaselineRef.current = ""; setFilterRules([]); setSortRules([]); };
  const activeSearchResult = query.trim() && searchResult?.boardId === data?.board?.id && searchResult?.query === query.trim() ? searchResult.payload : null;
  const displayData = { ...(activeSearchResult ? { ...data, items: activeSearchResult.items, relations: activeSearchResult.relations, dependencies: activeSearchResult.dependencies, hasMoreItems: activeSearchResult.hasMoreItems, nextOffset: activeSearchResult.nextOffset } : viewResult ? { ...data, ...viewResult } : data), toggleItemSubitems };
  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const peopleColumnIds = (data?.columns || []).filter((column) => ["person_refs", "team_refs", "assignee_refs", "people", "person", "team_assignees"].includes(column.type)).map((column) => column.id);
    const columnsById = new Map((data?.columns || []).map((column) => [column.id, column]));
    return (displayData?.items || []).filter((item) => {
      const matchesSearch = activeSearchResult || !needle || `${item.name} ${Object.entries(item.values || {}).map(([id, value]) => displayValue(value, columnsById.get(id) || { type: "text" })).join(" ")}`.toLowerCase().includes(needle);
      const matchesPerson = !personFilter || peopleColumnIds.some((columnId) => { const value = item.values?.[columnId]; return (Array.isArray(value) ? value : value ? [value] : []).some((entry) => String(entry?.id || entry) === personFilter); });
      return matchesSearch && matchesPerson;
    });
  }, [activeSearchResult, data?.columns, displayData?.items, personFilter, query]);
  const visibleColumns = useMemo(() => {
    const configured = activeViewPresentation?.visibleColumnIds;
    const order = activeViewPresentation?.columnOrder;
    const base = data?.columns || [];
    const ordered = Array.isArray(order) && order.length ? [...base].sort((left, right) => { const leftIndex = order.indexOf(left.id); const rightIndex = order.indexOf(right.id); return (leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex) - (rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex); }) : base;
    if (!Array.isArray(configured)) return ordered;
    const allowed = new Set(configured);
    return ordered.filter((column) => column.type === "name" || allowed.has(column.id));
  }, [activeViewPresentation, data?.columns]);

  if (loading && !data) return <div className="flex min-h-[440px] items-center justify-center text-sm text-slate-500"><Loader2 className="mr-2 size-4 animate-spin" />Loading Work Flow…</div>;
  if (!data) return <section className="min-h-[calc(100vh-120px)] bg-[#f7f8fa] px-5 py-8 text-slate-900"><div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white px-6 py-10 text-center"><Table2 className="mx-auto mb-3 size-8 text-slate-400" /><h1 className="text-lg font-semibold">{workspaces.find((workspace) => workspace.id === selectedWorkspaceId)?.name || "Work Flow"}</h1><p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Choose a workspace or create its first board.</p>{workspaces.length > 0 && <SiteSelect className="mx-auto mt-5 block rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" aria-label="Workspace" value={selectedWorkspaceId} onChange={(event) => selectWorkspace(event.target.value)}>{workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}</SiteSelect>}{error && <div className="mx-auto mt-4 flex max-w-lg items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-700"><CircleAlert className="size-4 shrink-0" />{error}</div>}<div className="mt-5 flex justify-center gap-2"><button onClick={() => createBoard(null)} disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"><Plus className="size-4" />Create board</button><button onClick={createWorkspace} disabled={busy} className="rounded-md border border-slate-200 px-4 py-2 text-sm">New workspace</button></div></div></section>;
  const boardViewContent = activeViewType === "table" ? null
    : activeViewType === "kanban" ? <KanbanView data={data} items={visibleItems} presentation={activeViewPresentation} onOpenItem={setSelectedItem} />
    : activeViewType === "calendar" ? <CalendarView data={data} items={visibleItems} presentation={activeViewPresentation} onOpenItem={setSelectedItem} />
    : activeViewType === "timeline" ? <TimelineView data={data} items={visibleItems} presentation={activeViewPresentation} onOpenItem={setSelectedItem} />
    : activeViewType === "gantt" ? <TimelineView data={data} items={visibleItems} presentation={activeViewPresentation} onOpenItem={setSelectedItem} gantt />
    : activeViewType === "chart" ? <ChartView data={data} items={visibleItems} presentation={activeViewPresentation} />
    : activeViewType === "workload" ? <WorkloadView data={data} items={visibleItems} onOpenItem={setSelectedItem} />
    : activeViewType === "files" ? <FilesView data={data} items={visibleItems} onOpenItem={setSelectedItem} refreshKey={selectedItem?.id || ""} />
    : activeViewType === "map" ? <MapView data={data} items={visibleItems} onOpenItem={setSelectedItem} />
    : activeViewType === "cards" ? <CardsView data={data} items={visibleItems} onOpenItem={setSelectedItem} />
    : activeViewType === "form" ? <FormsSurface data={data} busy={busy} setBusy={setBusy} setError={setError} requestText={requestText} />
    : <p className="p-6 text-sm text-[#676879]">This view type is not available.</p>;

  return <section className="work-flow-board min-h-[calc(100vh-120px)] bg-white text-slate-900">
    {data && <script type="application/json" data-work-flow-diagnostics aria-hidden="true">{JSON.stringify({ boardId: data.board.id, live: liveState }).replace(/</g, "\\u003c")}</script>}
    {surface === "Main table" && <WorkFlowParitySurface canViewInvoices={canViewInvoices} boardViewContent={boardViewContent} onNewTask={createTaskFromView} data={displayData} boards={boards} workspaces={workspaces} folders={folders} selectedWorkspaceId={selectedWorkspaceId} selectWorkspace={selectWorkspace} createWorkspace={createWorkspace} createFolder={createFolder} cloneWorkspace={cloneWorkspace} moveBoard={moveBoard} cloneBoardStructure={cloneBoardStructure} currentId={currentId} selectBoard={selectBoard} views={views} selectedViewId={selectedViewId} applyView={applyView} selectMainTable={selectMainTable} updateView={updateView} duplicateView={duplicateView} query={query} setQuery={setQuery} busy={busy} saveState={saveState} searching={searching} visibleItems={visibleItems} visibleColumns={visibleColumns} collapsedGroupIds={collapsedGroupIds} setCollapsedGroupIds={setCollapsedGroupIds} collapsedItemIds={collapsedItemIds} setCollapsedItemIds={setCollapsedItemIds} selectedItemIds={selectedItemIds} setSelectedItemIds={setSelectedItemIds} toggleSelection={toggleSelection} updateItem={updateItem} moveItem={moveItem} transitionItem={transitionItem} setSelectedItem={setSelectedItem} newName={newName} setNewName={setNewName} createItem={createItem} renameColumn={renameColumn} duplicateColumn={duplicateColumn} toggleColumnRestriction={toggleColumnRestriction} updateColumnSettings={updateColumnSettings} deleteColumn={deleteColumn} persistColumnWidth={persistColumnWidth} setPermissionColumn={setPermissionColumn} setRelationshipColumn={setRelationshipColumn} setShowQueryBuilder={setShowQueryBuilder} filterRules={filterRules} setFilterRules={setFilterRules} sortRules={sortRules} setSortRules={setSortRules} showColumnVisibility={showColumnVisibility} setShowColumnVisibility={setShowColumnVisibility} activeViewPresentation={activeViewPresentation} setActiveViewPresentation={setActiveViewPresentation} showPersonMenu={showPersonMenu} setShowPersonMenu={setShowPersonMenu} personFilter={personFilter} setPersonFilter={setPersonFilter} showGroupByMenu={showGroupByMenu} setShowGroupByMenu={setShowGroupByMenu} showBoardMenu={showBoardMenu} setShowBoardMenu={setShowBoardMenu} createGroup={createGroup} editGroup={editGroup} duplicateGroup={duplicateGroup} updateGroup={updateGroup} transitionGroup={transitionGroup} importCsv={importCsv} exportCsv={exportCsv} setShowMondayImport={setShowMondayImport} setSurface={setSurface} showTools={showTools} setShowTools={setShowTools} setShowBoardSettings={setShowBoardSettings} setShowColumnBuilder={setShowColumnBuilder} createBoard={createBoard} duplicateBoard={() => setShowDuplicateBoard(true)} transitionBoard={transitionBoard} openBoardDiscussion={() => setShowBoardDiscussion(true)} openBoardActivity={() => setShowBoardActivity(true)} openRecovery={() => setShowRecovery(true)} showAddViewMenu={showAddViewMenu} setShowAddViewMenu={setShowAddViewMenu} createView={createView} peopleOptions={peopleOptions} teamOptions={teamOptions} loadMoreItems={loadMoreItems} loadingMore={loadingMore} canLoadMore={activeViewType !== "form"} pageKey={`${data.board.id}:${activeSearchResult ? `search:${query.trim()}:${displayData.nextOffset}` : viewResult ? `view:${selectedViewId}:${displayData.nextCursor}` : `board:${displayData.nextOffset}`}`} childPages={childPages} loadingChildIds={loadingChildIds} loadMoreSubitems={loadMoreSubitems} viewsCollapsed={viewsCollapsed} setViewsCollapsed={setViewsCollapsed}>
      {error && <div className="mb-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"><CircleAlert className="size-4" />{error}</div>}
      {showQueryBuilder && <ViewQueryBuilder columns={data.columns} filters={filterRules} sorts={sortRules} onFiltersChange={setFilterRules} onSortsChange={setSortRules} onApply={applyQuery} onClose={() => setShowQueryBuilder(false)} busy={busy} />}
      {selectedItemIds.length > 0 && <BulkActionBar count={selectedItemIds.length} groups={data.groups} columns={data.columns} actionType={bulkActionType} setActionType={setBulkActionType} groupId={bulkGroupId} setGroupId={setBulkGroupId} columnId={bulkColumnId} setColumnId={setBulkColumnId} value={bulkValue} setValue={setBulkValue} onPreview={previewBulkAction} onClear={() => setSelectedItemIds([])} busy={busy} />}
    </WorkFlowParitySurface>}
    {surface !== "Main table" && <>
    <header className="border-b border-slate-200 bg-white px-8 pt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight">{data?.board?.name || "Work Flow"}</h1>
        <div className="flex items-center gap-2"><button onClick={() => setSurface("Notifications")} aria-label="Update feed" className={`inline-flex size-9 items-center justify-center rounded-md border ${surface === "Notifications" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white hover:bg-slate-50"}`}><Bell className="size-4" /></button><button onClick={() => setSurface("Automations")} aria-label="Automations" className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium ${surface === "Automations" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white hover:bg-slate-50"}`}><Bot className="size-4" />Automate</button><div ref={secondaryToolsRef} className="relative"><button onClick={() => setShowTools((current) => !current)} className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium ${showTools || !["Main table", "Automations", "Notifications"].includes(surface) ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white hover:bg-slate-50"}`} aria-expanded={showTools}><Settings2 className="size-4" />Tools<ChevronDown className="size-3.5" /></button>{showTools && <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl">{["Forms", "Documents", "Dashboards", "Templates"].map((label) => <button key={label} onClick={() => { setSurface(label); setShowTools(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50">{label}</button>)}<div className="my-1 border-t border-slate-100" /><button onClick={() => { setShowBoardSettings(true); setShowTools(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50">Board settings</button><button onClick={() => { setShowColumnBuilder(true); setShowTools(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50">Add column</button><button onClick={() => { createBoard(); setShowTools(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50">New board</button></div>}</div></div>
      </div>
{(!viewsCollapsed || surface !== "Main table") && <nav className="mt-4 flex items-center gap-5 overflow-x-auto text-sm" aria-label="Board views"><button onClick={selectMainTable} className={`whitespace-nowrap pb-2 ${surface === "Main table" && !selectedViewId ? "border-b-2 border-blue-600 font-medium text-blue-700" : "text-slate-500 hover:text-slate-800"}`}>Main table</button>{views.map((view) => <button key={view.id} onClick={() => applyView(view)} className={`whitespace-nowrap pb-2 ${surface === "Main table" && selectedViewId === view.id ? "border-b-2 border-blue-600 font-medium text-blue-700" : "text-slate-500 hover:text-slate-800"}`}>{view.name}</button>)}<div className="relative shrink-0"><button onClick={() => setShowAddViewMenu((current) => !current)} disabled={busy} aria-label="Save current view" aria-expanded={showAddViewMenu} className="inline-flex whitespace-nowrap pb-2 text-slate-500 hover:text-blue-700"><Plus className="mr-1 size-4" />Add view</button>{showAddViewMenu && <div className="absolute left-0 top-8 z-30 max-h-96 w-44 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl">{VIEW_OPTIONS.map((option) => <button key={option.id} onClick={() => createView(option.id)} className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50">{option.label}</button>)}</div>}</div></nav>}
    </header>
    <div className="px-8 pb-12 pt-4">
      {error && <div className="mb-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"><CircleAlert className="size-4" />{error}</div>}
      {offlineCommands > 0 && <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"><span>{offlineCommands} Work Flow change{offlineCommands === 1 ? " is" : "s are"} waiting to sync.</span><button onClick={async () => { const result = await replayWorkFlowOfflineCommands({ onChange: () => setOfflineCommands(listWorkFlowOfflineCommands().length) }); setOfflineCommands(result.remaining.length); if (!result.blocked && !result.offline && currentId) await loadBoard(currentId); }} className="font-medium underline underline-offset-2">Sync now</button></div>}
      {surface === "Main table" && data && <><div className="mb-3 flex flex-wrap items-center gap-2">{viewsCollapsed && <CompactBoardViewSelector views={views} selectedViewId={selectedViewId} selectMainTable={selectMainTable} applyView={applyView} />}<button onClick={() => document.querySelector('input[placeholder="Add task"]')?.focus()} disabled={busy} className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"><Plus className="size-4" />New task</button><label className="relative"><Search className="absolute left-3 top-2.5 size-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" className={`${inputClass} w-44 border-transparent bg-transparent pl-9 hover:bg-white`} /></label><button onClick={() => setShowQueryBuilder((current) => !current)} data-selector-trigger="work-flow-query-builder" aria-label="Filter & sort" className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium ${showQueryBuilder || filterRules.length || sortRules.length ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white hover:bg-slate-50"}`}><Filter className="size-4" />Filter{filterRules.length ? ` (${filterRules.length})` : ""}</button><button data-selector-trigger="work-flow-query-builder" onClick={() => setShowQueryBuilder(true)} className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium ${sortRules.length ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white hover:bg-slate-50"}`}><ArrowUpDown className="size-4" />Sort{sortRules.length ? ` (${sortRules.length})` : ""}</button><div className="relative"><button onClick={() => setShowColumnVisibility((current) => !current)} aria-label="Hide columns" aria-expanded={showColumnVisibility} className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium ${showColumnVisibility ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}><EyeOff className="size-4" />Hide</button>{showColumnVisibility && <div className="absolute left-0 top-10 z-30 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl"><p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Visible columns</p>{data.columns.filter((column) => column.type !== "name").map((column) => { const checked = visibleColumns.some((entry) => entry.id === column.id); return <label key={column.id} className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"><input type="checkbox" checked={checked} onChange={() => setActiveViewPresentation((current) => { const ids = Array.isArray(current.visibleColumnIds) ? current.visibleColumnIds : data.columns.map((entry) => entry.id); return { ...current, visibleColumnIds: checked ? ids.filter((id) => id !== column.id) : [...new Set([...ids, column.id])] }; })} className="size-4 accent-blue-600" />{column.label}</label>; })}</div>}</div><div className="relative"><button onClick={() => setShowBoardMenu((current) => !current)} aria-label="Board actions" aria-expanded={showBoardMenu} className="inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"><MoreHorizontal className="size-5" /></button>{showBoardMenu && <div className="absolute left-0 top-10 z-30 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl"><button onClick={() => { createGroup(); setShowBoardMenu(false); }} disabled={busy} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"><Plus className="size-4" />New group</button><label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"><Upload className="size-4" />Import CSV<input type="file" accept=".csv,text/csv" disabled={busy} className="sr-only" onChange={(event) => { importCsv(event.target.files?.[0]); event.target.value = ""; setShowBoardMenu(false); }} /></label><button onClick={() => { exportCsv(); setShowBoardMenu(false); }} disabled={busy} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"><Download className="size-4" />Export CSV</button></div>}</div>{busy && <Loader2 className="ml-auto size-4 animate-spin text-blue-600" />}<button type="button" onClick={() => setViewsCollapsed((current) => !current)} aria-label="Header Tabs" aria-expanded={!viewsCollapsed} className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"><ChevronDown className={`size-4 transition-transform ${viewsCollapsed ? "" : "rotate-180"}`} /></button></div>{showQueryBuilder && <ViewQueryBuilder columns={data.columns} filters={filterRules} sorts={sortRules} onFiltersChange={setFilterRules} onSortsChange={setSortRules} onApply={applyQuery} onClose={() => setShowQueryBuilder(false)} busy={busy} />}{selectedItemIds.length > 0 && <BulkActionBar count={selectedItemIds.length} groups={data.groups} columns={data.columns} actionType={bulkActionType} setActionType={setBulkActionType} groupId={bulkGroupId} setGroupId={setBulkGroupId} columnId={bulkColumnId} setColumnId={setBulkColumnId} value={bulkValue} setValue={setBulkValue} onPreview={previewBulkAction} onClear={() => setSelectedItemIds([])} busy={busy} />}</>}
      {surface === "Notifications" ? <NotificationsSurface setError={setError} /> : surface === "My Work" ? <MyWorkSurface setError={setError} /> : surface === "Automations" ? <AutomationsSurface data={data} busy={busy} setBusy={setBusy} setError={setError} requestText={requestText} /> : surface === "Forms" || activeViewType === "form" ? <FormsSurface data={data} busy={busy} setBusy={setBusy} setError={setError} requestText={requestText} /> : surface === "Documents" ? <DocumentsSurface data={data} busy={busy} setBusy={setBusy} setError={setError} requestText={requestText} /> : surface === "Dashboards" ? <DashboardsSurface data={data} busy={busy} setBusy={setBusy} setError={setError} requestText={requestText} /> : surface === "Templates" ? <TemplatesSurface data={data} busy={busy} setBusy={setBusy} setError={setError} onCreatedBoard={adoptCreatedBoard} requestText={requestText} /> : activeViewType === "kanban" ? <KanbanView data={data} items={visibleItems} presentation={activeViewPresentation} onOpenItem={setSelectedItem} /> : activeViewType === "calendar" ? <CalendarView data={data} items={visibleItems} presentation={activeViewPresentation} onOpenItem={setSelectedItem} /> : activeViewType === "timeline" ? <TimelineView data={data} items={visibleItems} presentation={activeViewPresentation} onOpenItem={setSelectedItem} /> : activeViewType === "gantt" ? <TimelineView data={data} items={visibleItems} presentation={activeViewPresentation} onOpenItem={setSelectedItem} gantt /> : activeViewType === "chart" ? <ChartView data={data} items={visibleItems} presentation={activeViewPresentation} /> : activeViewType === "workload" ? <WorkloadView data={data} items={visibleItems} onOpenItem={setSelectedItem} /> : activeViewType === "files" ? <FilesView data={data} items={visibleItems} onOpenItem={setSelectedItem} refreshKey={selectedItem?.id || ""} /> : activeViewType === "map" ? <MapView data={data} items={visibleItems} onOpenItem={setSelectedItem} /> : activeViewType === "cards" ? <CardsView data={data} items={visibleItems} onOpenItem={setSelectedItem} /> : <div className="space-y-8">{data.groups.map((group) => {
        const items = visibleItems.filter((item) => item.groupId === group.id);
        const collapsed = collapsedGroupIds.includes(group.id);
        const displayedItems = visibleHierarchy(items, collapsedItemIds);
        return <div key={group.id} className="overflow-hidden bg-white"><div className="flex items-center gap-2 px-3 py-2"><button type="button" onClick={() => setCollapsedGroupIds((current) => current.includes(group.id) ? current.filter((id) => id !== group.id) : [...current, group.id])} aria-label={`${collapsed ? "Expand" : "Collapse"} ${group.title}`} aria-expanded={!collapsed} className="rounded p-1 hover:bg-slate-100"><ChevronDown className={`size-4 transition-transform ${collapsed ? "-rotate-90" : ""}`} style={{ color: group.color || "#64748b" }} /></button><h2 className="font-semibold" style={{ color: group.color || "#64748b" }}>{group.title}</h2><span className="text-xs text-slate-400">{items.length} {items.length === 1 ? "Task" : "Tasks"}</span></div><div className={`${collapsed ? "hidden" : "divide-y divide-slate-100 border-l-4 border-slate-200 md:hidden"}`} style={{ borderLeftColor: group.color || "#64748b" }}>{items.map((item) => <article key={item.id} className="space-y-3 p-3"><div className="flex items-center gap-2"><input type="checkbox" checked={selectedItemIds.includes(item.id)} onChange={() => toggleSelection(item.id)} aria-label={`Select ${item.name}`} className="size-4 accent-blue-600" /><input defaultValue={item.name} onBlur={(event) => { if (event.target.value.trim() && event.target.value.trim() !== item.name) updateItem(item, { name: event.target.value.trim() }); }} className="h-9 min-w-0 flex-1 rounded-md border-0 bg-slate-50 px-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-200" /><button onClick={() => setSelectedItem(item)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label={`Open updates for ${item.name}`}><MessageSquare className="size-4" /></button></div>{visibleColumns.filter((column) => column.type !== "name").map((column) => <label key={column.id} className="grid grid-cols-[7rem_1fr] items-center gap-2"><span className="truncate text-xs font-medium text-slate-500">{column.label}</span><CellEditor itemId={item.id} boardId={data.board.id} boardItems={data.items} itemRelations={data.relations} boardDependencies={data.dependencies} column={column} value={item.values?.[column.id]} valueHealth={item.valueHealth?.[column.id]} disabled={busy} onCommit={(value) => updateItem(item, { values: { [column.id]: value } })} /></label>)}</article>)}<div className="flex items-center p-2"><Plus className="ml-1 size-4 text-slate-400" /><input value={newName} onChange={(event) => setNewName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createItem(group.id); }} placeholder="Add task" className="h-9 min-w-0 flex-1 border-0 bg-transparent px-2 text-sm outline-none" /></div></div><div className={`${collapsed ? "hidden" : "hidden overflow-x-auto border-l-4 md:block"}`} style={{ borderLeftColor: group.color || "#64748b" }}><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="bg-white text-xs font-medium text-slate-600"><th className="w-10 border border-slate-200 px-3 py-2"><input type="checkbox" checked={items.length > 0 && items.every((item) => selectedItemIds.includes(item.id))} onChange={() => { const ids = items.map((item) => item.id); setSelectedItemIds((current) => ids.every((id) => current.includes(id)) ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])]); }} aria-label={`Select all items in ${group.title}`} className="size-4 accent-blue-600" /></th><th className="min-w-64 border border-slate-200 px-3 py-2 text-center"><button onClick={() => toggleColumnSort("item.name")} className="group/header inline-flex w-full items-center justify-center gap-1.5">Item<ArrowUpDown className="size-3.5 text-slate-300 opacity-0 transition group-hover/header:opacity-100" /></button></th>{visibleColumns.filter((column) => column.type !== "name").map((column) => <th key={column.id} className="min-w-40 border border-slate-200 px-3 py-2 text-center font-normal"><button onClick={() => toggleColumnSort(column.id)} className="group/header inline-flex w-full items-center justify-center gap-1.5">{column.label}<ArrowUpDown className="size-3.5 text-slate-300 opacity-0 transition group-hover/header:opacity-100" /></button></th>)}</tr></thead><tbody>
          {items.map((item) => <tr key={item.id} className={`work-flow-item-enter group hover:bg-blue-50/30 ${selectedItemIds.includes(item.id) ? "bg-blue-50/50" : ""}`}><td className="border-b border-r border-slate-100 px-3 text-center"><input type="checkbox" checked={selectedItemIds.includes(item.id)} onChange={() => toggleSelection(item.id)} aria-label={`Select ${item.name}`} className="size-4 accent-blue-600" /></td><td className="border-b border-r border-slate-100 p-1"><input defaultValue={item.name} onBlur={(event) => { if (event.target.value.trim() && event.target.value.trim() !== item.name) updateItem(item, { name: event.target.value.trim() }); }} className="h-8 w-full rounded-md border-0 bg-transparent px-2 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-200" /></td>{data.columns.filter((column) => column.type !== "name").map((column) => <td key={column.id} className="border-b border-r border-slate-100 p-1"><CellEditor itemId={item.id} boardId={data.board.id} boardItems={data.items} itemRelations={data.relations} boardDependencies={data.dependencies} column={column} value={item.values?.[column.id]} valueHealth={item.valueHealth?.[column.id]} disabled={busy} onCommit={(value) => updateItem(item, { values: { [column.id]: value } })} /></td>)}<td className="border-b border-slate-100 px-2"><button onClick={() => setSelectedItem(item)} className="text-slate-400 opacity-0 transition group-hover:opacity-100 focus:opacity-100" aria-label={`Open updates for ${item.name}`}><MessageSquare className="size-4" /></button></td></tr>)}
          <tr><td className="border-r border-slate-100"></td><td className="border-r border-slate-100 p-1"><div className="flex items-center"><Plus className="ml-2 size-4 text-slate-400" /><input value={newName} onChange={(event) => setNewName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createItem(group.id); }} placeholder="Add task" className="h-9 min-w-0 flex-1 border-0 bg-transparent px-2 text-sm outline-none" /></div></td><td colSpan={Math.max(1, visibleColumns.length - 1)}></td></tr>
          <tr className="h-9 bg-white"><td colSpan={2}></td>{visibleColumns.filter((column) => column.type !== "name").map((column) => <td key={column.id} className="border-b border-r border-t border-slate-100 px-2 text-center"><GroupSummaryCell column={column} items={items} /></td>)}</tr>
        </tbody></table></div></div>;
      })}</div>}
    </div>
    </>}
    <AnimatePresence>{selectedItem && <ItemDiscussionDrawer canViewInvoices={canViewInvoices} key={selectedItem.id} boardId={data.board.id} item={selectedItem} boardItems={data.items} columns={data.columns} groups={data.groups} permissions={data.permissions} onMove={(groupId) => moveItem(data.items.find((entry) => entry.id === selectedItem.id) || selectedItem, groupId, null)} onArchive={async () => { if (await transitionItem(data.items.find((entry) => entry.id === selectedItem.id) || selectedItem, "archive")) setSelectedItem(null); }} onTrash={async () => { if (await transitionItem(data.items.find((entry) => entry.id === selectedItem.id) || selectedItem, "trash")) setSelectedItem(null); }} onUndo={async (column, value) => { const result = await updateItem(data.items.find((entry) => entry.id === selectedItem.id) || selectedItem, { values: { [column.id]: value } }); if (!result) throw new Error("The field could not be restored. Refresh the log and try again."); }} requestConfirmation={requestConfirmation} requestText={requestText} onUpdatesChanged={(change) => refreshItemUpdateCount(selectedItem.id, change)} onClose={() => { setSelectedItem(null); const url = new URL(window.location.href); url.searchParams.delete("target"); window.history.replaceState({}, "", url); }} onScheduleApplied={async () => { setSelectedItem(null); const url = new URL(window.location.href); url.searchParams.delete("target"); window.history.replaceState({}, "", url); await loadBoard(data.board.id); }} />}</AnimatePresence>
    {showBoardSettings && <BoardSettingsDialog board={data.board} setError={setError} onClose={() => setShowBoardSettings(false)} onSaved={async () => loadBoard(data.board.id)} />}
    {showColumnBuilder && <ColumnBuilderDialog initialType={showColumnBuilder.initialType || "text"} busy={busy} boardId={data.board.id} boardColumns={data.columns} boards={boards} onClose={() => setShowColumnBuilder(false)} onCreate={addColumn} setError={setError} />}
    {permissionColumn && <ColumnPermissionsDialog boardId={data.board.id} column={permissionColumn} setError={setError} onClose={() => { setPermissionColumn(null); loadBoard(data.board.id); }} />}
    <AnimatePresence>{relationshipColumn && <RelationshipGraphDrawer boardId={data.board.id} column={relationshipColumn} setError={setError} onClose={() => setRelationshipColumn(null)} />}</AnimatePresence>
    {bulkPlan && <BulkPlanDialog plan={bulkPlan} onClose={() => setBulkPlan(null)} onExecute={executeBulkAction} busy={busy} />}
    <AnimatePresence>{csvImportDraft && <CsvImportDialog key={csvImportDraft.analysis.checksumSha256} draft={csvImportDraft} groups={data?.groups || []} busy={busy} onClose={() => { if (!busy) setCsvImportDraft(null); }} onImport={executeCsvImport} />}</AnimatePresence>
    <AnimatePresence>{showMondayImport && <MondayImportReadinessDialog boards={boards} boardId={data.board.id} onClose={() => setShowMondayImport(false)} setError={setError} onImported={adoptCreatedBoard} />}</AnimatePresence>
    <AnimatePresence>{showBoardDiscussion && data?.board && <BoardDiscussionDrawer board={data.board} onClose={() => setShowBoardDiscussion(false)} />}</AnimatePresence>
    <AnimatePresence>{showBoardActivity && data && <BoardActivityDrawer key={data.board.id} board={data.board} onClose={() => setShowBoardActivity(false)} />}</AnimatePresence>
    <AnimatePresence>{showRecovery && <RecoveryDrawer boardId={data?.board?.id || null} onClose={() => setShowRecovery(false)} onChanged={async (kind) => { if (kind === "item" && data?.board?.id) await loadBoard(data.board.id); const payload = await api("/api/work-flow/v1/boards?limit=100"); setBoards(payload.data.boards || []); }} />}</AnimatePresence>
    <AnimatePresence>{showDuplicateBoard && data && <BoardDuplicateDialog board={data.board} busy={busy} onClose={() => { if (!busy) setShowDuplicateBoard(false); }} onSubmit={duplicateBoard} />}</AnimatePresence>
    {textDialog && <TextEntryDialog key={`${textDialog.title}:${textDialog.defaultValue || ""}`} dialog={textDialog} onCancel={() => closeTextDialog(null)} onSubmit={closeTextDialog} />}
    {confirmDialog && <ConfirmActionDialog dialog={confirmDialog} onCancel={() => closeConfirmDialog(false)} onConfirm={() => closeConfirmDialog(true)} />}
  </section>;
}
