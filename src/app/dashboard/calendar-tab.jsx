"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  List,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

const EMPTY = {
  title: "",
  date: "",
  startTime: "09:00",
  endTime: "10:00",
  status: "Scheduled",
  category: "Meeting",
  customer: "",
  department: "",
  owner: "",
  participants: "",
  decisionMakers: "",
  invitees: "",
  organizer: "",
  invitationDeliveryStatus: "Not sent",
  rsvpStatus: "Awaiting responses",
  attendeeResponses: "",
  changeRequestStatus: "None",
  requestedChanges: "",
  visibility: "Company",
  availability: "Busy",
  locationType: "Video call",
  location: "",
  meetingUrl: "",
  conferenceProvider: "",
  phoneNumber: "",
  externalCalendar: "None",
  externalEventId: "",
  lastSyncedAt: "",
  recurrence: "None",
  recurrenceEnd: "",
  timezone: "America/New_York",
  reminderMinutes: 30,
  smsNotifications: false,
  agenda: "",
  privateNotes: "",
  outcome: "",
  followUpOwner: "",
  followUpDate: "",
};
const field =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
const COLORS = {
  Meeting: "border-blue-500 bg-blue-50 text-blue-900",
  Deadline: "border-rose-500 bg-rose-50 text-rose-900",
  Implementation: "border-emerald-500 bg-emerald-50 text-emerald-900",
  Discovery: "border-violet-500 bg-violet-50 text-violet-900",
  Support: "border-amber-500 bg-amber-50 text-amber-900",
  Internal: "border-slate-500 bg-slate-100 text-slate-800",
};
async function json(url, options = {}) {
  const response = await fetch(url, { ...options, cache: "no-store" }),
    body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed.");
  return body;
}
function isoDay(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  options,
  required = false,
  wide = false,
}) {
  return (
    <label
      className={`${wide ? "sm:col-span-2" : ""} block text-xs font-bold text-slate-600`}
    >
      {label}
      {options ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={field}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          required={required}
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={field}
        />
      )}
    </label>
  );
}

export default function CalendarTab() {
  const [anchor, setAnchor] = useState(() => new Date()),
    [records, setRecords] = useState([]),
    [editing, setEditing] = useState(null),
    [error, setError] = useState(""),
    [view, setView] = useState("month"),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [owner, setOwner] = useState("All"),
    [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await json("/api/dashboard/records?type=calendar");
      setRecords(data.records || []);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const days = useMemo(() => {
    const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1),
      start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [anchor]);
  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        records
          .map((record) => record.payload.category || record.payload.type)
          .filter(Boolean),
      ),
    ],
    [records],
  );
  const owners = useMemo(
    () => [
      "All",
      ...new Set(records.map((record) => record.payload.owner).filter(Boolean)),
    ],
    [records],
  );
  const visible = useMemo(
    () =>
      records.filter(
        (record) =>
          `${record.title} ${record.payload.customer} ${record.payload.owner} ${record.payload.department} ${record.payload.agenda} ${record.payload.notes}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (category === "All" ||
            (record.payload.category || record.payload.type) === category) &&
          (owner === "All" || record.payload.owner === owner),
      ),
    [category, owner, query, records],
  );
  const byDate = useMemo(
    () =>
      visible.reduce((map, record) => {
        const key = record.payload.date;
        if (!map[key]) map[key] = [];
        map[key].push(record);
        map[key].sort((a, b) =>
          String(a.payload.startTime).localeCompare(
            String(b.payload.startTime),
          ),
        );
        return map;
      }, {}),
    [visible],
  );
  async function save(event) {
    event.preventDefault();
    try {
      const payload = {
        ...editing,
        category: editing.category || editing.type,
      };
      delete payload.id;
      delete payload.title;
      delete payload.type;
      const data = await json("/api/dashboard/records", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          type: "calendar",
          title: editing.title,
          payload,
        }),
      });
      setRecords((current) =>
        editing.id
          ? current.map((item) => (item.id === editing.id ? data.record : item))
          : [data.record, ...current],
      );
      setEditing(null);
    } catch (caught) {
      setError(caught.message);
    }
  }
  async function remove() {
    if (!editing?.id || !confirm(`Delete “${editing.title}”?`)) return;
    try {
      await json("/api/dashboard/records", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id }),
      });
      setRecords((current) => current.filter((item) => item.id !== editing.id));
      setEditing(null);
    } catch (caught) {
      setError(caught.message);
    }
  }
  function open(record) {
    setEditing(
      record
        ? {
            ...EMPTY,
            id: record.id,
            title: record.title,
            ...record.payload,
            category:
              record.payload.category || record.payload.type || "Meeting",
          }
        : { ...EMPTY, date: isoDay(new Date()) },
    );
  }
  const currentMonth = visible.filter((record) =>
    String(record.payload.date || "").startsWith(
      `${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, "0")}`,
    ),
  );
  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Company schedule
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {anchor.toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setAnchor(
                    new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1),
                  )
                }
                className="rounded-lg border p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAnchor(new Date())}
                className="rounded-lg border px-3 text-xs font-bold"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setAnchor(
                    new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1),
                  )
                }
                className="rounded-lg border p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="flex rounded-lg border p-0.5">
                <button
                  onClick={() => setView("month")}
                  className={`rounded-md p-1.5 ${view === "month" ? "bg-violet-100 text-violet-800" : ""}`}
                >
                  <CalendarDays className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`rounded-md p-1.5 ${view === "list" ? "bg-violet-100 text-violet-800" : ""}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => open(null)}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                New event
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_180px_180px]">
            <label className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, customer, owner, agenda…"
                className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm"
              />
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-lg border px-3 text-sm"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="h-10 rounded-lg border px-3 text-sm"
            >
              {owners.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </header>
        {error ? (
          <p className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {loading ? (
          <p className="p-10 text-sm text-slate-500">Loading calendar…</p>
        ) : view === "month" ? (
          <>
            <div className="grid grid-cols-7 border-b bg-slate-50">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="border-r px-2 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day) => {
                const key = isoDay(day),
                  inMonth = day.getMonth() === anchor.getMonth();
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEditing({ ...EMPTY, date: key })}
                    className={`min-h-32 border-b border-r p-2 text-left hover:bg-violet-50 ${inMonth ? "bg-white" : "bg-slate-50/70"}`}
                  >
                    <span
                      className={`text-xs font-semibold ${inMonth ? "text-slate-800" : "text-slate-400"}`}
                    >
                      {day.getDate()}
                    </span>
                    <div className="mt-2 space-y-1">
                      {(byDate[key] || []).slice(0, 4).map((record) => (
                        <span
                          key={record.id}
                          onClick={(event) => {
                            event.stopPropagation();
                            open(record);
                          }}
                          className={`block truncate border-l-4 px-1.5 py-1 text-[10px] font-semibold ${COLORS[record.payload.category || record.payload.type] || COLORS.Meeting}`}
                        >
                          {record.payload.startTime} {record.title}
                        </span>
                      ))}
                      {(byDate[key] || []).length > 4 ? (
                        <span className="block text-[10px] text-slate-500">
                          +{byDate[key].length - 4} more
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="divide-y">
            {currentMonth.length ? (
              currentMonth
                .sort((a, b) =>
                  `${a.payload.date}${a.payload.startTime}`.localeCompare(
                    `${b.payload.date}${b.payload.startTime}`,
                  ),
                )
                .map((record) => (
                  <button
                    key={record.id}
                    onClick={() => open(record)}
                    className="grid w-full gap-3 p-4 text-left hover:bg-slate-50 sm:grid-cols-[120px_90px_1fr_180px_120px]"
                  >
                    <span className="font-bold">
                      {new Date(
                        `${record.payload.date}T12:00`,
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                      })}
                    </span>
                    <span className="text-sm text-slate-500">
                      {record.payload.startTime}
                    </span>
                    <span>
                      <b className="block">{record.title}</b>
                      <small className="text-slate-500">
                        {record.payload.customer ||
                          record.payload.agenda ||
                          "No customer or agenda"}
                      </small>
                    </span>
                    <span className="text-sm">
                      {record.payload.owner || "Unassigned"}
                      <small className="block text-slate-500">
                        {record.payload.department || "No department"}
                      </small>
                    </span>
                    <span className="text-xs font-bold uppercase text-violet-700">
                      {record.payload.status || "Scheduled"}
                    </span>
                  </button>
                ))
            ) : (
              <p className="p-10 text-center text-sm text-slate-500">
                No events match these filters.
              </p>
            )}
          </div>
        )}
      </section>
      {editing ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"
          onMouseDown={() => setEditing(null)}
        >
          <form
            onSubmit={save}
            onMouseDown={(e) => e.stopPropagation()}
            className="max-h-[94vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <header className="flex justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                  Calendar event
                </p>
                <h3 className="mt-1 text-2xl font-black">
                  {editing.id ? "Edit event" : "Schedule event"}
                </h3>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                <X />
              </button>
            </header>
            <div className="mt-5 grid gap-5">
              <section>
                <h4 className="text-xs font-black uppercase tracking-wider text-violet-600">
                  Schedule
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Field
                    required
                    label="Title"
                    value={editing.title}
                    onChange={(v) => setEditing((c) => ({ ...c, title: v }))}
                  />
                  <Field
                    label="Status"
                    value={editing.status}
                    onChange={(v) => setEditing((c) => ({ ...c, status: v }))}
                    options={[
                      "Tentative",
                      "Scheduled",
                      "Confirmed",
                      "Completed",
                      "Cancelled",
                    ]}
                  />
                  <Field
                    label="Category"
                    value={editing.category}
                    onChange={(v) => setEditing((c) => ({ ...c, category: v }))}
                    options={Object.keys(COLORS)}
                  />
                  <Field
                    required
                    type="date"
                    label="Date"
                    value={editing.date}
                    onChange={(v) => setEditing((c) => ({ ...c, date: v }))}
                  />
                  <Field
                    type="time"
                    label="Start"
                    value={editing.startTime}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, startTime: v }))
                    }
                  />
                  <Field
                    type="time"
                    label="End"
                    value={editing.endTime}
                    onChange={(v) => setEditing((c) => ({ ...c, endTime: v }))}
                  />
                  <Field
                    label="Recurrence"
                    value={editing.recurrence}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, recurrence: v }))
                    }
                    options={["None", "Daily", "Weekly", "Monthly", "Yearly"]}
                  />
                  <Field
                    type="date"
                    label="Repeat until"
                    value={editing.recurrenceEnd}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, recurrenceEnd: v }))
                    }
                  />
                </div>
              </section>
              <section>
                <h4 className="text-xs font-black uppercase tracking-wider text-violet-600">
                  Ownership & access
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Customer / account"
                    value={editing.customer}
                    onChange={(v) => setEditing((c) => ({ ...c, customer: v }))}
                  />
                  <Field
                    label="Department"
                    value={editing.department}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, department: v }))
                    }
                  />
                  <Field
                    label="Owner"
                    value={editing.owner}
                    onChange={(v) => setEditing((c) => ({ ...c, owner: v }))}
                  />
                  <Field
                    label="Organizer"
                    value={editing.organizer}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, organizer: v }))
                    }
                  />
                  <Field
                    label="Participants"
                    value={editing.participants}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, participants: v }))
                    }
                  />
                  <Field
                    label="Decision makers"
                    value={editing.decisionMakers}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, decisionMakers: v }))
                    }
                  />
                  <Field
                    label="External invitees"
                    value={editing.invitees}
                    onChange={(v) => setEditing((c) => ({ ...c, invitees: v }))}
                  />
                  <Field
                    label="Visibility"
                    value={editing.visibility}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, visibility: v }))
                    }
                    options={["Personal", "Team", "Department", "Company"]}
                  />
                  <Field
                    label="Availability"
                    value={editing.availability}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, availability: v }))
                    }
                    options={["Busy", "Free"]}
                  />
                  <Field
                    label="Timezone"
                    value={editing.timezone}
                    onChange={(v) => setEditing((c) => ({ ...c, timezone: v }))}
                  />
                </div>
              </section>
              <section>
                <h4 className="text-xs font-black uppercase tracking-wider text-violet-600">
                  Invitations, RSVP & change control
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Invitation delivery"
                    value={editing.invitationDeliveryStatus}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, invitationDeliveryStatus: v }))
                    }
                    options={[
                      "Not sent",
                      "Queued",
                      "Delivered",
                      "Partially delivered",
                      "Failed",
                    ]}
                  />
                  <Field
                    label="RSVP state"
                    value={editing.rsvpStatus}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, rsvpStatus: v }))
                    }
                    options={[
                      "Awaiting responses",
                      "All accepted",
                      "Partially accepted",
                      "Declined",
                      "No response required",
                    ]}
                  />
                  <Field
                    label="Change request state"
                    value={editing.changeRequestStatus}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, changeRequestStatus: v }))
                    }
                    options={[
                      "None",
                      "Requested",
                      "Under review",
                      "Approved",
                      "Declined",
                      "Applied",
                    ]}
                  />
                  <Field
                    wide
                    label="Attendee responses"
                    value={editing.attendeeResponses}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, attendeeResponses: v }))
                    }
                  />
                  <Field
                    wide
                    label="Requested schedule changes"
                    value={editing.requestedChanges}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, requestedChanges: v }))
                    }
                  />
                </div>
              </section>
              <section>
                <h4 className="text-xs font-black uppercase tracking-wider text-violet-600">
                  Location & notifications
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Meeting type"
                    value={editing.locationType}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, locationType: v }))
                    }
                    options={[
                      "Video call",
                      "Phone call",
                      "Customer site",
                      "USATII office",
                      "Custom location",
                    ]}
                  />
                  <Field
                    label="Location"
                    value={editing.location}
                    onChange={(v) => setEditing((c) => ({ ...c, location: v }))}
                  />
                  <Field
                    label="Meeting URL"
                    type="url"
                    value={editing.meetingUrl}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, meetingUrl: v }))
                    }
                  />
                  <Field
                    label="Conference provider"
                    value={editing.conferenceProvider}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, conferenceProvider: v }))
                    }
                    options={[
                      "",
                      "Google Meet",
                      "Zoom",
                      "Microsoft Teams",
                      "Slack",
                      "Other",
                    ]}
                  />
                  <Field
                    label="Phone number"
                    type="tel"
                    value={editing.phoneNumber}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, phoneNumber: v }))
                    }
                  />
                  <Field
                    label="Reminder minutes"
                    type="number"
                    value={editing.reminderMinutes}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, reminderMinutes: Number(v) }))
                    }
                  />
                  <Field
                    label="External calendar"
                    value={editing.externalCalendar}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, externalCalendar: v }))
                    }
                    options={[
                      "None",
                      "Google Calendar",
                      "Microsoft 365",
                      "Apple Calendar",
                      "Other",
                    ]}
                  />
                  <Field
                    label="External event ID"
                    value={editing.externalEventId}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, externalEventId: v }))
                    }
                  />
                  <Field
                    type="datetime-local"
                    label="Last synchronized"
                    value={String(editing.lastSyncedAt || "").slice(0, 16)}
                    onChange={(v) =>
                      setEditing((c) => ({ ...c, lastSyncedAt: v }))
                    }
                  />
                  <label className="mt-6 flex h-10 items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={Boolean(editing.smsNotifications)}
                      onChange={(e) =>
                        setEditing((c) => ({
                          ...c,
                          smsNotifications: e.target.checked,
                        }))
                      }
                    />
                    Send SMS reminder
                  </label>
                </div>
              </section>
              <section className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">
                  Agenda and preparation
                  <textarea
                    value={editing.agenda || editing.notes || ""}
                    onChange={(e) =>
                      setEditing((c) => ({ ...c, agenda: e.target.value }))
                    }
                    className="mt-1.5 min-h-28 w-full rounded-lg border p-3 text-sm"
                  />
                </label>
                <label className="text-xs font-bold text-slate-600">
                  Private internal notes
                  <textarea
                    value={editing.privateNotes || ""}
                    onChange={(e) =>
                      setEditing((c) => ({
                        ...c,
                        privateNotes: e.target.value,
                      }))
                    }
                    className="mt-1.5 min-h-28 w-full rounded-lg border p-3 text-sm"
                  />
                </label>
              </section>
              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="text-xs font-bold text-slate-600 sm:col-span-2 lg:col-span-1">
                  Outcome / decisions
                  <textarea
                    value={editing.outcome || ""}
                    onChange={(e) =>
                      setEditing((c) => ({ ...c, outcome: e.target.value }))
                    }
                    className="mt-1.5 min-h-24 w-full rounded-lg border p-3 text-sm"
                  />
                </label>
                <Field
                  label="Follow-up owner"
                  value={editing.followUpOwner}
                  onChange={(v) =>
                    setEditing((c) => ({ ...c, followUpOwner: v }))
                  }
                />
                <Field
                  type="date"
                  label="Follow-up date"
                  value={editing.followUpDate}
                  onChange={(v) =>
                    setEditing((c) => ({ ...c, followUpDate: v }))
                  }
                />
              </section>
            </div>
            <footer className="mt-6 flex items-center gap-2">
              {editing.id ? (
                <button
                  type="button"
                  onClick={remove}
                  className="mr-auto inline-flex items-center gap-2 rounded-lg border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border px-4 py-2 text-sm font-bold"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white">
                Save event
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </div>
  );
}
