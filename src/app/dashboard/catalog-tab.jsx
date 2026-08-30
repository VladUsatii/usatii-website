"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Boxes, Pencil, Plus, Search, Trash2, X } from "lucide-react";

const EMPTY = {
  title: "",
  category: "",
  subcategory: "",
  sku: "",
  manufacturer: "USATII",
  sourceId: "",
  catalogPath: "",
  imageUrl: "",
  sortOrder: 0,
  unit: "project",
  billingModel: "One-time",
  serviceType: "Custom software",
  deliveryModel: "Managed",
  cost: "",
  price: "",
  taxable: true,
  taxCode: "",
  accountingCode: "",
  minimumQuantity: 1,
  defaultQuantity: 1,
  minimumTermMonths: 0,
  implementationDays: "",
  onboardingHours: "",
  includedSupportHours: "",
  overageRate: "",
  supportLevel: "Standard",
  slaResponseHours: "",
  warrantyDays: "",
  lifecycleStage: "Generally available",
  availableFrom: "",
  availableUntil: "",
  version: "1.0",
  renewalPolicy: "",
  pricingNotes: "",
  description: "",
  deliverables: "",
  dependencies: "",
  exclusions: "",
  acceptanceCriteria: "",
  configurationOptions: [],
  active: true,
};
const control =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });

async function json(url, options = {}) {
  const response = await fetch(url, { ...options, cache: "no-store" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed.");
  return body;
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  options,
  required = false,
}) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      {options ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={control}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          required={required}
          type={type}
          min={type === "number" ? 0 : undefined}
          step={type === "number" ? "0.01" : undefined}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={control}
        />
      )}
    </label>
  );
}

function Options({ items, onChange }) {
  const update = (index, patch) =>
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Configuration choices
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Tiers, add-ons, limits, environments, relationships, and their
            separate price and delivery effects.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                id: crypto.randomUUID(),
                group: "",
                name: "",
                value: "",
                sku: "",
                selectionMode: "single",
                relationshipType: "direct",
                priceAdjustment: 0,
                laborAdjustment: 0,
                costAdjustment: 0,
                implementationDaysAdjustment: 0,
                constraints: "",
                required: false,
                defaultSelected: false,
              },
            ])
          }
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold"
        >
          <Plus className="h-3.5 w-3.5" />
          Add option
        </button>
      </div>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          <div className="grid gap-2 md:grid-cols-4">
            <input
              aria-label="Option group"
              placeholder="Group (Hosting)"
              value={item.group || ""}
              onChange={(e) => update(index, { group: e.target.value })}
              className="h-9 rounded-lg border px-2 text-sm"
            />
            <input
              aria-label="Option name"
              placeholder="Option name"
              value={item.name || ""}
              onChange={(e) => update(index, { name: e.target.value })}
              className="h-9 rounded-lg border px-2 text-sm"
            />
            <input
              aria-label="Option value"
              placeholder="Value / tier"
              value={item.value || ""}
              onChange={(e) => update(index, { value: e.target.value })}
              className="h-9 rounded-lg border px-2 text-sm"
            />
            <input
              aria-label="Option SKU"
              placeholder="Option SKU"
              value={item.sku || ""}
              onChange={(e) => update(index, { sku: e.target.value })}
              className="h-9 rounded-lg border px-2 text-sm"
            />
            <select
              aria-label="Selection mode"
              value={item.selectionMode || "single"}
              onChange={(e) => update(index, { selectionMode: e.target.value })}
              className="h-9 rounded-lg border px-2 text-sm"
            >
              <option value="single">Single choice</option>
              <option value="multiple">Multiple choice</option>
              <option value="quantity">Quantity</option>
              <option value="boolean">Yes / no</option>
            </select>
            <select
              aria-label="Relationship type"
              value={item.relationshipType || "direct"}
              onChange={(e) =>
                update(index, { relationshipType: e.target.value })
              }
              className="h-9 rounded-lg border px-2 text-sm"
            >
              <option value="direct">Direct</option>
              <option value="requires">Requires another option</option>
              <option value="excludes">Excludes another option</option>
              <option value="replaces">Replaces base scope</option>
            </select>
            <input
              aria-label="Price adjustment"
              type="number"
              step="0.01"
              placeholder="Price +/−"
              value={item.priceAdjustment ?? 0}
              onChange={(e) =>
                update(index, { priceAdjustment: Number(e.target.value) })
              }
              className="h-9 rounded-lg border px-2 text-sm"
            />
            <input
              aria-label="Labor adjustment"
              type="number"
              step="0.01"
              placeholder="Labor +/−"
              value={item.laborAdjustment ?? 0}
              onChange={(e) =>
                update(index, { laborAdjustment: Number(e.target.value) })
              }
              className="h-9 rounded-lg border px-2 text-sm"
            />
            <input
              aria-label="Cost adjustment"
              type="number"
              step="0.01"
              placeholder="Cost +/−"
              value={item.costAdjustment ?? 0}
              onChange={(e) =>
                update(index, { costAdjustment: Number(e.target.value) })
              }
              className="h-9 rounded-lg border px-2 text-sm"
            />
            <input
              aria-label="Implementation days adjustment"
              type="number"
              placeholder="Days +/−"
              value={item.implementationDaysAdjustment ?? 0}
              onChange={(e) =>
                update(index, {
                  implementationDaysAdjustment: Number(e.target.value),
                })
              }
              className="h-9 rounded-lg border px-2 text-sm"
            />
            <input
              aria-label="Option constraints"
              placeholder="Constraints / compatibility"
              value={item.constraints || ""}
              onChange={(e) => update(index, { constraints: e.target.value })}
              className="h-9 rounded-lg border px-2 text-sm md:col-span-2"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="grid h-9 place-items-center rounded-lg text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={Boolean(item.required)}
                onChange={(e) => update(index, { required: e.target.checked })}
              />
              Required selection
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={Boolean(item.defaultSelected)}
                onChange={(e) =>
                  update(index, { defaultSelected: e.target.checked })
                }
              />
              Selected by default
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CatalogTab() {
  const [records, setRecords] = useState([]),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [status, setStatus] = useState("All"),
    [editing, setEditing] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await json("/api/dashboard/records?type=catalog");
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
  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        records.map((record) => record.payload.category).filter(Boolean),
      ),
    ],
    [records],
  );
  const visible = useMemo(
    () =>
      records.filter(
        (record) =>
          `${record.title} ${record.payload.category} ${record.payload.subcategory} ${record.payload.sku} ${record.payload.manufacturer} ${record.payload.sourceId} ${record.payload.catalogPath} ${record.payload.description} ${record.payload.deliverables} ${record.payload.dependencies}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (category === "All" || record.payload.category === category) &&
          (status === "All" ||
            (status === "Active") === (record.payload.active !== false)),
      ),
    [category, query, records, status],
  );
  async function save(event) {
    event.preventDefault();
    setError("");
    const numeric = [
      "cost",
      "price",
      "sortOrder",
      "minimumQuantity",
      "defaultQuantity",
      "minimumTermMonths",
      "implementationDays",
      "onboardingHours",
      "includedSupportHours",
      "overageRate",
      "slaResponseHours",
      "warrantyDays",
    ];
    const payload = { ...editing };
    delete payload.id;
    delete payload.title;
    for (const key of numeric) payload[key] = Number(payload[key] || 0);
    payload.configurationOptions = editing.configurationOptions || [];
    try {
      const data = await json("/api/dashboard/records", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          type: "catalog",
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
  async function remove(record) {
    if (!confirm(`Delete “${record.title}” from the software catalog?`)) return;
    try {
      await json("/api/dashboard/records", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id }),
      });
      setRecords((current) => current.filter((item) => item.id !== record.id));
    } catch (caught) {
      setError(caught.message);
    }
  }
  function edit(record) {
    setEditing({
      ...EMPTY,
      id: record.id,
      title: record.title,
      ...record.payload,
      configurationOptions: Array.isArray(record.payload.configurationOptions)
        ? record.payload.configurationOptions
        : [],
    });
  }
  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <label className="relative min-w-[260px] flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Keyword, module, SKU, configuration…"
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm"
            />
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border px-3 text-sm font-semibold"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg border px-3 text-sm font-semibold"
          >
            {["All", "Active", "Inactive"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            Add software product
          </button>
        </div>
      </section>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-10 text-sm text-slate-500">Loading catalog…</p>
        ) : visible.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {[
                    "Product",
                    "SKU",
                    "Billing / unit",
                    "Cost",
                    "Price",
                    "Margin",
                    "Implementation",
                    "Options",
                    "Status",
                    "",
                  ].map((label) => (
                    <th key={label} className="px-4 py-3">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {visible.map((record) => {
                  const cost = Number(record.payload.cost || 0),
                    price = Number(record.payload.price || 0),
                    margin = price
                      ? Math.round(((price - cost) / price) * 100)
                      : 0;
                  return (
                    <tr
                      key={record.id}
                      className={
                        record.payload.active === false
                          ? "bg-slate-50 text-slate-500"
                          : ""
                      }
                    >
                      <td className="px-4 py-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-violet-600">
                          {record.payload.category || "Software"}
                          {record.payload.subcategory
                            ? ` · ${record.payload.subcategory}`
                            : ""}
                        </p>
                        <p className="mt-1 font-bold text-slate-950">
                          {record.title}
                        </p>
                        <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                          {record.payload.description || "No description"}
                        </p>
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {record.payload.sku || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <b>{record.payload.billingModel || "One-time"}</b>
                        <p className="text-xs text-slate-500">
                          per {record.payload.unit || "project"}
                        </p>
                      </td>
                      <td className="px-4 py-4">{money(cost)}</td>
                      <td className="px-4 py-4 font-black">{money(price)}</td>
                      <td className="px-4 py-4">
                        <b
                          className={
                            margin >= 50
                              ? "text-emerald-700"
                              : margin >= 25
                                ? "text-amber-700"
                                : "text-rose-700"
                          }
                        >
                          {margin}%
                        </b>
                      </td>
                      <td className="px-4 py-4">
                        {record.payload.implementationDays
                          ? `${record.payload.implementationDays} days`
                          : "—"}
                        <p className="text-xs text-slate-500">
                          {record.payload.supportLevel || "Standard"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {record.payload.configurationOptions?.length || 0}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${record.payload.active === false ? "bg-slate-200 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}
                        >
                          {record.payload.active === false
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => edit(record)}
                            className="rounded-lg border p-2"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove(record)}
                            className="rounded-lg border border-red-200 p-2 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid h-52 place-items-center text-center">
            <div>
              <Boxes className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-semibold">
                No matching software products
              </p>
            </div>
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
                  Software catalog record
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {editing.id
                    ? "Edit software product"
                    : "Add software product"}
                </h2>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                <X />
              </button>
            </header>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                required
                label="Product / module name"
                value={editing.title}
                onChange={(v) => setEditing((c) => ({ ...c, title: v }))}
              />
              <Field
                label="Category"
                value={editing.category}
                onChange={(v) => setEditing((c) => ({ ...c, category: v }))}
              />
              <Field
                label="Subcategory"
                value={editing.subcategory}
                onChange={(v) => setEditing((c) => ({ ...c, subcategory: v }))}
              />
              <Field
                label="SKU"
                value={editing.sku}
                onChange={(v) => setEditing((c) => ({ ...c, sku: v }))}
              />
              <Field
                label="Manufacturer / delivery owner"
                value={editing.manufacturer}
                onChange={(v) => setEditing((c) => ({ ...c, manufacturer: v }))}
              />
              <Field
                label="Source ID"
                value={editing.sourceId}
                onChange={(v) => setEditing((c) => ({ ...c, sourceId: v }))}
              />
              <Field
                label="Catalog path"
                value={editing.catalogPath}
                onChange={(v) => setEditing((c) => ({ ...c, catalogPath: v }))}
              />
              <Field
                label="Version"
                value={editing.version}
                onChange={(v) => setEditing((c) => ({ ...c, version: v }))}
              />
              <Field
                type="number"
                label="Sort order"
                value={editing.sortOrder}
                onChange={(v) => setEditing((c) => ({ ...c, sortOrder: v }))}
              />
              <Field
                type="url"
                label="Product image URL"
                value={editing.imageUrl}
                onChange={(v) => setEditing((c) => ({ ...c, imageUrl: v }))}
              />
              <Field
                label="Lifecycle stage"
                value={editing.lifecycleStage}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, lifecycleStage: v }))
                }
                options={[
                  "Concept",
                  "Pilot",
                  "Generally available",
                  "Maintenance",
                  "Deprecated",
                  "Retired",
                ]}
              />
              <Field
                label="Service type"
                value={editing.serviceType}
                onChange={(v) => setEditing((c) => ({ ...c, serviceType: v }))}
                options={[
                  "Custom software",
                  "Platform module",
                  "Integration",
                  "Automation",
                  "Data migration",
                  "Implementation service",
                  "Support service",
                  "Training",
                ]}
              />
              <Field
                label="Delivery model"
                value={editing.deliveryModel}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, deliveryModel: v }))
                }
                options={[
                  "Managed",
                  "Customer-hosted",
                  "Hybrid",
                  "Licensed",
                  "Professional services",
                ]}
              />
              <Field
                type="date"
                label="Available from"
                value={editing.availableFrom}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, availableFrom: v }))
                }
              />
              <Field
                type="date"
                label="Available until"
                value={editing.availableUntil}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, availableUntil: v }))
                }
              />
              <Field
                label="Billing model"
                value={editing.billingModel}
                onChange={(v) => setEditing((c) => ({ ...c, billingModel: v }))}
                options={[
                  "One-time",
                  "Monthly",
                  "Annual",
                  "Usage-based",
                  "Milestone",
                  "Retainer",
                ]}
              />
              <Field
                label="Unit"
                value={editing.unit}
                onChange={(v) => setEditing((c) => ({ ...c, unit: v }))}
                options={[
                  "project",
                  "month",
                  "year",
                  "user",
                  "location",
                  "workflow",
                  "integration",
                  "environment",
                  "hour",
                ]}
              />
              <Field
                type="number"
                label="Internal cost"
                value={editing.cost}
                onChange={(v) => setEditing((c) => ({ ...c, cost: v }))}
              />
              <Field
                type="number"
                label="Customer price"
                value={editing.price}
                onChange={(v) => setEditing((c) => ({ ...c, price: v }))}
              />
              <Field
                type="number"
                label="Implementation days"
                value={editing.implementationDays}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, implementationDays: v }))
                }
              />
              <Field
                type="number"
                label="Minimum quantity"
                value={editing.minimumQuantity}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, minimumQuantity: v }))
                }
              />
              <Field
                type="number"
                label="Default quantity"
                value={editing.defaultQuantity}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, defaultQuantity: v }))
                }
              />
              <Field
                type="number"
                label="Minimum term (months)"
                value={editing.minimumTermMonths}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, minimumTermMonths: v }))
                }
              />
              <Field
                type="number"
                label="Onboarding hours"
                value={editing.onboardingHours}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, onboardingHours: v }))
                }
              />
              <Field
                type="number"
                label="Included support hours"
                value={editing.includedSupportHours}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, includedSupportHours: v }))
                }
              />
              <Field
                type="number"
                label="Overage hourly rate"
                value={editing.overageRate}
                onChange={(v) => setEditing((c) => ({ ...c, overageRate: v }))}
              />
              <Field
                label="Support level"
                value={editing.supportLevel}
                onChange={(v) => setEditing((c) => ({ ...c, supportLevel: v }))}
                options={["None", "Standard", "Priority", "Dedicated", "24/7"]}
              />
              <Field
                type="number"
                label="SLA response (hours)"
                value={editing.slaResponseHours}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, slaResponseHours: v }))
                }
              />
              <Field
                type="number"
                label="Warranty / hypercare (days)"
                value={editing.warrantyDays}
                onChange={(v) => setEditing((c) => ({ ...c, warrantyDays: v }))}
              />
              <Field
                label="Tax code"
                value={editing.taxCode}
                onChange={(v) => setEditing((c) => ({ ...c, taxCode: v }))}
              />
              <Field
                label="Accounting code"
                value={editing.accountingCode}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, accountingCode: v }))
                }
              />
              <Field
                label="Renewal policy"
                value={editing.renewalPolicy}
                onChange={(v) =>
                  setEditing((c) => ({ ...c, renewalPolicy: v }))
                }
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                ["description", "Description"],
                ["deliverables", "Included deliverables"],
                ["dependencies", "Dependencies / prerequisites"],
                ["exclusions", "Explicit exclusions"],
                ["acceptanceCriteria", "Acceptance criteria"],
                ["pricingNotes", "Pricing and approval notes"],
              ].map(([key, label]) => (
                <label key={key} className="text-xs font-bold text-slate-600">
                  {label}
                  <textarea
                    value={editing[key] || ""}
                    onChange={(e) =>
                      setEditing((c) => ({ ...c, [key]: e.target.value }))
                    }
                    className="mt-1.5 min-h-28 w-full rounded-lg border p-3 text-sm"
                  />
                </label>
              ))}
            </div>
            <div className="mt-5">
              <Options
                items={editing.configurationOptions || []}
                onChange={(configurationOptions) =>
                  setEditing((c) => ({ ...c, configurationOptions }))
                }
              />
            </div>
            <label className="mt-5 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={editing.taxable !== false}
                onChange={(e) =>
                  setEditing((c) => ({ ...c, taxable: e.target.checked }))
                }
              />
              Taxable
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={editing.active !== false}
                onChange={(e) =>
                  setEditing((c) => ({ ...c, active: e.target.checked }))
                }
              />
              Available for new proposals
            </label>
            <footer className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border px-4 py-2 text-sm font-bold"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white">
                Save product
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </div>
  );
}
